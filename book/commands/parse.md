---
title: parse
categories: |
  strings
version: 0.73.1
strings: |
  Parse columns from string data using a simple pattern.
usage: |
  Parse columns from string data using a simple pattern.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> parse (pattern) --regex```

## Parameters

 -  `pattern`: the pattern to match. Eg) "{foo}: {bar}"
 -  `--regex`: use full regex syntax for patterns

## Examples

Parse a string into two named columns
```shell
> "hi there" | parse "{foo} {bar}"
```

Parse a string using regex pattern
```shell
> "hi there" | parse -r '(?P<foo>\w+) (?P<bar>\w+)'
```

Parse a string using fancy-regex named capture group pattern
```shell
> "foo bar." | parse -r '\s*(?<name>\w+)(?=\.)'
```

Parse a string using fancy-regex capture group pattern
```shell
> "foo! bar." | parse -r '(\w+)(?=\.)|(\w+)(?=!)'
```

Parse a string using fancy-regex look behind pattern
```shell
> " @another(foo bar)   " | parse -r '\s*(?<=[() ])(@\w+)(\([^)]*\))?\s*'
```

Parse a string using fancy-regex look ahead atomic group pattern
```shell
> "abcd" | parse -r '^a(bc(?=d)|b)cd$'
```
