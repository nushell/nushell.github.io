# Variables

Nushell values can be assigned to named variables using the `let`, `const`, or `mut` keywords.
After creating a variable, we can refer to it using `$` followed by its name.

## Types of Variables

### Immutable Variables

An immutable variable cannot change its value after declaration. They are declared using the `let` keyword,

```nu
let val = 42
$val
# => 42
$val = 100
# => Error: nu::parser::assignment_requires_mutable_variable
# =>
# =>   × Assignment to an immutable variable.
# =>    ╭─[repl_entry #3:1:1]
# =>  1 │ $val = 100
# =>    · ──┬─
# =>    ·   ╰── needs to be a mutable variable
# =>    ╰────
# =>   help: declare the variable with `mut`, or shadow it again with `let`
```

However, immutable variables can be 'shadowed'. Shadowing means that they are redeclared and their initial value cannot be used anymore within the same scope.

```nu
let val = 42                   # declare a variable
do { let val = 101;  $val }    # in an inner scope, shadow the variable
# => 101
$val                           # in the outer scope the variable remains unchanged
# => 42
let val = $val + 1             # now, in the outer scope, shadow the original variable
$val                           # the variable is now shadowed, and its original value is no longer available
# => 43
```

#### Using `let` in a Pipeline

`let` can also be used as a step in a pipeline. At the end of a pipeline, `let <name>` stores the pipeline's result in the variable and also outputs it:

```nu
[3 1 2] | sort | let nums
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
$nums | length
# => 3
```

In the middle of a pipeline, `let` stores its input and passes it through unchanged to the next command:

```nu
"hello" | let greeting | str length
# => 5
$greeting
# => hello
```

If you don't want to see the value at the end of a pipeline, add `| ignore`, or use the regular `let nums = ...` form.

### Mutable Variables

A mutable variable is allowed to change its value by assignment. These are declared using the `mut` keyword.

```nu
mut val = 42
$val += 27
$val
# => 69
```

There are a couple of assignment operators used with mutable variables

| Operator | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `=`      | Assigns a new value to the variable                                        |
| `+=`     | Adds a value to the variable and makes the sum its new value               |
| `-=`     | Subtracts a value from the variable and makes the difference its new value |
| `*=`     | Multiplies the variable by a value and makes the product its new value     |
| `/=`     | Divides the variable by a value and makes the quotient its new value       |
| `++=`    | Concatenates a list, string, or binary value to the variable               |

::: tip Note

1. `+=`, `-=`, `*=` and `/=` are only valid in the contexts where their root operations are expected to work. For example, `+=` uses addition, so it can not be used for contexts where addition would normally fail. The result must also fit the variable's type: `/` always produces a `float`, so `$x /= 2` is an error when `$x` holds an `int` (use `$x = $x // 2` instead).
2. `++=` requires that the variable and the value are the same kind: both lists, both strings, or both binary values. To add a single item to a list, use `$list ++= [$item]`.

:::

#### More on Mutability

Closures and nested `def`s cannot capture mutable variables from their environment. For example

```nu
# naive method to count number of elements in a list
mut x = 0

[1 2 3] | each { $x += 1 }   # error: $x is captured in a closure
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[repl_entry #1:4:18]
# =>  3 │
# =>  4 │ [1 2 3] | each { $x += 1 }   # error: $x is captured in a closure
# =>    ·                  ─┬
# =>    ·                   ╰── capture of mutable variable
# =>    ╰────
```

To use mutable variables for such behaviour, you are encouraged to use the loops

### Constant Variables

A constant variable is an immutable variable that can be fully evaluated at parse-time. These are useful with commands that need to know the value of an argument at parse time, like [`source`](/commands/docs/source.md), [`use`](/commands/docs/use.md) and [`plugin use`](/commands/docs/plugin_use.md). See [how nushell code gets run](how_nushell_code_gets_run.md) for a deeper explanation. They are declared using the `const` keyword

For example, if the file `hello.nu` in the current directory contains `print "Hello from hello.nu"`, you can source it through a constant:

```nu
const script_file = 'hello.nu'
source $script_file
# => Hello from hello.nu
```

## Choosing between mutable and immutable variables

Try to use immutable variables for most use-cases.

