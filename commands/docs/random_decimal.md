---
title: random decimal
categories: |
  random
version: 0.82.0
random: |
  Generate a random decimal within a range [min..max].
usage: |
  Generate a random decimal within a range [min..max].
---

# <code>{{ $frontmatter.title }}</code> for random

<div class='command-title'>{{ $frontmatter.random }}</div>

## Signature

```> random decimal (range)```

## Parameters

 -  `range`: Range of values

## Examples

Generate a default decimal value between 0 and 1
```shell
> random decimal

```

Generate a random decimal less than or equal to 500
```shell
> random decimal ..500

```

Generate a random decimal greater than or equal to 100000
```shell
> random decimal 100000..

```

Generate a random decimal between 1.0 and 1.1
```shell
> random decimal 1.0..1.1

```
