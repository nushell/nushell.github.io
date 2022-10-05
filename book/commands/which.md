---
title: which
version: 0.69.1
system: |
  Finds a program file, alias or custom command.
usage: |
  Finds a program file, alias or custom command.
---

# <code>{{ $frontmatter.title }}</code> for system

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.system }}</div>

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
