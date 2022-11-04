# Working with strings

Strings in Nushell help to hold text data for later use. This can include file names, file paths, names of columns,
and much more. Strings are so common that Nushell offers a couple ways to work with them, letting you pick what best
matches your needs.

## Single-quoted string

The simplest string in Nushell is the single-quoted string. This string uses the `'` character to surround some text. Here's the text for hello world as a single-quoted string:

```sh
> 'hello world'
hello world
```

Single-quoted strings don't do anything to the text they're given, making them ideal for holding a wide range of text data.

## Double-quoted strings

For more complex strings, Nushell also offers double-quoted strings. These strings use the `"` character to surround text. They also support the ability escape characters inside the text using the `\` character.

For example, we could write the text hello followed by a new line and then world, using escape characters and a double-quoted string:

```sh
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

## Bare strings

Like other shell languages (but unlike most other programming languages) strings consisting of a single 'word' can also be written without any quotes:
```sh
> print hello
hello
> [hello] | describe
list<string>
```
But be careful - if you use a bare word plainly on the command line (that is, not inside a data structure or used as a command parameter) or inside round brackets `(` `)`, it will be interpreted as an external command:
```
> hello
Error: nu::shell::external_command

  × External command failed
   ╭─[entry #5:1:1]
 1 │ hello
   · ──┬──
   ·   ╰── executable was not found
   ╰────
  help: program not found
```

Also, many bare words have special meaning in nu, and so will not be interpreted as a string:
```
> true | describe
bool
> [true] | describe
list<bool>
> [trueX] | describe
list<string>
> trueX | describe
Error: nu::shell::external_command

  × External command failed
   ╭─[entry #5:1:1]
 1 │ trueX | describe
   · ──┬──
   ·   ╰── executable was not found
   ╰────
  help: program not found
```
So, while bare strings are useful for informal command line usage, when programming more formally in nu, you should generally use quotes.


## String interpolation

More complex string use cases also need a new form of string: string interpolation. This is a way of building text from both raw text and the result of running expressions. String interpolation combines the results together, giving you a new string.

String interpolation uses `$" "` and `$' '` as ways to wrap interpolated text.

For example, let's say we have a variable called `$name` and we want to greet the name of the person contained in this variable:

```sh
> let name = "Alice"
> $"greetings, ($name)"
greetings, Alice
```

By wrapping expressions in `()`, we can run them to completion and use the results to help build the string.

String interpolation has both a single-quoted, `$' '`, and a double-quoted, `$" "`, form. These correspond to the single-quoted and double-quoted strings: single-quoted string interpolation doesn't support escape characters while double-quoted string interpolation does.

As of version 0.61, interpolated strings support escaping parentheses, so that the `(` and `)` characters may be used in a string without Nushell trying to evaluate what appears between them:

```sh
> $"2 + 2 is (2 + 2) \(you guessed it!)"
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

```sh
> "hello world" | str contains "w"
true
```

### Trimming Strings

You can trim the sides of a string with the [`str trim`](commands/str_trim.md) command. By default, the [`str trim`](commands/str_trim.md) commands trims whitespace from both sides of the string. For example:

```sh
> '       My   string   ' | str trim
My   string
```

You can specify on which side the trimming occurs with the `--right` and `--left` options. (`-r` and `-l` being the short-form options respectively)

To trim a specific character, use `--char <Character>` or `-c <Character>` to specify the character to trim.

Here's an example of all the options in action:

```sh
> '=== Nu shell ===' | str trim -r -c '='
=== Nu shell
```

### Substrings

Substrings are slices of a string. They have a startpoint and an endpoint. Here's an example of using a substring:

```sh
> 'Hello World!' | str index-of 'o'
4
> 'Hello World!' | str index-of 'r'
8
> 'Hello World!' | str substring '4,8'
o Wo
```

### String padding

With the [`str lpad`](commands/str_lpad.md) and [`str rpad`](commands/str_rpad.md) commands you can add padding to a string. Padding adds characters to string until it's a certain length. For example:

```sh
> '1234' | str lpad -l 10 -c '0'
0000001234
> '1234' | str rpad -l 10 -c '0' | str length
10
```

### Reversing Strings

This can be done easily with the [`str reverse`](commands/str_reverse.md) command.

```sh
> 'Nushell' | str reverse
llehsuN
> ['Nushell' 'is' 'cool'] | str reverse
╭───┬─────────╮
│ 0 │ llehsuN │
│ 1 │ si      │
│ 2 │ looc    │
╰───┴─────────╯
```

## String Parsing

With the [`parse`](commands/parse.md) command you can parse a string into columns. For example:

```sh
> 'Nushell is the best' | parse '{shell} is {type}'
╭───┬─────────┬──────────╮
│ # │  shell  │   type   │
├───┼─────────┼──────────┤
│ 0 │ Nushell │ the best │
╰───┴─────────┴──────────╯
> 'Bash is kinda cringe' | parse --regex '(?P<shell>\w+) is (?P<type>[\w\s]+)'
╭───┬───────┬──────────────╮
│ # │ shell │     type     │
├───┼───────┼──────────────┤
│ 0 │ Bash  │ kinda cringe │
╰───┴───────┴──────────────╯
```

## Converting Strings

There are multiple ways to convert strings to and from other types.

### To String

1. Using [`into string`](commands/into_string.md). e.g. `123 | into string`
2. Using string interpolation. e.g. `$'(123)'`
3. Using [`build-string`](commands/build-string.md). e.g. `build-string (123)`

### From String

1. Using [`into <type>`](commands/into.md). e.g. `'123' | into int`

## Coloring Strings

You can color strings with the [`ansi`](commands/ansi.md) command. For example:

```sh
> $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold` makes the text a bold purple
`ansi reset` resets the coloring to the default. (Tip: You should always end colored strings with `ansi reset`)
