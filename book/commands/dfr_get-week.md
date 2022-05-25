---
title: dfr get-week
layout: command
version: 0.63.0
usage: |
  Gets week from date
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr get-week ```

## Examples

Returns week from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr to-df);
    $df | dfr get-week
```
