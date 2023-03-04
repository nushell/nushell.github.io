---
title: http post
categories: |
  network
version: 0.76.1
network: |
  Post a body to a URL.
usage: |
  Post a body to a URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http post (URL) (data) --user --password --content-type --content-length --max-time --headers --raw --insecure```

## Parameters

 -  `URL`: the URL to post to
 -  `data`: the contents of the post body
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--content-type {any}`: the MIME type of content to post
 -  `--content-length {any}`: the length of the content being posted
 -  `--max-time {int}`: timeout period in seconds
 -  `--headers {any}`: custom headers you want to add
 -  `--raw` `(-r)`: return values as a string instead of a table
 -  `--insecure` `(-k)`: allow insecure server connections when using SSL

## Notes
Performs HTTP POST operation.
## Examples

Post content to example.com
```shell
> http post https://www.example.com 'body'
```

Post content to example.com, with username and password
```shell
> http post -u myuser -p mypass https://www.example.com 'body'
```

Post content to example.com, with custom header
```shell
> http post -H [my-header-key my-header-value] https://www.example.com
```

Post content to example.com, with JSON body
```shell
> http post -t application/json https://www.example.com { field: value }
```