You might wonder why Nushell uses immutable variables by default. For the first few years of Nushell's development, mutable variables were not a language feature. Early on in Nushell's development, we decided to see how long we could go using a more data-focused, functional style in the language. This experiment showed its value when Nushell introduced parallelism. By switching from [`each`](/commands/docs/each.md) to [`par-each`](/commands/docs/par-each.md) in any Nushell script, you're able to run the corresponding block of code in parallel over the input. This is possible because Nushell's design leans heavily on immutability, composition, and pipelining.

Many, if not most, use-cases for mutable variables in Nushell have a functional solution that:

- Only uses immutable variables, and as a result ...
- Has better performance
- Supports streaming
- Can support additional features such as `par-each` as mentioned above

For instance, loop counters are a common pattern for mutable variables and are built into most iterating commands. For example, you can get both each item and the index of each item using [`each`](/commands/docs/each.md) with [`enumerate`](/commands/docs/enumerate.md):

```nu
ls | enumerate | each { |elt| $"Item #($elt.index) is size ($elt.item.size)" }
# => ╭───┬─────────────────────────╮
# => │ 0 │ Item #0 is size 812 B   │
# => │ 1 │ Item #1 is size 3.4 kB  │
# => │ 2 │ Item #2 is size 28 B    │
# => │ 3 │ Item #3 is size 11.2 kB │
# => ╰───┴─────────────────────────╯
```

You can also use the [`reduce`](/commands/docs/reduce.md) command to work in the same way you might mutate a variable in a loop. For example, if you wanted to find the largest string in a list of strings, you might do:

```nu
[one, two, three, four, five, six] | reduce {|current_item, max|
  if ($current_item | str length) > ($max | str length) {
      $current_item
  } else {
      $max
  }
}
# => three
```

While `reduce` processes lists, the [`generate`](/commands/docs/generate.md) command can be used with arbitrary sources such as external REST APIs, also without requiring mutable variables. Here's an example that retrieves local weather data every hour and generates a continuous list from that data. The `each` command can be used to consume each new list item as it becomes available.

```nu
generate {|weather_station|
  let res = try {
    http get -ef $'https://api.weather.gov/stations/($weather_station)/observations/latest'
  } catch {
    null
  }
  sleep 1hr
  match $res {
    null => {
      next: $weather_station
    }
    _ => {
      out: ($res.body? | default '' | from json)
      next: $weather_station
    }
  }
} khot
| each {|weather_report|
    {
      time: ($weather_report.properties.timestamp | into datetime)
      temp: $weather_report.properties.temperature.value
    }
}
```

### Performance Considerations

Using [filter commands](/commands/categories/filters.html) with immutable variables is often far more performant than mutable variables with traditional flow-control statements such as `for` and `while`. For example:

- Using a `for` statement to create a list of 10,000 random numbers:

  ```nu
  timeit {
    mut randoms = []
    for _ in 1..10_000 {
      $randoms = ($randoms | append (random int))
    }
  }
  ```

  Result: 1sec 282ms 658µs 250ns

- Using `each` to do the same:

  ```nu
  timeit {
    let randoms = (1..10_000 | each {random int})
  }
  ```

  Result: 10ms 449µs 500ns

- Using `each` with 1,000,000 iterations:

  ```nu
  timeit {
    let randoms = (1..1_000_000 | each {random int})
  }
  ```

  Result: 1sec 47ms 554µs 250ns

  As with many filters, the `each` statement also streams its results, meaning the next stage of the pipeline can continue processing without waiting for the results to be collected into a variable.

  For tasks which can be optimized by parallelization, as mentioned above, `par-each` can have even more drastic performance gains.

## Deleting Variables

A variable normally lives until the end of the scope it was declared in. To free a variable earlier, for example one that holds a large amount of data, delete it with [`unlet`](/commands/docs/unlet.md). Afterwards, the variable can no longer be used:

```nu
let a = 1
let b = 2
unlet $a $b
$a
# => Error: nu::shell::variable_not_found
# =>
# =>   × Variable not found
# =>    ╭─[repl_entry #1:4:1]
# =>  3 │ unlet $a $b
# =>  4 │ $a
# =>    · ─┬
# =>    ·  ╰── variable not found
# =>    ╰────
```

## Variable Names

Variable names in Nushell come with a few restrictions as to what characters they can contain. In particular, they cannot contain these characters:

```text
.  [  (  {  +  -  *  ^  /  =  !  <  >  &  |
```

It is common for some scripts to declare variables that start with `$`. This is allowed, and it is equivalent to the `$` not being there at all.

```nu
let $var = 42
# identical to `let var = 42`
```
