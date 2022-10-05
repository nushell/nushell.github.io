---
title: from xml
version: 0.69.1
formats: |
  Parse text as .xml and create table.
usage: |
  Parse text as .xml and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from xml ```

## Examples

Converts xml formatted string to table
```shell
> '<?xml version="1.0" encoding="UTF-8"?>
<note>
  <remember>Event</remember>
</note>' | from xml
```
