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

`else` must start on the same line as the `}` that closes the block before it. A newline ends the `if` command, so an `else` on the next line is a separate command. The parser doesn't report this. The `if` runs without it, and then the `else` line fails with a "Command `else` not found" error (`nu::shell::external_command`). Inside parentheses a newline does not end a command, so `else` may start a new line there. See the example in [Control Flow](/book/control_flow.md#if).

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

The condition is parsed as a math expression, the same as the condition of [`while`](./while.md). Variables, literals, comparisons, and `and`, `or` and `not` can be used directly. A command call or a pipeline has to be wrapped in parentheses:

```nu
let list = []
if ($list | is-empty) { "empty" } else { "not empty" }
# => empty
```

Without the parentheses, the `|` ends the `if` command before it has a block:

```nu
let list = []
if $list | is-empty { "empty" } else { "not empty" }
# => Error: nu::parser::missing_positional
# =>
# =>   × Missing required positional argument.
# =>    ╭─[repl_entry #2:1:9]
# =>  1 │ if $list | is-empty { "empty" } else { "not empty" }
# =>    ·         ▲
# =>    ·         ╰── missing cond
# =>    ╰────
# =>   help: Usage: if <cond> <then_block> (else <else_expression>) . Use `--help`
# =>         for more information.
```

A command name on its own, as in `if is-empty { ... }`, isn't run either. It is read as a string, and the `if` fails with a type mismatch ("expected bool").

See also: [`match`](./match.md) for choosing between many values.
