# Strings and Text Formatting

## String literals

- Maybe it's the backtick quote?
- Should we have a `r"some\nliteral\tstring"` ala rust?
- Should we have something like python's triple double quotes like `"""` which helps with multi-line strings and also does string literal things?

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

### Example:

```nu
"This is just a string 'that needs an inner part quoted'"
'This is also a string "that needs an inner part quoted"'
```

The key to always remember is that double quotes recognize and interpret escapes so if you have any `\` characters in your string, they will be interpreted as escapes. The following is an example of a question we get frequently on Discord.

```nu
# => Why doesn't this work?
cd "C:\Program Files\somedir"
```

It doesn't work because it sees `\P` and `\s` as escapes that are not recognized.

## Bare word
