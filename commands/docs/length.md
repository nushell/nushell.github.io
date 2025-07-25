---
title: length
categories: |
  filters
version: 0.106.0
filters: |
  Count the number of items in an input list, rows in a table, or bytes in binary data.
usage: |
  Count the number of items in an input list, rows in a table, or bytes in binary data.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `length` for [filters](/commands/categories/filters.md)

<div class='command-title'>Count the number of items in an input list, rows in a table, or bytes in binary data.</div>

## Signature

```> length {flags} ```


## Input/output types:

| input     | output |
| --------- | ------ |
| list&lt;any&gt; | int    |
| binary    | int    |
| nothing   | int    |
## Examples

Count the number of items in a list
```nu
> [1 2 3 4 5] | length
5
```

Count the number of rows in a table
```nu
> [{a:1 b:2}, {a:2 b:3}] | length
2
```

Count the number of bytes in binary data
```nu
> 0x[01 02] | length
2
```

Count the length a null value
```nu
> null | length
0
```
