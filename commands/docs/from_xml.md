---
title: from xml
categories: |
  formats
version: 0.82.1
formats: |
  Parse text as .xml and create record.
usage: |
  Parse text as .xml and create record.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from xml --keep-comments --keep-pi```

## Parameters

 -  `--keep-comments` `(-)`: add comment nodes to result
 -  `--keep-pi` `(-)`: add processing instruction nodes to result

## Notes
Every XML entry is represented via a record with tag, attribute and content fields.
To represent different types of entries different values are written to this fields:
1. Tag entry: `{tag: <tag name> attrs: {<attr name>: "<string value>" ...} content: [<entries>]}`
2. Comment entry: `{tag: '!' attrs: null content: "<comment string>"}`
3. Processing instruction (PI): `{tag: '?<pi name>' attrs: null content: "<pi content string>"}`
4. Text: `{tag: null attrs: null content: "<text>"}`.

Unlike to xml command all null values are always present and text is never represented via plain
string. This way content of every tag is always a table and is easier to parse
## Examples

Converts xml formatted string to record
```shell
> '<?xml version="1.0" encoding="UTF-8"?>
<note>
  <remember>Event</remember>
</note>' | from xml
╭────────────┬───────────────────────────────────────────────────────────────────────────╮
│ tag        │ note                                                                      │
│ attributes │ {record 0 fields}                                                         │
│            │ ╭───┬──────────┬───────────────────┬────────────────────────────────────╮ │
│ content    │ │ # │   tag    │    attributes     │              content               │ │
│            │ ├───┼──────────┼───────────────────┼────────────────────────────────────┤ │
│            │ │ 0 │ remember │ {record 0 fields} │ ╭───┬─────┬────────────┬─────────╮ │ │
│            │ │   │          │                   │ │ # │ tag │ attributes │ content │ │ │
│            │ │   │          │                   │ ├───┼─────┼────────────┼─────────┤ │ │
│            │ │   │          │                   │ │ 0 │     │            │ Event   │ │ │
│            │ │   │          │                   │ ╰───┴─────┴────────────┴─────────╯ │ │
│            │ ╰───┴──────────┴───────────────────┴────────────────────────────────────╯ │
╰────────────┴───────────────────────────────────────────────────────────────────────────╯
```
