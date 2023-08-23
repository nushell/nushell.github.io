---
title: date format
categories: |
  removed
version: 0.84.0
removed: |
  Removed command: use `format date` instead
usage: |
  Removed command: use `format date` instead
---

# <code>{{ $frontmatter.title }}</code> for removed

<div class='command-title'>{{ $frontmatter.removed }}</div>

## Signature

```> date format (format string) --list```

## Parameters

 -  `format string`: the desired date format
 -  `--list` `(-l)`: lists strftime cheatsheet


## Input/output types:

| input    | output |
| -------- | ------ |
| datetime | string |
| string   | string |