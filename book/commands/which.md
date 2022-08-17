---
title: which
version: 0.67.0
usage: |
  Finds a program file, alias or custom command.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
