---
title: into bool
categories: |
  conversions
version: 0.106.0
conversions: |
  Convert value to boolean.
usage: |
  Convert value to boolean.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `into bool` for [conversions](/commands/categories/conversions.md)

<div class='command-title'>Convert value to boolean.</div>

## Signature

```> into bool {flags} ...rest```

## Flags

 -  `--relaxed`: Relaxes conversion to also allow null and any strings.

## Parameters

 -  `...rest`: For a data structure input, convert data at the given cell paths.


## Input/output types:

| input     | output |
| --------- | ------ |
| int       | bool   |
| number    | bool   |
| string    | bool   |
| bool      | bool   |
| nothing   | bool   |
| list&lt;any&gt; | table  |
| table     | table  |
| record    | record |
## Examples

Convert value to boolean in table
```nu
> [[value]; ['false'] ['1'] [0] [1.0] [true]] | into bool value
╭───┬───────╮
│ # │ value │
├───┼───────┤
│ 0 │ false │
│ 1 │ true  │
│ 2 │ false │
│ 3 │ true  │
│ 4 │ true  │
╰───┴───────╯

```

Convert bool to boolean
```nu
> true | into bool
true
```

convert int to boolean
```nu
> 1 | into bool
true
```

convert float to boolean
```nu
> 0.3 | into bool
true
```

convert float string to boolean
```nu
> '0.0' | into bool
false
```

convert string to boolean
```nu
> 'true' | into bool
true
```

interpret a null as false
```nu
> null | into bool --relaxed
false
```

interpret any non-false, non-zero string as true
```nu
> 'something' | into bool --relaxed
true
```
