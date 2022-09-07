---
title: to toml
version: 0.68.0
usage: |
  Convert table into .toml text
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to toml ```

## Examples

Outputs an TOML string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to toml
```
