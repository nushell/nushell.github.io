---
title: load-env
categories: |
  filesystem
version: 0.75.0
filesystem: |
  Loads an environment update from a record.
usage: |
  Loads an environment update from a record.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> load-env (update)```

## Parameters

 -  `update`: the record to use for updates

## Examples

Load variables from an input stream
```shell
> {NAME: ABE, AGE: UNKNOWN} | load-env; $env.NAME
```

Load variables from an argument
```shell
> load-env {NAME: ABE, AGE: UNKNOWN}; $env.NAME
```
