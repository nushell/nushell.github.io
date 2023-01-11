---
title: reduce
categories: |
  default
version: 0.74.0
default: |
  Aggregate a list to a single value using an accumulator closure.
usage: |
  Aggregate a list to a single value using an accumulator closure.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> reduce (closure) --fold --numbered```

## Parameters

 -  `closure`: reducing function
 -  `--fold {any}`: reduce with initial value
 -  `--numbered`: iterate with an index (deprecated; use a 3-parameter closure instead)

## Examples

Sum values of a list (same as 'math sum')
```shell
> [ 1 2 3 4 ] | reduce {|it, acc| $it + $acc }
```

Sum values of a list, plus their indexes
```shell
> [ 8 7 6 ] | reduce {|it, acc, ind| $acc + $it + $ind }
```

Sum values with a starting value (fold)
```shell
> [ 1 2 3 4 ] | reduce -f 10 {|it, acc| $acc + $it }
```

Replace selected characters in a string with 'X'
```shell
> [ i o t ] | reduce -f "Arthur, King of the Britons" {|it, acc| $acc | str replace -a $it "X" }
```

Add ascending numbers to each of the filenames, and join with semicolons.
```shell
> ['foo.gz', 'bar.gz', 'baz.gz'] | reduce -f '' {|str all ind| $"($all)(if $ind != 0 {'; '})($ind + 1)-($str)" }
```
