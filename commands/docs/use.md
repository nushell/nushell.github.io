---
title: use
categories: |
  core
version: 0.84.0
core: |
  Use definitions from a module, making them available in your shell.
usage: |
  Use definitions from a module, making them available in your shell.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> use (module) ...rest```

## Parameters

 -  `module`: Module or module file
 -  `...rest`: Which members of the module to import


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |

## Examples

Define a custom command in a module and call it
```shell
> module spam { export def foo [] { "foo" } }; use spam foo; foo
foo
```

Define a custom command that participates in the environment in a module and call it
```shell
> module foo { export def-env bar [] { $env.FOO_BAR = "BAZ" } }; use foo bar; bar; $env.FOO_BAR
BAZ
```

Use a plain module name to import its definitions qualified by the module name
```shell
> module spam { export def foo [] { "foo" }; export def bar [] { "bar" } }; use spam; (spam foo) + (spam bar)
foobar
```

Specify * to use all definitions in a module
```shell
> module spam { export def foo [] { "foo" }; export def bar [] { "bar" } }; use spam *; (foo) + (bar)
foobar
```

To use commands with spaces, like subcommands, surround them with quotes
```shell
> module spam { export def 'foo bar' [] { "baz" } }; use spam 'foo bar'; foo bar
baz
```

To use multiple definitions from a module, wrap them in a list
```shell
> module spam { export def foo [] { "foo" }; export def 'foo bar' [] { "baz" } }; use spam ['foo', 'foo bar']; (foo) + (foo bar)
foobaz
```

## Notes
See `help std` for the standard library module.
See `help modules` to list all available modules.

This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html