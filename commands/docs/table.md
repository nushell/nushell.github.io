---
title: table
categories: |
  viewers
version: 0.76.0
viewers: |
  Render the table.
usage: |
  Render the table.
---

# <code>{{ $frontmatter.title }}</code> for viewers

<div class='command-title'>{{ $frontmatter.viewers }}</div>

## Signature

```> table --start-number --list --width --expand --expand-deep --flatten --flatten-separator --collapse```

## Parameters

 -  `--start-number {int}`: row number to start viewing from
 -  `--list`: list available table modes/themes
 -  `--width {int}`: number of terminal columns wide (not output columns)
 -  `--expand`: expand the table structure in a light mode
 -  `--expand-deep {int}`: an expand limit of recursion which will take place
 -  `--flatten`: Flatten simple arrays
 -  `--flatten-separator {string}`: sets a separator when 'flatten' used
 -  `--collapse`: expand the table structure in collapse mode.
Be aware collapse mode currently doesn't support width control

## Notes
If the table contains a column called 'index', this column is used as the table index instead of the usual continuous index
## Examples

List the files in current directory, with indexes starting from 1.
```shell
> ls | table -n 1
```

Render data in table view
```shell
> [[a b]; [1 2] [3 4]] | table
```

Render data in table view (expanded)
```shell
> [[a b]; [1 2] [2 [4 4]]] | table --expand
```

Render data in table view (collapsed)
```shell
> [[a b]; [1 2] [2 [4 4]]] | table --collapse
```
