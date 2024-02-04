# Front-end client for Clocked

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

