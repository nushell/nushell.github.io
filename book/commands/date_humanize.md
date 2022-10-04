---
title: date humanize
version: 0.69.1
date: |
  Print a 'humanized' format for the date, relative to now.
usage: |
  Print a 'humanized' format for the date, relative to now.
---

# <code>{{ $frontmatter.title }}</code> for date

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.date }}</div>

## Signature

```> date humanize ```

## Examples

Print a 'humanized' format for the date, relative to now.
```shell
> date humanize
```

Print a 'humanized' format for the date, relative to now.
```shell
> "2021-10-22 20:00:12 +01:00" | date humanize
```
