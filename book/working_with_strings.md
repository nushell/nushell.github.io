# Working with Strings

As with most languages, strings are a collection of 0 or more characters that represent text. This can include file names, file paths, names of columns,
and much more. Strings are so common that Nushell offers multiple string formats to match your use-case:

## String Formats at a Glance

| Format of string                                     | Example                 | Escapes                   | Notes                                                                  |
| ---------------------------------------------------- | ----------------------- | ------------------------- | ---------------------------------------------------------------------- |
| [Single-quoted string](#single-quoted-strings)       | `'[^\n]+'`              | None                      | Inner `'` only in pairs, kept as written: `'a''b'` is `a''b`           |
| [Double-quoted string](#double-quoted-strings)       | `"The\nEnd"`            | C-style backslash escapes | All literal backslashes must be escaped                                |
| [Raw strings](#raw-strings)                          | `r#'Raw string'#`       | None                      | May include single quotes                                              |
| [Bare word string](#bare-word-strings)               | `ozymandias`            | None                      | Can only contain "word" characters; Cannot be used in command position |
| [Backtick string](#backtick-quoted-strings)          | <code>\`[^\n]+\`</code> | None                      | Bare string that can include whitespace. No unmatched backticks        |
| [Single-quoted interpolation](#string-interpolation) | `$'Captain ($name)'`    | None                      | Inner `'` only in pairs, as above. No unmatched `()`                   |
| [Double-quoted interpolation](#string-interpolation) | `$"Captain ($name)"`    | C-style backslash escapes | All literal backslashes and `()` must be escaped                       |

## Single-quoted Strings

The simplest string in Nushell is the single-quoted string. This string uses the `'` character to surround some text. Here's the text for hello world as a single-quoted string:

```nu
'hello world'
# => hello world
'The
end'
# => The
# => end
```

Single-quoted strings don't do anything to the text they're given, making them ideal for holding a wide range of text data. As the second example shows, a single-quoted string can span several lines, and the line breaks become part of the string.

There is no escape for `'` inside a single-quoted string. Inner single quotes work only in pairs, and only when the word ends with `'` (see [Quotes inside a quoted word](#quotes-inside-a-quoted-word)). Nushell keeps them as written, so `''` is not read as one quote the way it is in SQL:

```nu
'it''s'
# => it''s
```

For text with a lone `'`, such as `don't`, use a double-quoted string, a backtick string, or a [raw string](#raw-strings).

## Double-quoted Strings

For more complex strings, Nushell also offers double-quoted strings. These strings use the `"` character to surround text. They also support the ability to escape characters inside the text using the `\` character.

For example, we could write the text hello followed by a new line and then world, using escape characters and a double-quoted string:

```nu
"hello\nworld"
# => hello
# => world
```

A double-quoted string can also span several lines. Escapes work on every line:

```nu
"first line
second\tline"
# => first line
# => second	line
```

Escape characters let you quickly add in a character that would otherwise be hard to type.

Nushell currently supports the following escape characters:

- `\"` - double-quote character
- `\'` - single-quote character
- `\\` - backslash
- `\/` - forward slash
- `\0` - null character (`NUL`)
- `\a` - bell (alert)
- `\b` - backspace
- `\e` - escape character, as used in ANSI escape sequences
- `\f` - formfeed
- `\r` - carriage return
- `\n` - newline (line feed)
- `\t` - tab
- `\xHH` - a single byte, where HH is exactly 2 hex digits (the resulting string must still be valid UTF-8)
- `\u{X...}` - a single unicode character, where X... is 1-6 hex digits (0-9, A-F, a-f) naming a code point up to `10FFFF`
- `\(`, `\)`, `\{`, `\}`, `\$`, `\^`, `\#`, `\|`, `\~` - the character itself
- `\` followed by a space - a space, so `"a\ b"` is `a b`

An unrecognized escape sequence, such as `\q`, is a parse error, and so is a malformed one, such as `\x4` with one hex digit or `\u{110000}`. A backslash right before the closing quote escapes that quote, so `"logs\"` is not a complete string, and Nushell reports an unclosed delimiter. Write `"logs\\"` for text that ends in a backslash. The [Language Guide](/lang-guide/chapters/strings_and_text.md#escape-errors) shows the error for each case. Special characters can also be created with the [`char`](/commands/docs/char.md) command, for example `(char nul)` inside [string interpolation](#string-interpolation). See [Special characters](#special-characters).

## Raw Strings

Raw strings behave the same as a single quoted strings, except that raw strings
may also contain single quotes. This is possible because raw strings are enclosed
by a starting `r#'` and a closing `'#`. This syntax should look familiar to users
of Rust.

```nu
r#'Raw strings can contain 'quoted' text.'#
# => Raw strings can contain 'quoted' text.
```

Additional `#` symbols can be added to the start and end of the raw string to enclose
one less than the same number of `#` symbols next to a `'` symbol in the string. This can
be used to nest raw strings:

```nu
r###'r##'This is an example of a raw string.'##'###
# => r##'This is an example of a raw string.'##
```

## Quotes inside a quoted word

Nushell splits a line into words at whitespace outside of quotes. When a word starts with `'` or `"`, the string runs from that quote to the last quote of the same kind in the word, and any quotes of that kind in between are part of the string. That's why `'it''s'` keeps both quotes, and why inner double quotes can go unescaped as long as the word has no spaces outside them:

```nu
"[{a: "b"}]"
# => [{a: "b"}]
```

Text after the last quote is an error:

```nu
'a'b
# => Error: nu::parser::extra_token_after_closing_delimiter
# =>
# =>   × Invalid characters after closing delimiter
# =>    ╭─[repl_entry #1:1:4]
# =>  1 │ 'a'b
# =>    ·    ┬
# =>    ·    ╰── invalid characters
# =>    ╰────
# =>   help: Remove these characters, or check that a delimiter closed too early
# =>         above.
```

A space outside the inner quotes ends the word, so `"a "b c" d"` fails the same way at the `b`, and so does JSON with a space in a value, such as `"{"k": "a b"}"`. Escape the inner quotes instead (`"a \"b c\" d"`), or use the other kind of quote or a raw string: `'{"k": "a b"}'` works.

The rule also catches words that look like operators. `'a'..'z'` is not a range of letters. It is the single string `a'..'z`.

## Bare Word Strings

Like other shell languages (but unlike most other programming languages) strings consisting of a single 'word' can also be written without any quotes:

```nu
print hello
# => hello
[hello] | describe
# => list<string>
```

But be careful - if you use a bare word plainly on the command line (that is, not inside a data structure or used as a command parameter) or inside round brackets `(` `)`, it will be interpreted as an external command:

```nu
hello
# => Error: nu::shell::external_command
# => 
# =>   × External command failed
# =>    ╭─[repl_entry #5:1:1]
# =>  1 │ hello
# =>    · ──┬──
# =>    ·   ╰── Command `hello` not found
# =>    ╰────
# =>   help: `hello` is neither a Nushell built-in or a known external command
```

Also, many bare words have special meaning in nu, and so will not be interpreted as a string:

```nu
true | describe
# => bool
[true] | describe
# => list<bool>
[trueX] | describe
# => list<string>
trueX | describe
# => Error: nu::shell::external_command
# => 
# =>   × External command failed
# =>    ╭─[repl_entry #5:1:1]
# =>  1 │ trueX | describe
# =>    · ──┬──
# =>    ·   ╰── Command `trueX` not found
# =>    ╰────
# =>   help: `trueX` is neither a Nushell built-in or a known external command
```

`true` and `false` aren't the only ones. A bare word that is a valid literal of another type gets that type: numbers, durations, file sizes, dates, ranges, `null`, binary data and cell paths. Only words that fit none of these are strings:

```nu
[42 1.5 10sec 2kb 2024-01-02 1..3 null 0x[ff] $.name hello] | each { describe } | to nuon
# => [int, float, duration, filesize, datetime, range, nothing, binary, cell-path, string]
```

Quote the word when you want the text, as in `["2kb" "null"]`. The Language Guide's [Bare word](/lang-guide/chapters/strings_and_text.md#bare-word) section explains how a command parameter's type changes this, and lists the characters that end a bare word.

So, while bare strings are useful for informal command line usage, when programming more formally in nu, you should generally use quotes.

## Backtick-quoted Strings

Bare word strings, by their nature, cannot include spaces or quotes. As an alternative, Nushell also includes backtick-quoted
strings using the <code>`</code> character. In most cases, these should operate the same as a bare word string.

For instance, as with a bare word, a backtick-quoted string in the first position of an expression will be interpreted as a _command_ or _path_.
For example:

```nu
# Run the external ls binary found on the path
`ls`
```

A backtick-quoted path entered on its own at the prompt changes to that directory. For example, this changes to the "my dir" subdirectory, if it exists:

```nu
`./my dir`
```

And this moves back up one directory:

```nu
`..`
```

Backtick-quoted strings can be useful for combining globs with files or directories which include spaces:

```nu
ls `./my dir/*`
```

Backtick-quoted strings cannot contain _unmatched_ backticks in the string itself. For example:

`````nu
echo ````
# => ``
`````

In contrast, <code>echo \`\`\`</code> is an unterminated string, which will start a new line in the CLI.

Like a bare word, a backtick string has no escapes, so a backslash inside it is plain text. Unlike a [bare word with parentheses](#interpolation-in-bare-words), it isn't interpolated either, and there is no <code>$\`...\`</code> form. It can span several lines.

```nu
let n = 3
echo `a\nb file($n).txt`
# => a\nb file($n).txt
```

Passed to a command parameter of type `path`, a backtick string is expanded the same way a bare word is: a leading `~` becomes your home directory, and `...` becomes `../..`. A single- or double-quoted string is passed as written:

```nu
def show [p: path] { $p }
[(show `.../my dir`) (show ".../my dir")] | to nuon
# => ["../../my dir", ".../my dir"]
```

## Strings as external commands

You can place the `^` sigil in front of any string (including a variable) to have Nushell execute the string as if it was an external command:

```nu
^'C:\Program Files\exiftool.exe'

let foo = 'C:\Program Files\exiftool.exe'
^$foo
```

You can also use the [`run-external`](/commands/docs/run-external.md) command for this purpose. Every external call goes through it. Both `^cmd arg` and a plain `cmd arg` that names an external run `run-external cmd arg`. Calling it yourself helps when the command line is stored in a list. If the first argument is a list, its first item is the program and the other items come before the remaining arguments:

```nu
let cmd = [echo hello]
run-external $cmd world
# => hello world
```

Arguments are expanded as for `^cmd`. A bare word containing glob characters, such as `*.txt`, becomes the matching file names, or stays as written if nothing matches, and a bare word starting with `~` or `...` becomes a path. Quoted strings are passed unchanged. A list variable after the first argument is an error, so spread it with `...$list`.

Because all externals go through `run-external`, a custom command with that name changes how every external runs. This one prints each command line before running it:

```nu
def --wrapped run-external [...args] {
    print --stderr $"+ ($args | str join ' ')"
    %run-external ...$args
}
^echo hello
# => + echo hello
# => hello
```

Inside the wrapper, call the built-in as `%run-external` (see [Running a Built-in Command with `%`](running_externals.md#running-a-built-in-command-with)). A `^cmd` call there is itself an external call, so it runs the wrapper again and never returns.

## Appending and Prepending to strings

There are various ways to prepend, or append strings. If you want to add something to the beginning of each string, closures are a good option:

```nu
['foo', 'bar'] | each {|s| '~/' ++ $s} # ~/foo, ~/bar
['foo', 'bar'] | each {|s| '~/' + $s} # ~/foo, ~/bar
```

You can also use a regex to replace the beginning or end of a string:

```nu
['foo', 'bar'] | str replace -r '^' '~/' # ~/foo, ~/bar
['foo', 'bar'] | str replace -r '$' '~/' # foo~/, bar~/
```

If you want to combine a list into a string, then `str join` is your friend:

```nu
"hello" | append "world!" | str join " " # hello world!
```

You can also use reduce:

```nu
1..10 | reduce -f "" {|elt, acc| $acc + ($elt | into string) + " + "} # 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 +
```

Though in the cases of strings, especially if you don't have to operate on the strings, it's usually easier and more correct (notice the extra + at the end in the example above) to use `str join`.

Finally you could also use string interpolation, but that is complex enough that it is covered in its own subsection below.

### Joining strings

[`str join`](/commands/docs/str_join.md) accepts items of any type and converts each one to text, mostly the way [string interpolation](#how-values-are-written-into-the-string) does. A `null` item becomes an empty string, so the separators around it stay:

```nu
[1 2.0 1500b 90sec null true] | str join ', '
# => 1, 2.0, 1.5 kB, 1min 30sec, , true
```

Two cases differ from interpolation. A date is written in RFC 2822 form without the "(... ago)" part, and the items of a nested list or record are separated by newlines instead of commas. Run [`to nuon`](/commands/docs/to_nuon.md) on nested data before joining it.

Without a separator, the items are joined directly (`[1 2] | str join` is `12`). A single string as input comes back unchanged.

## String interpolation

More complex string use cases also need a new form of string: string interpolation. This is a way of building text from both raw text and the result of running expressions. String interpolation combines the results together, giving you a new string.

String interpolation uses `$" "` and `$' '` as ways to wrap interpolated text.

For example, let's say we have a variable called `$name` and we want to greet the name of the person contained in this variable:

```nu
let name = "Alice"
$"greetings, ($name)"
# => greetings, Alice
```

By wrapping expressions in `()`, we can run them to completion and use the results to help build the string.

String interpolation has both a single-quoted, `$' '`, and a double-quoted, `$" "`, form. These correspond to the single-quoted and double-quoted strings: single-quoted string interpolation doesn't support escape characters while double-quoted string interpolation does.

The quoting rules carry over too. Inner single quotes in pairs are kept, as in a single-quoted string, so `$'it''s'` is `it''s`. Both forms can span several lines, and so can the code inside `( )`:

```nu
let name = "Nu"
$"Hello,
($name)!"
# => Hello,
# => Nu!
```

Double-quoted interpolated strings support escaping parentheses, so that the `(` and `)` characters may be used in a string without Nushell trying to evaluate what appears between them:

```nu
$"2 + 2 is (2 + 2) \(you guessed it!)"
# => 2 + 2 is 4 (you guessed it!)
```

The code inside `( )` is ordinary Nushell code, not part of the surrounding string. Quotes inside it don't end the interpolated string, and you write them without escapes, the same way you would outside a string. That includes another interpolated string:

```nu
$"(["x" "y"] | str join ", ")"
# => x, y
$"a ($"b (1 + 1)")"
# => a b 2
```

A `)` inside a quoted string within the parentheses doesn't close them either: `$"a (")") c"` is `a ) c`. Escaping a quote inside the parentheses is an error, because `\"` isn't valid Nushell code outside a string:

```nu
$"a (\"b\") c"
# => Error: nu::parser::unclosed_delimiter
# =>
# =>   × Unclosed delimiter.
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ $"a (\"b\") c"
# =>    ·     ┬        ┬
# =>    ·     │        ╰── expected `)` here
# =>    ·     ╰── unclosed — opens here (need `)`)
# =>    ╰────
# =>   help: Add a matching `)` to close this delimiter, or check that an earlier
# =>         closer closed the wrong block.
```

### How values are written into the string

A value that isn't a string is converted to text where it appears:

```nu
let item = {name: "Nu", tags: [shell data], size: 1500b, note: null}
$"tags: ($item.tags), note: [($item.note)], size: ($item.size)"
# => tags: [shell, data], note: [], size: 1.5 kB
$"($item)"
# => {name: Nu, tags: [shell, data], size: 1.5 kB, note: }
$"(1.0) (90sec) (0x[01 ff]) ([[a b]; [1 2]])"
# => 1.0 1min 30sec [1, 255] [{a: 1, b: 2}]
```

- `null` becomes an empty string.
- Lists and records are written in brackets and braces, with the strings inside left unquoted, and a table is written as a list of records. The result looks like NUON but often isn't valid NUON. Use [`to nuon`](/commands/docs/to_nuon.md) or [`to json`](/commands/docs/to_json.md) when the text has to be read back.
- File sizes and durations look the way they do in a table, and file sizes follow your `$env.config.filesize` settings.
- A float keeps its decimal point: `1.0`, not `1`.
- Binary data is written as a list of byte values. Use [`decode`](/commands/docs/decode.md) to turn bytes into text.
- A date is written in RFC 2822 form followed by how long ago it was, such as `Thu, 2 Jan 2020 03:04:05 +0000 (6 years ago)`. If `$env.config.datetime_format.normal` is set, that format is used instead.
- A closure is written as `closure_` followed by an internal ID number.

[`into string`](#to-string) and [`str join`](#joining-strings) write some of these values differently.

Interpolated strings can be evaluated at parse time, but if they include values whose formatting depends
on your configuration and your `config.nu` hasn't been loaded yet, they will use the default configuration.
So if you have something like this in your `config.nu`, `x` will be `"2.0 kB"` even if your config says to use
`MB` for all file sizes (datetimes will similarly use the default config).

```nu
const x = $"(2kb)"
```

### Interpolation in bare words

A [bare word](#bare-word-strings) that contains `(` is interpolated without the `$"..."`. This is handy for file names and other arguments built from a variable:

```nu
let n = 3
echo file($n).txt
# => file3.txt
[v($n) ($n)-beta] | to nuon
# => ["v3", "3-beta"]
```

It follows the rules for bare words:

- It works where Nushell expects a value, such as a command argument, a list item or a record value. At the start of a pipeline or after `let x =`, a word like `v($n)` is a command name, so Nushell tries to run an external command called `v3`. A word that starts with `(`, like `($n)-beta`, works in both places.
- There are no escapes. As in single-quoted interpolation, `v\($n)` is `v\3`.
- It can't be attached to a quoted string. `"v"($n)` is the "Invalid characters after closing delimiter" error from [above](#quotes-inside-a-quoted-word).
- The variable needs parentheses. Nushell reads all of `$n-beta` as one variable name and rejects it with "expected valid variable name".
- In a command argument that takes a glob, such as for `ls` or `rm`, the result is a glob pattern: `ls ($n)*.txt` lists the files whose names start with `3` and end in `.txt`. See [Converting Strings to Globs](moving_around.md#converting-strings-to-globs).

## Splitting Strings

The [`split row`](/commands/docs/split_row.md) command creates a list from a string based on a delimiter.

```nu
"red,green,blue" | split row ","
# => ╭───┬───────╮
# => │ 0 │ red   │
# => │ 1 │ green │
# => │ 2 │ blue  │
# => ╰───┴───────╯
```

Given a list of strings, `split row` splits each one and returns a single flat list of all the pieces. Two separators next to each other give an empty string, so `'a,,b'` splits into `a`, `""` and `b`. With `--regex`, the separator is a [regular expression](./regular_expressions.md). `--number` limits how many pieces you get, and the last piece keeps the rest of the string. Add `--right` to count from the end instead, so the first piece keeps the rest:

```nu
['a,b' 'c,d,e'] | split row ',' | to nuon
# => [a, b, c, d, e]
'one1two22three' | split row --regex '\d+' | to nuon
# => [one, two, three]
'a,b,c,d' | split row ',' --number 2 | to nuon
# => [a, "b,c,d"]
'a,b,c,d' | split row ',' --number 2 --right | to nuon
# => ["a,b,c", d]
```

The [`split column`](/commands/docs/split_column.md) command will create a table from a string based on a delimiter. This applies generic column names to the table.

```nu
"red,green,blue" | split column ","
# => ╭───┬─────────┬─────────┬─────────╮
# => │ # │ column0 │ column1 │ column2 │
# => ├───┼─────────┼─────────┼─────────┤
# => │ 0 │ red     │ green   │ blue    │
# => ╰───┴─────────┴─────────┴─────────╯
```

To name the columns yourself, list the names after the separator. Pieces beyond the last name are dropped, so give one name per piece:

```nu
'2024-01-15' | split column '-' year month day
# => ╭───┬──────┬───────┬─────╮
# => │ # │ year │ month │ day │
# => ├───┼──────┼───────┼─────┤
# => │ 0 │ 2024 │ 01    │ 15  │
# => ╰───┴──────┴───────┴─────╯
'2024-01-15' | split column '-' year month
# => ╭───┬──────┬───────╮
# => │ # │ year │ month │
# => ├───┼──────┼───────┤
# => │ 0 │ 2024 │ 01    │
# => ╰───┴──────┴───────╯
```

Using the same name twice is an error ("Record field or table column used twice"). `--regex`, `--number` and `--right` work as they do for `split row`, and `--number` is the way to keep a separator that also appears inside the last value:

```nu
'query=a=1&b=2' | split column '=' key value --number 2
# => ╭───┬───────┬─────────╮
# => │ # │  key  │  value  │
# => ├───┼───────┼─────────┤
# => │ 0 │ query │ a=1&b=2 │
# => ╰───┴───────┴─────────╯
```

Two separators next to each other give an empty column. `--collapse-empty` drops those columns, and the later pieces move left to fill the gap:

```nu
'red,,blue' | split column ',' --collapse-empty
# => ╭───┬─────────┬─────────╮
# => │ # │ column0 │ column1 │
# => ├───┼─────────┼─────────┤
# => │ 0 │ red     │ blue    │
# => ╰───┴─────────┴─────────╯
```

A list of strings gives one row per string. A string with fewer pieces gives a row without the extra columns.

Finally, the [`split chars`](/commands/docs/split_chars.md) command will split a string into a list of characters.

```nu
'aeiou' | split chars
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ e │
# => │ 2 │ i │
# => │ 3 │ o │
# => │ 4 │ u │
# => ╰───┴───╯
```

By default `split chars` splits into Unicode code points (`--code-points`). Some characters are written with more than one code point, such as an `e` followed by a combining acute accent, and the default splits the mark from its letter. `--grapheme-clusters` keeps each visible character in one piece:

```nu
"cafe\u{301}s" | split chars | length
# => 6
"cafe\u{301}s" | split chars --grapheme-clusters
# => ╭───┬───╮
# => │ 0 │ c │
# => │ 1 │ a │
# => │ 2 │ f │
# => │ 3 │ é │
# => │ 4 │ s │
# => ╰───┴───╯
```

Given a list of strings, `split chars` returns a list of lists, one for each string: `['ab' 'cd'] | split chars` is `[[a, b], [c, d]]`.

## The [`str`](/commands/docs/str.md) command

Many string functions are subcommands of the [`str`](/commands/docs/str.md) command. You can get a full list using `help str`.

For example, you can look if a string contains a particular substring using [`str contains`](/commands/docs/str_contains.md):

```nu
"hello world" | str contains "o wo"
# => true
```

(You might also prefer, for brevity, the `=~` operator (described below).)

### Lists, records and tables

Most `str` subcommands also take a list of strings and work on each item:

```nu
['hello' 'abc'] | str contains 'l'
# => ╭───┬───────╮
# => │ 0 │ true  │
# => │ 1 │ false │
# => ╰───┴───────╯
```

The list has to hold only strings. A list such as `['a' 1]` is an "Input type not supported" error. [`str join`](#joining-strings) is different, because it combines the whole list into one string.

For a record or a table, name the fields or columns to change after the command's own arguments. These names are cell paths, so a nested field such as `meta.city` works too. Everything else passes through unchanged:

```nu
[[name city]; ['  Ann ' ' Oslo '] [' Bo' 'Lima  ']] | str trim name
# => ╭───┬──────┬────────╮
# => │ # │ name │  city  │
# => ├───┼──────┼────────┤
# => │ 0 │ Ann  │  Oslo  │
# => │ 1 │ Bo   │ Lima   │
# => ╰───┴──────┴────────╯
{name: 'Ann', city: 'Oslo'} | str contains 'n' name city
# => ╭──────┬───────╮
# => │ name │ true  │
# => │ city │ false │
# => ╰──────┴───────╯
```

This works the same for [`str contains`](/commands/docs/str_contains.md), [`str index-of`](/commands/docs/str_index-of.md), [`str replace`](/commands/docs/str_replace.md), [`str reverse`](/commands/docs/str_reverse.md), [`str substring`](/commands/docs/str_substring.md), [`str trim`](/commands/docs/str_trim.md) and [`into string`](/commands/docs/into_string.md). For all of them except `str trim`, a record or table without any names is an error. Given a record or table and no names, `str trim` trims every string it finds at any depth and leaves other values alone:

```nu
{name: ' Ann ', meta: {city: ' Oslo '}, tags: [' a '], age: 30} | str trim | to nuon
# => {name: Ann, meta: {city: Oslo}, tags: [a], age: 30}
```

### Trimming Strings

You can trim the sides of a string with the [`str trim`](/commands/docs/str_trim.md) command. By default, the [`str trim`](/commands/docs/str_trim.md) commands trims whitespace from both sides of the string. For example:

```nu
'       My   string   ' | str trim
# => My   string
```

You can specify on which side the trimming occurs with the `--right` and `--left` options. (`-r` and `-l` being the short-form options respectively)

To trim a specific character, use `--char <Character>` or `-c <Character>` to specify the character to trim. It takes exactly one character. A longer value, such as `--char 'xx'`, is the error "Trim only works with single character". To strip a longer prefix or suffix, use [`str replace`](#replacing-text) with a regular expression such as `'^(ab)+'`.

Here's an example of all the options in action:

```nu
'=== Nu shell ===' | str trim -r -c '='
# => === Nu shell
```

### Substrings

Substrings are slices of a string. They have a startpoint and an endpoint. Here's an example of using a substring:

```nu
'Hello World!' | str index-of 'o'
# => 4
'Hello World!' | str index-of 'r'
# => 8
'Hello World!' | str substring 4..8
# => o Wor
```

[`str index-of`](/commands/docs/str_index-of.md) returns `-1` when the text isn't there. `--end` finds the last match instead of the first. `--range` limits the search to part of the string, and the result still counts from the start of the whole string:

```nu
'Hello World!' | str index-of 'z'
# => -1
'Hello World!' | str index-of 'o' --end
# => 7
'Hello World!' | str index-of 'o' --range 5..
# => 7
```

[`str substring`](/commands/docs/str_substring.md) takes a [range](./types_of_data.md#ranges). A range written with `..` includes its end and one written with `..<` doesn't. Either end can be left open. A negative index counts back from the end of the string, so `-1` is the last character. Wrap negative numbers in parentheses when they start the range, or Nushell reads `-6..` as a flag:

```nu
'Hello World!' | str substring 4..<8
# => o Wo
'Hello World!' | str substring 6..
# => World!
'Hello World!' | str substring (-6)..(-2)
# => World
'Hello World!' | str substring 1..-2
# => ello World
```

An end past the string stops at the end, and a range that starts past the end or after its own end gives an empty string.

Both commands count in UTF-8 bytes by default (`--utf-8-bytes`), so a character such as `ï` counts as 2. With `--grapheme-clusters` they count visible characters instead. A byte range that cuts a character in half gives the replacement character `�`:

```nu
'naïve' | str substring 0..2
# => na�
'naïve' | str substring --grapheme-clusters 0..2
# => naï
'naïve' | str index-of -g 'v'
# => 3
```

`--range` in `str index-of` always counts bytes, even with `--grapheme-clusters`, and a bound that falls inside a character is an error. With `--grapheme-clusters`, a match that starts in the middle of a character, such as a lone combining accent, reports the index of the character after it, or `-1` if there isn't one.

### String Padding

With the [`fill`](/commands/docs/fill.md) command you can add padding to a string. Padding adds characters to string until it's a certain length. For example:

```nu
'1234' | fill -a right -c '0' -w 10
# => 0000001234
'1234' | fill -a left -c '0' -w 10 | str length
# => 10
```

Without `--alignment` the text goes on the left, and without `--character` the padding is spaces. `--width` defaults to 1, which leaves any non-empty string unchanged, so always give a width. Text that is already as wide as `--width`, or wider, comes back unchanged, not cut short:

```nu
'Nushell' | fill -w 3
# => Nushell
```

`--alignment` takes `left` (`l`), `right` (`r`), `center` (`c`, or `middle`/`m`) and `centerright` (`cr`, or `middleright`/`mr`), in any letter case. When the padding can't be split evenly, `center` puts the extra character on the right and `centerright` puts it on the left:

```nu
'ab' | fill -w 7 -a center -c '*'
# => **ab***
'ab' | fill -w 7 -a centerright -c '*'
# => ***ab**
```

`fill` also pads ints, floats and file sizes, which are turned into text first, and it pads each item of a list. A file size is written as its number of bytes, and the minus sign of a negative number ends up after the padding (`-42 | fill -a r -c '0' -w 5` is `00-42`):

```nu
[7 42 512] | fill -a r -c '0' -w 4
# => ╭───┬──────╮
# => │ 0 │ 0007 │
# => │ 1 │ 0042 │
# => │ 2 │ 0512 │
# => ╰───┴──────╯
1kb | fill -a r -w 6
# =>   1000
```

The width counts visible characters, and [`ansi`](#coloring-strings) color codes don't count. Use a single character with `--character`. A longer string is repeated once for each missing character, so the result comes out wider than `--width`.

### Reversing Strings

This can be done easily with the [`str reverse`](/commands/docs/str_reverse.md) command.

```nu
'Nushell' | str reverse
# => llehsuN
['Nushell' 'is' 'cool'] | str reverse
# => ╭───┬─────────╮
# => │ 0 │ llehsuN │
# => │ 1 │ si      │
# => │ 2 │ looc    │
# => ╰───┴─────────╯
```

`str reverse` reverses Unicode code points, not visible characters. A combining mark ends up on a different letter. To keep each character whole, split it with [`split chars --grapheme-clusters`](#splitting-strings), reverse the list and join it again:

```nu
"cafe\u{301}s" | str reverse
# => śefac
"cafe\u{301}s" | split chars -g | reverse | str join
# => séfac
```

### Replacing text

[`str replace`](/commands/docs/str_replace.md) replaces only the first match unless you add `--all`:

```nu
'a-b-c' | str replace '-' '+'
# => a+b-c
'a-b-c' | str replace --all '-' '+'
# => a+b+c
```

The text to find is plain text. With `--regex` (or `--multiline`) it's a [regular expression](./regular_expressions.md#replacing-with-str-replace), and the replacement can refer to capture groups.

The replacement can also be a closure that computes the new text. With `--regex`, it runs once for each match, with the matched text as `$in`. It has to return a string:

```nu
'price: 10, tax: 2' | str replace --all --regex '\d+' { $in | into int | $in * 2 | into string }
# => price: 20, tax: 4
```

Without `--regex`, every match is the same text, so the closure runs only once and its result replaces all of them.

## String Parsing

With the [`parse`](/commands/docs/parse.md) command you can parse a string into columns. For example:

```nu
'Nushell 0.80' | parse '{shell} {version}'
# => ╭───┬─────────┬─────────╮
# => │ # │  shell  │ version │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ 0.80    │
# => ╰───┴─────────┴─────────╯
'where all data is structured!' | parse --regex '(?P<subject>\w*\s?\w+) is (?P<adjective>\w+)'
# => ╭───┬──────────┬────────────╮
# => │ # │ subject  │ adjective  │
# => ├───┼──────────┼────────────┤
# => │ 0 │ all data │ structured │
# => ╰───┴──────────┴────────────╯
```

Without `--regex`, Nushell turns the pattern into a regular expression for you. Text outside the braces is matched as written, so a `.` matches only a dot. The pattern has to match the whole string, and each string gives at most one row. Each `{name}` placeholder matches as little text as it can, except the last one, which takes the rest of the string. With `--regex`, every match in the string becomes a row:

```nu
'a=1, b=2' | parse '{key}={value}'
# => ╭───┬─────┬────────╮
# => │ # │ key │ value  │
# => ├───┼─────┼────────┤
# => │ 0 │ a   │ 1, b=2 │
# => ╰───┴─────┴────────╯
'a=1, b=2' | parse --regex '(?<key>\w+)=(?<value>\w+)'
# => ╭───┬─────┬───────╮
# => │ # │ key │ value │
# => ├───┼─────┼───────┤
# => │ 0 │ a   │ 1     │
# => │ 1 │ b   │ 2     │
# => ╰───┴─────┴───────╯
```

A `{_}` placeholder matches text without making a column. Write `{{` for a literal `{`. A `{` without a closing `}` is the error "Found opening `{` without an associated closing `}`".

```nu
'Nushell 0.117.0 stable' | parse '{name} {_} {channel}'
# => ╭───┬─────────┬─────────╮
# => │ # │  name   │ channel │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ stable  │
# => ╰───┴─────────┴─────────╯
```

Given a list, `parse` parses each string and skips the ones that don't match, so it also works as a filter:

```nu
['size=10' 'oops' 'color=red'] | parse '{key}={value}'
# => ╭───┬───────┬───────╮
# => │ # │  key  │ value │
# => ├───┼───────┼───────┤
# => │ 0 │ size  │ 10    │
# => │ 1 │ color │ red   │
# => ╰───┴───────┴───────╯
```

See [Regular Expressions](./regular_expressions.md#capture-groups-in-parse) for how `parse --regex` names unnamed groups and for its `--backtrack` limit.

If a string is known to contain comma-separated, tab-separated or multi-space-separated data, you can use [`from csv`](/commands/docs/from_csv.md), [`from tsv`](/commands/docs/from_tsv.md) or [`from ssv`](/commands/docs/from_ssv.md):

```nu
"acronym,long\nAPL,A Programming Language" | from csv
# => ╭───┬─────────┬────────────────────────╮
# => │ # │ acronym │          long          │
# => ├───┼─────────┼────────────────────────┤
# => │ 0 │ APL     │ A Programming Language │
# => ╰───┴─────────┴────────────────────────╯
"name  duration\nonestop.mid  4:06" | from ssv
# => ╭───┬─────────────┬──────────╮
# => │ # │    name     │ duration │
# => ├───┼─────────────┼──────────┤
# => │ 0 │ onestop.mid │ 4:06     │
# => ╰───┴─────────────┴──────────╯
"rank\tsuit\nJack\tSpades\nAce\tClubs" | from tsv
# => ╭───┬──────┬────────╮
# => │ # │ rank │  suit  │
# => ├───┼──────┼────────┤
# => │ 0 │ Jack │ Spades │
# => │ 1 │ Ace  │ Clubs  │
# => ╰───┴──────┴────────╯
```

### Options for `from csv` and `from tsv`

`from csv` turns a field into an int or a float when it parses as one. Every other field stays a string, including `true` and dates. `--no-infer` keeps every field a string, which also keeps leading zeros:

```nu
"id,price,active,since\n007,2.50,true,2024-01-02" | from csv | describe
# => table<id: int, price: float, active: string, since: string> (stream)
"id,price\n007,2.50" | from csv --no-infer
# => ╭───┬─────┬───────╮
# => │ # │ id  │ price │
# => ├───┼─────┼───────┤
# => │ 0 │ 007 │ 2.50  │
# => ╰───┴─────┴───────╯
```

The other options describe the format of the text:

- `--separator` sets the column separator. It takes one ASCII character, or four hex digits naming one, such as `001f` for the unit separator.
- `--comment` names a character that marks a comment. Lines that start with it are skipped.
- `--noheaders` treats the first line as data. The columns are then named `column0`, `column1` and so on.
- `--quote` changes the quote character from `"`. A separator inside quotes is part of the field. By default, a quote inside a quoted field is written twice (`"say ""hi"""`). `--escape` names a character that escapes it instead, such as `\` for `"say \"hi\""`.
- `--trim` removes whitespace around the header names (`headers`), the fields (`fields`), or both (`all`). The default is `none`. Trimming happens before the number conversion, so a field written as ` 3` only becomes the int `3` when fields are trimmed.
- `--flexible` allows rows with different numbers of fields. Without it, such a row is an error ("found record with 3 fields, but the previous record has 2 fields"). Extra fields get columns named after their position, and short rows lack the missing columns.

```nu
"# exported 2024-01-02\nname;qty\napple; 3\npear; 10" | from csv --separator ';' --comment '#' --trim all
# => ╭───┬───────┬─────╮
# => │ # │ name  │ qty │
# => ├───┼───────┼─────┤
# => │ 0 │ apple │   3 │
# => │ 1 │ pear  │  10 │
# => ╰───┴───────┴─────╯
"a,b\n1,2,3\n4" | from csv --flexible | to nuon
# => [{a: 1, b: 2, "column2": 3}, {a: 4}]
```

`from tsv` takes the same options, except `--separator`, because its separator is always a tab.

### Options for `from ssv`

`from ssv` splits each line wherever there are at least two spaces in a row, so a single space can appear inside a value. `--minimum-spaces` changes that number. It doesn't convert any fields, so numbers stay strings. `--noheaders` works as it does for `from csv`.

When a column has blank cells, the values after the blank shift left into the wrong columns. `--aligned-columns` uses the position of each header in the first line to decide where a column starts:

```nu
"NAME  PORTS  STATUS\nweb   80     up\ndb           down" | from ssv --aligned-columns
# => ╭───┬──────┬───────┬────────╮
# => │ # │ NAME │ PORTS │ STATUS │
# => ├───┼──────┼───────┼────────┤
# => │ 0 │ web  │ 80    │ up     │
# => │ 1 │ db   │       │ down   │
# => ╰───┴──────┴───────┴────────╯
```

Without `--aligned-columns`, `down` would end up in the `PORTS` column and the second row would have no `STATUS`.

## String Comparison

In addition to the standard `==` and `!=` operators, a few operators exist for specifically comparing strings to one another.

Those familiar with Bash and Perl will recognise the regex comparison operators:

```nu
'APL' =~ '^\w{0,3}$'
# => true
'FORTRAN' !~ '^\w{0,3}$'
# => true
```

Two other operators exist for simpler comparisons:

```nu
'JavaScript' starts-with 'Java'
# => true
'OCaml' ends-with 'Caml'
# => true
```

## Converting Strings

There are multiple ways to convert strings to and from other types.

### To string

1. Using [`into string`](/commands/docs/into_string.md). e.g. `123 | into string`
2. Using string interpolation. e.g. `$'(123)'`

The two don't always give the same text. `into string` drops the `.0` of a whole float, and it writes a date in the form `Thu Jan  2 03:04:05 2020`, with no time zone and no "(... ago)" part. File sizes and durations come out as they do in [interpolation](#how-values-are-written-into-the-string):

```nu
[1.0 3.14159 1500b 90sec] | into string | to nuon
# => ["1", "3.14159", "1.5 kB", "1min 30sec"]
$"(1.0)"
# => 1.0
```

`--decimals` rounds a float to that many digits, and pads an int with zeros after the decimal point. A half rounds away from zero. `--group-digits` adds thousands separators. Both the separator and the decimal point come from your system locale, so the output below is for an English locale. With `--group-digits`, a file size is written as its number of bytes:

```nu
3.14159 | into string --decimals 2
# => 3.14
7 | into string --decimals 2
# => 7.00
1234567 | into string --group-digits
# => 1,234,567
1500000b | into string --group-digits
# => 1,500,000
```

`into string` doesn't decode binary data. It fails with a hint to use [`decode`](/commands/docs/decode.md), as in `0x[48 69] | decode utf-8`, which gives `Hi`. A record is also an error, and its hint points to [`to nuon`](/commands/docs/to_nuon.md). A list is converted item by item, and for a table or record you name the columns to convert, as described in [Lists, records and tables](#lists-records-and-tables).

### From string

1. Using [`into <type>`](/commands/docs/into.md). e.g. `'123' | into int`

## Special characters

The [`char`](/commands/docs/char.md) command returns a character by name, such as `char newline` or `char tab`. `char --list` shows every name with its code point and aliases (`nl` is an alias of `newline`). A few names depend on the operating system, which makes them useful in scripts that run everywhere:

- `char path_sep` (alias `psep`) separates the parts of a file path: `\` on Windows and `/` elsewhere.
- `char esep` (alias `env_sep`) separates the entries of a list variable such as `PATH`: `;` on Windows and `:` elsewhere.
- `char eol` (aliases `lsep` and `line_sep`) is the line ending: `\r\n` on Windows and `\n` elsewhere. `char newline` is always `\n`.

```nu
"/usr/bin:/bin" | split row (char esep)
# => ╭───┬──────────╮
# => │ 0 │ /usr/bin │
# => │ 1 │ /bin     │
# => ╰───┴──────────╯
```

The example shows the output on Linux and macOS.

`char --unicode` (`-u`) takes hex code points instead of a name, and `char --integer` (`-i`) takes code points as numbers. Both accept several code points and join them into one string, which is how you build characters made of more than one code point. Quote a hex code point that contains only digits, such as `'41'`, because a bare `41` is read as an int and rejected:

```nu
char --unicode '41' '42'
# => AB
char --integer 72 105
# => Hi
char -u '1F468' '200D' '1F467' | str length --grapheme-clusters
# => 1
```

Without `-u` or `-i`, `char` uses only its first argument, and further names are ignored.

## Coloring Strings

You can color strings with the [`ansi`](/commands/docs/ansi.md) command. For example:

```nu
$'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold` makes the text a bold purple
`ansi reset` resets the coloring to the default.

::: tip
You should always end colored strings with `ansi reset`
:::

`ansi --list` shows every name `ansi` accepts, with its short name and its escape sequence (written with `\e` for the escape character). Besides colors and styles, the list has names that control the terminal, such as clearing the screen or hiding the cursor:

```nu
ansi --list | where name in [clear_screen cursor_home cursor_off cursor_on] | select name short_name code
# => ╭───┬──────────────┬────────────┬─────────╮
# => │ # │     name     │ short_name │  code   │
# => ├───┼──────────────┼────────────┼─────────┤
# => │ 0 │ clear_screen │            │ \e[J    │
# => │ 1 │ cursor_off   │            │ \e[?25l │
# => │ 2 │ cursor_on    │            │ \e[?25h │
# => │ 3 │ cursor_home  │ home       │ \e[H    │
# => ╰───┴──────────────┴────────────┴─────────╯
```

For a sequence that has no name, `ansi --escape` adds the escape character and `[` in front of the code you give it. It also accepts a record with `fg` (foreground), `bg` (background) and `attr` (attributes such as `b` for bold or `u` for underline) and builds the sequence from it. Colors can be names or `#rrggbb` hex codes, and any other key is an error. Both of these produce bold red:

```nu
(ansi --escape '1;31m') == "\e[1;31m"
# => true
(ansi --escape {fg: red, attr: b}) == "\e[1;31m"
# => true
```

This record has the same format as the color settings described in [Coloring and Theming](coloring_and_theming.md).

`ansi --osc` does the same for operating system commands, which start with the escape character and `]` and do things like setting the window title. `ansi --osc` doesn't end the command, so add `(ansi st)`, the string terminator, yourself:

```nu
print $"(ansi --osc '2;build finished')(ansi st)"
```
