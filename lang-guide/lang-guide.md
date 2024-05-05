# The Nushell Language

## Types in the Nu language

Nu is strongly typed and gradually typed.

- Strongly typed : Types are strictly enforced.
- Gradually typed : A mix between static (types are checked at compile time) type checks and dynamic (types are checked at runtime).

Gradual typing is a clarification of optional typing where the developer
could choose or not choose to add type annotations to declarations. This paper
from Jeremy Siek is here: [What is Gradual Typing?](https://wphomes.soic.indiana.edu/jsiek/what-is-gradual-typing/)

### The infix type operators

- `:` Read as `is type of`
- `->` Read as becomes type of or as `to type of` in custom commands in the return type position

### Type signatures

There are 3 syntactic. forms that can have type signatures:

- variable and parameter declarations
- Input type declarations
- Return type declarations

The following code snippets illustrates these 3 kinds of type signatures

```nu
# Variable declaration
let x: int = 9

# Parameter declaration in custom commands
def my-command [x: int, y: string] { }

# Input type declaration
def my-filter []: list { }

# Return type declaration
def "my make" [] -> list { }
```

For a further discussion on custom command signatures please refer to: [Custom Commands](https://www.nushell.sh/book/custom_commands.html)
And also: [Command Signature](https://www.nushell.sh/book/command_signature.html)

#### Kinds of type signatures

There are 3 forms of valid type signatures in Nu:

- Basic: E.g. int, bool, string etc.
- Compound:
  - `list<string>`,
    `record<type: int, bar: string>`
- Multiple: Enumerations of the above kinds delimited by commas `, `
  - `<string, int>`
  - These can only be used for return types

### Custom command parameters and flags

This section does not enumerate all of the various ways to create parameters
and flags to custom commands. Here we only discuss the type annotation to both
types of parameters.

#### Parameters

If a parameter to a custom command or a closure is type annotated then it will
have the `:` operator after the name followed by the type signature
and before any default value.

E.g. Here is a fully articulated parameter with a type annotation.

```nu
def fully [some?: int = 9] { $some }
```

The above command has an optional parameter of type `int` with a default value of 9.

#### Type annotations for flags.

If a flag has a type annotation then it expects an argument matching that type
which can be `any` for all types. If the type is missing, then the flag is assumed
to be a either present or not present at the call site.
Thus, within the body of the command the type of that flag's named variable
binding will be `bool` and its value will be `true` if the flag is present
and `false` if not present.

You cannot use the `bool` type as a flag annoatation as that is the same
as the the existence or not of the occurrence of the flag.

### Closure parameters

In Nu, closures have a simpler kind of type annotations for parameters
than custom commands. Basically, closures can have type annotations for their
parameters but not optional or default values.

E.g. An annotated closure:

```nu
let cl = {|x: int, y: string| $"x: ($x), y: ($y)" }
do $cl 88 'hello'
# => x: 88, y: hello
```

### Commands that interact with types

The main type inspector in Nu is the `describe` command that
takes any data type on input and reports its type signature.

E.g.

```nu
[foo bar baz] | describe
# => list<string>
```

#### Commands

- `describe`
- `inspect`
- `help`
- `into (subcommands)`
  - The into commands are used to cast one type into another.
- `ast`
  - In the branches of abstract syntax tree that describe the type of some element

## Basic Types

The items below are from `enum Value`
See: `nushell/crates/nu-protocol/src/value/mod.rs` (about line 47)

### Any

What it is: The `any` type is an universal type that matches anything.

What are possible values: There is no literal version of an `any` type. Any literal value can be assigned to an `any` type.

In other words, the `any` type is a superset of all other types.

Annotation: `any`

#### Example 1:

Declaring an mutable variable that can accept any type.

```nu
let q = false
mut x: any = 12

if $q {
  $x = 'true'
} else {
  $x = 'false'
}
$x
# =>'false' a string
```

#### Example 2:

Create a custom command that takes `any` type and returns `any` type.

```nu
def takes-anything [v: any] -> any {
  $v | describe
}

takes-anything 42
# => int
takes-anything foo
# => string
```

### Bool

What it is: A logical data type that can have only `true` or `false` values.

Annotation: `bool`

#### Literals

- `true`
- `false`

#### Example 1:

```nu
> if true { print hello }
# => hello
```

#### Example 2:

```nu
let truth: bool  = true
> echo $truth
# => true
```

#### Casts

The command `into bool` can convert other data types into bool.
For a complete list see: `help into bool`.

#### Commands that use bool

- `if`, `while`
- `match`
  - in clauses where the expression matches the clause expression, or the `_` value which is always true
- `any`, `all`, `skip until`, `skip while`, `take until`, `take while`
  - when the closure returns bool value
- `where`
- `filter`
  - when closure returns the bool value of true or false
- `is-empty`, `is-not-empty`
- `is-admin`
- `is-terminal`

##### Operators that use bool

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `and`, `or`, `not`
- `in`
- `=~`, `!~` `<regex>`
- `ends-with`, `starts-with`
  - String comparison operators

### Int

What it is: Integer numbers.

Annotation: `int`

Internally represented as a signed 64-bit number with two's complement arithmetic.

Numeric literals without a fractional component will evaluate as `Int`: `1`, `-2`, `1000`

Integers can be created using hex `0xff`, octal `0o234`, binary `0b10101`, and decimal `123`.

Can be used for indexing into `List`s or `String`s

#### Casts

The command `into int` can be used to convert other types of data into integers.
For a full list of possible inputs, see `help into int`

### Float

What it is: Real numeric values using floating point internal arithmetic.

Annotation: `float`

Internally IEEE-754 floats with 64 bit precision.

Literals with a fractional decimal component are evaluated as `Float`: `0.1`, `3.14159`, `-10.4`

TBD: semantics for comparison, NaN/InF. Future hashing.

#### Casts

The command `into float` can be used to convert other data types into floats.
See the command: `help into float` fro a complete list of input data types.

### Filesize

What it is: Specialized numeric type to represent the size of files or a number of bytes.

Annotation: `filesize`

The literals and display representations support both metric prefixes with a base of `1000` and the binary compatible kibibytes, mebibytes, etc. with a base of `1024`

```nu
1 kb
0.2 gb
20 mib
```

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

As with durations, you can make fractional file sizes, and do calculations:

```nu
> 1Gb / 1b
1000000000
> 1Gib / 1b
1073741824
> (1Gib / 1b) == 2 ** 30
true
```

#### Casts

The command `into filesize` will convert a variety of other data types
into a filesize value. For the complete list of inputs see: `help into filesize`.

#### Commands that use filesize

- `ls`
- `du`
- `sys`

Note: The where command and other filters can use filesize in comparison expressions.

##### Operators that use filesize

- `==`, `!=`
- `+`, `-`
- `<`, `<=`, `>`, `>=`

### Duration

What it is: A value representing a unit of passage of time.

Annotation: `duration`

Durations are internally stored as a number of nanoseconds.

##### Literals

to form a Duration literal you need to combine a numeric value with a a unit of time.
The numeric literal part must be a signed integer or floating point number literal.
The unit part must be one of a specific set of strings listed below.

```
<number><unit>

# E.g.

10sec
987us
-34.65day

```

This chart shows all duration units currently supported:

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

You can make fractional durations:

```nu
> 3.14day
3day 3hr 21min
```

And you can do calculations with durations:

```nu
> 30day / 1sec  # How many seconds in 30 days?
# => 2592000
```

Note: Months, years, centuries and milliniums are not precise as to the exact
number of nanoseconds thus are not valid duration literals.You are free to make
your own constants for specific months or years.

#### Casts

The command `into duration` will convert various other data types into a duration. and is quite flexible. For a complete list of possible inputs, see `help into duration`

#### Commands that use duration

- `sleep`
- `where`
  - In the comparison expression
- `ps`
- `sys`

##### Operators that use duration

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `+`, `-`

### Date

What it is: A value representing a specific point in time using international standard date time descriptors.

Annotation: `datetime`

Dates and times are held together in the Date value type. Date values used by the system are timezone-aware, and by default use the UTC timezone.

Dates are in three forms, based on the RFC 3339 standard:

- A date:
  - `2022-02-02`
- A date and time (in GMT):
  - `2022-02-02T14:30:00`
- A date and time with timezone:
  - `2022-02-02T14:30:00+05:00`

#### Casts

The command `into datetime` can be used to convert many other data types
into dates. See: `help into datetime` for a full list of inputs.

#### Commands that use datetime

Many of Nushell's builtin commands are datetime aware and output or use datetimes
for fields and expressions.

- `ls`
- `where`
- `ps`
- `sys`

### Range

What it is: A range describes a range of values from a starting value to an ending value, with an optional stride.

Values are separated by `..` to create a range.

Annotation:`range`

Example 1:

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
# => [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

Ranges can exclude either the `from` or the `to` side of the range:

Numbers from 0 to 10:

```nu
..10
# => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Numbers starting from 1:

```nu
1..
# => infinite range starting at 1
```

Ranges are lazy. They do not generate their values until needed. You can use a range with no specified end point and combine it with a command that takes only the first n elements. For example, you could generate the numbers from 1 to 10 using:

```nu
1.. | take 10
# => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### String

What it is: A string is a length of characters like `hello` or `1234`

Annotation: `string`

Nu supports Unicode strings as the basic text type. Internally strings are UTF-8 encoded, to ensure a consistent behavior of string operations across different platforms and simplify interoperability with most platforms and the web.
They have an associated length and do not rely on the C-style null character for termination.
As strings have to be valid UTF-8 for effective string operations, they can not be used to represent arbitrary binary data. For this please use the [binary data type](#binary).

Different display operations might impose limitations on which non-printable or printable characters get shown. One relevant area are the ANSI escape sequences that can be used to affect the display on the terminal. Certain operations may choose to ignore those.

To input string data, different [string literals](#string-literals) supporting escaping and [string interpolation](#string-interpolation) are available.

TBD: On which level string indexing should be performed: bytes or Unicode scalars.

#### Casts

The command `into string` will convert other data types into strings.
For a complete list of possible input types see: `help into string`

##### Commands that use string

Many commands takes strings as inputs or parameters.
These commands work with strings explicitly

- `str (subcommand)`
  - For a complete list of subcommands, see: `help str`
- `into string`
- `ansi strip`
- `is-empty`
- `is-not-empty`

In addition to the above commands, most other `into <type>` commands take strings
as inputs.

#### Operators that use string

- `+` : Concatenate two strings
- `+=` : Mutates a string variable by concatenating its right side value.
- `==` : ' True if 2 strings are equal
- `!=` : True if two strings are not equal
- `>` : True if the left string is greater than the right string
- `>=` : True if the left string is greater or equal than the right string
- `<` : True if the left string is less than the right string
- `<=` : True if the left string is less or equal than the right string

### Record

What it is: A record is the foundational associative map.

Annotation: `record`

A record contains items of any value that are addressed by a string key. (TBD: complex hashable/equality checkable keys)
The keys maintain the order of insertion or the order defined in a record literal.
Keys are guaranteed to be unique. Inserting twice with the same key will only keep the last insertion or definition.

`{a: b, c: d}`

#### Casts

The command `into record` can be used to convert other data types into records.
See the command: `help into record` fro a complete list of input data types.

#### Commands that use record

Since the record data type is foundational to Nushell's structured nature, many commands use records as inputs or as parameters. See the list of commands for tables because many of those also take records.

Here are a few commands that use records:

- `get`
- `insert`
- `merge`
- `update`
- `upsert`

### List

What it is: Basic collection of values ordered by their insertion.

Annotation: `list`

A list is like a vector or array list in other languages.

0-based indexing to retrieve values.

Lists use either commas or spaces to delimit values.

Examples of lists:

```nu
[1, 2, 3]
[1 2 3]
[1,2,3]
```

Effectively, commas in the above are treated like spaces.

Lists can span multiple lines to enumerate values. For example, this is equivalent to `[1, 2, 3]`:

```nu
[
1
2
3
]
```

#### Commands that use list

Since lists, records and tables form the backbone of Nushell's structured nature,
there are too many commands to list here.

Here are a few

- `any`
- `all`
- `get`
- `select`
- `get`
- `each`, `par-each`, `filter`, `reduce`
- `skip`, `skip until`, `skip while`, `take`, `take until`, `take while`
- `first`, `last`, `length`
- `insert`, `update`, `upsert`, `append`
  See also the `to (subcommands)` and `from (subcommands)` for more examples.
- `where`
- `match`
  - Can destructure a list

##### Operators that use list

- in For set membership
  - `not (12 in [1 2 3])` for inverse set membership

### Table

What it is: A table is a two-dimensional container with both columns and rows.

Annotation: `table`

There are two ways to write a table. These two examples are equivalent:

```nu
[[a, b]; [1, 2], [3, 4]]
```

```nu
[{a: 1, b: 2}, {a: 3, b: 4}]
```

In the first syntax, the headers are separated from the data cells using a semicolon(`;`). The semicolon separator is mandatory in this syntax to create a table. It must follow the headers.

The second syntax is simply a list of records. This plays on the Nushell data model, which sees a list of records as equivalent to a table. This is used in cases where the length of a table may not be known ahead of time. In such a case, a stream of records likewise represents a table.

#### Commands that use table

- `table`
- `ls`
- `ps`
- `sys`
- `select`
- `get`
- `where`
- `range`

Note: Almost all of Nushell's filter commands work with tables
For a longer list see: `help commands | where category == filters`.

### Closure

What it is: A closure is an anonymous function which is also often called a lambda function.

Annotation: `closure`

Closures are used in Nu extensively as parameters to iteration style commands like each, filter and reduce, to name but a few. A closure acts like a custom command that can be invoked either explicitly or by other commands. Closures can take parameters, return values and be passed to commands, either builtin or custom. You cannot pass a closure to an external command, they are reserved only for Nu usage You can also assign a closure to a variable, be included as elements in a list or as a value in a record.

Closures can also consume input from a pipeline. and pass data further to the next item in a pipeline.

As closures are closely related to functions or commands, they can also have parameters that are typed. The special variable $in (the value of
the input from the pipeline) is also available to a closure. You can also pass closures themselves into a pipe line assuming the next command knows how to consume it. Closures can be returned from a custom command and can also be returned from another closure.

#### Declaring a closure

```nu
let cl = {|i: int, j: int| $i + $j }
```

The above example assigns a closure that takes 2 parameters, both int types, and assignns it to the immutable variable `$cl`. The type signatures `: int` are optional.

```nu
# A closure that checks if its parameter is even
#returns a bool either true or false
let evens = {|it| ($it mod 2) == 0 }
```

#### Invoking a closure

```nu
# Assuming $cl is the closure declared above
do $cl 34 8
# => 42
```

Using `$cl` from the previous example, we invoke it with the `do` keyword and pass it integers, 34 and 8. When it runs, it computes the sum and returns 42.

#### Using a closure as a parameter to an iteration command

Let's say we have a list of ints and want to only have a list of even ints.
We can use our `$evens` closure to filter our list.

```nu
# assuming $evens has been declared as above
1..10 | filter $evens
# => [2, 4, 6, 8, 10]
```

#### Capturing values from an outer scope

Closures can also remember values declared in some outer scope and then use them for processing when invoked. If it must be done explicitly. There are some restrictions on the kind of external values that can be closed over. Only immutable variables like those created with the `let` keyword or parameters to a custom command can be captured in a closure. Mutable variables created with the `mut` keyword cannot be captured in a closure. However, you can mutate an `$env` variable if used by the `--env` flag passed to the `do` keyword.

```nu
def "create lambda" [x: int] {
  {|it| $it * $x }
}
let doubler = (create lambda 2)
# Now invoke it with 7
do $doubler 7
# => 14

let tripler = (create lambda 3)
do $tripler 7
# => 21
```

If we try to create a closure that attempts to capture a mutable variable we get a compile error:

```nu
if true {
  mut x = 9
  do {|it| $it + $x }
}
# => Error: Capture of mutable variable.
```

#### Commands that use closure

- `all`
- `any`
- `collect`
- `do`
- `each`
- `explain`
- `filter`
- `group-by`
- `interleave`
- `items`
- `par-each`
- `reduce`
- `skip until`
- `skip while`
- `take until`
- `tee`
- `update`
- `upsert`
- `zip`

Note: This is not a complete list. New commands are being added to Nushell and the new commands might take a closure as a parameter or a flag argument.

### Nothing

What it is: The type `nothing` is to be used to represent the absence of another value. Commands that explicitly do not return a value return `null`.

Annotation: `nothing`

Use as a missing value indicator.

### Binary

What it is: A literal syntax for expressing binary data in your Nushell scripts.

Annotation: `binary`

Nushell offers a way of creating binary literals in your data. These are in one of three ways:

- `0x[ffffffff]` - hex-based binary representation
- `0o[1234567]` - octal-based binary representation
- `0b[10101010101]` - binary-based binary representation

The data inside of the `[]` represents a single data value of bits.

You can use spaces to make the literals more readable. For example, `0x[ffff ffff]`.

#### Casts

The command `into binary` can convert other data types into a binary datatype.
See `help into binary` for a complete list of compatible input data types.

### Glob

What it is: A pattern to match pathnames in a filesystem.

Annotation: `glob`

Nu supports creating a value as a glob, it's similar to string, but if you pass it to some commands that support glob pattern(e.g: `open`), it will be expanded. It's best to see difference between `glob` and `string` by example:

```nu
let f = "a*c.txt"   # a string type.
open $f   # opens a file names `a*c.txt`

let g: glob = "a*c.txt"   # a glob type.
open $g   # opens files matches the glob pattern, e.g: `abc.txt`, `aac.txt`
```

The same rules happened if you are using custom command:

```nu
# open files which match a given glob pattern
def open-files [g: glob] {
    open $g
    # In case if you want to open one file only
    # open ($g | into string)
}

# open one file
def open-one-file [g: string] {
    open $g
    # In case if you want to open with glob pattern
    # open ($g | into glob)
}

# open one file
def open-one-file2 [g] {
    open $g
}
```

You can use `into glob` and `into string` to convert values between `glob` and `string`.

If you pass a `string` or a `bare word` to `builtin commands` which support glob pattern directly(not passing a variable or subexpression etc.), it follows some rules, let's see them by examples:

```nu
open *.txt    # opens all files which ends with `.txt`
open `*.txt`  # it's backtick quoted, it's a bare word, so nu opens all files which ends with `.txt`
open "*.txt"  # it's quoted, opens a file named `*.txt`
open '*.txt'  # it's quoted, opens a file named `*.txt`
```

You can use the `glob` command to expand a glob when needed.

```nu
glob *.nu
# => /home/you/dev/foo.nu /home/you/dev/bar.nu
```

Notice the glob, after expansion, always gets expanded into a list of fully quallified pathanes.

Here is a idiomatic Nu way to get just the simple filenames in the current directory:

```nu
glob -D * | path basename | str join ' '
foo.nu bar.nu
# => foo.nu bar.nu baz.nu
```

Another caveat when using Nushell over traditional shells is the `ls` command.
The ls command only takes a single glob pattern argument. which it internally expands.

```nu
# Try to expand the glob ourselves
ls (glob *.nu)
# Error [TODO: Show the actual error]
```

Globs can also represent directory trees recursively. In Unix like systems you might use a combination of the `find` and `xargs` commands to operate on directory trees. In Nushell, it is more idiomatic to use this pattern:

```nu
# Nostalgic for the Good Ole DOS days?
glob **/*.txt | each {|p| $p | path split } | each {|l| $l | str join '\' } | each {|p| $p | str upcase }
# upper case pathnames
```

#### Casts

Using the `into glob` command, you can convert other types like strings into globs.

#### Using globs as a first class object

Globs can be saved in a variable, passed to a custom command and returned from a custom command.

```nu
let g: glob = **/*.nu
glob $g
# Returns list of pathnames
```

#### Escaping globs

Sometimes you might want to not let a command expand a possible glob pattern before executing. You can use the `str escape-glob` command for this.

Note: As of Release 0.91.0 of Nu, `str escape-glob` is deprecated.

As of release 0.91.0, if you pass a string variable to commands that support glob patterns, then Nushell won't auto-expand the glob pattern.

#### Commands that use glob

- `cp`
- `du`
- `ls`
- `glob`
- `mv`
- `rm`

### CellPath

What it is: An expression to reach into a structured value and return the inner value, in whole or in part.

Annotation: `cell-path`

Indexing into values is done by using a cell path. Cell paths are based on the spreadsheet idea where columns have names and rows have numbers. To reach a column, Nushell will use the name of the column. To reach a row, it will use the name of the row.

In this example, we get the 2nd element inside of `$x`:`$x.1`. Rows are 0-based, so the row with number `1` is the second row.

Likewise, `$x.foo` means to reach into `$x` and get the data in column `foo`.

Rows also double as indices into lists. `$x.2` will get the 3rd element of the list.

Column names also double as fields in records. `$x.bar` will return the value in the field named `bar` inside of the record held by `$x`.

You can create cell paths as deeply nested as you need, simply add a period between parts.

For example, assume you want the 3rd element of the column temps in the 4th row of the following table:

```nu
# Temp values captured at 5 locations over a span of 4 days
let data = [[date temps conditions];
[2022-02-01T14:30:00+05:00,[    39.24,    42.94,    16.21,    31.24,    38.65  ], , 'good'],
[2022-02-02T14:30:00+05:00,[    39.24,    42.94,    16.21,    31.24,    38.65], 'sunny'],
[2022-02-03T14:30:00+05:00,[    19.17,    22.67,    42.42,    41.76,    24.52  ] , 'cloudy'],
[2022-02-04T14:30:00+05:00,[39.24,    42.94,    16.21,    31.24,    38.65  ], 'windy'],
]

# Get the 3rd temp from the 4th row of  the table:
$data | get $.3.temps.2
# => 16.21
```

Note that we can also represent cell paths with the leading `$.`. In the above example, the cell path could have been written as `$data | get 3.temps.2` without the leading `$.`. However, if assigning a cell path to a variable that begins with a numerical index, then you must use the leading `$.` syntax.

```nu
# Correct
let cp: cell-path = $.0.foo
# Error
let cp: cell-path = 0.foo
```

This does not affect using cell paths s arguments to a custom command.

#### Optional cell paths

By default, cell path access will fail if it can't access the requested row or column. To suppress these errors, you can add a `?` to a cell path member to mark it as optional:

Using the temp data from above:

```nu
let cp: cell-path = $.temps?.1 # only get the 2nd location from the temps column

# Ooops, we've removed the temps column
$data | reject temps | get $cp
```

By default missing cells will be replaced by null.

#### Using cell paths with tables

The order of parts of a cell path might depend on the structure of the data
you are trying to extract from. Note that the above table could also be accessed with

```nu
let cp = $.temps.0.2
```

In this case, the first part: `$.temps` will return a list of the entire temps column from the table. Then the `.0` part will get the list in that row and the `.2` part will get the 3rd item from that list.

#### Using cell-path as a type annotation

Let's say we wanted our own version of the versatile `get` command.

```nu
def my-get [p: cell-path] {
  get $p
}
# Now call it
[1 2 3 4] | my-get 2
# => 3
# structured data
{foo: 1, bar: { baz: {quo: 4}}} | my-get bar.baz.quo
# => 4
# with the $ prefix
{foo: 1, bar: { baz: {quo: 4}}} | my-get $.bar.baz.quo
# => 4
# Create a var: $p
let p: cell-path = $.bar.baz.quo
# works so far
# let's try for standard get
{foo: 1, bar: { baz: {quo: 4}}} | get $p
# => 4
# Now with my-get
{foo: 1, bar: { baz: {quo: 4}}} | my-get $p
# => 4
```

#### Casts

Cell paths are not restricted to just literal values in your program source. You can also construct them on the fly with the `into cell-path` command.

For example, you could construct the cell path in the temp data programmatically with this code which knows that the location desired is for Grand Rapids, Mich., U.S.A.

```nu
let grr = 2 # using IATA codes for variable names
let cp: cell-path = ([3, temps, $grr] | into cell-path)
$data | get $cp
# returns just temps for GRR
```

See `help into cell-path` for full description and further examples.

## Types that cannot be used to declare variables

These type annotations can be used for custom command signatures but
cannot be used to type variables.

### Path

What it is: This is a string that will be expanded into a fully qualified pathname when passed to a command or closure.

Annotation: `path`

Example 1:

You can easily recreate the `realpath` command from some Linux distros:

```nu
def realpath [p: path] { $p }
cd /usr/bin
realpath sh
/usr/bin/sh
```

#### Casts

There is no `into path` command, but these 2 commands might fit the bill:

- `path expand`
- `path join`

#### Commands that use path

- `path (subcommands)`
  - See: `help path` for a full list

## Other data types

### Lazy Make

What it is: A type of record that invokes a closure when a field is requested.

Annotation: None.

A lazy record behaves much like a standard record, but whenever its specific columns are requested, a closure is called instead of just returning the field's value. The key is passed to the closure so it can determine what to return when that key is requested, say by the `get` command.

There is only one closure for the entire record.

There is only one way to create a lazy record by using the `lazy make` command.

#### Example 1

```nu
  > let lr = lazy make --columns ["haskell", "futures", "nushell"] --get-value { |lazything| $lazything + "!" }
# Get nushell field
$lr.nushell
# => 'nushell!'
```

#### How to discriminate between fields in the lazy record

That is up to you as the value of the key is passed to the closure when ever the key is requested. One way to do something different is to use a match expression in the body of the closure:

#### Example 2

```nu
# Make a lazy record that performs different actions depending on the value of the key:
let lr = lazy make -c [coke pepsi juice]  -g {|drink|
  match $drink {
    'coke' => "No Coke, Pepsi",
    'pepsi' => "One Pepsi",
    _ => $"Look, we just have Pepsi, no ($drink)"
  }
}
$lr | get coke
# => 'No Coke, Pepsi'
```

#### Using lazy records with cell paths

A lazy record will invoke the closure when operated on in a cell path context. The value of the result will be determined by the result of calling the closure and passing the key of the field as a parameter.

Keeping this in mind, if the closure returns some kind of Nu structured data that also participates in cell path contexts, then further parts of the cell path will continue to work.

####nExample 3

```nu
# Create a lazy record that returns a different record depending on which field
# is requested:
let lr = lazy record   -c [rec1, rec2] -g {|k|
  if $k == 'rec1' {
    {type: orange, color: orange}
  } else if $k == 'rec2' {
    {type: apple, color: red}
  }
}

# Now inspect it with cell paths
$lr.rec1.type
# => orange
$lr.rec2.color
# => red
```

## Types not exposed to scripts

the following data types are valid Nushell data types but cannot be declared in user scripts. They are used by Nushell internally or by plugins or commands compiled in Nushell like DataFrames and SQLite database.

### Error

What it is: The data type generated by the `error make` command and other internal commands.

Annotation: `error`

At the present time, this data type is not useful as a proper Nushell data type. When the `error make` command is called, the system throws an exception so you cannot really capture the actual value generated by the `error make` command.

If you surround the code that might potentially throw such an error with a try/catch code block, the error, if thrown will be captured by the catch sub-expression. The parameter passed to the closure given to the catch expression, is a record data type, not an error type.

The error annotation can be used to type a custom command parameter, or the command's return type. It cannot be used to type either a mutable or innutable variable nor the input type for a custom command. But doing so has no effect.

This code snippet shows how to detect the error data type from within Nushell:

```nu
do { error make {msg: 'can we see this?'} } | describe
error
```

### CustomValue

What it is: An opaque data type that is used internal to Nushell by compiled in commands or plugins.

Annotation: None

Custom values are values that might be created vy Nushell internal commands or plugins. For instance, a plugin might generate a custom value that encodes data in a binary format or some other data type like structured data used by DataFrames or SQLite.

Note: Custom values used by external commands are not this data type.

You might encounter a custom value in your interaction with parts of Nushell. Depending on the specific example, you should let the command handle it as described in the help documentation for that command or plugin.

There is not necessarily a string representation of any custom value.

#### Examples of Custom Values you might encounter

## The SQLite example.

```nu
[[a b]; [c d] [e f]] | into sqlite test.db
open test.db | describe
# => SQLiteDatabase
```

The output from describe is `SQLiteDatabase`, which is a CustomValue data type.

The dataframe example:

Note: You need to have dataframes compiled in Nushell for the following example to work. See [Dataframes: Nushell](https://www.nushell.sh/book/dataframes.html)

```nu
ls | dfr into-df | describe
# => dataframe
```

### Block

What it is: A syntactic. form used by some Nushell keywords.

A block is any Nushell code enclosed in curly braces: `{`, `}` but only when used in some specific Nushell constructs. In other cases code enclosed between braces is a closure.

A block is not a data type like a closure and cannot be used to type a variable or custom command parameter, its input type or its return type. You will get a type error if you try this.

Note: A closure that takes no parameters may look like a block but is actually a closure.

E.g.

```nu
{ echo foo } | describe
# => closure
# An alternate way to write the same thing:
{|| echo foo } | describe
# => closure
```

A block establishes a new variable scope. Variables defined within the new scope having the same name as a variable in an outer scope will alias that name for the lifetime of that block's scope.

E.g.

```nu
# Outer scope:
let x: int = 9
if true {
  # inner scope
  let x: string = '8'
  $x | describe
  # => string
}
echo $x
# => 9
```

#### Mutable variables

Unlike closures, mutable variables are exposed within the inner scope of the block and can be modified. Once modified, the value of the mutable variable is changed to that it was set in the scope of the block.

E.g.

```nu
# This won't work
mut x = 9
do { $x += 1 }
# => Error: Capture of mutable variable.
# But this will work:
if true { $x += 1 }
# => 10
```

Note: Aliasing still occurs within the block:

```nu
mut x = 9
if true { mut x = 8; $x += 100; echo $x }
# => 108
echo $x
# => 9
```

These are the Nushell constructs that use a block

- `if`/`else`
- `loop`
- `while`
- `for`
- `try`
  - But not the body of the catch clause which is always a closure

Note: For both the if/else and try statements, the value of the last expression in the block for whichever clause is executed is returned. This is not true
for any of the looping constructs. If you try to assign the result of calling a for or while loop the type of the result will always be `nothing`.

To capture the result of a loop, you can define a mutable variable before the loop and mutate it inside the body of the loop. However, the more idiomatic Nushell way to do it is with a command like `each` which takes a closure. The last expression evaluated in the closure is returned and available to further items in the pipeline.

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

The `if` expression evaluates a condition and then chooses to run a block based on the condition.

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
- Should we have something like python's triple double quotes like `"""` which helps with multi-line strings and also does string literal things?

## String interpolation

String interpolation uses either double quotes or single quotes with a preceding dollar sign. However, when using double quotes, you have to be aware that escapes will be recognized and interpreted.

#### Example:

```nu
let name = "Nushell"
print $"My favorite shell is ($name)"
```

There are a couple things to be aware of in the above example.

1. The trigger to recognize a string interpolated string is the `$` sign.
2. Double quotes are used here, but single quotes could be as well. Be aware of escapes when using double quotes.
3. Accessed variable names need to be in parentheses as `$name` is in the example.

### Executing String Interpolated strings

Sometimes you need to build a path to execute external commands or build command arguments.

#### Example:

```nu
let path1 = "/part1"
let path2 = "/part2"
let fn = "filename"
let arguments = ["arg1", "-a", "arg2"]

^$"($path1)($path2)($fn)" ...$arguments
```

The caret `^` before the string interpolation symbol `$` allows that external command to be executed.

## String Quoting

### Double quotes

Double quotes are used as you would normal quotes, except for one thing: escapes can be recognized and interpreted with double quotes.

Example:

```nu
"\e[31mHello\e[35m Nushell\e[0m"
```

This would be interpreted as a red foreground `Hello` and a magenta/purple foreground `Nushell` because:

1. `\e` means insert an `escape` character
2. `[31m` means use whatever is defined as `red` foreground in your terminal
3. `[35m` means use whatever is defined as `magenta/purple` foreground in your terminal.
4. `[0m` means reset all ANSI escape sequences.

There are other escapes defined by Nushell found in [parser.rs](https://github.com/nushell/nushell/blob/main/crates/nu-parser/src/parser.rs#L2496) around line 2500 in the `unescape_string` function.

Recognized Nushell escapes:

- `"` - Double quote
- `'` - Single quote
- `\` - Back slash
- `/` - Forward slash
- `(` - Left parenthesis
- `)` - Right parenthesis
- `{` - Left brace
- `}` - Right brace
- `$` - Dollar sign
- `^` - Caret symbol
- `#` - Hash / pound sign
- `|` - Pipe character
- `~` - Tilde
- `a` - Bel
- `b` - Bs aka Backspace
- `e` - Escape
- `f` - Form feed
- `n` - Line feed aka New Line
- `r` - Carriage return
- `t` - Tab aka Horizontal Tab
- `uXXXX` - Unicode hex value for a char - requires 4 chars. It would be nice if \uXX was acceptable as well.

Double quotes work within string interpolation as well.

### Single quotes

The single quote character should work identically to the double quote _except_ that escape characters will not be recognized and interpreted.

Single quotes work within string interpolation as well.

### Backtick quotes

Backtick quotes are something I'm still fuzzy on. Originally I thought they were supposed to be used as our string literal representation of quotes. Maybe that's what it is now. I'm not sure to tell.

Here are some ways we see/use backtick quotes.

1. If you're using Tab to complete directories with spaces, backtick quotes will be used to wrap the string. The only issue with this is that when you want to complete the next folder after one with a space, you have to move the cursor backward inside the last backtick quote before you hit tab again to complete the next level or file.
2. Backtick quotes do not work in string interpolation. Should they?
3. I believe backtick quotes can be used the same way as double quotes and single quotes but they do not recognize and interpret escapes.
4. Another definition from Kubouch is backtick quotes are supposed to be like `bare words` that support spaces. As an example Sophia just landed a PR that allows backtick quotes to autocd. So, in Windows, if you're at `C:\` you could type `` `Program Files` `` and it would change to that directory.

## Nested Quotes

Sometimes you need to nest quotes. I think this could use some work because sometimes I start with single quotes on the outside and have to reverse course to use double quotes on the outside. I'm not sure if backtick quotes can participate here.

#### Example:

```nu
"This is just a string 'that needs an inner part quoted'"
'This is also a string "that needs an inner part quoted"'
```

The key to always remember is that double quotes recognize and interpret escapes so if you have any `\` characters in your string, they will be interpreted as escapes. The following is an example of a question we get frequently on Discord.

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

### Interaction with Unix pipes

### Handling stdout and stderr

You can handle stderr in multiple ways:

1. Do nothing, stderr will be printed directly
2. Pipe stderr to the next command, using `e>|` or `e+o>|`
3. Redirect stderr to a file, using `e> file_path`, or `e+o> file_path`
4. Use `do -i { cmd } | complete` to capture both stdout and stderr as structured data

For the next examples, let's assume this file:

```nushell
# demo.nu
print "foo"
print -e "barbar"
```

It prints `foo` to stdout and `barbar` to stderr. The following table illustrates the differences between the different redirection styles:

Redirection to a pipeline:

| type   | command                                     | `$result` contents | printed to terminal |
| ------ | ------------------------------------------- | ------------------ | ------------------- |
| \|     | `let result = nu demo.nu \| str upcase`     | "FOO"              | "barbar"            |
| e>\|   | `let result = nu demo.nu e>\| str upcase`   | "BARBAR"           | "foo"               |
| o+e>\| | `let result = nu demo.nu e+o>\| str upcase` | "FOO\nBARBAR"      | nothing             |

Redirection to a file:

| type           | command                    | `file.txt` contents | printed to terminal |
| -------------- | -------------------------- | ------------------- | ------------------- |
| o> file_path   | `nu demo.nu o> file.txt`   | "foo"               | "barbar"            |
| e> file_path   | `nu demo.nu e> file.txt`   | "barbar"            | "foo"               |
| o+e> file_path | `nu demo.nu o+e> file.txt` | "foo/nbarbar"       | nothing             |

`complete` command:

| type           | command                                      | `$result` contents                       |
| -------------- | -------------------------------------------- | ---------------------------------------- |
| use `complete` | `let result = do { nu demo.nu } \| complete` | record containing both stdout and stderr |

Note that `e>|` and `o+e>|` only work with external command, if you pipe internal commands' output through `e>|` and `o+e>|`, you will get an error:

```
❯ ls e>| str length
Error:   × `e>|` only works with external streams
   ╭─[entry #1:1:1]
 1 │ ls e>| str length
   ·    ─┬─
   ·     ╰── `e>|` only works on external streams
   ╰────

❯ ls e+o>| str length
Error:   × `o+e>|` only works with external streams
   ╭─[entry #2:1:1]
 1 │ ls e+o>| str length
   ·    ──┬──
   ·      ╰── `o+e>|` only works on external streams
   ╰────
```

You can also redirect `stdout` to a file, and pipe `stderr` to next command:

```
nu demo.nu o> file.txt e>| str upcase
nu demo.nu e> file.txt | str upcase
```

But you can't use redirection along with `o+e>|`, because it's ambiguous:

```
nu demo.nu o> file.txt o+e>| str upcase
```

Also note that `complete` is special, it doesn't work with `e>|`, `o+e>|`.

## Nu as a shell

### Name resolution for commands

### invoking external commands

#### Unix

#### Windows

Your mileage might vary.
