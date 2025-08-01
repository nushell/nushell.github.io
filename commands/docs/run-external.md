---
title: run-external
categories: |
  system
version: 0.106.0
system: |
  Runs external command.
usage: |
  Runs external command.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `run-external` for [system](/commands/categories/system.md)

<div class='command-title'>Runs external command.</div>

## Signature

```> run-external {flags} ...rest```

## Parameters

 -  `...rest`: External command to run, with arguments.


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |
## Examples

Run an external command
```nu
> run-external "echo" "-n" "hello"

```

Redirect stdout from an external command into the pipeline
```nu
> run-external "echo" "-n" "hello" | split chars

```

Redirect stderr from an external command into the pipeline
```nu
> run-external "nu" "-c" "print -e hello" e>| split chars

```
