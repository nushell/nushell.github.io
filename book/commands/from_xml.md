---
title: from xml
version: 0.64.0
usage: |
  Parse text as .xml and create table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
