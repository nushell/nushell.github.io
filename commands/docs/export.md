---
title: export
categories: |
  core
version: 0.106.0
core: |
  Export definitions or environment variables from a module.
usage: |
  Export definitions or environment variables from a module.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `export` for [core](/commands/categories/core.md)

<div class='command-title'>Export definitions or environment variables from a module.</div>

## Signature

```> export {flags} ```


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |
## Examples

Export a definition from a module
```nu
> module utils { export def my-command [] { "hello" } }; use utils my-command; my-command
hello
```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html

## Subcommands:

| name                                               | description                                                                      | type    |
| -------------------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| [`export alias`](/commands/docs/export_alias.md)   | Alias a command (with optional flags) to a new name and export it from a module. | keyword |
| [`export const`](/commands/docs/export_const.md)   | Use parse-time constant from a module and export them from this module.          | keyword |
| [`export def`](/commands/docs/export_def.md)       | Define a custom command and export it from a module.                             | keyword |
| [`export extern`](/commands/docs/export_extern.md) | Define an extern and export it from a module.                                    | keyword |
| [`export module`](/commands/docs/export_module.md) | Export a custom module from a module.                                            | keyword |
| [`export use`](/commands/docs/export_use.md)       | Use definitions from a module and export them from this module.                  | keyword |