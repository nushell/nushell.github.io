---
title: str ends-with
layout: command
version: 0.60.1
usage: |
  checks if string ends with pattern
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str ends-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: optionally matches suffix of text by column paths

## Examples

Checks if string ends with '.rb' pattern
```shell
> 'my_library.rb' | str ends-with '.rb'
```

Checks if string ends with '.txt' pattern
```shell
> 'my_library.rb' | str ends-with '.txt'
```
