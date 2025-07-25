---
title: export def
categories: |
  core
version: 0.106.0
core: |
  Define a custom command and export it from a module.
usage: |
  Define a custom command and export it from a module.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `export def` for [core](/commands/categories/core.md)

<div class='command-title'>Define a custom command and export it from a module.</div>

## Signature

```> export def {flags} (def_name) (params) (block)```

## Flags

 -  `--env`: keep the environment defined inside the command
 -  `--wrapped`: treat unknown flags and arguments as strings (requires ...rest-like parameter in signature)

## Parameters

 -  `def_name`: Command name.
 -  `params`: Parameters.
 -  `block`: Body of the definition.


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |
## Examples

Define a custom command in a module and call it
```nu
> module spam { export def foo [] { "foo" } }; use spam foo; foo
foo
```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html