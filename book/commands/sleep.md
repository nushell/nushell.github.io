---
title: sleep
version: 0.69.1
platform: |
  Delay for a specified amount of time.
usage: |
  Delay for a specified amount of time.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.platform }}</div>

## Signature

```> sleep (duration) ...rest```

## Parameters

 -  `duration`: time to sleep
 -  `...rest`: additional time

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
