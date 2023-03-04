---
title: url join
categories: |
  network
version: 0.76.1
network: |
  Converts a record to url.
usage: |
  Converts a record to url.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url join ```

## Examples

Outputs a url representing the contents of this record
```shell
> {
        "scheme": "http",
        "username": "",
        "password": "",
        "host": "www.pixiv.net",
        "port": "",
        "path": "/member_illust.php",
        "query": "mode=medium&illust_id=99260204",
        "fragment": "",
        "params":
        {
            "mode": "medium",
            "illust_id": "99260204"
        }
    } | url join
```

Outputs a url representing the contents of this record
```shell
> {
        "scheme": "http",
        "username": "user",
        "password": "pwd",
        "host": "www.pixiv.net",
        "port": "1234",
        "query": "test=a",
        "fragment": ""
    } | url join
```

Outputs a url representing the contents of this record
```shell
> {
        "scheme": "http",
        "host": "www.pixiv.net",
        "port": "1234",
        "path": "user",
        "fragment": "frag"
    } | url join
```
