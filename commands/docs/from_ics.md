---
title: from ics
categories: |
  formats
version: 0.76.0
formats: |
  Parse text as .ics and create table.
usage: |
  Parse text as .ics and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from ics ```

## Examples

Converts ics formatted string to table
```shell
> 'BEGIN:VCALENDAR
            END:VCALENDAR' | from ics
```
