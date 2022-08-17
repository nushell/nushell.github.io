---
title: inc
version: 0.67.0
usage: |
  Increment a value or version. Optionally use the column of a table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> inc (cell_path) --major --minor --patch```

## Parameters

 -  `cell_path`: cell path to update
 -  `--major`: increment the major version (eg 1.2.1 -> 2.0.0)
 -  `--minor`: increment the minor version (eg 1.2.1 -> 1.3.0)
 -  `--patch`: increment the patch version (eg 1.2.1 -> 1.2.2)
