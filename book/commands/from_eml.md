---
title: from eml
layout: command
version: 0.63.0
usage: |
  Parse text as .eml and create table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
