# tdeak67.com — Static Portfolio Site
FROM nginx:1.25-alpine

# Copy built static files
COPY dist/ /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:80/ || exit 1