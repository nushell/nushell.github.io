# Strings and Text Formatting

## String literals

Nushell has raw strings, which work like Rust's raw strings. A raw string starts with `r#'` and ends with `'#`. Escapes are not interpreted, and the string can span multiple lines. Add more `#` characters on both sides if the text itself contains `'#`:

```nu
r#'some\nliteral\tstring'#
# => some\nliteral\tstring
r##'contains '# inside'##
# => contains '# inside
```

See [Raw Strings](/book/working_with_strings.md#raw-strings) in the Book.

## String interpolation

String interpolation uses either double quotes or single quotes with a preceding dollar sign. However, when using double quotes, you have to be aware that escapes will be recognized and interpreted.

### Example:

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
let path1 = "/bin"
let path2 = "/"
let fn = "echo"
let arguments = ["arg1", "-a", "arg2"]

^$"($path1)($path2)($fn)" ...$arguments
# => arg1 -a arg2
```

The caret `^` before the string interpolation symbol `$` allows that external command to be executed.

The percent sigil `%` calls the built-in command with that name, even if a custom command or alias shadows it. Only built-in commands can be called this way. When the name comes from a variable or string, as below, arguments are passed as positional values, so flags such as `-a` are not recognized.

```nu
let cmd = "ls"
# call internal `ls` command
%$cmd
# call external `ls` command
^$cmd
```

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

There are other escapes defined by Nushell found in [parse_literals.rs](https://github.com/nushell/nushell/blob/main/crates/nu-parser/src/parse_literals.rs) in the `unescape_string` function.

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
- `0` - Null character
- a space character - Space (`"a\ b"` is `a b`)
- `xHH` - A byte given as exactly 2 hex digits, e.g. `\x41` is `A`
- `u{X...}` - Unicode hex value for a char, with 1 to 6 hex digits inside the braces, e.g. `\u{41}` or `\u{1F600}`. The old `\uXXXX` form without braces is an error.

A double-quoted string can span several lines. The line breaks are part of the string, and escapes work on every line.

If the word starts with `"` and also ends with `"`, double quotes inside it are kept without escapes, as long as there's no whitespace outside them, so `"[{a: "b"}]"` is the text `[{a: "b"}]`. See [Quotes inside a quoted word](/book/working_with_strings.md#quotes-inside-a-quoted-word) in the Book.

#### Escape errors

Each of these is a parse error, reported as "Invalid literal" with the reason below the code:

| String         | Reason in the error                                                                   |
| -------------- | ------------------------------------------------------------------------------------- |
| `"\q"`         | unrecognized escape sequence '\q'                                                     |
| `"\x4"`        | incomplete hex escape '\xHH', expected 2 hex digits                                   |
| `"\x4g"`       | invalid hex escape '\xHH', expected exactly 2 hex digits                              |
| `"\xff"`       | invalid UTF-8 from `\x` escapes (the bytes the escapes produce must form valid UTF-8) |
| `"\u{110000}"` | invalid unicode escape '\u{...}', must be 1-6 hex digits, max codepoint 0x10FFFF      |

The `\u{...}` error also covers an empty `\u{}`, more than 6 digits, a surrogate code point such as `\u{D800}`, and `\u0041` without braces. A missing `}`, as in `"\u{41"`, is reported as "incomplete unicode escape '\u{...}', missing closing '}'".

A backslash right before the closing quote escapes the quote, so the string doesn't end there:

```nu
"logs\"
# => Error: nu::parser::unclosed_delimiter
# =>
# =>   × Unclosed delimiter.
# =>    ╭─[repl_entry #1:1:7]
# =>  1 │ "logs\"
# =>    · ┬     ┬
# =>    · │     ╰── expected `"` here
# =>    · ╰── unclosed — opens here (need `"`)
# =>    ╰────
# =>   help: Add a matching `"` to close this delimiter, or check that an earlier
# =>         closer closed the wrong block.
```

Write `"logs\\"` for text that ends in a backslash, or use a single-quoted string.

Double quotes work within string interpolation as well.

### Single quotes

The single quote character should work identically to the double quote _except_ that escape characters will not be recognized and interpreted.

A single-quoted string can span several lines, and the line breaks are part of the string. There is no escape for `'`. Inner single quotes are kept only when they come in pairs and the word also ends with `'`, so `'it''s'` is the text `it''s`, not `it's`. For text with a lone `'`, use double quotes, backticks or a raw string.

Single quotes work within string interpolation as well, with the same rules: `$'it''s'` is `it''s`.

### Backtick quotes

A backtick-quoted string is a bare word that can contain spaces. It behaves like a bare word in these ways:

- It has no escapes. A backslash is kept as written.
- Passed to a parameter of type `path`, a leading `~` expands to the home directory and `...` expands to `../..`. Single- and double-quoted strings are passed as written.
- Passed to a parameter that takes a glob, such as for `ls`, it's a glob pattern, so `` ls `my dir/*.txt` `` lists the matching files.
- In command position it's a command name. A path such as `` `./my dir` ``, entered on its own at the prompt, changes to that directory.

Unlike a bare word, it isn't interpolated. A bare word such as `file($n).txt` evaluates `($n)`, but `` `file($n).txt` `` is kept as written, and there is no `` $`...` `` form:

```nu
let n = 3
echo `a\nb file($n).txt`
# => a\nb file($n).txt
```

It can span several lines and can't contain an unmatched backtick. When Tab completion inserts a path that contains a space or another special character, it wraps the path in backticks. A path that contains glob characters gets single or double quotes instead, so it isn't expanded as a glob.

See [Backtick-quoted Strings](/book/working_with_strings.md#backtick-quoted-strings) in the Book.

## Nested Quotes

Sometimes you need to nest quotes. Put double quotes inside a single-quoted string, or single quotes inside a double-quoted one. A backtick string can hold both kinds, as in `` `it's "quoted"` ``, which is the text `it's "quoted"`. A raw string such as `r#'it's "quoted"'#` can hold anything except its own closing `'#`.

### Example:

```nu
"This is just a string 'that needs an inner part quoted'"
'This is also a string "that needs an inner part quoted"'
```

The key to always remember is that double quotes recognize and interpret escapes so if you have any `\` characters in your string, they will be interpreted as escapes. The following is an example of a question we get frequently on Discord.

```nu
# Why doesn't this work?
"C:\Program Files\somedir"
# => Error: nu::parser::error
# =>
# =>   × Invalid literal
# =>    ╭─[repl_entry #1:2:4]
# =>  1 │ # Why doesn't this work?
# =>  2 │ "C:\Program Files\somedir"
# =>    ·    ───────────┬───────────
# =>    ·               ╰── unrecognized escape sequence '\P' in string
# =>    ╰────
```

It doesn't work because it sees `\P` and `\s` as escapes that are not recognized. Use single quotes or a raw string instead: `'C:\Program Files\somedir'` or `r#'C:\Program Files\somedir'#`.

## Bare word

A bare word is a string written without quotes, such as `hello` or `./my-file.txt`. See [Bare Word Strings](/book/working_with_strings.md#bare-word-strings) in the Book for where Nushell reads one as a string and where it reads it as a command name.

A bare word that is a valid literal of another type gets that type instead:

| Bare word                           | Type        |
| ----------------------------------- | ----------- |
| `42`, `0x1f`, `0b101`, `1_000`      | `int`       |
| `1.5`, `1e3`, `inf`, `NaN`          | `float`     |
| `true`, `false`                     | `bool`      |
| `null`                              | `nothing`   |
| `10sec`, `2day`                     | `duration`  |
| `2kb`, `1MiB`                       | `filesize`  |
| `2024-01-02`, `2024-01-02T03:04:05` | `datetime`  |
| `1..3`                              | `range`     |
| `0x[ff]`                            | `binary`    |
| `$.name`                            | `cell-path` |

A word that only starts like one of these is a string: `2kbx`, `trueX` and `1..3x` are strings. The table applies where any type is accepted, such as list items, record values and command parameters without a type. A parameter declared as `string` takes `42`, `2kb` or `2024-01-02` as text, but rejects `true` and `null` with "expected string". An external command gets every bare word as written. In a record key, every bare word is a string. See [How record keys are written](/book/navigating_structured_data.md#how-record-keys-are-written).

A bare word ends at whitespace (a space, a tab or a newline), at `|`, and at `;`. Inside a list, a `,` also ends it, and inside a record so do `,` and the `:` after a key. A closing `)`, `]` or `}` ends it when it closes a bracket opened before the word. Other characters are part of the word, so `a,b`, `x=y` and `abc#def` are each one word in a command argument. A `#` starts a comment only after whitespace.

Quotes and brackets inside a bare word don't end it, and whitespace between them stays in the word. The quote characters are kept, too:

```nu
[a"b c" d#e x[1 2]] | to nuon
# => ["a\"b c\"", "d#e", "x[1 2]"]
```

A bare word that contains `(` is an interpolated string. Each `( )` part is evaluated and joined with the text around it. Backslashes are kept as written, as in `$'...'`:

```nu
let n = 3
echo file($n).txt
# => file3.txt
```

In command position the word is still a command name, so `v($n)` on its own runs an external command named `v3`. A word that starts with a quote is not bare, and `"v"($n)` is a parse error. See [Interpolation in bare words](/book/working_with_strings.md#interpolation-in-bare-words) for the details.
