# Types of Data

Traditional Unix shell commands communicate with each other using strings of text -- One command writes text to standard output (often abbreviated `stdout`) and the other reads text from standard input (or `stdin`). This allows multiple commands to be combined together to communicate through what is called a "pipeline".

Nushell embraces this approach and expands it to include other types of data in addition to strings.

Like many programming languages, Nu models data using a set of simple, structured data types. Simple data types include integers, floats, strings, and booleans. There are also special types for dates, file sizes, and time durations.

The [`describe`](/commands/docs/describe.md) command returns the type of a data value:

```nu
> 42 | describe
```

## Types at a glance

| Type              | Example                                                               |
| ----------------- | --------------------------------------------------------------------- |
| Integers          | `-65535`                                                              |
| Decimals (floats) | `9.9999`, `Infinity`                                                  |
| Strings           | <code>"hole 18", 'hole 18', \`hole 18\`, hole18</code>                |
| Booleans          | `true`                                                                |
| Dates             | `2000-01-01`                                                          |
| Durations         | `2min + 12sec`                                                        |
| File sizes        | `64mb`                                                                |
| Ranges            | `0..4`, `0..<5`, `0..`, `..4`                                         |
| Binary            | `0x[FE FF]`                                                           |
| Lists             | `[0 1 'two' 3]`                                                       |
| Records           | `{name:"Nushell", lang: "Rust"}`                                      |
| Tables            | `[{x:12, y:15}, {x:8, y:9}]`, `[[x, y]; [12, 15], [8, 9]]`            |
| Closures          | `{\|e\| $e + 1 \| into string }`, `{ $in.name.0 \| path exists }`     |
| Blocks            | `if true { print "hello!" }`, `loop { print "press ctrl-c to exit" }` |
| Null              | `null`                                                                |

## Integers

::: warning Type
`int`
:::

Examples of integers (i.e. "round numbers") include 1, 0, -5, and 100.
You can parse a string into an integer with the [`into int`](/commands/docs/into_int.md) command

```nu
> "-5" | into int
```

## Decimals

::: warning Type
`float`
:::

Decimal numbers are numbers with some fractional component. Examples include 1.5, 2.0, and 15.333.
You can cast a string into a Float with the [`into float`](/commands/docs/into_float.md) command

```nu
> "1.2" | into float
```

## Text/Strings

::: warning Type
`string`
:::

A string of characters that represents text. There are multiple ways these can be constructed. See [Working with strings](working_with_strings.md) and [Handling Strings](https://www.nushell.sh/book/loading_data.html#handling-strings) for details.

## Booleans

::: warning Type
`bool`
:::

There are just two boolean values: `true` and `false`. Rather than writing the values directly, they often result from a comparison:

```nu
> let mybool = 2 > 1
> $mybool
true
> let mybool = ($env.HOME | path exists)
> $mybool
true
```

## Dates

::: warning Type
`date`
:::

Dates and times are held together in the Date value type. Date values used by the system are timezone-aware, and by default use the UTC timezone.

Dates are in three forms, based on the RFC 3339 standard:

- A date:
  - `2022-02-02`
- A date and time (in GMT):
  - `2022-02-02T14:30:00`
- A date and time with timezone:
  - `2022-02-02T14:30:00+05:00`

## Durations

::: warning Type
`duration`
:::

Durations represent a length of time. This chart shows all durations currently supported:

| Duration | Length          |
| -------- | --------------- |
| `1ns`    | one nanosecond  |
| `1us`    | one microsecond |
| `1ms`    | one millisecond |
| `1sec`   | one second      |
| `1min`   | one minute      |
| `1hr`    | one hour        |
| `1day`   | one day         |
| `1wk`    | one week        |

Nushell supports fractional durations:

```nu
> 3.14day
3day 3hr 21min
```

As well as calculations with durations:

```nu
> 30day / 1sec  # How many seconds in 30 days?
2592000
```

## File sizes

::: warning Type
`filesize`
:::

Nushell also has a special type for file sizes. Examples include `100b`, `15kb`, and `100mb`.

The full list of filesize units are:

- `b`: bytes
- `kb`: kilobytes (aka 1000 bytes)
- `mb`: megabytes
- `gb`: gigabytes
- `tb`: terabytes
- `pb`: petabytes
- `eb`: exabytes
- `kib`: kibibytes (aka 1024 bytes)
- `mib`: mebibytes
- `gib`: gibibytes
- `tib`: tebibytes
- `pib`: pebibytes
- `eib`: exbibytes

As with durations, Nushell supports fractional file sizes and calculations:

```nu
> 1Gb / 1b
1000000000
> 1Gib / 1b
1073741824
> (1Gib / 1b) == 2 ** 30
true
```

## Ranges

::: warning Type
`range`
:::

A range is a way of expressing a sequence of integer or float values from start to finish. They take the form \<start\>..\<end\>. For example, the range `1..3` means the numbers 1, 2, and 3.

::: tip

You can also easily create lists of characters with a form similar to ranges with the command [`seq char`](/commands/docs/seq_char.html) as well as with dates using the [`seq date`](/commands/docs/seq_date.html) command.

:::

### Specifying the step

You can specify the step of a range with the form \<start\>..\<second\>..\<end\>, where the step between values in the range is the distance between the \<start\> and \<second\> values, which numerically is \<second\> - \<start\>. For example, the range `2..5..11` means the numbers 2, 5, 8, and 11 because the step is \<second\> - \<first\> = 5 - 2 = 3. The third value is 5 + 3 = 8 and the fourth value is 8 + 3 = 11.

[`seq`](/commands/docs/seq.md) can also create sequences of numbers, and provides an alternate way of specifying the step with three parameters. It's called with `seq $start $step $end` where the step amount is the second parameter rather than being the second parameter minus the first parameter. So `2..5..9` would be equivalent to `seq 2 3 9`.

### Inclusive and non-inclusive ranges

Ranges are inclusive by default, meaning that the ending value is counted as part of the range. The range `1..3` includes the number `3` as the last value in the range.

Sometimes, you may want a range that is limited by a number but doesn't use that number in the output. For this, you can use `..<` instead of `..`. For example, `1..<5` is the numbers 1, 2, 3, and 4.

### Open-ended ranges

Ranges can also be open-ended. You can remove the start or the end of the range to make it open-ended.

Let's say you wanted to start counting at 3, but you didn't have a specific end in mind. You could use the range `3..` to represent this. When you use a range that's open-ended on the right side, remember that this will continue counting for as long as possible, which could be a very long time! You'll often want to use open-ended ranges with commands like [`take`](/commands/docs/take.md), so you can take the number of elements you want from the range.

You can also make the start of the range open. In this case, Nushell will start counting with `0`. For example, the range `..2` is the numbers 0, 1, and 2.

::: warning

Use caution when typing an open-ended range such as `3..` into the command line. This will continue printing out numbers very quickly until you terminate the range generation with <kbd>Ctrl</kbd>+<kbd>C</kbd> or an equivalent.

:::

## Binary data

::: warning Type
`binary`
:::

Binary data, like the data from an image file, is a group of raw bytes.

You can write binary as a literal using any of the `0x[...]`, `0b[...]`, or `0o[...]` forms:

```nu
> 0x[1F FF]  # Hexadecimal
> 0b[1 1010] # Binary
> 0o[377]    # Octal
```

Incomplete bytes will be left-padded with zeros.

## Structured data types

Nushell includes a collection of structured data types that can contain the primitive types above. For example, instead of a single `float`, structured data gives us a way to represent multiple `float` values, such as a `list` of temperature readings, in the same value. Nushell supports the following structured data types:

## Records

::: warning Type
`record`
:::

Records hold key-value pairs, which associate string keys with various data values. Record syntax is very similar to objects in JSON. However, commas are _not_ required to separate values if Nushell can easily distinguish them! The key-value pairs of a record may be delimited by:

- Commas

  ```nu
  > {name: "Sam", rank: 10}
  ╭──────┬─────╮
  │ name │ Sam │
  │ rank │ 10  │
  ╰──────┴─────╯
  ```

- Spaces (when unambiguous):

  ```nu
  > {name: "Sam" rank: 10}
  ╭──────┬─────╮
  │ name │ Sam │
  │ rank │ 10  │
  ╰──────┴─────╯
  ```

- Line breaks:

  ```nu
  > {
      name: "Sam"
      rank: 10
    }
  ╭──────┬─────╮
  │ name │ Sam │
  │ rank │ 10  │
  ╰──────┴─────╯
  ```

As records can have many fields, they are, by default, displayed vertically rather than left-to-right. To display a record left-to-right, convert it to a nuon. For example:

```nu
  > {
      name: "Sam"
      rank: 10
    } | to nuon
  {name: Sam, rank: 10}
