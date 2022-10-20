---
title: split words
version: 0.70.0
strings: |
  Split a string's words into separate rows
usage: |
  Split a string's words into separate rows
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> split words --min-word-length```

## Parameters

 -  `--min-word-length {int}`: The minimum word length

## Examples

Split the string's words into separate rows
```shell
> 'hello world' | split words
```

Split the string's words, of at least 3 characters, into separate rows
```shell
> 'hello to the world' | split words -l 3
```

A real-world example of splitting words
```shell
> fetch https://www.gutenberg.org/files/11/11-0.txt | str downcase | split words -l 2 | uniq -c | sort-by count --reverse | first 10
```
