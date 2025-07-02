# Types of Data

Traditional Unix shell commands communicate with each other using strings of text -- One command writes text to standard output (often abbreviated `stdout`) and the other reads text from standard input (or `stdin`). This allows multiple commands to be combined together to communicate through what is called a "pipeline".

Nushell embraces this approach and expands it to include other types of data in addition to strings.

Like many programming languages, Nu models data using a set of simple, structured data types. Simple data types include integers, floats, strings, and booleans. There are also special types for dates, file sizes, and time durations.

The [`describe`](/commands/docs/describe.md) command returns the type of a data value:

```nu
42 | describe
# => int
```

## Types at a Glance

| Type                                  | Example                                                               |
| ------------------------------------- | --------------------------------------------------------------------- |
| [Integers](#integers)                 | `-65535`                                                              |
| [Floats (decimals)](#floats-decimals) | `9.9999`, `Infinity`                                                  |
| [Strings](#text-strings)              | <code>"hole 18", 'hole 18', \`hole 18\`, hole18, r#'hole18'#</code>   |
| [Booleans](#booleans)                 | `true`                                                                |
| [Dates](#dates)                       | `2000-01-01`                                                          |
| [Durations](#durations)               | `2min + 12sec`                                                        |
| [File-sizes](#file-sizes)             | `64mb`                                                                |
| [Ranges](#ranges)                     | `0..4`, `0..<5`, `0..`, `..4`                                         |
| [Binary](#binary-data)                | `0x[FE FF]`                                                           |
| [Lists](#lists)                       | `[0 1 'two' 3]`                                                       |
| [Records](#records)                   | `{name:"Nushell", lang: "Rust"}`                                      |
| [Tables](#tables)                     | `[{x:12, y:15}, {x:8, y:9}]`, `[[x, y]; [12, 15], [8, 9]]`            |
| [Closures](#closures)                 | `{\|e\| $e + 1 \| into string }`, `{ $in.name.0 \| path exists }`     |
| [Cell-paths](#cell-paths)             | `$.name.0`                                                            |
| [Blocks](#blocks)                     | `if true { print "hello!" }`, `loop { print "press ctrl-c to exit" }` |
| [Null (Nothing)](#nothing-null)       | `null`                                                                |
| [Any](#any)                           | `let p: any = 5`                                                      |

## Basic Data Types

### Integers

|                       |                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | Numbers without a fractional component (positive, negative, and 0)                                                                                        |
| **_Annotation:_**     | `int`                                                                                                                                                     |
| **_Literal Syntax:_** | A decimal, hex, octal, or binary numeric value without a decimal place. E.g., `-100`, `0`, `50`, `+50`, `0xff` (hex), `0o234` (octal), `0b10101` (binary) |
| **_See also:_**       | [Language Reference - Integer](/lang-guide/chapters/types/basic_types/int.md)                                                                             |

Simple Example:

```nu
10 / 2
# => 5
5 | describe
# => int
```

### Floats/Decimals

|                       |                                                                                  |
| --------------------- | -------------------------------------------------------------------------------- |
| **_Description:_**    | Numbers with some fractional component                                           |
| **_Annotation:_**     | `float`                                                                          |
| **_Literal Syntax:_** | A decimal numeric value including a decimal place. E.g., `1.5`, `2.0`, `-15.333` |
| **_See also:_**       | [Language Reference - Float](/lang-guide/chapters/types/basic_types/float.md)    |

Simple Example:

```nu
2.5 / 5.0
# => 0.5
```

::: tip
As in most programming languages, decimal values in Nushell are approximate.

```nu
10.2 * 5.1
# => 52.01999999999999
```

:::

### Text/Strings

|                       |                                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| **_Description:_**    | A series of characters that represents text                                     |
| **_Annotation:_**     | `string`                                                                        |
| **_Literal Syntax:_** | See [Working with strings](working_with_strings.md)                             |
| **_See also:_**       | [Handling Strings](/book/loading_data.html#handling-strings)                    |
|                       | [Language Reference - String](/lang-guide/chapters/types/basic_types/string.md) |

As with many languages, Nushell provides multiple ways to specify String values and numerous commands for working with strings.

Simple (obligatory) example:

```nu
let audience: string = "World"
$"Hello, ($audience)"
# => Hello, World
```

### Booleans

|                       |                                                                                |
| --------------------- | ------------------------------------------------------------------------------ |
| **_Description:_**    | True or False value                                                            |
| **_Annotation:_**     | `bool`                                                                         |
| **_Literal Syntax:_** | Either a literal `true` or `false`                                             |
| **_See also:_**       | [Language Reference - Boolean](/lang-guide/chapters/types/basic_types/bool.md) |

Booleans are commonly the result of a comparison. For example:

```nu
let mybool: bool = (2 > 1)
$mybool
# => true
let mybool: bool = ($env.HOME | path exists)
$mybool
# => true
```

A boolean result is commonly used to control the flow of execution:

```nu
let num = -2
if $num < 0 { print "It's negative" }
# => It's negative
```

### Dates

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **_Description:_**    | Represents a specific point in time using international standard date-time descriptors |
| **_Annotation:_**     | `datetime`                                                                             |
| **_Literal Syntax:_** | See [Language Guide - Date](/lang-guide/chapters/types/basic_types/datetime.md)        |

Simple example:

```nu
date now
# => Mon, 12 Aug 2024 13:59:22 -0400 (now)
# Format as Unix epoch
date now | format date '%s'
# => 1723485562
```

### Durations

|                       |                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **_Description:_**    | Represent a unit of a passage of time                                                     |
| **_Annotation:_**     | `duration`                                                                                |
| **_Literal Syntax:_** | See [Language Reference - Duration](/lang-guide/chapters/types/basic_types/duration.html) |

Durations support fractional values as well as calculations.

Simple example:

```nu
3.14day
# => 3day 3hr 21min
30day / 1sec  # How many seconds in 30 days?
# => 2592000
```

### File sizes

|                       |                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **_Description:_**    | Specialized numeric type to represent the size of files or a number of bytes              |
| **_Annotation:_**     | `filesize`                                                                                |
| **_Literal Syntax:_** | See [Language Reference - Filesize](/lang-guide/chapters/types/basic_types/filesize.html) |

Nushell also has a special type for file sizes.

As with durations, Nushell supports fractional file sizes and calculations:

```nu
0.5kB
# => 500 B
1GiB / 1B
# => 1073741824
(1GiB / 1B) == 2 ** 30
# => true
```

See the [Language Reference](/lang-guide/chapters/types/basic_types/filesize.html) for a complete list of units and more detail.

### Ranges

|                       |                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **_Description:_**    | Describes a range of values from a starting value to an ending value, with an optional stride. |
| **_Annotation:_**     | `range`                                                                                        |
| **_Literal Syntax:_** | `<start_value>..<end_value>`. E.g., `1..10`.                                                   |
|                       | `<start_value>..<second_value>..<end_value>`. E.g., `2..4..20`                                 |
| **_See also:_**       | [Language Guide - Range](/lang-guide/chapters/types/basic_types/range.md)                      |

Simple example:

```nu
1..5
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => │ 4 │ 5 │
# => ╰───┴───╯
```

::: tip
You can also easily create lists of characters with a form similar to ranges with the command [`seq char`](/commands/docs/seq_char.html) as well as with dates using the [`seq date`](/commands/docs/seq_date.html) command.
:::

### Cell Paths

|                       |                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | An expression that is used to navigated to an inner value in a structured value.                                |
| **_Annotation:_**     | `cell-path`                                                                                                     |
| **_Literal syntax:_** | A dot-separated list of row (int) and column (string) IDs. E.g., `name.4.5`.                                    |
|                       | Optionally, use a leading `$.` when needed for disambiguation, such as when assigning a cell-path to a variable |
| **_See also:_**       | [Language Reference - Cell-path](/lang-guide/chapters/types/basic_types/cellpath.md)                            |
|                       | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) chapter.                        |

Simple example:

```nu
let cp = $.2
# Return list item at index 2
[ foo bar goo glue ] | get $cp
# => goo
```

### Closures

|                       |                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | An anonymous function, often called a lambda function, which accepts parameters and _closes over_ (i.e., uses) variables from outside its scope |
| **_Annotation:_**     | `closure`                                                                                                                                       |
| **_Literal Syntax:_** | `{\|args\| expressions }`                                                                                                                       |
| **_See also:_**       | [Language Reference - Closure](/lang-guide/chapters/types/basic_types/closure.md)                                                               |

Simple example:

This closure returns a boolean result of the comparison and then uses it in a `where` command to return all values greater than 5.

```nu
let compare_closure = {|a| $a > 5 }
let original_list = [ 40 -4 0 8 12 16 -16 ]
$original_list | where $compare_closure
# => ╭───┬────╮
# => │ 0 │ 40 │
# => │ 1 │  8 │
# => │ 2 │ 12 │
# => │ 3 │ 16 │
# => ╰───┴────╯
```

Closures are a useful way to represent code that can be executed on each row of data via [filters](/lang-guide/chapters/filters/00_filters_overview.md)

### Binary data

|                       |                                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| **_Description:_**    | Represents binary data                                                      |
| **_Annotation:_**     | `binary`                                                                    |
| **_Literal Syntax:_** | `0x[ffffffff]` - hex-based binary representation                            |
|                       | `0o[1234567]` - octal-based binary representation                           |
|                       | `0b[10101010101]` - binary-based binary representation                      |
| **_See also:_**       | [Language Guide - Binary](/lang-guide/chapters/types/basic_types/binary.md) |

Binary data, like the data from an image file, is a group of raw bytes.

Simple example - Confirm that a JPEG file starts with the proper identifier:

```nu
open nushell_logo.jpg
| into binary
| first 2
| $in == 0x[ff d8]
# => true
```

## Structured Data Types

Nushell includes a collection of structured data types that can contain the primitive types above. For example, instead of a single `float`, structured data gives us a way to represent multiple `float` values, such as a `list` of temperature readings, in the same value. Nushell supports the following structured data types:

### Lists

|                       |                                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| **_Description:_**    | Ordered sequence of zero or more values of any type                             |
| **_Annotation:_**     | `list`                                                                          |
| **_Literal Syntax:_** | See [Language Guide - List](/lang-guide/chapters/types/basic_types/list.md)     |
| **_See Also:_**       | [Working with Lists](./working_with_lists.md)                                   |
|                       | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) |

Simple example:

```nu
[Sam Fred George]
# => ╭───┬────────╮
# => │ 0 │ Sam    │
# => │ 1 │ Fred   │
# => │ 2 │ George │
# => ╰───┴────────╯
```

### Records

|                       |                                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| **_Description:_**    | Holds key-value pairs which associate string keys with various data values.     |
| **_Annotation:_**     | `record`                                                                        |
| **_Literal Syntax:_** | See [Language Guide - Record](/lang-guide/chapters/types/basic_types/record.md) |
| **_See Also:_**       | [Working with Records](./working_with_records.md)                               |
|                       | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) |

Simple example:

```nu
let my_record = {
  name: "Kylian"
  rank: 99
}
$my_record
# => ╭───────┬────────────╮
# => │ name  │ Kylian     │
# => │ rank  │ 99         │
# => ╰───────┴────────────╯

$my_record | get name
# =>  Kylian
```

### Tables

|                    |                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **_Description:_** | A two-dimensional container with both columns and rows where each cell can hold any basic or structured data type |
| **_Annotation:_**  | `table`                                                                                                           |
| **_See Also:_**    | [Working with Tables](./working_with_tables.md)                                                                   |
|                    | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md)                                   |
|                    | [Language Guide - Table](/lang-guide/chapters/types/basic_types/table.md)                                         |

The table is a core data structure in Nushell. As you run commands, you'll see that many of them return tables as output. A table has both rows and columns.

:::tip
Internally, tables are simply **lists of records**. This means that any command which extracts or isolates a specific row of a table will produce a record. For example, `get 0`, when used on a list, extracts the first value. But when used on a table (a list of records), it extracts a record:

```nu
[{x:12, y:5}, {x:3, y:6}] | get 0
# => ╭───┬────╮
# => │ x │ 12 │
# => │ y │ 5  │
# => ╰───┴────╯
```

:::

## Other Data Types

### Any

|                       |                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | When used in a type annotation or signature, matches any type. In other words, a "superset" of other types. |
| **_Annotation:_**     | `any`                                                                                                       |
| **_Literal syntax:_** | N/A - Any literal value can be assigned to an `any` type                                                    |
| **_See also:_**       | [Language Reference - Any](/lang-guide/chapters/types/basic_types/any.md)                                   |

### Blocks

|                       |                                                                               |
| --------------------- | ----------------------------------------------------------------------------- |
| **_Description:_**    | A syntactic form used by some Nushell keywords (e.g., `if` and `for`)         |
| **_Annotation:_**     | N/A                                                                           |
| **_Literal Syntax:_** | N/A                                                                           |
| **_See also:_**       | [Language Reference - Block](/lang-guide/chapters/types/other_types/block.md) |

Simple example:

```nu
if true { print "It's true" }
```

The `{ print "It's true" }` portion above is a block.

### Nothing (Null)

|                       |                                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| **_Description:_**    | The `nothing` type is to be used to represent the absence of another value.       |
| **_Annotation:_**     | `nothing`                                                                         |
| **_Literal Syntax:_** | `null`                                                                            |
| **_See also:_**       | [Language Reference - Nothing](/lang-guide/chapters/types/basic_types/nothing.md) |

#### Simple Example

Using the optional operator `?` returns `null` if the requested cell-path doesn't exist:

```nu
let simple_record = { a: 5, b: 10 }
$simple_record.a?
# => 5
$simple_record.c?
# => Nothing is output
$simple_record.c? | describe
# => nothing
$simple_record.c? == null
# => true
```
