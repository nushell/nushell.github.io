---
title: str downcase
categories: |
  strings
version: 0.70.0
strings: |
  Make text lowercase
usage: |
  Make text lowercase
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str downcase ...rest```

## Parameters

 -  `...rest`: optionally downcase text by column paths

## Examples

Downcase contents
```shell
> 'NU' | str downcase
```

Downcase contents
```shell
> 'TESTa' | str downcase
```

Downcase contents
```shell
> [[ColA ColB]; [Test ABC]] | str downcase ColA
```

Downcase contents
```shell
> [[ColA ColB]; [Test ABC]] | str downcase ColA ColB
```
