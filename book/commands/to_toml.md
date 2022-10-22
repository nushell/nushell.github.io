---
title: to toml
categories: |
  formats
version: 0.70.0
formats: |
  Convert table into .toml text
usage: |
  Convert table into .toml text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to toml ```

## Examples

Outputs an TOML string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to toml
```
