---
title: parse
version: 0.64.0
usage: |
  Parse columns from string data using a simple pattern.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> parse (pattern) --regex```

## Parameters

 -  `pattern`: the pattern to match. Eg) "{foo}: {bar}"
 -  `--regex`: use full regex syntax for patterns

## Examples

Parse a string into two named columns
```shell
> echo "hi there" | parse "{foo} {bar}"
```

Parse a string using regex pattern
```shell
> echo "hi there" | parse -r '(?P<foo>\w+) (?P<bar>\w+)'
```
