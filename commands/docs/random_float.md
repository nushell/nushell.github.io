---
title: random float
categories: |
  random
version: 0.106.0
random: |
  Generate a random float within a range [min..max].
usage: |
  Generate a random float within a range [min..max].
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `random float` for [random](/commands/categories/random.md)

<div class='command-title'>Generate a random float within a range [min..max].</div>

## Signature

```> random float {flags} (range)```

## Parameters

 -  `range`: Range of values.


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | float  |
## Examples

Generate a default float value between 0 and 1
```nu
> random float

```

Generate a random float less than or equal to 500
```nu
> random float ..500

```

Generate a random float greater than or equal to 100000
```nu
> random float 100000..

```

Generate a random float between 1.0 and 1.1
```nu
> random float 1.0..1.1

```
