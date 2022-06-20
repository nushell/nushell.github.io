---
title: split-by
version: 0.64.0
usage: |
  Create a new table splitted.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> split-by (splitter)```

## Parameters

 -  `splitter`: the splitter value to use

## Examples

split items by column named "lang"
```shell
>
                {
                    '2019': [
                      { name: 'andres', lang: 'rb', year: '2019' },
                      { name: 'jt', lang: 'rs', year: '2019' }
                    ],
                    '2021': [
                      { name: 'storm', lang: 'rs', 'year': '2021' }
                    ]
                } | split-by lang

```
