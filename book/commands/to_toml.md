---
title: to toml
version: 0.69.1
formats: |
  Convert table into .toml text
usage: |
  Convert table into .toml text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> to toml ```

## Examples

Outputs an TOML string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to toml
```
