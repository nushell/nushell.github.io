---
title: explore
categories: |
  viewers
version: 0.84.0
viewers: |
  Explore acts as a table pager, just like `less` does for text.
usage: |
  Explore acts as a table pager, just like `less` does for text.
---

# <code>{{ $frontmatter.title }}</code> for viewers

<div class='command-title'>{{ $frontmatter.viewers }}</div>

## Signature

```> explore --head --index --reverse --peek```

## Parameters

 -  `--head {bool}`: Show or hide column headers (default true)
 -  `--index` `(-i)`: Show row indexes when viewing a list
 -  `--reverse` `(-r)`: Start with the viewport scrolled to the bottom
 -  `--peek` `(-p)`: When quitting, output the value of the cell the cursor was on


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Explore the system information record
```shell
> sys | explore

```

Explore the output of `ls` without column names
```shell
> ls | explore --head false

```

Explore a list of Markdown files' contents, with row indexes
```shell
> glob *.md | each {|| open } | explore -i

```

Explore a JSON file, then save the last visited sub-structure to a file
```shell
> open file.json | explore -p | to json | save part.json

```

## Notes
Press `:` then `h` to get a help menu.