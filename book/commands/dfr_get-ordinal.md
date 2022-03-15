---
title: dfr get-ordinal
layout: command
version: 0.59.1
usage: |
  Gets ordinal from date
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr get-ordinal ```

## Examples

Returns ordinal from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr to-df);
    $df | dfr get-ordinal
```
