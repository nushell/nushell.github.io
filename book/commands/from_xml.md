---
title: from xml
layout: command
version: 0.60.0
usage: |
  Parse text as .xml and create table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> from xml `

## Examples

Converts xml formatted string to table

```shell
> '<?xml version="1.0" encoding="UTF-8"?>
<note>
  <remember>Event</remember>
</note>' | from xml
```
