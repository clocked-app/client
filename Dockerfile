# Stage 1: Base image
FROM node:21-alpine3.18 as base
WORKDIR /var/app/
RUN <<EOF
apk add bash
EOF
COPY . .

# Stage 2: Build stage
FROM node:21-alpine3.18 as build
ARG CLIENT_VERSION=v0.0.0
ENV CLIENT_VERSION=${CLIENT_VERSION}
WORKDIR /var/app/
COPY --from=base /var/app .
RUN <<EOF
npm i
npm run build
EOF

# Stage 3: Optimized deploy-ready image
LABEL org.opencontainers.image.source=https://github.com/clocked-app/client
FROM nginx:1.25.3-alpine
RUN rm -rf /usr/share/nginx/html
COPY --from=build /var/app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
