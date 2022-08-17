---
title: overlay list
version: 0.67.0
usage: |
  List all active overlays
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> overlay list ```

## Notes
```text
The overlays are listed in the order they were activated.
```
## Examples

Get the last activated overlay
```shell
> module spam { export def foo [] { "foo" } }
    overlay add spam
    overlay list | last
```
