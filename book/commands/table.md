---
title: table
version: 0.68.0
usage: |
  Render the table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> table --start-number --list --width --expand --expand-deep --flatten --flatten-separator --collapse```

## Parameters

 -  `--start-number {int}`: row number to start viewing from
 -  `--list`: list available table modes/themes
 -  `--width {int}`: number of terminal columns wide (not output columns)
 -  `--expand`: changes a standart table view; expand the table structure so internal all data will be displayed as inner tables

    #### **NOTICE**
    
    The `expand` mode can be considered generally slower than a base table view.
    So if you have a large data set you may not better use it.
 -  `--expand-deep {int}`: set a limit after which table enlargement is stopped
 -  `--flatten`: an `--expand` view option to return a set of values instead of table for a simple lists
 -  `--flatten-separator {char}`: a configuration of a separator for `--flatten`
 -  `--collapse`: changes a standart table view; expand the table structure in a squashed way

    #### **NOTICE**
    
    `collapse` mode currently doesn't support width controll, therefore if your terminal is not wide enough the table might be broken.

    The `collapse` mode can be considered generally slower than a base table view.
    So if you have a large data set you may not better use it.

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

`expand` table view
```shell
> sys | table --expand
```

`collapse` table view
```shell
> sys | table --collapse
```