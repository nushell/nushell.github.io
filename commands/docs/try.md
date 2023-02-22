---
title: try
categories: |
  core
version: 0.76.0
core: |
  Try to run a block, if it fails optionally run a catch block
usage: |
  Try to run a block, if it fails optionally run a catch block
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> try (try_block) (catch_block)```

## Parameters

 -  `try_block`: block to run
 -  `catch_block`: block to run if try block fails

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Try to run a missing command
```shell
> try { asdfasdf }
```

Try to run a missing command
```shell
> try { asdfasdf } catch { echo 'missing' }
```
