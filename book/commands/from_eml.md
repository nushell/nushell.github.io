---
title: from eml
categories: |
  formats
version: 0.70.0
formats: |
  Parse text as .eml and create table.
usage: |
  Parse text as .eml and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from eml --preview-body```

## Parameters

 -  `--preview-body {int}`: How many bytes of the body to preview

## Examples

Convert eml structured data into table
```shell
> 'From: test@email.com
Subject: Welcome
To: someone@somewhere.com

Test' | from eml
```

Convert eml structured data into table
```shell
> 'From: test@email.com
Subject: Welcome
To: someone@somewhere.com

Test' | from eml -b 1
```
