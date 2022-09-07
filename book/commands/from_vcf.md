---
title: from vcf
version: 0.68.0
usage: |
  Parse text as .vcf and create table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
```
