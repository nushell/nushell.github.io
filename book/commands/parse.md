---
title: parse
version: 0.68.0
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

Parse a string using fancy-regex named capture group pattern
```shell
> echo "foo bar." | parse -r '\s*(?<name>\w+)(?=\.)'
```

Parse a string using fancy-regex capture group pattern
```shell
> echo "foo! bar." | parse -r '(\w+)(?=\.)|(\w+)(?=!)'
```

Parse a string using fancy-regex look behind pattern
```shell
> echo " @another(foo bar)   " | parse -r '\s*(?<=[() ])(@\w+)(\([^)]*\))?\s*'
```

Parse a string using fancy-regex look ahead atomic group pattern
```shell
> echo "abcd" | parse -r '^a(bc(?=d)|b)cd$'
```
