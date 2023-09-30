# Working with strings

Strings in Nushell help to hold text data for later use. This can include file names, file paths, names of columns,
and much more. Strings are so common that Nushell offers a couple ways to work with them, letting you pick what best
matches your needs.

## String formats at a glance

| Format of string            | Example                 | Escapes                   | Notes                                                                  |
| --------------------------- | ----------------------- | ------------------------- | ---------------------------------------------------------------------- |
| Single-quoted string        | `'[^\n]+'`              | None                      | Cannot contain any `'`                                                 |
| Backtick string             | <code>\`[^\n]+\`</code> | None                      | Cannot contain any backticks `                                         |
| Double-quoted string        | `"The\nEnd"`            | C-style backslash escapes | All backslashes must be escaped                                        |
| Bare string                 | `ozymandias`            | None                      | Can only contain "word" characters; Cannot be used in command position |
| Single-quoted interpolation | `$'Captain ($name)'`    | None                      | Cannot contain any `'` or unmatched `()`                               |
| Double-quoted interpolation | `$"Captain ($name)"`    | C-style backslash escapes | All backslashes and `()` must be escaped                               |

## Single-quoted strings

The simplest string in Nushell is the single-quoted string. This string uses the `'` character to surround some text. Here's the text for hello world as a single-quoted string:

```sh
> 'hello world'
hello world
> 'The
end'
The
end
```

Single-quoted strings don't do anything to the text they're given, making them ideal for holding a wide range of text data.

## Backtick-quoted strings

Single-quoted strings, due to not supporting any escapes, cannot contain any single-quote characters themselves. As an alternative, backtick strings using the <code>`</code> character also exist:

```sh
> `no man's land`
no man's land
> `no man's
land`
no man's
land
```

Of course, backtick strings cannot contain any backticks themselves. Otherwise, they are identical to single-quoted strings.

## Double-quoted Strings

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
- `\u{X...}` - a single unicode character, where X... is 1-6 hex digits (0-9, A-F)

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

## Strings as external commands

You can place the `^` sigil in front of any string (including a variable) to have Nushell execute the string as if it was an external command:

```sh
^'C:\Program Files\exiftool.exe'

> let foo = 'C:\Program Files\exiftool.exe'
> ^$foo
```

You can also use the [`run-external`](/commands/docs/run-external.md) command for this purpose, which provides additional flags and options.

## Appending and Prepending to strings

There are various ways to pre, or append strings. If you want to add something to the beginning of each string closures are a good option:

```sh
['foo', 'bar'] | each {|s| '~/' ++ $s} # ~/foo, ~/bar
['foo', 'bar'] | each {|s| '~/' + $s} # ~/foo, ~/bar
```

You can also use a regex to replace the beginning or end of a string:

```sh
['foo', 'bar'] | str replace -r '^' '~/'# ~/foo, ~/bar
['foo', 'bar'] | str replace -r '$' '~/'# foo~/, bar~/
```

If you want to get one string out of the end then `str join` is your friend:

```sh
"hello" | append "world!" | str join " " # hello world!
```

You can also use reduce:

```sh
1..10 | reduce -f "" {|it, acc| $acc + ($it | into string) + " + "} # 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 +
```


Though in the cases of strings, especially if you don't have to operate on the strings, it's usually easier and more correct (notice the extra + at the end in the example above) to use `str join`.

Finally you could also use string interpolation, but that is complex enough that it is covered in it's own subsection below.

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

The [`split row`](/commands/docs/split_row.md) command creates a list from a string based on a delimiter.

```sh
> "red,green,blue" | split row ","
╭───┬───────╮
│ 0 │ red   │
│ 1 │ green │
│ 2 │ blue  │
╰───┴───────╯
```

The [`split column`](/commands/docs/split_column.md) command will create a table from a string based on a delimiter. This applies generic column names to the table.

```sh
> "red,green,blue" | split column ","
╭───┬─────────┬─────────┬─────────╮
│ # │ column1 │ column2 │ column3 │
├───┼─────────┼─────────┼─────────┤
│ 0 │ red     │ green   │ blue    │
╰───┴─────────┴─────────┴─────────╯
```

Finally, the [`split chars`](/commands/docs/split_chars.md) command will split a string into a list of characters.

```sh
> 'aeiou' | split chars
╭───┬───╮
│ 0 │ a │
│ 1 │ e │
│ 2 │ i │
│ 3 │ o │
│ 4 │ u │
╰───┴───╯
```

## The [`str`](/commands/docs/str.md) command

Many string functions are subcommands of the [`str`](/commands/docs/str.md) command. You can get a full list using `help str`.

For example, you can look if a string contains a particular substring using [`str contains`](/commands/docs/str_contains.md):

```sh
> "hello world" | str contains "o wo"
true
```

(You might also prefer, for brevity, the `=~` operator (described below).)

### Trimming strings

You can trim the sides of a string with the [`str trim`](/commands/docs/str_trim.md) command. By default, the [`str trim`](/commands/docs/str_trim.md) commands trims whitespace from both sides of the string. For example:

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
> 'Hello World!' | str substring 4..8
o Wo
```

