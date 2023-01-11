---
title: start
categories: |
  filesystem
version: 0.74.0
filesystem: |
  Open a folder or file in the default application or viewer.
usage: |
  Open a folder or file in the default application or viewer.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> start (filepath)```

## Parameters

 -  `filepath`: the filepath to open

## Examples

Open a text file with the default text editor
```shell
> start file.txt
```

Open an image with the default image viewer
```shell
> start file.jpg
```

Open the current directory with the default file manager
```shell
> start .
```

Open a pdf with the default pdf viewer
```shell
> start file.pdf
```
