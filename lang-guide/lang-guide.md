---
title: The Nushell Language
---

## Basic Types

The items below are from `enum Value`

### Bool

What it is: A logical data type that can have only `true` or `false`.

What are possible values: `true` or `false`

Example 1:

```nu
> if true { print hello }
hello
```

Example 2:

```nu
> let truth = true
> echo $truth
true
```

### Int

Integer numbers.

Internally represented as a signed 64-bit number with two's complement arithmetic.

Numeric literals without a fractional components will evaluate as `Int`: `1`, `-2`, `1000`

Integers can be created using hex `0xff`, octal `0o234`, binary `0b10101`, and decimal `123`.

Can be used for indexing into `List`s or `String`s

### Float

Floating point numbers to represent real valued numeric values:

Internally IEE-754 floats with 64 bit precision.

Literals with a fractional decimal component are evaluated as `Float`: `0.1`, `3.14159`, `-10.4`

TBD: semantics for comparison, NaN/InF. Future hashing.

### Filesize

Specialized numeric type to represent the size of files or a number of bytes.

The literals and display representations support both metric prefixes with a base of `1000` and the binary compatible kibibytes, mebibytes, etc. with a base of `1024`

```nu
1 kb
0.2 gb
20 mib
```

TBD: choice of base and scale when displaying a value.

### Duration

### Date

### Range

A range describes a range of values from a starting value to an ending value, with an optional stride. Values are separated by `..` to create a range.

Values from 1 to 10 inclusive:
`1..10`

Value from 1 to 10, striding with 2 (only odds):
`1..3..10`

You can also use `..<` to have values up to, but not including, the range end.

Values from 1 to 9:
`1..<10`

Ranges can range over int or float values.

Ranges can also work backward. For example, the values from 10 to 1 in reverse could be created with:

```nu
10..1
```

Ranges can exclude either the `from` or the `to` side of the range:

Numbers from 0 to 10:

```nu
..10
```

Numbers starting from 1:

```nu
1..
```

Ranges are lazy. They do not generate their values until needed. You can use a range with no specified end point and combine it with a command that takes only the first n elements. For example, you could generate the numbers from 1 to 10 using:

```nu
1.. | take 10
```

### String

