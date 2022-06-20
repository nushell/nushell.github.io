---
title: ls-df
version: 0.64.0
usage: |
  Lists stored dataframes
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> ls-df ```

## Examples

Creates a new dataframe and shows it in the dataframe list
```shell
> let test = ([[a b];[1 2] [3 4]] | to-df);
    ls-df
```
