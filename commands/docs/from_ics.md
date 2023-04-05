---
title: from ics
categories: |
  formats
version: 0.78.0
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
╭───────┬────────────────────┬───────────────────┬───────────────────┬───────────────────┬───────────────────┬───────────────────┬───────────────────╮
│     # │     properties     │      events       │      alarms       │      to-Dos       │     journals      │    free-busys     │     timezones     │
├───────┼────────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│     0 │ [list 0 items]     │ [list 0 items]    │ [list 0 items]    │ [list 0 items]    │ [list 0 items]    │ [list 0 items]    │ [list 0 items]    │
╰───────┴────────────────────┴───────────────────┴───────────────────┴───────────────────┴───────────────────┴───────────────────┴───────────────────╯

```
