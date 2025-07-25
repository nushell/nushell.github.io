---
title: generate
categories: |
  generators
version: 0.106.0
generators: |
  Generate a list of values by successively invoking a closure.
usage: |
  Generate a list of values by successively invoking a closure.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `generate` for [generators](/commands/categories/generators.md)

<div class='command-title'>Generate a list of values by successively invoking a closure.</div>

## Signature

```> generate {flags} (closure) (initial)```

## Parameters

 -  `closure`: Generator function.
 -  `initial`: Initial value.


## Input/output types:

| input     | output    |
| --------- | --------- |
| nothing   | list&lt;any&gt; |
| list&lt;any&gt; | list&lt;any&gt; |
| table     | list&lt;any&gt; |
| range     | list&lt;any&gt; |
## Examples

Generate a sequence of numbers
```nu
> generate {|i| if $i <= 10 { {out: $i, next: ($i + 2)} }} 0
╭───┬────╮
│ 0 │  0 │
│ 1 │  2 │
│ 2 │  4 │
│ 3 │  6 │
│ 4 │  8 │
│ 5 │ 10 │
╰───┴────╯

```

Generate a continuous stream of Fibonacci numbers
```nu
> generate {|fib| {out: $fib.0, next: [$fib.1, ($fib.0 + $fib.1)]} } [0, 1]

```

Generate a continuous stream of Fibonacci numbers, using default parameters
```nu
> generate {|fib=[0, 1]| {out: $fib.0, next: [$fib.1, ($fib.0 + $fib.1)]} }

```

Generate a running sum of the inputs
```nu
> 1..5 | generate {|e, sum=0| let sum = $e + $sum; {out: $sum, next: $sum} }
╭───┬────╮
│ 0 │  1 │
│ 1 │  3 │
│ 2 │  6 │
│ 3 │ 10 │
│ 4 │ 15 │
╰───┴────╯

```

## Notes
The generator closure accepts a single argument and returns a record
containing two optional keys: 'out' and 'next'. Each invocation, the 'out'
value, if present, is added to the stream. If a 'next' key is present, it is
used as the next argument to the closure, otherwise generation stops.

Additionally, if an input stream is provided, the generator closure accepts two
arguments. On each invocation an element of the input stream is provided as the
first argument. The second argument is the `next` value from the last invocation.
In this case, generation also stops when the input stream stops.