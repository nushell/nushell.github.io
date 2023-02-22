---
title: http get
categories: |
  network
version: 0.76.0
network: |
  Fetch the contents from a URL.
usage: |
  Fetch the contents from a URL.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> http get (URL) --user --password --max-time --headers --raw --insecure```

## Parameters

 -  `URL`: the URL to fetch the contents from
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--max-time {int}`: timeout period in seconds
 -  `--headers {any}`: custom headers you want to add
 -  `--raw`: fetch contents as text rather than a table
 -  `--insecure`: allow insecure server connections when using SSL

## Notes
Performs HTTP GET operation.
## Examples

http get content from example.com
```shell
> http get https://www.example.com
```

http get content from example.com, with username and password
```shell
> http get -u myuser -p mypass https://www.example.com
```

http get content from example.com, with custom header
```shell
> http get -H [my-header-key my-header-value] https://www.example.com
```
