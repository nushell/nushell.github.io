---
title: reduce
categories: |
  default
version: 0.78.0
default: |
  Aggregate a list to a single value using an accumulator closure.
usage: |
  Aggregate a list to a single value using an accumulator closure.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> reduce (closure) --fold```

## Parameters

 -  `closure`: reducing function
 -  `--fold {any}`: reduce with initial value

## Examples

Sum values of a list (same as 'math sum')
```shell
> [ 1 2 3 4 ] | reduce {|it, acc| $it + $acc }
10
```

Sum values of a list, plus their indexes
```shell
> [ 8 7 6 ] | enumerate | reduce -f 0 {|it, acc| $acc + $it.item + $it.index }
24
```

Sum values with a starting value (fold)
```shell
> [ 1 2 3 4 ] | reduce -f 10 {|it, acc| $acc + $it }
20
```

Replace selected characters in a string with 'X'
```shell
> [ i o t ] | reduce -f "Arthur, King of the Britons" {|it, acc| $acc | str replace -a $it "X" }
ArXhur, KXng Xf Xhe BrXXXns
```

Add ascending numbers to each of the filenames, and join with semicolons.
```shell
> ['foo.gz', 'bar.gz', 'baz.gz'] | enumerate | reduce -f '' {|str all| $"($all)(if $str.index != 0 {'; '})($str.index + 1)-($str.item)" }
1-foo.gz; 2-bar.gz; 3-baz.gz
```
