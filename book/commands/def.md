---
title: def
layout: command
version: 0.60.1
usage: |
  Define a custom command
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> def (def_name) (params) (block)`

## Parameters

- `def_name`: definition name
- `params`: parameters
- `block`: body of the definition

## Examples

Define a command and run it

```shell
> def say-hi [] { echo 'hi' }; say-hi
```

Define a command and run it with parameter(s)

```shell
> def say-sth [sth: string] { echo $sth }; say-sth hi
```
