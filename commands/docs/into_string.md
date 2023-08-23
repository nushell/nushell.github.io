---
title: into string
categories: |
  conversions
version: 0.84.0
conversions: |
  Convert value to string.
usage: |
  Convert value to string.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into string ...rest --decimals```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths
 -  `--decimals {int}`: decimal digits to which to round


## Input/output types:

| input     | output       |
| --------- | ------------ |
| binary    | string       |
| bool      | string       |
| datetime  | string       |
| duration  | string       |
| filesize  | string       |
| int       | string       |
| list\<any\> | list\<string\> |
| number    | string       |
| record    | record       |
| string    | string       |
| table     | table        |
## Examples

convert integer to string and append three decimal places
```shell
> 5 | into string -d 3
5.000
```

convert decimal to string and round to nearest integer
```shell
> 1.7 | into string -d 0
2
```

convert decimal to string
```shell
> 1.7 | into string -d 1
1.7
```

convert decimal to string and limit to 2 decimals
```shell
> 1.734 | into string -d 2
1.73
```

try to convert decimal to string and provide negative decimal points
```shell
> 1.734 | into string -d -2

```

convert decimal to string
```shell
> 4.3 | into string
4.3
```

convert string to string
```shell
> '1234' | into string
1234
```

convert boolean to string
```shell
> true | into string
true
```

convert date to string
```shell
> '2020-10-10 10:00:00 +02:00' | into datetime | into string
Sat Oct 10 10:00:00 2020
```

convert filepath to string
```shell
> ls Cargo.toml | get name | into string

```

convert filesize to string
```shell
> 1KiB | into string
1,024 B
```

convert duration to string
```shell
> 9day | into string
1wk 2day
```
