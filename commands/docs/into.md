---
title: into
categories: |
  conversions
version: 0.83.2
conversions: |
  Commands to convert data from one type to another.
usage: |
  Commands to convert data from one type to another.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into ```

## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |


## Subcommands:

| name                                               | type    | usage                                      |
| -------------------------------------------------- | ------- | ------------------------------------------ |
| [`into binary`](/commands/docs/into_binary.md)     | Builtin | Convert value to a binary primitive.       |
| [`into bits`](/commands/docs/into_bits.md)         | Builtin | Convert value to a binary primitive.       |
| [`into bool`](/commands/docs/into_bool.md)         | Builtin | Convert value to boolean.                  |
| [`into datetime`](/commands/docs/into_datetime.md) | Builtin | Convert text or timestamp into a datetime. |
| [`into decimal`](/commands/docs/into_decimal.md)   | Builtin | Convert text into a decimal.               |
| [`into duration`](/commands/docs/into_duration.md) | Builtin | Convert value to duration.                 |
| [`into filesize`](/commands/docs/into_filesize.md) | Builtin | Convert value to filesize.                 |
| [`into int`](/commands/docs/into_int.md)           | Builtin | Convert value to integer.                  |
| [`into record`](/commands/docs/into_record.md)     | Builtin | Convert value to record.                   |
| [`into sqlite`](/commands/docs/into_sqlite.md)     | Builtin | Convert table into a SQLite database.      |
| [`into string`](/commands/docs/into_string.md)     | Builtin | Convert value to string.                   |