```

:::tip
A record is identical to a single row of a table (see below). You can think of a record as essentially being a "one-row table", with each of its keys as a column (although a true one-row table is something distinct from a record).

This means that any command that operates on a table's rows _also_ operates on that of a record. For instance, [`insert`](/commands/docs/insert.md), which adds data to each of a table's rows, can be used with records:

```nu
> {x:3 y:1} | insert z 0
╭───┬───╮
│ x │ 3 │
│ y │ 1 │
│ z │ 0 │
╰───┴───╯
```

:::

You can iterate over the key-value pairs of a record by first transposing it into a table:

```nu
> {name: "Sam", rank: 10} | transpose key value
╭───┬──────┬───────╮
│ # │ key  │ value │
├───┼──────┼───────┤
│ 0 │ name │  Sam  │
│ 1 │ rank │   10  │
╰───┴──────┴───────╯
```

Accessing a record's value is done by placing a `.` before a string with the key name. This is usually a bare-word string:

```nu
> {x:12 y:4}.x
12
```

However, if a record has a key name that can't be expressed as a bare string, or resembles an integer (see lists, below), you'll need to use more explicit string syntax. For example:

```nu
> let record_example = {
    "key x":12
    "key y":4
  }
> $record_example."key x"
12

# or
> $record_example | get "key x"
12
```

To make a copy of a record with new fields, you can use the [spread operator](/book/operators#spread-operator) (`...`):

```nu
> let data = {
    name: "Alice"
    age: 50
  }
