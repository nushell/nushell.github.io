---
title: set-with-idx
version: 0.70.0
dataframe: |
  Sets value in the given index
usage: |
  Sets value in the given index
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> set-with-idx (value) --indices```

## Parameters

 -  `value`: value to be inserted in series
 -  `--indices {any}`: list of indices indicating where to set the value

## Examples

Set value in selected rows from series
```shell
> let series = ([4 1 5 2 4 3] | into df);
    let indices = ([0 2] | into df);
    $series | set-with-idx 6 -i $indices
```
