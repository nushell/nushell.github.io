---
title: open
categories: |
  filesystem
version: 0.76.1
filesystem: |
  Load a file into a cell, converting to table if possible (avoid by appending '--raw').
usage: |
  Load a file into a cell, converting to table if possible (avoid by appending '--raw').
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> open (filename) --raw```

## Parameters

 -  `filename`: the filename to use
 -  `--raw` `(-r)`: open file as raw binary

## Examples

Open a file, with structure (based on file extension or SQLite database header)
```shell
> open myfile.json
```

Open a file, as raw bytes
```shell
> open myfile.json --raw
```

Open a file, using the input to get filename
```shell
> 'myfile.txt' | open
```

Open a file, and decode it by the specified encoding
```shell
> open myfile.txt --raw | decode utf-8
```
