---
title: get-ordinal
version: 0.69.1
dataframe: |
  Gets ordinal from date
usage: |
  Gets ordinal from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-ordinal ```

## Examples

Returns ordinal from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-ordinal
```
