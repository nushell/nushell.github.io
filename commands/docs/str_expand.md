---
title: str expand
categories: |
  strings
version: 0.84.0
strings: |
  Generates all possible combinations defined in brace expansion syntax.
usage: |
  Generates all possible combinations defined in brace expansion syntax.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str expand --path```

## Parameters

 -  `--path` `(-)`: Replaces all backslashes with double backslashes, useful for Path.


## Input/output types:

| input        | output             |
| ------------ | ------------------ |
| list\<string\> | list\<list\<string\>\> |
| string       | list\<string\>       |
## Examples

Define a range inside braces to produce a list of string.
```shell
> "{3..5}" | str expand
╭───┬───╮
│ 0 │ 3 │
│ 1 │ 4 │
│ 2 │ 5 │
╰───┴───╯

```

Ignore the next character after the backslash ('\')
```shell
> 'A{B\,,C}' | str expand
╭───┬─────╮
│ 0 │ AB, │
│ 1 │ AC  │
╰───┴─────╯

```

Commas that are not inside any braces need to be skipped.
```shell
> 'Welcome\, {home,mon ami}!' | str expand
╭───┬───────────────────╮
│ 0 │ Welcome, home!    │
│ 1 │ Welcome, mon ami! │
╰───┴───────────────────╯

```

Use double backslashes to add a backslash.
```shell
> 'A{B\\,C}' | str expand
╭───┬─────╮
│ 0 │ AB\ │
│ 1 │ AC  │
╰───┴─────╯

```

Export comma separated values inside braces (`{}`) to a string list.
```shell
> "{apple,banana,cherry}" | str expand
╭───┬────────╮
│ 0 │ apple  │
│ 1 │ banana │
│ 2 │ cherry │
╰───┴────────╯

```

If the piped data is path, you may want to use --path flag, or else manually replace the backslashes with double backslashes.
```shell
> 'C:\{Users,Windows}' | str expand --path
╭───┬────────────╮
│ 0 │ C:\Users   │
│ 1 │ C:\Windows │
╰───┴────────────╯

```

Brace expressions can be used one after another.
```shell
> "A{b,c}D{e,f}G" | str expand
╭───┬───────╮
│ 0 │ AbDeG │
│ 1 │ AbDfG │
│ 2 │ AcDeG │
│ 3 │ AcDfG │
╰───┴───────╯

```

Collection may include an empty item. It can be put at the start of the list.
```shell
> "A{,B,C}" | str expand
╭───┬────╮
│ 0 │ A  │
│ 1 │ AB │
│ 2 │ AC │
╰───┴────╯

```

Empty item can be at the end of the collection.
```shell
> "A{B,C,}" | str expand
╭───┬────╮
│ 0 │ AB │
│ 1 │ AC │
│ 2 │ A  │
╰───┴────╯

```

Empty item can be in the middle of the collection.
```shell
> "A{B,,C}" | str expand
╭───┬────╮
│ 0 │ AB │
│ 1 │ A  │
│ 2 │ AC │
╰───┴────╯

```

Also, it is possible to use one inside another. Here is a real-world example, that creates files:
```shell
> "A{B{1,3},C{2,5}}D" | str expand
╭───┬──────╮
│ 0 │ AB1D │
│ 1 │ AB3D │
│ 2 │ AC2D │
│ 3 │ AC5D │
╰───┴──────╯

```

## Notes
This syntax may seem familiar with `glob {A,B}.C`. The difference is glob relies on filesystem, but str expand is not. Inside braces, we put variants. Then basically we're creating all possible outcomes.