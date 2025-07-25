---
title: is-terminal
categories: |
  platform
version: 0.106.0
platform: |
  Check if stdin, stdout, or stderr is a terminal.
usage: |
  Check if stdin, stdout, or stderr is a terminal.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `is-terminal` for [platform](/commands/categories/platform.md)

<div class='command-title'>Check if stdin, stdout, or stderr is a terminal.</div>

## Signature

```> is-terminal {flags} ```

## Flags

 -  `--stdin, -i`: Check if stdin is a terminal
 -  `--stdout, -o`: Check if stdout is a terminal
 -  `--stderr, -e`: Check if stderr is a terminal


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | bool   |
## Examples

Return "terminal attached" if standard input is attached to a terminal, and "no terminal" if not.
```nu
> if (is-terminal --stdin) { "terminal attached" } else { "no terminal" }
terminal attached
```
