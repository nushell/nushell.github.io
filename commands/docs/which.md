---
title: which
categories: |
  system
version: 0.84.0
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
 -  `--all` `(-a)`: list all executables


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | table  |

## Examples

Find if the 'myapp' application is available
```shell
> which myapp

```
