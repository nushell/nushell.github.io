# Contributing

If you want to contribute to nushell itself, see [nushell/nushell/CONTRIBUTING.md](https://github.com/nushell/nushell/blob/master/CONTRIBUTING.md) and the [contributor-book](https://github.com/nushell/contributor-book).

This website is based on Hugo, which you can install directly or use Docker.

## Running Hugo locally

To run this locally (without Docker, see below), you need the [to install Hugo](https://gohugo.io/getting-started/installing/), then run this command to start the Hugo server:

```shell
hugo server -D
```

Then open http://localhost:1313/

## Running locally with Docker

To avoid installing dependencies locally, run with Docker:

```
docker-compose up
```

Runing that command will first download the `klakegg/hugo` Docker image. That will install dependencies, which can take a while. Once its done, open http://localhost:1313/
