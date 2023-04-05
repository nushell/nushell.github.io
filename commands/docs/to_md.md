---
title: to md
categories: |
  formats
version: 0.78.0
formats: |
  Convert table into simple Markdown.
usage: |
  Convert table into simple Markdown.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to md --pretty --per-element```

## Parameters

 -  `--pretty` `(-p)`: Formats the Markdown table to vertically align items
 -  `--per-element` `(-e)`: treat each row as markdown syntax element

## Examples

Outputs an MD string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to md
|foo|bar|
|-|-|
|1|2|

```

Optionally, output a formatted markdown string
```shell
> [[foo bar]; [1 2]] | to md --pretty
| foo | bar |
| --- | --- |
| 1   | 2   |

```

Treat each row as a markdown element
```shell
> [{"H1": "Welcome to Nushell" } [[foo bar]; [1 2]]] | to md --per-element --pretty
# Welcome to Nushell
| foo | bar |
| --- | --- |
| 1   | 2   |
```

Render a list
```shell
> [0 1 2] | to md --pretty
0
1
2
```
