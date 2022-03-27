---
title: sleep
layout: command
version: 0.60.0
usage: |
  Delay for a specified amount of time.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> sleep (duration) ...rest`

## Parameters

- `duration`: time to sleep
- `...rest`: additional time

## Examples

Sleep for 1sec

```shell
> sleep 1sec
```

Sleep for 3sec

```shell
> sleep 1sec 1sec 1sec
```

Send output after 1sec

```shell
> sleep 1sec; echo done
```
