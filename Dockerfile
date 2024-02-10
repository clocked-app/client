# Stage 1: Base image
FROM node:21-alpine3.18 AS base
WORKDIR /var/app/
RUN <<EOF
apk --no-cache add bash
EOF
COPY . .

# Stage 2: Build stage
FROM node:21-alpine3.18 AS build
ARG CLIENT_VERSION=v0.0.0
ENV VITE_CLIENT_VERSION=${CLIENT_VERSION}
WORKDIR /var/app/
COPY --from=base /var/app .
RUN <<EOF
npm i --ignore-scripts
npm run build
EOF

# Stage 3: Optimized deploy-ready image
LABEL org.opencontainers.image.source=https://github.com/clocked-app/client
FROM nginx:latest
COPY --from=build /var/app/dist /usr/share/nginx/html
COPY --from=build /var/app/.env.production /tmp
COPY --from=build /var/app/update-env-vars-on-build.sh /docker-entrypoint.d
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh", "nginx", "-g", "daemon off;"]
