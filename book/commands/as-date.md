---
title: as-date
categories: |
  dataframe
version: 0.73.1
dataframe: |
  Converts string to date.
usage: |
  Converts string to date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> as-date ```

## Notes
```text
Format example:
        "%Y-%m-%d"    => 2021-12-31
        "%d-%m-%Y"    => 31-12-2021
        "%Y%m%d"      => 2021319 (2021-03-19)
```
## Examples

Converts string to date
```shell
> ["2021-12-30" "2021-12-31"] | into df | as-datetime "%Y-%m-%d"
```
