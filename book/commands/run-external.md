---
title: run-external
version: 0.67.1
usage: |
  Runs external command
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> run-external (command) ...args --redirect-stdout --redirect-stderr```

## Parameters

 -  `command`: external comamdn to run
 -  `...args`: arguments for external command
 -  `--redirect-stdout`: redirect-stdout
 -  `--redirect-stderr`: redirect-stderr

## Examples

Run an external command
```shell
> run-external "echo" "-n" "hello"
```
