---
title: from xml
categories: |
  formats
version: 0.74.0
formats: |
  Parse text as .xml and create record.
usage: |
  Parse text as .xml and create record.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from xml ```

## Examples

Converts xml formatted string to record
```shell
> '<?xml version="1.0" encoding="UTF-8"?>
<note>
  <remember>Event</remember>
</note>' | from xml
```
