# tdeak67.com — Deployment Reference

## Sources
- **Project root:** `/root/tdeak67_website`
- **Built files:** `/root/tdeak67_website/dist` (`npm run build` → tsc && vite build)

## Infrastructure
- **Host nginx:** `/etc/nginx/sites-available/tdeak67.com` (symlinked in sites-enabled)
- **SSL certs:** `/etc/letsencrypt/live/tdeak67.com/` (auto-renew, expires 2026-10-28)
- **Docker image:** `tdeak67:latest`
- **Docker container:** `tdeak67-website` (restart: unless-stopped, port: `127.0.0.1:8005→80`)
- **Docker files:** `Dockerfile`, `docker-compose.yml`, `nginx-docker.conf`, `.dockerignore`

## DNS
- `tdeak67.com`, `www.tdeak67.com`, `diary.tdeak67.com` → `187.124.171.89`
- `diary.tdeak67.com` → reverse-proxied to `127.0.0.1:8004` (PocketBase)

## Nginx Flow
```
public:80 → 301 redirect → public:443 → reverse-proxy → 127.0.0.1:8005 (Docker)
```

## Rebuild & Redeploy (one-liner)
```bash
cd /root/tdeak67_website \
  && npm run build \
  && docker build -t tdeak67:latest . \
  && docker rm -f tdeak67-website \
  && docker run -d --name tdeak67-website --restart unless-stopped -p 127.0.0.1:8005:80 tdeak67:latest
```

## Verify
```bash
curl -s -I https://tdeak67.com
docker ps --filter name=tdeak67-website
docker logs tdeak67-website
```