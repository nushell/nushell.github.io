---
title: kill
version: 0.69.1
platform: |
  Kill a process using the process id.
usage: |
  Kill a process using the process id.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.platform }}</div>

## Signature

```> kill (pid) ...rest --force --quiet```

## Parameters

 -  `pid`: process id of process that is to be killed
 -  `...rest`: rest of processes to kill
 -  `--force`: forcefully kill the process
 -  `--quiet`: won't print anything to the console

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
