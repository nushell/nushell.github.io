---
title: table
categories: |
  viewers
version: 0.78.0
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
 -  `--list` `(-l)`: list available table modes/themes
 -  `--width {int}`: number of terminal columns wide (not output columns)
 -  `--expand` `(-e)`: expand the table structure in a light mode
 -  `--expand-deep {int}`: an expand limit of recursion which will take place
 -  `--flatten` `(-)`: Flatten simple arrays
 -  `--flatten-separator {string}`: sets a separator when 'flatten' used
 -  `--collapse` `(-c)`: expand the table structure in collapse mode.
Be aware collapse mode currently doesn't support width control

## Notes
If the table contains a column called 'index', this column is used as the table index instead of the usual continuous index.
## Examples

List the files in current directory, with indexes starting from 1.
```shell
> ls | table -n 1

```

Render data in table view
```shell
> [[a b]; [1 2] [3 4]] | table
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```

Render data in table view (expanded)
```shell
> [[a b]; [1 2] [2 [4 4]]] | table --expand
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```

Render data in table view (collapsed)
```shell
> [[a b]; [1 2] [2 [4 4]]] | table --collapse
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```