> {
    ...$data
    hobby: "Cricket"
  }
╭───────┬─────────╮
│ name  │ Alice   │
│ age   │ 50      │
│ hobby │ Cricket │
╰───────┴─────────╯
```

## Lists

::: warning Type
`list`
:::

Lists are ordered sequences of data values. List syntax is very similar to arrays in JSON. However, commas are _not_ required to separate values if Nushell can easily distinguish them! As with Records, Lists may be delimited by commas, spaces, or linebreaks.

```nu
> [Sam Fred George]
╭───┬────────╮
│ 0 │ Sam    │
│ 1 │ Fred   │
│ 2 │ George │
╰───┴────────╯
```

:::tip
Lists are equivalent to the individual columns of tables. You can think of a list as essentially being a "one-column table" (with no column name). Thus, any command which operates on a column _also_ operates on a list. For instance, [`where`](/commands/docs/where.md) can be used with lists:

```nu
> [bell book candle] | where ($it =~ 'b')
╭───┬──────╮
│ 0 │ bell │
│ 1 │ book │
╰───┴──────╯
```

:::

Accessing a list's data is done by placing a `.` before an integer literal:

```nu
> [a b c].1
b
```

To return multiple rows (a sub-list) from a list, you can use the [`range`](/commands/docs/range.md) command:

```nu
> [a b c d e f] | range 1..3
╭───┬───╮
│ 0 │ b │
│ 1 │ c │
│ 2 │ d │
╰───┴───╯
```

To append one or more lists together, optionally with values interspersed in between, you can use the
[spread operator](/book/operators#spread-operator) (`...`):

```nu
> let x = [1 2]
> [...$x 3 ...(4..7 | take 2)]
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
│ 3 │ 4 │
│ 4 │ 5 │
╰───┴───╯
```

## Tables

::: warning Type
`table`
:::

The table is a core data structure in Nushell. As you run commands, you'll see that many of them return tables as output. A table has both rows and columns.

### Table-literal syntax

Table literals can be created using a syntax similar to that of a list literal. Because tables also contain columns and not just values, we also specify the column names:

```nu
> [[column1, column2]; [Value1, Value2] [Value3, Value4]]
╭───┬─────────┬─────────╮
│ # │ column1 │ column2 │
├───┼─────────┼─────────┤
│ 0 │ Value1  │ Value2  │
│ 1 │ Value3  │ Value4  │
╰───┴─────────┴─────────╯
```

### List-of-Records syntax

You can also create a table as a list of records, JSON-style:

```nu
> [{name: "Sam", rank: 10}, {name: "Bob", rank: 7}]
╭───┬──────┬──────╮
│ # │ name │ rank │
├───┼──────┼──────┤
│ 0 │ Sam  │   10 │
│ 1 │ Bob  │    7 │
╰───┴──────┴──────╯
```

:::tip
Internally, tables are simply **lists of records**. This means that any command which extracts or isolates a specific row of a table will produce a record. For example, `get 0`, when used on a list, extracts the first value. But when used on a table (a list of records), it extracts a record:

```nu
> [{x:12, y:5}, {x:3, y:6}] | get 0
╭───┬────╮
│ x │ 12 │
│ y │ 5  │
╰───┴────╯
```

This is true regardless of which table syntax you use:

```nu
[[x,y];[12,5],[3,6]] | get 0
╭───┬────╮
│ x │ 12 │
│ y │ 5  │
╰───┴────╯
```

:::

## Cell Paths

::: warning Type
`cell-path`
:::

The syntax used to access lists and records can be combined to navigate tables. When used on tables, these access chains are called "cell paths".

You can access individual rows by number to obtain records:

@[code](@snippets/types_of_data/cell-paths.sh)

Moreover, you can also access entire columns of a table by name, to obtain lists:

```nu
> [{x:12 y:5} {x:4 y:7} {x:2 y:2}].x
╭───┬────╮
│ 0 │ 12 │
│ 1 │  4 │
│ 2 │  2 │
╰───┴────╯
```

Of course, these resulting lists don't have the column names of the table. To choose columns from a table while leaving it as a table, you'll commonly use the [`select`](/commands/docs/select.md) command with column names:

```nu
> [{x:0 y:5 z:1} {x:4 y:7 z:3} {x:2 y:2 z:0}] | select y z
╭───┬───┬───╮
│ # │ y │ z │
├───┼───┼───┤
│ 0 │ 5 │ 1 │
│ 1 │ 7 │ 3 │
│ 2 │ 2 │ 0 │
╰───┴───┴───╯
```

To get specific rows from a table, you'll commonly use the [`select`](/commands/docs/select.md) command with row numbers, as you would with a list:

```nu
> [{x:0 y:5 z:1} {x:4 y:7 z:3} {x:2 y:2 z:0}] | select 1 2
╭───┬───┬───┬───╮
│ # │ x │ y │ z │
├───┼───┼───┼───┤
│ 0 │ 4 │ 7 │ 3 │
│ 1 │ 2 │ 2 │ 0 │
╰───┴───┴───┴───╯
```

#### Optional cell paths

By default, cell path access will fail if it can't access the requested row or column. To logically handle this case, you can add `?` to a cell path member to mark it as _optional_:

```nu
> [{foo: 123}, {}].foo?
╭───┬─────╮
│ 0 │ 123 │
│ 1 │     │
╰───┴─────╯
```

When using optional cell path members, missing data is replaced with `null`.

## Closures

::: warning Type
`closure`
:::

Closures are anonymous functions that can be passed a value through parameters and _close over_ (i.e., use) variables from outside their scope.

For example, in the command `each { |it| print $it }` the closure is the portion contained in curly braces, `{ |it| print $it }`.
Closure parameters are specified between a pair of pipe symbols (for example, `|it|`) if necessary.
You can also use [pipeline input as `$in`](pipelines.html#pipeline-input-and-the-special-in-variable) in most closures instead of providing an explicit parameter. For example:

```nu
1..10 | each { print $in }
```

A closure can be bound to a named variable and passed as a parameter.
To call a closure directly in your code use the [`do`](/commands/docs/do.md) command.

```nu
# Assign a closure to a variable
> let greet = {|name| print $"Hello, ($name)"}
> do $greet "Julian"
Hello, Julian
```

Closures are a useful way to represent code that can be executed on each row of data.
It is common to use `$it` as a parameter name in [`each`](/commands/docs/each.md) blocks, but not required. For example:

`each {|x| print $x }` works the same way as `each {|it| print $it }`.

## Blocks

::: warning Type
`block`
:::

Blocks don't close over variables, don't have parameters, and can't be passed as a value.
However, unlike closures, blocks can access mutable variable in the parent scope.
For example, mutating a variable inside the block used in an [`if`](/commands/docs/if.md) call is valid:

```nu
mut x = 1
if true {
    $x += 1000
}
print $x
```

Result:

```nu
1001
```

## Null

::: warning Type
`nothing`
:::

Finally, `null` is the language's "nothing" value, similar to JSON's "null". Whenever Nushell would print the `null` value (outside of a string or data structure), it prints nothing instead. Hence, most of Nushell's file system commands (like [`save`](/commands/docs/save.md) or [`cd`](/commands/docs/cd.md)) produce `null`.

::: tip
You can add `ignore` at the end of a pipeline to convert any pipeline result to a `nothing`. This will prevent the command/pipeline's output from being displayed.

```nu
git checkout featurebranch | ignore
```

:::

It's important to understand that `null` is not the same as the absence of a value! It is possible for a table or list to have _missing_ values. Attempting to access a missing value will not produce `null` but will instead generate an error:

```nu
> let missing_value = [{a:1 b:2} {b:1}]
> $missing_value
╭───┬────┬───╮
│ # │ a  │ b │
├───┼────┼───┤
│ 0 │  1 │ 2 │
│ 1 │ ❎ │ 1 │
╰───┴────┴───╯

