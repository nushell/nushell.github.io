---
title: source
layout: command
version: 0.63.0
usage: |
  Runs a script file in the current context.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> source (filename)```

## Parameters

 -  `filename`: the filepath to the script file to source

## Notes
```text
This command is a parser keyword. For details, check
https://www.nushell.sh/book/thinking_in_nushell.html#parsing-and-evaluation-are-different-stages
```
## Examples

Runs foo.nu in the current context
```shell
> source foo.nu
```

Runs foo.nu in current context and call the command defined, suppose foo.nu has content: `def say-hi [] { echo 'Hi!' }`
```shell
> source ./foo.nu; say-hi
```

Runs foo.nu in current context and call the `main` command automatically, suppose foo.nu has content: `def main [] { echo 'Hi!' }`
```shell
> source ./foo.nu
```
