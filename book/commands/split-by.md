---
title: split-by
layout: command
version: 0.59.1
usage: |
  Create a new table splitted.
---

# `{{ $frontmatter.title }}`

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
