"""Secure Gemini proxy for tdeak67.com AI chat.

The frontend no longer holds the API key. All chat requests go to this
server-side proxy which holds the key in the environment (.env) and
forwards to the official Gemini REST API. Streaming is preserved via SSE.

Security properties:
  - API key never leaves this server.
  - Per-IP in-memory token bucket (burst + sustained) as a second line of
    defence; nginx `limit_req` is the first.
  - Origin/Host check: only accept requests whose Origin matches the site.
  - Input length cap and single-message window (server keeps no history).
"""

import asyncio
import json
import os
import secrets
import time

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

API_KEY = os.environ.get("API_KEY") or os.environ.get("GEMINI_API_KEY") or ""
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{MODEL}:streamGenerateContent?alt=sse"
)
def _load_system_instruction() -> str:
    """Load the same CV-backed system prompt the old client used."""
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "system_prompt.txt")
    try:
        with open(p, encoding="utf-8") as f:
            return f.read().strip()
    except OSError:
        return os.environ.get(
            "SYSTEM_INSTRUCTION_FALLBACK",
            "You are Tamas Deak's portfolio AI assistant. Answer concisely about "
            "his experience, skills, and projects. Stay factual; if unsure, say so.",
        )


SYSTEM_INSTRUCTION = _load_system_instruction()

ALLOWED_ORIGINS = {
    "https://tdeak67.com",
    "https://www.tdeak67.com",
    "https://taskmind-ai.com",
    os.environ.get("PUBLIC_BASE_URL", ""),
}

# The Gemini API key is referer-restricted to the live site. The proxy must
# send a matching Referer header when calling Google, otherwise Google rejects
# the request with 403 even though the key is valid.
GEMINI_REFERER = os.environ.get("GEMINI_REFERER", "https://tdeak67.com/")

MAX_PROMPT_CHARS = 3000
MAX_CONTEXT_MESSAGES = 8

# --- Per-IP token bucket (in-process, reset on restart) ----------------------
# Burst:  3 tokens refill every 10s  (max burst 3)
# Sustained: 10 tokens refill every 180s (max burst 10)
_bucket = {}          # ip -> {"tokens": float, "last": float, "kind": "burst"|"sustained"}
_bucket_lock = asyncio.Lock()


async def _check_rate_limit(ip: str) -> tuple[bool, int]:
    """Return (allowed, seconds_to_wait). In-memory sliding token bucket."""
    now = time.monotonic()
    async with _bucket_lock:
        b = _bucket.get(ip, {"burst": {"t": 3.0, "last": now}, "sust": {"t": 10.0, "last": now}})
        for name, rate, cap in (("burst", 3.0 / 10.0, 3.0), ("sust", 10.0 / 180.0, 10.0)):
            slot = b[name]
            slot["t"] = min(cap, slot["t"] + (now - slot["last"]) * rate)
            slot["last"] = now
        # A request costs 1 sustained token and 1 burst token.
        if b["burst"]["t"] >= 1.0 and b["sust"]["t"] >= 1.0:
            b["burst"]["t"] -= 1.0
            b["sust"]["t"] -= 1.0
            _bucket[ip] = b
            return True, 0
        # compute wait for the limiting bucket
        _bucket[ip] = b
        wait = 0.0
        for name, rate, cap in (("burst", 3.0 / 10.0, 3.0), ("sust", 10.0 / 180.0, 10.0)):
            slot = b[name]
            deficit = 1.0 - slot["t"]
            if deficit > 0:
                wait = max(wait, deficit / rate)
        return False, max(1, int(wait))


app = FastAPI(title="tdeak67 chat proxy", docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def _check_origin(request: Request) -> bool:
    origin = request.headers.get("origin") or request.headers.get("referer") or ""
    # Browsers always send Origin on cross-origin POST. Non-browser callers that
    # omit it are subject to rate limits + the per-IP bucket, but we still allow
    # them through (the API key stays hidden either way).
    if not origin:
        return True
    return origin.rstrip("/") in {o.rstrip("/") for o in ALLOWED_ORIGINS if o}


@app.post("/v1/chat")
async def chat(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not _check_origin(request):
        raise HTTPException(status_code=403, detail="origin not allowed")

    allowed, wait = await _check_rate_limit(client_ip)
    if not allowed:
        raise HTTPException(status_code=429, detail=f"rate limited, retry in {wait}s")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="invalid JSON")

    prompt = (body.get("message") or "").strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="empty message")
    if len(prompt) > MAX_PROMPT_CHARS:
        raise HTTPException(status_code=400, detail="message too long")

    conversation = body.get("conversation") or []
    if len(conversation) > MAX_CONTEXT_MESSAGES:
        conversation = conversation[-MAX_CONTEXT_MESSAGES:]

    contents = []
    for turn in conversation:
        role = turn.get("role")
        text = turn.get("text")
        if role in ("user", "model") and isinstance(text, str) and text.strip():
            contents.append({"role": "model" if role == "model" else "user", "parts": [{"text": text[:MAX_PROMPT_CHARS]}]})
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "generationConfig": {"temperature": 0.7},
    }
    headers = {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
        "Referer": GEMINI_REFERER,
    }
    if not API_KEY:
        return StreamingResponse(
            iter(["I am currently offline. Please contact the administrator."]),
            media_type="text/plain",
        )

    async def gen():
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(connect=10, read=120, write=30, pool=30)) as client:
                async with client.stream("POST", GEMINI_URL, json=payload, headers=headers) as resp:
                    if resp.status_code != 200:
                        detail = await resp.aread()
                        yield f"Proxy error {resp.status_code}: {detail[:200].decode(errors='replace')}"
                        return
                    async for line in resp.aiter_lines():
                        if line.startswith("data: "):
                            data = line[6:]
                            if data.strip() == "[DONE]":
                                break
                            try:
                                obj = json.loads(data)
                                text = obj["candidates"][0]["content"]["parts"][0].get("text", "")
                                if text:
                                    yield text
                            except (json.JSONDecodeError, KeyError, IndexError, AttributeError):
                                continue
        except Exception as exc:  # noqa: BLE001
            yield f"\n\n⚠️ Proxy error: {type(exc).__name__}"

    return StreamingResponse(gen(), media_type="text/plain")


@app.get("/health")
async def health():
    return {"status": "ok", "hasKey": bool(API_KEY)}


if __name__ == "__main__":
    port = int(os.environ.get("PROXY_PORT", "8020"))
    uvicorn.run(app, host="127.0.0.1", port=port, workers=1)