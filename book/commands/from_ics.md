---
title: from ics
version: 0.66.1
usage: |
  Parse text as .ics and create table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> from ics ```

## Examples

Converts ics formatted string to table
```shell
> 'BEGIN:VCALENDAR
END:VCALENDAR' | from ics
```
