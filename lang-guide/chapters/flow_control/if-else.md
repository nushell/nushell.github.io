# if/else

The `if` expression evaluates a condition and then chooses to run a block based on the condition.

For example, you can print "yes", based on a true condition:

```nu
if true {
  print yes
} else {
  print no
}
# => yes
```

Alternately, you can print "no", based on a false condition:

```nu
if false {
  print yes
} else {
  print no
}
# => no
```

The `else` part of `if` is optional. If not provided, if a condition is false, the `if` expression returns `null`.

The code that follows the `else` is an expression rather than a block, allowing any number of follow-on `if` expressions as well as other types of expressions. For example, this expression returns 100: `if false { 1 } else 100`.

Chained `else if` expressions are checked in order, and the first block whose condition is true is run:

```nu
let x = 5
if $x > 10 { "big" } else if $x > 3 { "medium" } else { "small" }
# => medium
```

Because `if` is an expression, its result can be assigned to a variable. The value is the value of the last expression in the block that ran:

```nu
let x = 5
let label = if $x mod 2 == 0 { "even" } else { "odd" }
$label
# => odd
```

The condition must be a `bool`. Nushell does not treat other values such as `1`, `0`, or an empty string as true or false:

```nu
if 1 { "yes" }
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to boolean.
# =>    ╭─[repl_entry #1:1:4]
# =>  1 │ if 1 { "yes" }
# =>    ·    ┬
# =>    ·    ╰── can't convert int to boolean
# =>    ╰────
```

See also: [`match`](./match.md) for choosing between many values.
