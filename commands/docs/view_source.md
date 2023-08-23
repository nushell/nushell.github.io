---
title: view source
categories: |
  debug
version: 0.84.0
debug: |
  View a block, module, or a definition.
usage: |
  View a block, module, or a definition.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> view source (item)```

## Parameters

 -  `item`: name or block to view


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |

## Examples

View the source of a code block
```shell
> let abc = {|| echo 'hi' }; view source $abc
{|| echo 'hi' }
```

View the source of a custom command
```shell
> def hi [] { echo 'Hi!' }; view source hi
def hi [] { echo 'Hi!' }
```

View the source of a custom command, which participates in the caller environment
```shell
> def-env foo [] { $env.BAR = 'BAZ' }; view source foo
def foo [] { $env.BAR = 'BAZ' }
```

View the source of a custom command with flags and arguments
```shell
> def test [a?:any --b:int ...rest:string] { echo 'test' }; view source test
def test [ a?: any --b: int ...rest: string] { echo 'test' }
```

View the source of a module
```shell
> module mod-foo { export-env { $env.FOO_ENV = 'BAZ' } }; view source mod-foo
 export-env { $env.FOO_ENV = 'BAZ' }
```

View the source of an alias
```shell
> alias hello = echo hi; view source hello
echo hi
```
