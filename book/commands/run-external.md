---
title: run-external
version: 0.69.1
system: |
  Runs external command
usage: |
  Runs external command
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

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
