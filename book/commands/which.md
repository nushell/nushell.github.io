---
title: which
layout: command
version: 0.60.0
usage: |
  Finds a program file, alias or custom command.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> which (application) ...rest --all`

## Parameters

- `application`: application
- `...rest`: additional applications
- `--all`: list all executables

## Examples

Find if the 'myapp' application is available

```shell
> which myapp
```
