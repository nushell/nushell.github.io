---
title: from json
categories: |
  formats
version: 0.76.1
formats: |
  Convert from json to structured data.
usage: |
  Convert from json to structured data.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from json --objects```

## Parameters

 -  `--objects` `(-o)`: treat each line as a separate value

## Examples

Converts json formatted string to table
```shell
> '{ "a": 1 }' | from json
```

Converts json formatted string to table
```shell
> '{ "a": 1, "b": [1, 2] }' | from json
```
