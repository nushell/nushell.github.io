# String

|                       |                                                              |
| --------------------- | ------------------------------------------------------------ |
| **_Description:_**    | A series of characters that represents text                  |
| **_Annotation:_**     | `string`                                                     |
| **_Literal Syntax:_** | See [Working with strings](/book/working_with_strings.md)    |
| **_Casts:_**          | [`into string`](/commands/docs/into_string.md)               |
| **_See also:_**       | [Handling Strings](/book/loading_data.md#handling-strings)   |
|                       | [Types of Data - String](/book/types_of_data.md#text-strings) |

## Language Notes:

- Nu supports Unicode strings as the basic text type.
- Internally strings are UTF-8 encoded, to ensure a consistent behavior of string operations across different platforms and simplify interoperability with most platforms and the web.
- They have an associated length and do not rely on the C-style null character for termination.
- As strings have to be valid UTF-8 for effective string operations, they can not be used to represent arbitrary binary data. For this please use the [binary data type](binary.md).

- Different display operations might impose limitations on which non-printable or printable characters get shown. One relevant area are the ANSI escape sequences that can be used to affect the display on the terminal. Certain operations may choose to ignore those.

- String commands that work with lengths or positions, such as `str length`, `str substring` and `str index-of`, count UTF-8 bytes by default. Use their `--grapheme-clusters` (`-g`) flag to count user-perceived characters instead:

  ```nu
  "héllo" | str length
  # => 6
  "héllo" | str length --grapheme-clusters
  # => 5
  ```

## Common commands that work with `string`

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

## Common operators that work with `string`

- `+`, `++` : Concatenate two strings
- `+=`, `++=` : Mutates a string variable by concatenating its right side value.
- `==` : True if 2 strings are equal
- `!=` : True if two strings are not equal
- `>` : True if the left string is greater than the right string
- `>=` : True if the left string is greater or equal than the right string
- `<` : True if the left string is less than the right string
- `<=` : True if the left string is less or equal than the right string
- `=~` / `like`, `!~` / `not-like` : True if the string matches (or does not match) a regular expression
- `starts-with`, `ends-with` (and `not-starts-with`, `not-ends-with`) : Compare the beginning or end of a string
- `in`, `has` (and `not-in`, `not-has`) : Substring check, e.g. `"b" in "abc"` and `"abc" has "b"` are both `true`
