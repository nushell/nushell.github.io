---
title: source
version: 0.67.0
usage: |
  Runs a script file in the current context.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> source (filename)```

## Parameters

 -  `filename`: the filepath to the script file to source

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html
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
