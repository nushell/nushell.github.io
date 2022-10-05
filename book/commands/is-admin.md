---
title: is-admin
version: 0.69.1
core: |
  Check if nushell is running with administrator or root privileges
usage: |
  Check if nushell is running with administrator or root privileges
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> is-admin ```

## Examples

Echo 'iamroot' if nushell is running with admin/root privileges, and 'iamnotroot' if not.
```shell
> if is-admin { echo "iamroot" } else { echo "iamnotroot" }
```
