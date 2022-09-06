---
title: table
version: 0.67.1
usage: |
  Render the table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> table --start-number --list --width```

## Parameters

 -  `--start-number {int}`: row number to start viewing from
 -  `--list`: list available table modes/themes
 -  `--width {int}`: number of terminal columns wide (not output columns)

## Notes
```text
If the table contains a column called 'index', this column is used as the table index instead of the usual continuous index
```
## Examples

List the files in current directory with index number start from 1.
```shell
> ls | table -n 1
```

Render data in table view
```shell
> echo [[a b]; [1 2] [3 4]] | table
```
