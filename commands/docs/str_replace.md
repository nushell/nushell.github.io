---
title: str replace
categories: |
  strings
version: 0.81.0
strings: |
  Find and replace text.
usage: |
  Find and replace text.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str replace (find) (replace) ...rest --all --no-expand --string --multiline```

## Parameters

 -  `find`: the pattern to find
 -  `replace`: the replacement string
 -  `...rest`: For a data structure input, operate on strings at the given cell paths
 -  `--all` `(-a)`: replace all occurrences of the pattern
 -  `--no-expand` `(-n)`: do not expand capture groups (like $name) in the replacement string
 -  `--string` `(-s)`: match the pattern as a substring of the input, instead of a regular expression
 -  `--multiline` `(-m)`: multi-line regex mode: ^ and $ match begin/end of line; equivalent to (?m)

## Examples

Find and replace contents with capture group
```shell
> 'my_library.rb' | str replace '(.+).rb' '$1.nu'
my_library.nu
```

Find and replace all occurrences of find string
```shell
> 'abc abc abc' | str replace -a 'b' 'z'
azc azc azc
```

Find and replace all occurrences of find string in table
```shell
> [[ColA ColB ColC]; [abc abc ads]] | str replace -a 'b' 'z' ColA ColC
╭───┬──────┬──────┬──────╮
│ # │ ColA │ ColB │ ColC │
├───┼──────┼──────┼──────┤
│ 0 │ azc  │ abc  │ ads  │
╰───┴──────┴──────┴──────╯

```

Find and replace contents without using the replace parameter as a regular expression
```shell
> 'dogs_$1_cats' | str replace '\$1' '$2' -n
dogs_$2_cats
```

Find and replace the first occurrence using string replacement *not* regular expressions
```shell
> 'c:\some\cool\path' | str replace 'c:\some\cool' '~' -s
~\path
```

Find and replace all occurrences using string replacement *not* regular expressions
```shell
> 'abc abc abc' | str replace -a 'b' 'z' -s
azc azc azc
```

Find and replace with fancy-regex
```shell
> 'a successful b' | str replace '\b([sS])uc(?:cs|s?)e(ed(?:ed|ing|s?)|ss(?:es|ful(?:ly)?|i(?:ons?|ve(?:ly)?)|ors?)?)\b' '${1}ucce$2'
a successful b
```

Find and replace with fancy-regex
```shell
> 'GHIKK-9+*' | str replace '[*[:xdigit:]+]' 'z'
GHIKK-z+*
```

Find and replace on individual lines (multiline)
```shell
> "non-matching line\n123. one line\n124. another line\n" | str replace -am '^[0-9]+\. ' ''
non-matching line
one line
another line
```
