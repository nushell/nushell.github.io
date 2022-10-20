---
title: echo
version: 0.70.0
core: |
  Echo the arguments back to the user.
usage: |
  Echo the arguments back to the user.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> echo ...rest```

## Parameters

 -  `...rest`: the values to echo

## Notes
```text
Unlike `print`, this command returns an actual value that will be passed to the next command of the pipeline.
```
## Examples

Put a hello message in the pipeline
```shell
> echo 'hello'
```

Print the value of the special '$nu' variable
```shell
> echo $nu
```
