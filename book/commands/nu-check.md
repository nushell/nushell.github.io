---
title: nu-check
version: 0.67.1
usage: |
  Validate and parse input content
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> nu-check (path) --as-module --debug --all```

## Parameters

 -  `path`: File path to parse
 -  `--as-module`: Parse content as module
 -  `--debug`: Show error messages
 -  `--all`: Parse content as script first, returns result if success, otherwise, try with module

## Examples

Parse a input file as script(Default)
```shell
> nu-check script.nu
```

Parse a input file as module
```shell
> nu-check --as-module module.nu
```

Parse a input file by showing error message
```shell
> nu-check -d script.nu
```

Parse an external stream as script by showing error message
```shell
> open foo.nu | nu-check -d script.nu
```

Parse an internal stream as module by showing error message
```shell
> open module.nu | lines | nu-check -d --as-module module.nu
```

Parse a string as script
```shell
> echo $'two(char nl)lines' | nu-check
```

Heuristically parse which begins with script first, if it sees a failure, try module afterwards
```shell
> nu-check -a script.nu
```

Heuristically parse by showing error message
```shell
> open foo.nu | lines | nu-check -ad
```