> $missing_value.1.a
Error: nu::shell::column_not_found

  × Cannot find column 'a'
   ╭─[entry #4:1:32]
 1 │ let missing_value = [{a:1 b:2} {b:1}]
   ·                                ──┬──
   ·                                  ╰── value originates here
   ╰────
   ╭─[entry #6:1:18]
 1 │ $missing_value.1.a
   ·                  ┬
   ·                  ╰── cannot find column 'a'
   ╰────
```

Note that, in the table above, the missing value is printed as the ❎ emoji in interactive output.

To safely access a value that may be missing, mark the cell-path member as _optional_ using a question-mark (`?`) after the key name.
Missing values will return `null` when accessed with the optional operator. For example, continuing the example above:

```nu
> match $missing_value.1.a? {
    null => "Missing"
    $value => $value
  }
Missing

> match $missing_value.1.b? {
    null => "Missing"
    $value => $value
  }
1
```

::: tip
The [`default` command](/commands/docs/default.html) can be used to apply a default value to missing or null column result. In the example, above, for instance:

```nu
> let missing_value = [{a:1 b:2} {b:1}]
> $missing_value
╭───┬────┬───╮
│ # │ a  │ b │
├───┼────┼───┤
│ 0 │  1 │ 2 │
│ 1 │ ❎ │ 1 │
╰───┴────┴───╯

> let with_default_value = ($missing_value | default 'n/a' a)
> $with_default_value
╭───┬─────┬───╮
│ # │  a  │ b │
├───┼─────┼───┤
│ 0 │   1 │ 2 │
│ 1 │ n/a │ 1 │
╰───┴─────┴───╯

> $with_default_value.1.a
n/a
```

:::
