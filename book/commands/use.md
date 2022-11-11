---
title: use
categories: |
  core
version: 0.71.0
core: |
  Use definitions from a module
usage: |
  Use definitions from a module
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> use (pattern)```

## Parameters

 -  `pattern`: import pattern

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Define a custom command in a module and call it
```shell
> module spam { export def foo [] { "foo" } }; use spam foo; foo
```

Define a custom command that participates in the environment in a module and call it
```shell
> module foo { export def-env bar [] { let-env FOO_BAR = "BAZ" } }; use foo bar; bar; $env.FOO_BAR
```
