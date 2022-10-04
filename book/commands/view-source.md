---
title: view-source
version: 0.69.1
core: |
  View a block, module, or a definition
usage: |
  View a block, module, or a definition
---

# <code>{{ $frontmatter.title }}</code> for core

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.core }}</div>

## Signature

```> view-source (item)```

## Parameters

 -  `item`: name or block to view

## Examples

View the source of a code block
```shell
> let abc = { echo 'hi' }; view-source $abc
```

View the source of a custom command
```shell
> def hi [] { echo 'Hi!' }; view-source hi
```

View the source of a custom command, which participates in the caller environment
```shell
> def-env foo [] { let-env BAR = 'BAZ' }; view-source foo
```

View the source of a module
```shell
> module mod-foo { export-env { let-env FOO_ENV = 'BAZ' } }; view-source mod-foo
```

View the source of an alias
```shell
> alias hello = echo hi; view-source hello
```
