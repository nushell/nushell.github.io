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

## Subcommands:
| name                                               | usage                                      |
| -------------------------------------------------- | ------------------------------------------ |
| [`into binary`](/commands/docs/into binary.md)     | Convert value to a binary primitive.       |
| [`into bits`](/commands/docs/into bits.md)         | Convert value to a binary primitive.       |
| [`into bool`](/commands/docs/into bool.md)         | Convert value to boolean.                  |
| [`into datetime`](/commands/docs/into datetime.md) | Convert text or timestamp into a datetime. |
| [`into decimal`](/commands/docs/into decimal.md)   | Convert text into a decimal.               |
| [`into duration`](/commands/docs/into duration.md) | Convert value to duration.                 |
| [`into filesize`](/commands/docs/into filesize.md) | Convert value to filesize.                 |
| [`into int`](/commands/docs/into int.md)           | Convert value to integer.                  |
| [`into record`](/commands/docs/into record.md)     | Convert value to record.                   |
| [`into sqlite`](/commands/docs/into sqlite.md)     | Convert table into a SQLite database.      |
| [`into string`](/commands/docs/into string.md)     | Convert value to string.                   |