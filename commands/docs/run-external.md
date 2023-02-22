---
title: run-external
categories: |
  system
version: 0.76.0
system: |
  Runs external command
usage: |
  Runs external command
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> run-external (command) ...rest --redirect-stdout --redirect-stderr --trim-end-newline```

## Parameters

 -  `command`: external command to run
 -  `...rest`: arguments for external command
 -  `--redirect-stdout`: redirect stdout to the pipeline
 -  `--redirect-stderr`: redirect stderr to the pipeline
 -  `--trim-end-newline`: trimming end newlines

## Examples

Run an external command
```shell
> run-external "echo" "-n" "hello"
```

Redirect stdout from an external command into the pipeline
```shell
> run-external --redirect-stdout "echo" "-n" "hello" | split chars
```
