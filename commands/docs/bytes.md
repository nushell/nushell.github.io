---
title: bytes
categories: |
  bytes
version: 0.84.0
bytes: |
  Various commands for working with byte data.
usage: |
  Various commands for working with byte data.
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes ```


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |

## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

## Subcommands:

| name                                                       | type    | usage                                                                                      |
| ---------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| [`bytes add`](/commands/docs/bytes_add.md)                 | Builtin | Add specified bytes to the input.                                                          |
| [`bytes at`](/commands/docs/bytes_at.md)                   | Builtin | Get bytes defined by a range                                                               |
| [`bytes build`](/commands/docs/bytes_build.md)             | Builtin | Create bytes from the arguments.                                                           |
| [`bytes collect`](/commands/docs/bytes_collect.md)         | Builtin | Concatenate multiple binary into a single binary, with an optional separator between each. |
| [`bytes ends-with`](/commands/docs/bytes_ends-with.md)     | Builtin | Check if bytes ends with a pattern.                                                        |
| [`bytes index-of`](/commands/docs/bytes_index-of.md)       | Builtin | Returns start index of first occurrence of pattern in bytes, or -1 if no match.            |
| [`bytes length`](/commands/docs/bytes_length.md)           | Builtin | Output the length of any bytes in the pipeline.                                            |
| [`bytes remove`](/commands/docs/bytes_remove.md)           | Builtin | Remove bytes.                                                                              |
| [`bytes replace`](/commands/docs/bytes_replace.md)         | Builtin | Find and replace binary.                                                                   |
| [`bytes reverse`](/commands/docs/bytes_reverse.md)         | Builtin | Reverse the bytes in the pipeline.                                                         |
| [`bytes starts-with`](/commands/docs/bytes_starts-with.md) | Builtin | Check if bytes starts with a pattern.                                                      |