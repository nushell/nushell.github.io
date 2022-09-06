---
title: sys
version: 0.67.1
usage: |
  View information about the system.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> sys ```

## Examples

Show info about the system
```shell
> sys
```

Show the os system name with get
```shell
> (sys).host | get name
```

Show the os system name
```shell
> (sys).host.name
```
