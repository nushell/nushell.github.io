# Control Flow

Nushell provides several commands that help determine how different groups of code are executed. In programming languages this functionality is often referred to as _control flow_.

::: tip
One thing to note is that all of the commands discussed on this page use [blocks](/book/types_of_data.html#blocks). This means you can mutate [environmental variables](/book/environment.html) and other [mutable variables](/book/variables.html#mutable-variables) in them.
:::

## Already covered

Below we cover some commands related to control flow, but before we get to them, it's worthwhile to note there are several pieces of functionality and concepts that have already been covered in other sections that are also related to control flow or that can be used in the same situations. These include:

- Pipes on the [pipelines](/book/pipelines.html) page.
- Closures on the [types of data](/book/types_of_data.html) page.
- Iteration commands on the [working with lists](/book/working_with_lists.html) page. Such as:
  - [`each`](/commands/docs/each.html)
  - [`where`](/commands/docs/where.html)
  - [`reduce`](/commands/docs/reduce.html)

## Choice (Conditionals)

The following commands execute code based on some given condition.

::: tip
The choice/conditional commands are expressions so they return values, unlike the other commands on this page. This means the following works.

```nu
'foo' | if $in == 'foo' { 1 } else { 0 } | $in + 2
# => 3
```

:::

### `if`

[`if`](/commands/docs/if.html) evaluates branching [blocks](/book/types_of_data.html#blocks) of code based on the results of one or more conditions similar to the "if" functionality in other programming languages. For example:

```nu
if $x > 0 { 'positive' }
```

Returns `'positive`' when the condition is `true` (`$x` is greater than zero) and `null` when the condition is `false` (`$x` is less than or equal to zero).

We can add an `else` branch to the `if` after the first block which executes and returns the resulting value from the `else` block when the condition is `false`. For example:

```nu
if $x > 0 { 'positive' } else { 'non-positive' }
```

This time it returns `'positive'` when the condition is `true` (`$x` is greater than zero) and `'non-positive`' when the condition is `false` (`$x` is less than or equal to zero).

We can also chain multiple `if`s together like the following:

```nu
if $x > 0 { 'positive' } else if $x == 0 { 'zero' } else { "negative" }
```

When the first condition is `true` (`$x` is greater than zero) it will return `'positive'`, when the first condition is `false` and the next condition is `true` (`$x` equals zero) it will return `'zero'`, otherwise it will return `'negative'` (when `$x` is less than zero).

### `match`

[`match`](/commands/docs/match.html) executes one of several conditional branches based on the value given to match. You can also do some [pattern matching](/cookbook/pattern_matching.html) to unpack values in composite types like lists and records.

Basic usage of [`match`](/commands/docs/match.html) can conditionally run different code like a "switch" statement common in other languages. [`match`](/commands/docs/match.html) checks if the value after the word [`match`](/commands/docs/match.html) is equal to the value at the start of each branch before the `=>` and if it does, it executes the code after that branch's `=>`.

```nu
match 3 {
    1 => 'one',
    2 => {
        let w = 'w'
        't' + $w + 'o'
    },
    3 => 'three',
    4 => 'four'
}
# => three
```

The branches can either return a single value or, as shown in the second branch, can return the results of a [block](/book/types_of_data.html#blocks).

#### Catch all Branch

You can also have a catch all condition for when the given value doesn't match any of the other conditions by having a branch whose matching value is `_`.

```nu
let foo = match 7 {
    1 => 'one',
    2 => 'two',
    3 => 'three',
    _ => 'other number'
}
$foo
# => other number
```

(Reminder, [`match`](/commands/docs/match.html) is an expression which is why we can assign the result to `$foo` here).

#### Pattern Matching

You can "unpack" values from types like lists and records with [pattern matching](/cookbook/pattern_matching.html). You can then assign variables to the parts you want to unpack and use them in the matched expressions.

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } => ($it + 3),
    { name: _, count: $it } => ($it + 7),
    _ => 1
}
# => 10
```

The `_` in the second branch means it matches any record with field `name` and `count`, not just ones where `name` is `'bar'`.

#### Guards

You can also add an additional condition to each branch called a "guard" to determine if the branch should be matched. To do so, after the matched pattern put `if` and then the condition before the `=>`.

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } if $it < 5 => ($it + 3),
    { name: 'bar', count: $it } if $it >= 5 => ($it + 7),
    _ => 1
}
# => 14
```

---

You can find more details about [`match`](/commands/docs/match.html) in the [pattern matching cookbook page](https://www.nushell.sh/cookbook/pattern_matching.html).

## Loops

The loop commands allow you to repeat a block of code multiple times.

### Loops and Other Iterating Commands

The functionality of the loop commands is similar to commands that apply a closure over elements in a list or table like [`each`](/commands/docs/each.html) or [`where`](/commands/docs/where.html) and many times you can accomplish the same thing with either. For example:

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯


[1 2 3] | each { $in + 1 }
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

While it may be tempting to use loops if you're familiar with them in other languages, it is considered more in the [Nushell-style](book/thinking_in_nu.html) (idiomatic) to use commands that apply closures when you can solve a problem either way. The reason for this is because of a pretty big downside with using loops.

#### Loop Disadvantages

The biggest downside of loops is that they are statements, unlike [`each`](/commands/docs/each.html) which is an expression. Expressions, like [`each`](/commands/docs/each.html) always result in some output value, however statements do not.

This means that they don't work well with immutable variables and using immutable variables is considered a more [Nushell-style](/book/thinking_in_nu.html#variables-are-immutable). Without a mutable variable declared beforehand in the example in the previous section, it would be impossible to use [`for`](/commands/docs/each.html) to get the list of numbers with incremented numbers, or any value at all.

Statements also don't work in Nushell pipelines which require some output. In fact Nushell will give an error if you try:

```nu
[1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# => Error: nu::parser::unexpected_keyword
# => 
# =>   × Statement used in pipeline.
# =>    ╭─[entry #5:1:1]
# =>  1 │ [1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# =>    ·           ─┬─
# =>    ·            ╰── not allowed in pipeline
# =>    ╰────
# =>   help: 'for' keyword is not allowed in pipeline. Use 'for' by itself, outside of a pipeline.
```

Because Nushell is very pipeline oriented, this means using expression commands like [`each`](/commands/docs/each.html) is typically more natural than loop statements.

#### Loop Advantages

If loops have such a big disadvantage, why do they exist? Well, one reason is that closures, like [`each`](/commands/docs/each.html) uses, can't modify mutable variables in the surrounding environment. If you try to modify a mutable variable in a closure you will get an error:

```nu
mut foo = []
[1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# => Error: nu::parser::expected_keyword
# => 
# =>   × Capture of mutable variable.
# =>    ╭─[entry #8:1:1]
# =>  1 │ [1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# =>    ·                  ──┬─
# =>    ·                    ╰── capture of mutable variable
# =>    ╰────
```

If you modify an environmental variable in a closure, you can, but it will only modify it within the scope of the closure, leaving it unchanged everywhere else. Loops, however, use [blocks](/book/types_of_data.html#blocks) which means they can modify a regular mutable variable or an environmental variable within the larger scope.

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

### `for`

[`for`](/commands/docs/for.html) loops over a range or collection like a list or a table.

```nu
for x in [1 2 3] { $x * $x | print }
# => 1
# => 4
# => 9
```

#### Expression Command Alternatives

- [`each`](/commands/docs/each.html)
- [`par-each`](/commands/docs/par-each.html)
- [`where`](/commands/docs/where.html)/[`filter`](/commands/docs/filter.html)
- [`reduce`](/commands/docs/reduce.html)

### `while`

[`while`](/commands/docs/while.html) loops the same block of code until the given condition is `false`.

```nu
mut x = 0; while $x < 10 { $x = $x + 1 }; $x
# => 10
```

#### Expression Command Alternatives

The "until" and other "while" commands

- [`take until`](/commands/docs/take_until.html)
- [`take while`](/commands/docs/take_while.html)
- [`skip until`](/commands/docs/skip_until.html)
- [`skip while`](/commands/docs/skip_while.html)

### `loop`

[`loop`](/commands/docs/loop.html) loops a block infinitely. You can use [`break`](/commands/docs/break.html) (as described in the next section) to limit how many times it loops. It can also be handy for continuously running scripts, like an interactive prompt.

```nu
mut x = 0; loop { if $x > 10 { break }; $x = $x + 1 }; $x
# => 11
```

### `break`

[`break`](/commands/docs/break.html) will stop executing the code in a loop and resume execution after the loop. Effectively "break"ing out of the loop.

```nu
for x in 1..10 { if $x > 3 { break }; print $x }
# => 1
# => 2
# => 3
```

### `continue`

[`continue`](/commands/docs/continue.html) will stop execution of the current loop, skipping the rest of the code in the loop, and will go to the next loop. If the loop would normally end, like if [`for`](/commands/docs/for.html) has iterated through all the given elements, or if [`while`](/commands/docs/while.html)'s condition is now false, it won't loop again and execution will continue after the loop block.

```nu
mut x = -1; while $x <= 6 { $x = $x + 1; if $x mod 3 == 0 { continue }; print $x }
# => 1
# => 2
# => 4
# => 5
# => 7
```

## Errors

### `error make`

[`error make`](/commands/docs/error_make.html) creates an error that stops execution of the code and any code that called it, until either it is handled by a [`try`](/commands/docs/try.html) block, or it ends the script and outputs the error message. This functionality is the same as "exceptions" in other languages.

```nu
print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# => printed
# => Error:   × Some error info
# =>    ╭─[entry #9:1:1]
# =>  1 │ print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# =>    ·                  ─────┬────
# =>    ·                       ╰── originates from here
# =>    ╰────
```

The record passed to it provides some information to the code that catches it or the resulting error message.

You can find more information about [`error make`](/commands/docs/error_make.html) and error concepts on the [Creating your own errors page](/book/creating_errors.html).

### `try`

[`try`](/commands/docs/try.html) will catch errors created anywhere in the [`try`](/commands/docs/try.html)'s code block and resume execution of the code after the block.

```nu
try { error make { msg: 'Some error info' }}; print 'Resuming'
# => Resuming
```

This includes catching built in errors.

```nu
try { 1 / 0 }; print 'Resuming'
# => Resuming
```

The resulting value will be `nothing` if an error occurs and the returned value of the block if an error did not occur.

If you include a `catch` block after the [`try`](/commands/docs/try.html) block, it will execute the code in the `catch` block if an error occurred in the [`try`](/commands/docs/try.html) block.

```nu
try { 1 / 0 } catch { 'An error happened!' } | $in ++ ' And now I am resuming.'
# => An error happened! And now I am resuming.
```

It will not execute the `catch` block if an error did not occur.

## Other

### `return`

[`return`](/commands/docs/return.html) Ends a closure or command early where it is called, without running the rest of the command/closure, and returns the given value. Not often necessary since the last value in a closure or command is also returned, but it can sometimes be convenient.

```nu
def 'positive-check' [it] {
    if $it > 0 {
        return 'positive'
    };

    'non-positive'
}
```

```nu
positive-check 3
# => positive

positive-check (-3)
# => non-positive

let positive_check = {|elt| if $elt > 0 { return 'positive' }; 'non-positive' }

do $positive_check 3
# => positive

do $positive_check (-3)
# => non-positive
```
