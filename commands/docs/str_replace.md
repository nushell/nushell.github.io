---
title: str replace
categories: |
  strings
version: 0.84.0
strings: |
  Find and replace text.
usage: |
  Find and replace text.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str replace (find) (replace) ...rest --all --no-expand --string --regex --multiline```

## Parameters

 -  `find`: the pattern to find
 -  `replace`: the replacement string
 -  `...rest`: For a data structure input, operate on strings at the given cell paths
 -  `--all` `(-a)`: replace all occurrences of the pattern
 -  `--no-expand` `(-n)`: do not expand capture groups (like $name) in the replacement string
 -  `--string` `(-s)`: DEPRECATED option, will be removed in 0.85. Substring matching is now the default.
 -  `--regex` `(-r)`: match the pattern as a regular expression in the input, instead of a substring
 -  `--multiline` `(-m)`: multi-line regex mode (implies --regex): ^ and $ match begin/end of line; equivalent to (?m)


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<string\> | list\<string\> |
| record       | record       |
| string       | string       |
| table        | table        |
## Examples

Find and replace the first occurrence of a substring
```shell
> 'c:\some\cool\path' | str replace 'c:\some\cool' '~'
~\path
```

Find and replace all occurrences of a substring
```shell
> 'abc abc abc' | str replace -a 'b' 'z'
azc azc azc
```

Find and replace contents with capture group using regular expression
```shell
> 'my_library.rb' | str replace -r '(.+).rb' '$1.nu'
my_library.nu
```

Find and replace all occurrences of find string using regular expression
```shell
> 'abc abc abc' | str replace -ar 'b' 'z'
azc azc azc
```

Find and replace all occurrences of find string in table using regular expression
```shell
> [[ColA ColB ColC]; [abc abc ads]] | str replace -ar 'b' 'z' ColA ColC
╭───┬──────┬──────┬──────╮
│ # │ ColA │ ColB │ ColC │
├───┼──────┼──────┼──────┤
│ 0 │ azc  │ abc  │ ads  │
╰───┴──────┴──────┴──────╯

```

Find and replace all occurrences of find string in record using regular expression
```shell
> { KeyA: abc, KeyB: abc, KeyC: ads } | str replace -ar 'b' 'z' KeyA KeyC
╭──────┬─────╮
│ KeyA │ azc │
│ KeyB │ abc │
│ KeyC │ ads │
╰──────┴─────╯
```

Find and replace contents without using the replace parameter as a regular expression
```shell
> 'dogs_$1_cats' | str replace -r '\$1' '$2' -n
dogs_$2_cats
```

Use captures to manipulate the input text using regular expression
```shell
> "abc-def" | str replace -r "(.+)-(.+)" "${2}_${1}"
def_abc
```

Find and replace with fancy-regex using regular expression
```shell
> 'a successful b' | str replace -r '\b([sS])uc(?:cs|s?)e(ed(?:ed|ing|s?)|ss(?:es|ful(?:ly)?|i(?:ons?|ve(?:ly)?)|ors?)?)\b' '${1}ucce$2'
a successful b
```

Find and replace with fancy-regex using regular expression
```shell
> 'GHIKK-9+*' | str replace -r '[*[:xdigit:]+]' 'z'
GHIKK-z+*
```

Find and replace on individual lines using multiline regular expression
```shell
> "non-matching line\n123. one line\n124. another line\n" | str replace -am '^[0-9]+\. ' ''
non-matching line
one line
another line

```
