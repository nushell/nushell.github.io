---
title: print
categories: |
  strings
version: 0.76.0
strings: |
  Print the given values to stdout
usage: |
  Print the given values to stdout
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> print ...rest --no-newline --stderr```

## Parameters

 -  `...rest`: the values to print
 -  `--no-newline` `(-n)`: print without inserting a newline for the line ending
 -  `--stderr` `(-e)`: print to stderr instead of stdout

## Notes
Unlike `echo`, this command does not return any value (`print | describe` will return "nothing").
Since this command has no output, there is no point in piping it with other commands.

`print` may be used inside blocks of code (e.g.: hooks) to display text during execution without interfering with the pipeline.
## Examples

Print 'hello world'
```shell
> print "hello world"
```

Print the sum of 2 and 3
```shell
> print (2 + 3)
```
