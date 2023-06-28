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
Performs HTTP OPTIONS operation.
## Examples

Get options from example.com
```shell
> http options https://www.example.com

```

Get options from example.com, with username and password
```shell
> http options -u myuser -p mypass https://www.example.com

```

Get options from example.com, with custom header
```shell
> http options -H [my-header-key my-header-value] https://www.example.com

```

Get options from example.com, with custom headers
```shell
> http options -H [my-header-key-A my-header-value-A my-header-key-B my-header-value-B] https://www.example.com

```
