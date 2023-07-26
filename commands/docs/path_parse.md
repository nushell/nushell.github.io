---
title: path parse
categories: |
  default
version: 0.83.0
default: |
  Convert a path into structured data.
usage: |
  Convert a path into structured data.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path parse --extension```

## Parameters

 -  `--extension {string}`: Manually supply the extension (without the dot)

## Notes
Each path is split into a table with 'parent', 'stem' and 'extension' fields.
On Windows, an extra 'prefix' column is added.
## Examples

Parse a path
```shell
> '/home/viking/spam.txt' | path parse
╭───────────┬──────────────╮
│ parent    │ /home/viking │
│ stem      │ spam         │
│ extension │ txt          │
╰───────────┴──────────────╯
```

Replace a complex extension
```shell
> '/home/viking/spam.tar.gz' | path parse -e tar.gz | upsert extension { 'txt' }

```

Ignore the extension
```shell
> '/etc/conf.d' | path parse -e ''
╭───────────┬────────╮
│ parent    │ /etc   │
│ stem      │ conf.d │
│ extension │        │
╰───────────┴────────╯
```

Parse all paths in a list
```shell
> [ /home/viking.d /home/spam.txt ] | path parse
╭───┬────────┬────────┬───────────╮
│ # │ parent │  stem  │ extension │
├───┼────────┼────────┼───────────┤
│ 0 │ /home  │ viking │ d         │
│ 1 │ /home  │ spam   │ txt       │
╰───┴────────┴────────┴───────────╯

```
