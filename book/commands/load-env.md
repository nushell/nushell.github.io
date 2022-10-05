---
title: load-env
version: 0.69.1
filesystem: |
  Loads an environment update from a record.
usage: |
  Loads an environment update from a record.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filesystem }}</div>

## Signature

```> load-env (update)```

## Parameters

 -  `update`: the record to use for updates

## Examples

Load variables from an input stream
```shell
> {NAME: ABE, AGE: UNKNOWN} | load-env; echo $env.NAME
```

Load variables from an argument
```shell
> load-env {NAME: ABE, AGE: UNKNOWN}; echo $env.NAME
```
