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
# => Error: nu::shell::assignment_requires_mutable_variable
# => 
# =>   × Assignment to an immutable variable.
# =>    ╭─[entry #10:1:1]
# =>  1 │ $val = 100
# =>    · ──┬─
# =>    ·   ╰── needs to be a mutable variable
# =>    ╰────
```

However, immutable variables can be 'shadowed'. Shadowing means that they are redeclared and their initial value cannot be used anymore within the same scope.

```nu
let val = 42                   # declare a variable
do { let val = 101;  $val }    # in an inner scope, shadow the variable
# => 101
$val                           # in the outer scope the variable remains unchanged
# => 42
let val = $val + 1             # now, in the outer scope, shadow the original variable
$val                           # in the outer scope, the variable is now shadowed, and
# => 43                               # its original value is no longer available.
```

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
| `++=`    | Appends a list or a value to a variable                                    |

::: tip Note

1. `+=`, `-=`, `*=` and `/=` are only valid in the contexts where their root operations are expected to work. For example, `+=` uses addition, so it can not be used for contexts where addition would normally fail
2. `++=` requires that either the variable **or** the argument is a list.
   :::

#### More on Mutability

Closures and nested `def`s cannot capture mutable variables from their environment. For example

```nu
# naive method to count number of elements in a list
mut x = 0

[1 2 3] | each { $x += 1 }   # error: $x is captured in a closure
```

To use mutable variables for such behaviour, you are encouraged to use the loops

### Constant Variables

A constant variable is an immutable variable that can be fully evaluated at parse-time. These are useful with commands that need to know the value of an argument at parse time, like [`source`](/commands/docs/source.md), [`use`](/commands/docs/use.md) and [`plugin use`](/commands/docs/plugin_use.md). See [how nushell code gets run](how_nushell_code_gets_run.md) for a deeper explanation. They are declared using the `const` keyword

```nu
const script_file = 'path/to/script.nu'
source $script_file
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
# => ╭───┬───────────────────────────╮
# => │ 0 │ Item #0 is size 812 B     │
# => │ 1 │ Item #1 is size 3.4 KiB   │
# => │ 2 │ Item #2 is size 11.0 KiB  │
# => │ 3 │ ...                       │
# => │ 4 │ Item #18 is size 17.8 KiB │
# => │ 5 │ Item #19 is size 482 B    │
# => │ 6 │ Item #20 is size 4.0 KiB  │
# => ╰───┴───────────────────────────╯
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

three
```

While `reduce` processes lists, the [`generate`](/commands/docs/generate.md) command can be used with arbitrary sources such as external REST APIs, also without requiring mutable variables. Here's an example that retrieves local weather data every hour and generates a continuous list from that data. The `each` command can be used to consume each new list item as it becomes available.

```nu
generate khot {|weather_station|
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
}
| each {|weather_report|
    {
      time: ($weather_report.properties.timestamp | into datetime)
      temp: $weather_report.properties.temperature.value
    }
}
```

### Performance Considerations

Using [filter commands](/commands/categories/filters.html) with immutable variables is often far more performant than mutable variables with traditional flow-control statements such as `for` and `while`. For example:

- Using a `for` statement to create a list of 50,000 random numbers:

  ```nu
  timeit {
    mut randoms = []
    for _ in 1..50_000 {
      $randoms = ($randoms | append (random int))
    }
  }
  ```

  Result: 1min 4sec 191ms 135µs 90ns

- Using `each` to do the same:

  ```nu
  timeit {
    let randoms = (1..50_000 | each {random int})
  }
  ```

  Result: 19ms 314µs 205ns

- Using `each` with 10,000,000 iterations:

  ```nu
  timeit {
    let randoms = (1..10_000_000 | each {random int})
  }
  ```

  Result: 4sec 233ms 865µs 238ns

  As with many filters, the `each` statement also streams its results, meaning the next stage of the pipeline can continue processing without waiting for the results to be collected into a variable.

  For tasks which can be optimized by parallelization, as mentioned above, `par-each` can have even more drastic performance gains.

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
