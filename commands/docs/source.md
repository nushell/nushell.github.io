---
title: source
categories: |
  core
version: 0.79.0
core: |
  Runs a script file in the current context.
usage: |
  Runs a script file in the current context.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> source (filename)```

## Parameters

 -  `filename`: the filepath to the script file to source

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Runs foo.nu in the current context
```shell
> source foo.nu

```

Runs foo.nu in current context and call the command defined, suppose foo.nu has content: `def say-hi [] { echo 'Hi!' }`
```shell
> source ./foo.nu; say-hi

```
