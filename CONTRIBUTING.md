# Contributing

If you want to contribute to nushell itself, see [nushell/nushell/CONTRIBUTING.md](https://github.com/nushell/nushell/blob/master/CONTRIBUTING.md) and the [contributor-book](https://github.com/nushell/contributor-book).

This website is based on Jekyll, which requires Ruby or Docker.

## Running locally with Bundler

To run this locally (without Docker, see below), you need the [dependencies as specified by Jekyll](https://jekyllrb.com/docs/installation/), then run these commands:

```shell
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000/

## Running locally with Docker

To avoid installing dependencies locally, run with Docker:

```
docker-compose up
```

Runing that command will first download the `jekyll/jekyll` Docker image. That will install dependencies, which can take a while. Once its done, open http://localhost:4000/

Changes in files will then show up after a reload and some delay (can be ~10 seconds).
