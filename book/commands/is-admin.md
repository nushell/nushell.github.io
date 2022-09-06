---
title: is-admin
version: 0.67.1
usage: |
  Check if nushell is running with administrator or root privileges
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-admin ```

## Examples

Echo 'iamroot' if nushell is running with admin/root privileges, and 'iamnotroot' if not.
```shell
> if is-admin { echo "iamroot" } else { echo "iamnotroot" }
```
