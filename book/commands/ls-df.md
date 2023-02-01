---
title: ls-df
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Lists stored dataframes
usage: |
  Lists stored dataframes
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> ls-df ```

## Examples

Creates a new dataframe and shows it in the dataframe list
```shell
> let test = ([[a b];[1 2] [3 4]] | into df);
    ls-df
```
