---
title: kill
categories: |
  platform
version: 0.76.1
platform: |
  Kill a process using the process id.
usage: |
  Kill a process using the process id.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> kill (pid) ...rest --force --quiet --signal```

## Parameters

 -  `pid`: process id of process that is to be killed
 -  `...rest`: rest of processes to kill
 -  `--force` `(-f)`: forcefully kill the process
 -  `--quiet` `(-q)`: won't print anything to the console
 -  `--signal {int}`: signal decimal number to be sent instead of the default 15 (unsupported on Windows)

## Examples

Kill the pid using the most memory
```shell
> ps | sort-by mem | last | kill $in.pid
```

Force kill a given pid
```shell
> kill --force 12345
```

Send INT signal
```shell
> kill -s 2 12345
```
