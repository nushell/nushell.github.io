---
title: from vcf
categories: |
  formats
version: 0.77.0
formats: |
  Parse text as .vcf and create table.
usage: |
  Parse text as .vcf and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from vcf ```

## Examples

Converts ics formatted string to table
```shell
> 'BEGIN:VCARD
N:Foo
FN:Bar
EMAIL:foo@bar.com
END:VCARD' | from vcf
╭───┬──────────────────────────────────────╮
│ # │              properties              │
├───┼──────────────────────────────────────┤
│ 0 │ ╭───┬───────┬─────────────┬────────╮ │
│   │ │ # │ name  │    value    │ params │ │
│   │ ├───┼───────┼─────────────┼────────┤ │
│   │ │ 0 │ N     │ Foo         │        │ │
│   │ │ 1 │ FN    │ Bar         │        │ │
│   │ │ 2 │ EMAIL │ foo@bar.com │        │ │
│   │ ╰───┴───────┴─────────────┴────────╯ │
╰───┴──────────────────────────────────────╯

```
