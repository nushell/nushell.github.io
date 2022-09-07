---
title: str downcase
version: 0.68.0
usage: |
  Make text lowercase
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
