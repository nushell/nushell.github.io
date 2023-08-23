---
title: date to-record
categories: |
  date
version: 0.84.0
date: |
  Convert the date into a record.
usage: |
  Convert the date into a record.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date to-record ```


## Input/output types:

| input    | output |
| -------- | ------ |
| datetime | record |
| string   | record |
## Examples

Convert the current date into a record.
```shell
> date to-record

```

Convert the current date into a record.
```shell
> date now | date to-record

```

Convert a date string into a record.
```shell
> '2020-04-12T22:10:57.123+02:00' | date to-record
╭────────────┬───────────╮
│ year       │ 2020      │
│ month      │ 4         │
│ day        │ 12        │
│ hour       │ 22        │
│ minute     │ 10        │
│ second     │ 57        │
│ nanosecond │ 123000000 │
│ timezone   │ +02:00    │
╰────────────┴───────────╯
```

Convert a date into a record.
```shell
> '2020-04-12 22:10:57 +0200' | into datetime | date to-record
╭────────────┬────────╮
│ year       │ 2020   │
│ month      │ 4      │
│ day        │ 12     │
│ hour       │ 22     │
│ minute     │ 10     │
│ second     │ 57     │
│ nanosecond │ 0      │
│ timezone   │ +02:00 │
╰────────────┴────────╯
```
