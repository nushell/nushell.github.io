---
title: echo
layout: command
version: 0.60.1
usage: |
  Echo the arguments back to the user.
---

# `{{ $frontmatter.title }}`

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
