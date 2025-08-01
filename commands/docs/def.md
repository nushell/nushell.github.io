---
title: def
categories: |
  core
version: 0.106.0
core: |
  Define a custom command.
usage: |
  Define a custom command.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `def` for [core](/commands/categories/core.md)

<div class='command-title'>Define a custom command.</div>

## Signature

```> def {flags} (def_name) (params) (block)```

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

Define a command and run it
```nu
> def say-hi [] { echo 'hi' }; say-hi
hi
```

Define a command and run it with parameter(s)
```nu
> def say-sth [sth: string] { echo $sth }; say-sth hi
hi
```

Set environment variable by call a custom command
```nu
> def --env foo [] { $env.BAR = "BAZ" }; foo; $env.BAR
BAZ
```

cd affects the environment, so '--env' is required to change directory from within a command
```nu
> def --env gohome [] { cd ~ }; gohome; $env.PWD == ('~' | path expand)
true
```

Define a custom wrapper for an external command
```nu
> def --wrapped my-echo [...rest] { ^echo ...$rest }; my-echo -e 'spam\tspam'
spamspam
```

Define a custom command with a type signature. Passing a non-int value will result in an error
```nu
> def only_int []: int -> int { $in }; 42 | only_int
42
```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html