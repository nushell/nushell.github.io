---
title: save
layout: command
version: 0.63.0
usage: |
  Save a file.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> save (filename) --raw --append```

## Parameters

 -  `filename`: the filename to use
 -  `--raw`: save file as raw binary
 -  `--append`: append input to the end of the file

## Examples

Save a string to foo.txt in current directory
```shell
> echo 'save me' | save foo.txt
```

Save a record to foo.json in current directory
```shell
> echo { a: 1, b: 2 } | save foo.json
```
