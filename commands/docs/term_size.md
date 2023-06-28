---
title: term size
categories: |
  platform
version: 0.82.0
platform: |
  Returns a record containing the number of columns (width) and rows (height) of the terminal.
usage: |
  Returns a record containing the number of columns (width) and rows (height) of the terminal.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> term size ```

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
