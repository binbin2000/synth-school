FROM node:20-alpine

# Install nginx
RUN apk add --no-cache nginx

# API server
WORKDIR /app
COPY server/server.js ./

# Static files
COPY index.html css js /usr/share/nginx/html/
COPY css  /usr/share/nginx/html/css
COPY js   /usr/share/nginx/html/js

# nginx config (proxy /api/ to localhost:3001)
COPY nginx.conf /etc/nginx/http.d/default.conf

ENV DATA_DIR=/data PORT=3001
EXPOSE 80

# Start both processes; nginx in foreground keeps the container alive
CMD node /app/server.js & nginx -g 'daemon off;'
