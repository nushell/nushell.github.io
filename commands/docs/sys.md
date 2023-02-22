---
title: sys
categories: |
  system
version: 0.76.0
system: |
  View information about the system.
usage: |
  View information about the system.
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

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
