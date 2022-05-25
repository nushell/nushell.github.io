---
title: dfr get-month
layout: command
version: 0.63.0
usage: |
  Gets month from date
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr get-month ```

## Examples

Returns month from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr to-df);
    $df | dfr get-month
```
