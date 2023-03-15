---
title: http put
categories: |
  network
version: 0.77.0
network: |
  Put a body to a URL.
usage: |
  Put a body to a URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http put (URL) (data) --user --password --content-type --max-time --headers --raw --insecure```

## Parameters

 -  `URL`: the URL to post to
 -  `data`: the contents of the post body
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--content-type {any}`: the MIME type of content to post
 -  `--max-time {int}`: timeout period in seconds
 -  `--headers {any}`: custom headers you want to add
 -  `--raw` `(-r)`: return values as a string instead of a table
 -  `--insecure` `(-k)`: allow insecure server connections when using SSL

## Notes
Performs HTTP PUT operation.
## Examples

Put content to example.com
```shell
> http put https://www.example.com 'body'

```

Put content to example.com, with username and password
```shell
> http put -u myuser -p mypass https://www.example.com 'body'

```

Put content to example.com, with custom header
```shell
> http put -H [my-header-key my-header-value] https://www.example.com

```

Put content to example.com, with JSON body
```shell
> http put -t application/json https://www.example.com { field: value }

```
