---
title: http get
categories: |
  network
version: 0.76.1
network: |
  Fetch the contents from a URL.
usage: |
  Fetch the contents from a URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http get (URL) --user --password --data --content-type --content-length --max-time --headers --raw --insecure```

## Parameters

 -  `URL`: the URL to fetch the contents from
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--data {any}`: the content to post
 -  `--content-type {any}`: the MIME type of content to post
 -  `--content-length {any}`: the length of the content being posted
 -  `--max-time {int}`: timeout period in seconds
 -  `--headers {any}`: custom headers you want to add
 -  `--raw` `(-r)`: fetch contents as text rather than a table
 -  `--insecure` `(-k)`: allow insecure server connections when using SSL

## Notes
Performs HTTP GET operation.
## Examples

Get content from example.com
```shell
> http get https://www.example.com
```

Get content from example.com, with username and password
```shell
> http get -u myuser -p mypass https://www.example.com
```

Get content from example.com, with custom header
```shell
> http get -H [my-header-key my-header-value] https://www.example.com
```

Get content from example.com, with body
```shell
> http get -d 'body' https://www.example.com
```

Get content from example.com, with JSON body
```shell
> http get -t application/json -d { field: value } https://www.example.com
```
