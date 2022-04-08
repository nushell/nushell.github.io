---
title: str starts-with
layout: command
version: 0.60.1
usage: |
  Check if string starts with a pattern
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str starts-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: optionally matches prefix of text by column paths

## Examples

Checks if string starts with 'my' pattern
```shell
> 'my_library.rb' | str starts-with 'my'
```

Checks if string starts with 'my' pattern
```shell
> 'Cargo.toml' | str starts-with 'Car'
```

Checks if string starts with 'my' pattern
```shell
> 'Cargo.toml' | str starts-with '.toml'
```
