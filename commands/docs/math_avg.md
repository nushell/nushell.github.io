---
title: math avg
categories: |
  math
version: 0.84.0
math: |
  Returns the average of a list of numbers.
usage: |
  Returns the average of a list of numbers.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math avg ```


## Input/output types:

| input          | output   |
| -------------- | -------- |
| list\<duration\> | duration |
| list\<filesize\> | filesize |
| list\<number\>   | number   |
## Examples

Compute the average of a list of numbers
```shell
> [-50 100.0 25] | math avg
25
```
