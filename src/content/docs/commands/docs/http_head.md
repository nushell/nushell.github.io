---
title: http head
categories: |
  network
version: 0.90.0
network: |
  Get the headers from a URL.
usage: |
  Get the headers from a URL.
feature: default
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

`> http head {flags} (URL)`

## Flags

- `--user, -u {any}`: the username when authenticating
- `--password, -p {any}`: the password when authenticating
- `--max-time, -m {int}`: timeout period in seconds
- `--headers, -H {any}`: custom headers you want to add
- `--insecure, -k`: allow insecure server connections when using SSL
- `--redirect-mode, -R {string}`: What to do when encountering redirects. Default: 'follow'. Valid options: 'follow' ('f'), 'manual' ('m'), 'error' ('e').

## Parameters

- `URL`: The URL to fetch the contents from.

## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | any    |

## Examples

Get headers from example.com

```nu
> http head https://www.example.com

```

Get headers from example.com, with username and password

```nu
> http head --user myuser --password mypass https://www.example.com

```

Get headers from example.com, with custom header

```nu
> http head --headers [my-header-key my-header-value] https://www.example.com

```

## Notes

Performs HTTP HEAD operation.