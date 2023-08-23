---
title: is-admin
categories: |
  core
version: 0.84.0
core: |
  Check if nushell is running with administrator or root privileges.
usage: |
  Check if nushell is running with administrator or root privileges.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> is-admin ```


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | bool   |

## Examples

Return 'iamroot' if nushell is running with admin/root privileges, and 'iamnotroot' if not.
```shell
> if (is-admin) { "iamroot" } else { "iamnotroot" }
iamnotroot
```
