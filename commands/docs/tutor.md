---
title: tutor
categories: |
  misc
version: 0.80.0
misc: |
  Run the tutorial. To begin, run: tutor.
usage: |
  Run the tutorial. To begin, run: tutor.
---

# <code>{{ $frontmatter.title }}</code> for misc

<div class='command-title'>{{ $frontmatter.misc }}</div>

## Signature

```> tutor (search) --find```

## Parameters

 -  `search`: item to search for, or 'list' to list available tutorials
 -  `--find {string}`: Search tutorial for a phrase

## Examples

Begin the tutorial
```shell
> tutor begin

```

Search a tutorial by phrase
```shell
> tutor -f "$in"

```
