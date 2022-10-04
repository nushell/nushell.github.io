---
title: with-env
version: 0.69.1
env: |
  Runs a block with an environment variable set.
usage: |
  Runs a block with an environment variable set.
---

# <code>{{ $frontmatter.title }}</code> for env

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.env }}</div>

## Signature

```> with-env (variable) (block)```

## Parameters

 -  `variable`: the environment variable to temporarily set
 -  `block`: the block to run once the variable is set

## Examples

Set the MYENV environment variable
```shell
> with-env [MYENV "my env value"] { $env.MYENV }
```

Set by primitive value list
```shell
> with-env [X Y W Z] { $env.X }
```

Set by single row table
```shell
> with-env [[X W]; [Y Z]] { $env.W }
```

Set by row(e.g. `open x.json` or `from json`)
```shell
> echo '{"X":"Y","W":"Z"}'|from json|with-env $in { echo $env.X $env.W }
```
