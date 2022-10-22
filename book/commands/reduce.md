---
title: reduce
categories: |
  default
version: 0.70.0
default: |
  Aggregate a list table to a single value using an accumulator block.
usage: |
  Aggregate a list table to a single value using an accumulator block.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> reduce (block) --fold --numbered```

## Parameters

 -  `block`: reducing function
 -  `--fold {any}`: reduce with initial value
 -  `--numbered`: iterate with an index

## Examples

Sum values of a list (same as 'math sum')
```shell
> [ 1 2 3 4 ] | reduce {|it, acc| $it + $acc }
```

Sum values of a list (same as 'math sum')
```shell
> [ 1 2 3 ] | reduce -n {|it, acc| $acc.item + $it.item }
```

Sum values with a starting value (fold)
```shell
> [ 1 2 3 4 ] | reduce -f 10 {|it, acc| $acc + $it }
```

Replace selected characters in a string with 'X'
```shell
> [ i o t ] | reduce -f "Arthur, King of the Britons" {|it, acc| $acc | str replace -a $it "X" }
```

Find the longest string and its index
```shell
> [ one longest three bar ] | reduce -n { |it, acc|
                    if ($it.item | str length) > ($acc.item | str length) {
                        $it.item
                    } else {
                        $acc.item
                    }
                }
```
