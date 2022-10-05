---
title: from json
version: 0.69.1
formats: |
  Convert from json to structured data
usage: |
  Convert from json to structured data
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from json --objects```

## Parameters

 -  `--objects`: treat each line as a separate value

## Examples

Converts json formatted string to table
```shell
> '{ "a": 1 }' | from json
```

Converts json formatted string to table
```shell
> '{ "a": 1, "b": [1, 2] }' | from json
```
