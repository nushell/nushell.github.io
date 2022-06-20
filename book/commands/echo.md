---
title: echo
version: 0.64.0
usage: |
  Echo the arguments back to the user.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> echo ...rest```

## Parameters

 -  `...rest`: the values to echo

## Examples

Put a hello message in the pipeline
```shell
> echo 'hello'
```

Print the value of the special '$nu' variable
```shell
> echo $nu
```
