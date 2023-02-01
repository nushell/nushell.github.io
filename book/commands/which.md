---
title: which
categories: |
  system
version: 0.75.0
system: |
  Finds a program file, alias or custom command.
usage: |
  Finds a program file, alias or custom command.
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> which (application) ...rest --all```

## Parameters

 -  `application`: application
 -  `...rest`: additional applications
 -  `--all`: list all executables

## Examples

Find if the 'myapp' application is available
```shell
> which myapp
```
