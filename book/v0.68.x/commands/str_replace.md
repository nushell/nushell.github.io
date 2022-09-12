---
title: str replace
version: 0.68.0
usage: |
  Find and replace text
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str replace (find) (replace) ...rest --all --no-expand --string```

## Parameters

 -  `find`: the pattern to find
 -  `replace`: the replacement pattern
 -  `...rest`: optionally find and replace text by column paths
 -  `--all`: replace all occurrences of find string
 -  `--no-expand`: do not expand the replace parameter as a regular expression
 -  `--string`: do not use regular expressions for string find and replace

## Examples

Find and replace contents with capture group
```shell
> 'my_library.rb' | str replace '(.+).rb' '$1.nu'
```

Find and replace all occurrences of find string
```shell
> 'abc abc abc' | str replace -a 'b' 'z'
```

Find and replace all occurrences of find string in table
```shell
> [[ColA ColB ColC]; [abc abc ads]] | str replace -a 'b' 'z' ColA ColC
```

Find and replace contents without using the replace parameter as a regular expression
```shell
> 'dogs_$1_cats' | str replace '\$1' '$2' -n
```

Find and replace the first occurence using string replacement *not* regular expressions
```shell
> 'c:\some\cool\path' | str replace 'c:\some\cool' '~' -s
```

Find and replace all occurences using string replacement *not* regular expressions
```shell
> 'abc abc abc' | str replace -a 'b' 'z' -s
```

Find and replace with fancy-regex
```shell
> 'a sucessful b' | str replace '\b([sS])uc(?:cs|s?)e(ed(?:ed|ing|s?)|ss(?:es|ful(?:ly)?|i(?:ons?|ve(?:ly)?)|ors?)?)\b' '${1}ucce$2'
```

Find and replace with fancy-regex
```shell
> 'GHIKK-9+*' | str replace '[*[:xdigit:]+]' 'z'
```
