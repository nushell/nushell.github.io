---
title: to yaml
version: 0.69.1
formats: |
  Convert table into .yaml/.yml text
usage: |
  Convert table into .yaml/.yml text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> to yaml ```

## Examples

Outputs an YAML string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to yaml
```
