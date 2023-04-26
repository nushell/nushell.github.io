---
title: http patch
categories: |
  network
version: 0.79.0
network: |
  Patch a body to a URL.
usage: |
  Patch a body to a URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http patch (URL) (data) --user --password --content-type --max-time --headers --raw --insecure --full --allow-errors```

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
 -  `--full` `(-f)`: returns the full response instead of only the body
 -  `--allow-errors` `(-e)`: do not fail if the server returns an error code

## Notes
Performs HTTP PATCH operation.
## Examples

Patch content to example.com
```shell
> http patch https://www.example.com 'body'

```

Patch content to example.com, with username and password
```shell
> http patch -u myuser -p mypass https://www.example.com 'body'

```

Patch content to example.com, with custom header
```shell
> http patch -H [my-header-key my-header-value] https://www.example.com

```

Patch content to example.com, with JSON body
```shell
> http patch -t application/json https://www.example.com { field: value }

```
