---
title: term size
version: 0.69.1
platform: |
  Returns the terminal size
usage: |
  Returns the terminal size
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> term size --columns --rows```

## Parameters

 -  `--columns`: Report only the width of the terminal
 -  `--rows`: Report only the height of the terminal

## Examples

Return the width height of the terminal
```shell
> term size
```

Return the width (columns) of the terminal
```shell
> term size -c
```

Return the height (rows) of the terminal
```shell
> term size -r
```
