---
title: def
version: 0.67.0
usage: |
  Define a custom command or subcommand
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> def (def_name) (params) (block)```

## Parameters

 -  `def_name`: definition name, via which the command/function will be available in the environment in which it was defined
 -  `params`: parameters (each parameter will represent a variable within the scope of `block` during the command's execution)
 -  `block`: body of the definition; see https://www.nushell.sh/book/thinking_in_nu.html#nushell-s-environment-is-scoped for more information on scoping in Nushell

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html

More information about defining custom commands (i.e., functions) using the
`def` keyword is available here:
https://www.nushell.sh/book/custom_commands.html
```
## Examples

Define a command and run it
```shell
> def say-hi [] { echo 'hi' }; say-hi
```

Define a subcommand and run it
```shell
> def str greet [] { echo 'good afternoon' }
> str greet
```

Define a command and run it with parameter(s)
```shell
> def say-sth [sth: string] { echo $sth }; say-sth hi
```

Define a command with default parameters
```shell
> def say-default [thing: string = 'hello'] { echo $thing }
> say-default
> say-default goodbye
```

Define a command with optional (positional) parameters
```shell
> def say [text?: string] { echo $text }
> say
> say hello
```

Define a command with an unknown number of parameters (rest parameters)
```shell
> def say-all [...text: string] { for $x in $text { echo $x } }
> say-all gas liquid solid plasma
```
