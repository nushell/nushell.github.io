---
title: http post
categories: |
  network
version: 0.75.0
network: |
  Post a body to a URL.
usage: |
  Post a body to a URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http post (path) (body) --user --password --content-type --content-length --headers --raw --insecure```

## Parameters

 -  `path`: the URL to post to
 -  `body`: the contents of the post body
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--content-type {any}`: the MIME type of content to post
 -  `--content-length {any}`: the length of the content being posted
 -  `--headers {any}`: custom headers you want to add
 -  `--raw`: return values as a string instead of a table
 -  `--insecure`: allow insecure server connections when using SSL

## Notes
Performs HTTP POST operation.
## Examples

Post content to url.com
```shell
> http post url.com 'body'
```

Post content to url.com, with username and password
```shell
> http post -u myuser -p mypass url.com 'body'
```

Post content to url.com, with custom header
```shell
> http post -H [my-header-key my-header-value] url.com
```

Post content to url.com with a json body
```shell
> http post -t application/json url.com { field: value }
```
