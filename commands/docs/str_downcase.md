---
title: str downcase
categories: |
  strings
version: 0.77.0
strings: |
  Make text lowercase.
usage: |
  Make text lowercase.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str downcase ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

Downcase contents
```shell
> 'NU' | str downcase
nu
```

Downcase contents
```shell
> 'TESTa' | str downcase
testa
```

Downcase contents
```shell
> [[ColA ColB]; [Test ABC]] | str downcase ColA
╭───┬──────┬──────╮
│ # │ ColA │ ColB │
├───┼──────┼──────┤
│ 0 │ test │ ABC  │
╰───┴──────┴──────╯

```

Downcase contents
```shell
> [[ColA ColB]; [Test ABC]] | str downcase ColA ColB
╭───┬──────┬──────╮
│ # │ ColA │ ColB │
├───┼──────┼──────┤
│ 0 │ test │ abc  │
╰───┴──────┴──────╯

```
