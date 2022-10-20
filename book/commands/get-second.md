---
title: get-second
version: 0.70.0
dataframe: |
  Gets second from date
usage: |
  Gets second from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-second ```

## Examples

Returns second from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-second
```
