---
title: path parse
layout: command
version: 0.60.0
usage: |
  Convert a path into structured data.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> path parse --columns --extension`

## Parameters

- `--columns {table}`: Optionally operate by column path
- `--extension {string}`: Manually supply the extension (without the dot)

## Examples

Parse a path

```shell
> '/home/viking/spam.txt' | path parse
```

Replace a complex extension

```shell
> '/home/viking/spam.tar.gz' | path parse -e tar.gz | upsert extension { 'txt' }
```

Ignore the extension

```shell
> '/etc/conf.d' | path parse -e ''
```

Parse all paths under the 'name' column

```shell
> ls | path parse -c [ name ]
```
