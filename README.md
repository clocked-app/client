# Front-end client for Clocked

Simple client developed to be the main interface to Clocked operations.

## Run

```bash
docker build --target base --tag app-image .
docker run -it --rm -v "$(pwd)":/var/app -p 8080:8080 app-image sh
npm run dev
```
