---
title: summary
categories: |
  dataframe
version: 0.74.0
dataframe: |
  For a dataframe, produces descriptive statistics (summary statistics) for its numeric columns.
usage: |
  For a dataframe, produces descriptive statistics (summary statistics) for its numeric columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> summary ```

## Examples

list dataframe descriptives
```shell
> [[a b]; [1 1] [1 1]] | into df | summary
```
