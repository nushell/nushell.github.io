---
title: run-external
version: 0.70.0
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

 -  `command`: external command to run
 -  `...args`: arguments for external command
 -  `--redirect-stdout`: redirect stdout to the pipeline
 -  `--redirect-stderr`: redirect stderr to the pipeline

## Examples

Run an external command
```shell
> run-external "echo" "-n" "hello"
```

Redirect stdout from an external command into the pipeline
```shell
> run-external --redirect-stdout "echo" "-n" "hello" | split chars
```
