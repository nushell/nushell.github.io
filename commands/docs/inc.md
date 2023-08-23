---
title: inc
categories: |
  default
version: 0.84.0
default: |
  Increment a value or version. Optionally use the column of a table.
usage: |
  Increment a value or version. Optionally use the column of a table.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> inc (cell_path) --major --minor --patch```

## Parameters

 -  `cell_path`: cell path to update
 -  `--major` `(-M)`: increment the major version (eg 1.2.1 -> 2.0.0)
 -  `--minor` `(-m)`: increment the minor version (eg 1.2.1 -> 1.3.0)
 -  `--patch` `(-p)`: increment the patch version (eg 1.2.1 -> 1.2.2)


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |
