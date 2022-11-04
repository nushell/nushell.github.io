# Types of Data

Traditionally, Unix shell commands have communicated with each other using strings of text: one command would write text to standard output (often abbreviated 'stdout') and the other would read text from standard input (or 'stdin'), allowing the two commands to communicate.

Nu embraces this approach, and expands it to include other types of data, in addition to strings.

Like many programming languages, Nu models data using a set of simple, and structured data types. Simple data types include integers, floats, strings, booleans, dates. There are also special types for filesizes and time durations.

The [`describe`](commands/describe.md) command returns the type of a data value:

```
> 42 | describe
```

## Integers

Examples of integers (i.e. "round numbers") include 1, 0, -5,  and 100.
You can parse a string into an integer with the `into int` command

```
> "-5" | into int
```

## Decimals

Decimal numbers are numbers with some fractional component. Examples include 1.5, 2.0, and 15.333.
You can cast a string into an Decimal with the `into decimal` command

```
> "1.2" | into decimal
```

## Strings

A string of characters that represents text. There are a few ways these can be constructed:

- Double quotes
  - `"Line1\nLine2\n"`
- Single quotes
  `'She said "Nushell is the future".'`
- Dynamic string interpolation
  - `$"6 x 7 = (6 * 7)"`
  - `ls | each { |it| $"($it.name) is ($it.size)" }`
- Bare strings
  - `"hello"`

See [Working with strings](working_with_strings.md) and [Handling Strings](https://www.nushell.sh/book/loading_data.html#handling-strings) for details.

## Booleans

There are just two boolean values: `true` and `false`. Rather than writing the values directly, they often result from a comparison:
```sh
> let mybool = 2 > 1
> $mybool
true
> let mybool = ($env.HOME | path exists)
> $mybool
true
```

## Dates

Dates and times are held together in the Date value type. Date values used by the system are timezone-aware, and by default use the UTC timezone.

Dates are in three forms, based on the RFC 3339 standard:

- A date:
  - `2022-02-02`
- A date and time (in GMT):
  - `2022-02-02T14:30:00`
- A date and time with timezone:
  - `2022-02-02T14:30:00+05:00`

## Durations

Durations represent a length of time. This chart shows all durations currently supported:

| Duration | Length                      |
| -------- | --------------------------- |
| `1ns`    | one nanosecond              |
| `1us`    | one microsecond             |
| `1ms`    | one millisecond             |
| `1sec`   | one second                  |
| `1min`   | one minute                  |
| `1hr`    | one hour                    |
| `1day`   | one day                     |
| `1wk`    | one week                    |

You can make fractional durations:
```sh
> 3.14day
3day 3hr 21min
```

And you can do calculations with durations:
```sh
> 30day / 1sec  # How many seconds in 30 days?
2592000
```

## File sizes

Nushell also has a special type for file sizes. Examples include `100b`, `15kb`, and `100mb`.

The full list of filesize units are:

- `b`: bytes
- `kb`: kilobytes (aka 1000 bytes)
- `mb`: megabytes
- `gb`: gigabytes
- `tb`: terabytes
- `pb`: petabytes
- `eb`: exabytes
- `zb`: zettabyte
- `kib`: kibibytes (aka 1024 bytes)
- `mib`: mebibytes
- `gib`: gibibytes
- `tib`: tebibytes
- `pib`: pebibytes
- `eib`: exbibyte
- `zib`: zebibyte

As with durations, you can make fractional file sizes, and do calculations:
```sh
> 1Gb / 1b
1000000000
> 1Gib / 1b
1073741824
> (1Gib / 1b) == 2 ** 30
true
```

## Ranges

A range is a way of expressing a sequence of values from start to finish. They take the form \<start\>..\<end\>. For example, the range `1..3` means the numbers 1, 2, and 3.

### Inclusive and non-inclusive ranges

Ranges are inclusive by default, meaning that the ending value is counted as part of the range. The range `1..3` includes the number `3` as the last value in the range.

Sometimes, you may want a range that is limited by a number but doesn't use that number in the output. For this, you can use `..<` instead of `..`. For example, `1..<5` is the numbers 1, 2, 3, and 4.

### Open-ended ranges

Ranges can also be open-ended. You can remove the start or the end of the range to make it open-ended.

Let's say you wanted to start counting at 3, but you didn't have a specific end in mind. You could use the range `3..` to represent this. When you use a range that's open-ended on the right side, remember that this will continue counting for as long as possible, which could be a very long time! You'll often want to use open-ended ranges with commands like `take`, so you can take the number of elements you want from the range.

You can also make the start of the range open. In this case, Nushell will start counting with `0`. For example, the range `..2` is the numbers 0, 1, and 2.

## Binary data

Binary data, like the data from an image file, is a group of raw bytes.

You can write binary as a literal using any of the `0x[...]`, `0b[...]`, or `0o[...]` forms:

```
> 0x[1F FF]  # Hexadecimal
> 0b[1 1010] # Binary
> 0o[777]    # Octal
```

Incomplete bytes will be left-padded with zeros.

## Structured data

Structured data builds from the simple data. For example, instead of a single integer, structured data gives us a way to represent multiple integers in the same value. Here's a list of the currently supported structured data types: records, lists and tables.

## Records

Records hold key-value pairs, much like objects in JSON. As these can sometimes have many fields, a record is printed up-down rather than left-right:

```
> {name: sam, rank: 10}
╭──────┬─────╮
│ name │ sam │
│ rank │ 10  │
╰──────┴─────╯
```

You can iterate over records by first transposing it into a table:

```
> {name: sam, rank: 10} | transpose key value
╭───┬──────┬───────╮
│ # │ key  │ value │
├───┼──────┼───────┤
│ 0 │ name │  sam  │
│ 1 │ rank │   10  │
╰───┴──────┴───────╯
```

## Lists

Lists can hold more than one value. These can be simple values. They can also hold rows, and the combination of a list of records is often called a "table".

Example: a list of strings

```
> [sam fred george]
───┬────────
 0 │ sam
 1 │ fred
 2 │ george
───┴────────
```

## Tables

The table is a core data structure in Nushell. As you run commands, you'll see that many of them return tables as output. A table has both rows and columns.

We can create our own tables similarly to how we create a list. Because tables also contain columns and not just values, we pass in the name of the column values:

```
> [[column1, column2]; [Value1, Value2]]
───┬─────────┬─────────
 # │ column1 │ column2
───┼─────────┼─────────
 0 │ Value1  │ Value2
───┴─────────┴─────────
```

We can also create a table with multiple rows of data:

```
> [[column1, column2]; [Value1, Value2] [Value3, Value4]]
───┬─────────┬─────────
 # │ column1 │ column2
───┼─────────┼─────────
 0 │ Value1  │ Value2
 1 │ Value3  │ Value4
───┴─────────┴─────────
```

You can also create a table as a list of records:

```
> [{name: sam, rank: 10}, {name: bob, rank: 7}]
╭───┬──────┬──────╮
│ # │ name │ rank │
├───┼──────┼──────┤
│ 0 │ sam  │   10 │
│ 1 │ bob  │    7 │
╰───┴──────┴──────╯
```

### Column paths

Column paths are a path through the table to a specific sub-table, column, row, or cell. E.g. the value `foo.0.bar` in `open data.toml | get foo.0.bar`


## Blocks

Blocks represent a block of code in Nu. For example, in the command `each { |it| print $it }` the block is the portion contained in curly braces, `{ |it| print $it }`. Block parameters are specified between a pair of pipe symbols (for example, `|it|`) if necessary. You can also use `$in` in most blocks instead of providing a parameter: `each { print $in }`

Blocks are a useful way to represent code that can be executed on each row of data. It is idiomatic to use `$it` as a parameter name in [`each`](commands/each.md) blocks, but not required; `each { |x| print $x }` works the same way as `each { |it| print $it }`.
