---
title: path parse
categories: |
  path
version: 0.106.0
path: |
  Convert a path into structured data.
usage: |
  Convert a path into structured data.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `path parse` for [path](/commands/categories/path.md)

<div class='command-title'>Convert a path into structured data.</div>

## Signature

```> path parse {flags} ```

## Flags

 -  `--extension, -e {string}`: Manually supply the extension (without the dot)


## Input/output types:

| input        | output |
| ------------ | ------ |
| string       | record |
| list&lt;string&gt; | table  |
## Examples

Parse a path
```nu
> '/home/viking/spam.txt' | path parse
╭───────────┬──────────────╮
│ parent    │ /home/viking │
│ stem      │ spam         │
│ extension │ txt          │
╰───────────┴──────────────╯
```

Replace a complex extension
```nu
> '/home/viking/spam.tar.gz' | path parse --extension tar.gz | upsert extension { 'txt' }

```

Ignore the extension
```nu
> '/etc/conf.d' | path parse --extension ''
╭───────────┬────────╮
│ parent    │ /etc   │
│ stem      │ conf.d │
│ extension │        │
╰───────────┴────────╯
```

Parse all paths in a list
```nu
> [ /home/viking.d /home/spam.txt ] | path parse
╭───┬────────┬────────┬───────────╮
│ # │ parent │  stem  │ extension │
├───┼────────┼────────┼───────────┤
│ 0 │ /home  │ viking │ d         │
│ 1 │ /home  │ spam   │ txt       │
╰───┴────────┴────────┴───────────╯

```

## Notes
Each path is split into a table with 'parent', 'stem' and 'extension' fields.
On Windows, an extra 'prefix' column is added.