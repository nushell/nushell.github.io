---
title: to xml
version: 0.67.1
usage: |
  Convert table into .xml text
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to xml --pretty```

## Parameters

 -  `--pretty {int}`: Formats the XML text with the provided indentation setting

## Examples

Outputs an XML string representing the contents of this table
```shell
> { "note": { "children": [{ "remember": {"attributes" : {}, "children": [Event]}}], "attributes": {} } } | to xml
```

Optionally, formats the text with a custom indentation setting
```shell
> { "note": { "children": [{ "remember": {"attributes" : {}, "children": [Event]}}], "attributes": {} } } | to xml -p 3
```
