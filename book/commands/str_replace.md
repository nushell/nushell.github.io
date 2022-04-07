---
title: str replace
layout: command
version: 0.60.1
usage: |
  finds and replaces text
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str replace (find) (replace) ...rest --all --no-expand```

## Parameters

 -  `find`: the pattern to find
 -  `replace`: the replacement pattern
 -  `...rest`: optionally find and replace text by column paths
 -  `--all`: replace all occurrences of find string
 -  `--no-expand`: do not expand the replace parameter as a regular expression

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
