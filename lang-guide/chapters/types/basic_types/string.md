# String

What it is: A string is a length of characters like `hello` or `1234`

Annotation: `string`

Nu supports Unicode strings as the basic text type. Internally strings are UTF-8 encoded, to ensure a consistent behavior of string operations across different platforms and simplify interoperability with most platforms and the web.
They have an associated length and do not rely on the C-style null character for termination.
As strings have to be valid UTF-8 for effective string operations, they can not be used to represent arbitrary binary data. For this please use the [binary data type](#binary).

Different display operations might impose limitations on which non-printable or printable characters get shown. One relevant area are the ANSI escape sequences that can be used to affect the display on the terminal. Certain operations may choose to ignore those.

To input string data, different [string literals](#string-literals) supporting escaping and [string interpolation](#string-interpolation) are available.

TBD: On which level string indexing should be performed: bytes or Unicode scalars.

## Casts

The command `into string` will convert other data types into strings.
For a complete list of possible input types see: `help into string`

## Commands that use string

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

## Operators that use string

- `+` : Concatenate two strings
- `+=` : Mutates a string variable by concatenating its right side value.
- `==` : ' True if 2 strings are equal
- `!=` : True if two strings are not equal
- `>` : True if the left string is greater than the right string
- `>=` : True if the left string is greater or equal than the right string
- `<` : True if the left string is less than the right string
- `<=` : True if the left string is less or equal than the right string
