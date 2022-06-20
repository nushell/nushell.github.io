---
title: run-external
version: 0.64.0
usage: |
  Runs external command
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> run-external ...rest --redirect-stdout --redirect-stderr```

## Parameters

 -  `...rest`: external command to run
 -  `--redirect-stdout`: redirect-stdout
 -  `--redirect-stderr`: redirect-stderr

## Examples

Run an external command
```shell
> run-external "echo" "-n" "hello"
```
