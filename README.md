# Front-end client for Clocked

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Quasar](https://img.shields.io/badge/Quasar-16B7FB?style=for-the-badge&logo=quasar&logoColor=black)
<br>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=clocked-app_client&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=clocked-app_client)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=clocked-app_client&metric=coverage)](https://sonarcloud.io/summary/new_code?id=clocked-app_client)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=clocked-app_client&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=clocked-app_client)
<br>
![CI](https://github.com/clocked-app/client/actions/workflows/ci.yml/badge.svg)
![Release](https://github.com/clocked-app/client/actions/workflows/release.yml/badge.svg)
<br>
<br>

Simple client developed to be the main interface to Clocked operations.

## Run

```bash
docker build --target base --tag app-image .
docker run -it --name client -v "$(pwd)":/var/app -p 8080:8080 --workdir /var/app app-image bash
npm run dev
```
## Development

To use the container as development environment, reuse the container created:

```bash
docker build --target base --tag app-image .
docker run -it --name client -v "$(pwd)":/var/app -p 8080:8080 --workdir /var/app app-image bash

# To run it again
docker start client

# To access it on terminal
docker exec -it client bash
```

To use [nvim](https://neovim.io/) inside the container for development of features, just run `.dev/nvim-setup.sh`. It will install and configure nvim and other dependencies.

This project uses hooks and actions for checking new changes.

## Deployment

The release automated workflow publishes the docker images on [Docker Hub](https://hub.docker.com/r/clockedwtc/client/tags) and [GitHub Container Registry](https://github.com/clocked-app/client/pkgs/container/wtc-client).

After pulling the images from the most appropriate location, execute one of the following commands to run the image:

```bash
docker run --rm -p {PORT}:8080 ghcr.io/clocked-app/client:{VERSION} # or
docker run --rm -p {PORT}:8080 clockedwtc/client:{VERSION}

