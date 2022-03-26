# Working with strings

Strings in Nushell help to hold text data for later use. This can include file names, file paths, names of columns,
and much more. Strings are so common that Nushell offers a couple ways to work with them, letting you pick what best
matches your needs.

## Single-quoted string

The simplest string in Nushell is the single-quoted string. This string uses the `'` character to surround some text. Here's the text for hello world as a single-quoted string:

```
> 'hello world'
hello world
```

Single-quoted strings don't do anything to the text they're given, making them ideal for holding a wide range
of text data.

## Double-quoted strings

For more complex strings, Nushell also offers double-quoted strings. These strings use the `"` character to surround text. They also support the ability escape characters inside the text using the `\` character.

For example, we could write the text hello followed by a new line and then world, using escape characters and a double-quoted string:

```
> "hello\nworld"
hello
world
```

Escape characters let you quickly add in a character that would otherwise be hard to type.

Nushell currently supports the following escape characters:

  - `\"` - double-quote character
  - `\'` - single-quote character
  - `\\` - backslash
  - `\/` - forward slash
  - `\b` - backspace
  - `\f` - formfeed
  - `\r` - carriage return
  - `\n` - newline (line feed)
  - `\t` - tab
  - `\uXXXX` - a unicode character (replace XXXX with the number of the unicode character)

## String interpolation

More complex string use cases also need a new form of string: string interpolation. This is a way of building text from both raw text and the result of running expressions. String interpolation combines the results together, giving you a new string.

String interpolation uses `$" "` and `$' '` as ways to wrap interpolated text.

For example, let's say we have a variable called `$name` and we want to greet the name of the person contained in this variable:

```
> let name = "Alice"
> $"greetings, ($name)"
greetings, Alice
```

By wrapping expressions in `()`, we can run them to completion and use the results to help build the string.

String interpolation has both a single-quoted, `$' '`, and a double-quoted, `$" "`, form. These correspond to the single-quoted and double-quoted strings: single-quoted string interpolation doesn't support escape characters such as `\n`, while double-quoted string interpolation does. 

Interpolated strings do not currently support any way of escaping parentheses. If you would like to include parentheses in the resulting string, one workaround is to use sub-expressions which evaluate to the `(` or `)` characters, such as [`char lp` and `char rp`](commands/char.md). For example:

```
> $"2 + 2 is (2 + 2) (char lp)you guessed it!(char rp)"
2 + 2 is 4 (you guessed it!)
```

Alternatively, you could compose the string using the [`build-string`](commands/build-string.md) command instead:

```
> build-string "2 + 2 is " (2 + 2) " (you guessed it!)"
2 + 2 is 4 (you guessed it!)
```

## Splitting strings

The [`split row`](commands/split_row.md) command creates a list from a string based on a delimiter.
For example, `let colors = ("red,green,blue" | split row ",")` creates the list `[red green blue]`.

The [`split column`](commands/split_column.md) command will create a table from a string based on a delimiter. For example `let colors = ("red,green,blue" | split column ",")` creates a table, giving only column to each element.

Finally, the [`split chars`](commands/split_chars.md) command will split a string into a list of characters.

## The `str` command

Many string functions are subcommands of the `str` command. You can get a full list using `help str`.

For example, you can look if a string contains a particular character using `str contains`:

```
> "hello world" | str contains "w"
true
```
