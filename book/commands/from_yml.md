---
title: from yml
layout: command
version: 0.60.1
usage: |
  Parse text as .yaml/.yml and create table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> from yml ```

## Examples

Converts yaml formatted string to table
```shell
> 'a: 1' | from yaml
```

Converts yaml formatted string to table
```shell
> '[ a: 1, b: [1, 2] ]' | from yaml
```
