---
title: url parse
categories: |
  network
version: 0.79.0
network: |
  Parses a url.
usage: |
  Parses a url.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url parse ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Parses a url
```shell
> 'http://user123:pass567@www.example.com:8081/foo/bar?param1=section&p2=&f[name]=vldc#hello' | url parse
╭──────────┬─────────────────────────────────╮
│ scheme   │ http                            │
│ username │ user123                         │
│ password │ pass567                         │
│ host     │ www.example.com                 │
│ port     │ 8081                            │
│ path     │ /foo/bar                        │
│ query    │ param1=section&p2=&f[name]=vldc │
│ fragment │ hello                           │
│          │ ╭─────────┬─────────╮           │
│ params   │ │ param1  │ section │           │
│          │ │ p2      │         │           │
│          │ │ f[name] │ vldc    │           │
│          │ ╰─────────┴─────────╯           │
╰──────────┴─────────────────────────────────╯
```
