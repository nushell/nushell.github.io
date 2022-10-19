---
title: term size
version: 0.70.0
platform: |
  Returns the terminal size
usage: |
  Returns the terminal size
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> term size```

## Examples

Return the columns (width) and rows (height) of the terminal
```shell
> term size
```

Return the columns (width) of the terminal
```shell
> (term size).columns
```

Return the rows (height) of the terminal
```shell
> (term size).rows
```
