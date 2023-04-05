---
title: path
categories: |
  default
version: 0.78.0
default: |
  Explore and manipulate paths.
usage: |
  Explore and manipulate paths.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path ```

## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

There are three ways to represent a path:

* As a path literal, e.g., '/home/viking/spam.txt'
* As a structured path: a table with 'parent', 'stem', and 'extension' (and
* 'prefix' on Windows) columns. This format is produced by the 'path parse'
  subcommand.
* As a list of path parts, e.g., '[ / home viking spam.txt ]'. Splitting into
  parts is done by the `path split` command.

All subcommands accept all three variants as an input. Furthermore, the 'path
join' subcommand can be used to join the structured path or path parts back into
the path literal.