### String padding

With the [`fill`](/commands/docs/fill.md) command you can add padding to a string. Padding adds characters to string until it's a certain length. For example:

```sh
> '1234' | fill -a right -c '0' -w 10
0000001234
> '1234' | fill -a left -c '0' -w 10 | str length
10
```

### Reversing strings

This can be done easily with the [`str reverse`](/commands/docs/str_reverse.md) command.

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

## String parsing

With the [`parse`](/commands/docs/parse.md) command you can parse a string into columns. For example:

```sh
> 'Nushell 0.80' | parse '{shell} {version}'
╭───┬─────────┬─────────╮
│ # │  shell  │ version │
├───┼─────────┼─────────┤
│ 0 │ Nushell │ 0.80    │
╰───┴─────────┴─────────╯
> 'where all data is structured!' | parse --regex '(?P<subject>\w*\s?\w+) is (?P<adjective>\w+)'
╭───┬──────────┬────────────╮
│ # │ subject  │ adjective  │
├───┼──────────┼────────────┤
│ 0 │ all data │ structured │
╰───┴──────────┴────────────╯
```

If a string is known to contain comma-separated, tab-separated or multi-space-separated data, you can use [`from csv`](/commands/docs/from_csv.md), [`from tsv`](/commands/docs/from_tsv.md) or [`from ssv`](/commands/docs/from_ssv.md):

```sh
> "acronym,long\nAPL,A Programming Language" | from csv
╭───┬─────────┬────────────────────────╮
│ # │ acronym │          long          │
├───┼─────────┼────────────────────────┤
│ 0 │ APL     │ A Programming Language │
╰───┴─────────┴────────────────────────╯
> "name  duration\nonestop.mid  4:06" | from ssv
╭───┬─────────────┬──────────╮
│ # │    name     │ duration │
├───┼─────────────┼──────────┤
│ 0 │ onestop.mid │ 4:06     │
╰───┴─────────────┴──────────╯
> "rank\tsuit\nJack\tSpades\nAce\tClubs" | from tsv
╭───┬──────┬────────╮
│ # │ rank │  suit  │
├───┼──────┼────────┤
│ 0 │ Jack │ Spades │
│ 1 │ Ace  │ Clubs  │
╰───┴──────┴────────╯
```

## String comparison

In addition to the standard `==` and `!=` operators, a few operators exist for specifically comparing strings to one another.

Those familiar with Bash and Perl will recognise the regex comparison operators:

```sh
> 'APL' =~ '^\w{0,3}$'
true
> 'FORTRAN' !~ '^\w{0,3}$'
true
```

Two other operators exist for simpler comparisons:

```sh
> 'JavaScript' starts-with 'Java'
true
> 'OCaml' ends-with 'Caml'
true
```

## Converting strings

There are multiple ways to convert strings to and from other types.

### To string

1. Using [`into string`](/commands/docs/into_string.md). e.g. `123 | into string`
2. Using string interpolation. e.g. `$'(123)'`

### From string

1. Using [`into <type>`](/commands/docs/into.md). e.g. `'123' | into int`

## Coloring strings

You can color strings with the [`ansi`](/commands/docs/ansi.md) command. For example:

```sh
> $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold` makes the text a bold purple
`ansi reset` resets the coloring to the default. (Tip: You should always end colored strings with `ansi reset`)
