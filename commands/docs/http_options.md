---
title: http options
categories: |
  network
version: 0.82.0
network: |
  Requests permitted communication options for a given URL.
usage: |
  Requests permitted communication options for a given URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http options (URL) --user --password --max-time --headers --insecure --allow-errors```

## Parameters

 -  `URL`: the URL to fetch the options from
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--max-time {int}`: timeout period in seconds
 -  `--headers {any}`: custom headers you want to add
 -  `--insecure` `(-k)`: allow insecure server connections when using SSL
 -  `--allow-errors` `(-e)`: do not fail if the server returns an error code

## Notes

Performs an HTTP OPTIONS request. Most commonly used for making [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) preflight request.

## Examples

Get options from example.com
```shell
> http options https://www.example.com

```

Simulate a browser cross-origin preflight request from www.example.com to media.example.com
```shell
> http options https://media.example.com/api/ -H [Origin https://www.example.com Access-Control-Request-Headers "Content-Type, X-Custom-Header" Access-Control-Request-Method GET]

```