Nu supports Unicode strings as the basic text type. Internally strings are UTF-8 encoded, to ensure a consistent behavior of string operations across different platforms and simplify interoperability with most platforms and the web.
They have an associated length and do not rely on the C-style null character for termination.
As strings have to be valid UTF-8 for effective string operations, they can not be used to represent arbitrary binary data. For this please use the [binary data type](#binary).

Different display operations might impose limitations on which non-printable or printable characters get shown. One relevant area are the ANSI escape sequences that can be used to affect the display on the terminal. Certain operations may choose to ignore those.

To input string data different [string literals](#string-literals) supporting escaping and [string interpolation](#string-interpolation) are available.

TBD: On which level string indexing should be performed: bytes or unicode scalars.

### Record

A record is the foundational associative map.
A record contains items of any value that are addressed by a string key. (TBD: complex hashable/equality checkable keys)
The keys maintain the order of insertion or the order defined in a record literal.
Keys are guaranteed to be unique. Inserting twice with the same key will only keep the last insertion or definition.

`{a: b, c: d}`

### List

Basic collection of values ordered by their insertion.

0-based indexing to retrieve values.

Lists use either commas or spaces to separate values.

`[1, 2, 3]`
`[1 2 3]`
`[1,2,3]`

Effectively, commas in the above are treated like spaces.

Lists can span multiple lines to enumerate values. For example, this is equivalent to `[1, 2, 3]`:

```nu
[
1
2
3
]
```

### Tables

A table is a two-dimensional container with both columns and rows. There are two ways to write a table. These two examples are equivalent:

```nu
[[a, b]; [1, 2], [3, 4]]
```

```nu
[{a: 1, b: 2}, {a: 3, b: 4}]
```

In the first syntax, the headers are separated from the data cells using a semicolon(`;`). The semicolon separator is mandatory in this syntax to create a table. It must follow the headers.

The second syntax is simply a list of records. This plays on the Nushell data model, which sees a list of records as equivalent to a table. This is used in cases where the length of a table may not be known ahead of time. In such a case, a stream of records likewise represents a table.

### Block

### Nothing

The type `nothing` is to be used to represent the absence of another value. Commands that explicitly do not return a value return `null`.
Use as a missing value indicator.

### Error

### Binary

Nushell offers a way of creating binary literals in your data. These are in one of three ways:

- `0x[ffffffff]` - hex-based binary representation
- `0o[1234567]` - octal-based binary representation
- `0b[10101010101]` - binary-based binary reprentation

The data inside of the `[]` represents a single data value of bits.

You can use spaces to make the literals more readable. For example, `0x[ffff ffff]`.

### CellPath

Indexing into values is done by using a cell path. Cell paths are based on the spreadsheet idea where columns have names and rows have numbers. To reach a column, Nushell will use the name of the column. To reach a row, it will use the name of the row.

In this example, we get the 2nd element inside of `$x`:`$x.1`. Rows are 0-based, so the row with number `1` is the second row.

Likewise, `$x.foo` means to reach into `$x` and get the data in column `foo`.

Rows also double as indices into lists. `$x.2` will get the 3rd element of the list.

Column names also double as fields in structs. `$x.bar` will return the value in the field named `bar` inside of the struct held by `$x`.

### CustomValue

## Numbers and Arithmetic

### Arithmetic Operators

- `+` - Plus / Addition
- `-` - Minus / Subtraction
- `*` - Multiply
- `/` - Divide
- `=` - Equal
- `!=` - Not Equal
- `//` - Floor Division
- `<` - Less Than
- `>` - Greater Than
- `<=` - Less Than or Equal To
- `>=` - Greater Than or Equal To
- `mod` - Modulo
- `**` - Pow

### Bitwise Operators

Nushell provides support for these bitwise operators:

- `bit-or` - bitwise or
- `bit-xor` - bitwise exclusive or
- `bit-and` - bitwise and
- `bit-shl` - bitwise shift left
- `bit-shr` - bitwise shift right

### Other operators

- `=~` - Regex Match / Contains
- `!~` - Not Regex Match / Not Contains
- `in` - In / Contains (doesn't use regex)
- `not-in` - Not In / Not Contains (doesn't use regex)
- `starts-with` - Starts With
- `ends-with` - Ends With
- `&&` - And
- `and` - And
- `||` - Or
- `or` - Or

## Flow Control

### if

The`if` expression evaluates a condition and then chooses to run a block based on the condition.

For example, you can print "yes", based on a true condition:

```nu
if true {
  print yes
} else {
  print no
}
```

Alternately, you can print "no", based on a false condition:

```nu
if false {
  print yes
} else {
  print no
}
```

The `else` part of `if` is optional. If not provided, if a condition is false, the `if` expression returns `null`.

The code that follows the `else` is an expression rather than a block, allowing any number of follow-on `if` expressions as well as other types of expressions. For example, this expression returns 100: `if false { 1 } else 100`.

### each

### for

### each while

### window

### skip until

### take until

## Custom Commands

### Defining Custom Commands

### Calling Custom Commands

### Function Scope

### Closures

### Arguments & Parameters

## Declarations

## Variable Scope

## Literals

### Text Formatting

## String literals

- Maybe it's the backtick quote?
- Should we have a `r"some\nliteral\tstring"` ala rust?
- Should we have something like python's triple double quotes like `"""` which helps with multi-line strings and also does sring literal thigns?

## String interpolation

String interpolation uses either double quotes or single quotes with a preceeding dollar sign. However, when using double quotes, you have to be aware that escapes will be recognized and interpreted. (I(darren) really don't like that people have to be aware of this functionality with double quotes.)

Example:

```nu
let name = "nushell"
print $"My favorite shell is ($name)"
```

There are a couple things to be aware of in the above example.

1. The trigger to recognize a string interpolated string is the `$` sign.
2. Double quotes are use here but single quotes could be used as well. User be aware of escapes if using double quotes.
3. Access variable names needs to be parenthesis as `$name` is in the example.

### Executing String Interpolated strings

Sometimes you need to build a path to execute external commands.

Example:

```nu
let path1 = "/part1"
let path2 = "/part2"
let fn = "filename"

^$"($path1)($path2)($fn)"
```

The caret `^` before the string interpolation symbol `$` allows that external command to be exectued.

## String Quoting

### Double quotes

Double quotes are used as you would think normal quotes should be used except for one thing. That one thing is escapes can be recognized and interpreted with double quotes.

Example:

```nu
"\e[31mHello\e[35m Nushell\e[0m"
```

That would be interpreted with `Red` foreground Hello and `Purple aka Magenta` foreground Nushell becuase:

1. `\e` means insert and `escape` character
2. `[31m` means use whatever is defined as `red` foreground in your terminal
3. `[35m` means use whatever is defined as purple, sometimes called magenta, foreground in your terminal.
4. `[0m` means reset all ansi escape sequences.

There are other escapes that are defined by nushell found in parser.rs around line 2426 in the `unescape_string` function.

Recognized nushell escapes:

- " - double quote
- ' - single quote
- \ - back slash
- / - forward slash
- ( - left parenthesis
- ) - right parenthesis
- { - left brace
- } - right brace
- $ - dollar sign
- ^ - caret symbol
- \# - hash / pound sign
- \| - pipe character
- ~ - tilde
- a - bel
- b - bs aka backspace
- e - escape
- f - form feed
- n - line feed aka new line
- r - carriage return
- t - tab aka horizontal tab
- uXXXX - unicode hex value for a char - requires 4 chars. It would be nice if \uXX was acceptible as well.

Double quotes work within string interpolation as well.

### Single quotes

The single quote character should work identicaly to the double quote _except_ that escape characters will not be recognized and interpreted.

Single quotes work within string interpolation as well.

### Backtick quotes

Backtick quotes are something I'm still fuzzy on. Originally I thought they were supposed to be used as our string literal representation of quotes. Maybe that's what it is now. I'm not sure to tell.

Here are some ways we see/use backtick quotes.

1. If you're using tab to complete directories with spaces, backtick quotes will be used to wrap the string. The only issue with this is that when you want to complete the next folder after one with a space, you have to move the cursor backward inside the last backtick quote before you hit tab again to complete the next level or file.
2. Backtick quotes do not work in string interpolation. Should they?
3. I believe backtick quotes can be used the same way as double quotes and single quotes but they do not recognize and interpret escapes.
4. Another definition from Kubouch is backtick quotes are supposed to be like `bare words` that support spaces. As an example JT just landed a PR that allows backtick quotes to autocd. So, in Windows, if you're at `C:\` you could type `` `Program Files` `` and it would change to that directory.

## Nested Quotes

Sometimes you need to nest quotes. I think this could use some work because sometimes I start with single quotes on the outside and have to reverse course to use double quotes on the outside. I'm not sure if backtick quotes can participate here.

Example:

```nu
"This is just a string 'that needs an inner part quoted'"
'This is also a string "that needs an inner part quoted"'
```

The key to always remember is that double quotes recognize and interpret escapes so if you have any `\` characters in your string, they will be interpreted as excapes. The following is an example of a question we get frequently on Discord.

```nu
Why doesn't this work?
> cd "C:\Program Files\somedir"
```

It doesn't work because it sees `\P` and `\s` as escapes that are not recognized.

## Bare word

## Helpers

### debug

### metadata

### error make

## Brackets

### `(` and `)`

### `[` and `]`

### `{` and `}`

## Pipelines

### The pipeline special variable `$in`

### Best practices for pipeline commands

### Interaction with unix pipes

### Handling stderr

## Nu as a shell

### Name resolution for commands

### invoking external commands

#### Unix

#### Windows
