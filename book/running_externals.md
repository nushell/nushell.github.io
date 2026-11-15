# Running System (External) Commands

Nu provides a set of commands that you can use across different operating systems ("internal" commands) and having this consistency is helpful when creating cross-platform code. Sometimes, though, you want to run an external command that has the same name as an internal Nu command. To run the external [`ls`](/commands/docs/ls.md) or [`date`](/commands/docs/date.md) command, for example, preface it with the caret (^) sigil. Prefacing with the caret calls the external command found in the user's `PATH` (e.g. `/bin/ls`) instead of Nu's internal [`ls`](/commands/docs/ls.md) command).

Nu internal command:

```nu
ls
```

External command (typically `/usr/bin/ls`):

```nu
^ls
```

::: note
On Windows, `ls` is a PowerShell _alias_ by default, so `^ls` will not find a matching system _command_.
:::

## How Nushell finds a command

Without a sigil, Nushell first looks for the name among its own definitions: aliases, custom commands, and built-in commands. A custom command or alias with the same name as a built-in hides the built-in. Only when no definition has the name does Nushell run an external command, which it looks up on the `PATH`. If nothing there matches either, the call fails, and the error's help line suggests what you may have meant:

```nu
lsx
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ lsx
# =>    · ─┬─
# =>    ·  ╰── Command `lsx` not found
# =>    ╰────
# =>   help: Did you mean `ls`?
```

Instead of a similar name, the help line can name a command that matches by search term (`sqrt` suggests `math sqrt`), point to a module that has a command by that name and isn't imported yet, or say that a file by that name in the current directory isn't executable. A [`command_not_found` hook](./hooks.md) can replace it with a message of your own.

## Running a Built-in Command with `%`

The percent (`%`) sigil does the opposite of the caret: it always runs the Nushell built-in command, even when a custom command or alias with the same name shadows it:

```nu
def echo [...args] { "custom echo" }
echo hello
# => custom echo
%echo hello
# => hello
```

A `%` call only resolves to built-in commands. It still finds a built-in that has been hidden with [`hide`](/commands/docs/hide.md), and it never falls back to an external command or a custom command. If no built-in has that name, Nushell reports an error:

```nu
%lss
# => Error: nu::parser::error
# =>
# =>   × percent sigil requires a built-in command
# =>    ╭─[repl_entry #1:1:2]
# =>  1 │ %lss
# =>    ·  ─┬─
# =>    ·   ╰── unknown built-in command
# =>    ╰────
# =>   help: remove `%` to use normal resolution, or use `^` to run an external command explicitly
```

Like `^`, the `%` sigil also accepts a command name stored in a variable, such as `%$cmd`. The [completion menu](./line_editor.md#completion-menu) offers both forms: when an executable has the same name as a built-in command, it lists `^name` and `%name` so you can pick one.

With `%$cmd` or `%($cmd)`, the parser can't tell which built-in you mean, so it turns the call into [`run-internal`](/commands/docs/run-internal.md) with the name as the first argument. `run-internal` looks the name up when the line runs, and checks the arguments against that command's signature at that point:

```nu
let cmd = "str length"
"hello" | %$cmd --grapheme-clusters
# => 5
```

`%$cmd --help` prints the built-in's help, as it does for a direct call. Moving the lookup to run time also moves some errors from parse time to run time. An unknown flag, such as `%$cmd --nope`, is reported only when the call runs, after the commands before it on the line have run. A name that isn't a built-in, including the name of one of your own commands, is a `nu::shell::command_not_found` error. The value must be a single string. Unlike `^$cmd`, a list doesn't add arguments, and `%$cmd` with a list is a `nu::shell::cant_convert` error.

You can also call `run-internal` directly, as in `run-internal echo hi`. It then passes only positional arguments and spreads on to the command. A flag is read as a flag of `run-internal` itself, which has none, so `run-internal ls --all` is a parse error. Use `%$cmd` when you need flags.

## Passing Arguments

External arguments are separated by Nushell syntax, not by spaces inside a quoted string. Quote a string to keep its spaces inside one argument:

```nu
git commit -m "Update external command documentation"
```

The examples below use `printf '[%s]\n'`, which prints each argument it gets in brackets on its own line, to show exactly what an external command receives.

### Quotes inside a word

An argument that starts as a bare word can contain quoted parts. Nushell removes the quotes and joins the parts into one argument, as POSIX shells do. A double-quoted part processes escapes such as `\t`, and a single-quoted part is taken as written:

```nu
^printf '[%s]\n' --foo="bar baz" "a""b" --tab="a\tb" --raw='a\tb'
# => [--foo=bar baz]
# => [ab]
# => [--tab=a	b]
# => [--raw=a\tb]
```

Raw strings (`r#'...'#`) aren't recognized inside a bare word. Use a raw string as a whole argument instead.

Nushell gives `--` no special meaning in a call to an external command. It reaches the command unchanged, along with everything after it.

A subexpression in parentheses and an interpolated string (`$"..."`) are evaluated inside a bare word, but a variable on its own is not. Write `--n=($n)`, not `--n=$n`:

```nu
let n = 5
^printf '[%s]\n' --n=($n) --n=$n -$n --i=$"v($n)" pre(1 + 1)post
# => [--n=5]
# => [--n=$n]
# => [-$n]
# => [--i=v5]
# => [pre2post]
```

### Values that aren't strings

A value from a variable or a subexpression is converted to text. Integers, floats, and booleans become the same text that [`into string`](/commands/docs/into_string.md) gives (so `3.0` becomes `3`), a date becomes RFC 3339 text with milliseconds, and binary data is passed as its bytes. A bare word that looks like a value, such as `1kb` or `null`, is just text and is passed as you typed it:

```nu
^printf '[%s]\n' 3 (10 / 4) true (2024-01-01T10:20:30+02:00) 1kb null
# => [3]
# => [2.5]
# => [true]
# => [2024-01-01T10:20:30.000+02:00]
# => [1kb]
# => [null]
```

Records, ranges, closures, file sizes, durations, and `null` can't be converted, so `let size = 1kb; ^printf '[%s]\n' $size` is a `cant_convert` error. Convert the value yourself first, for example with `($size | into string)`.

### Spreading a list

Nushell does not automatically convert a list into external arguments, and passing a list directly produces an error. Use the spread operator (`...`) to pass each list item as its own argument:

```nu
let paths = ["file one.txt" "file two.txt"]
git add ...$paths
```

Here, `git` receives two path arguments, and the space in each path remains part of that argument. See [the spread operator in command calls](operators.md#in-command-calls) for more examples and the complete spreading rules.

Each item is converted by the rules in the previous section, so a list of numbers works, and a record inside the list is an error. Spread strings are never expanded as globs, even when the same text as a bare word would be:

```nu
^printf '[%s]\n' *.md ...['*.md']
# => [notes.md]
# => [readme.md]
# => [*.md]
```

Spreading a variable that holds `null` passes nothing, so `...$extra` can stand for optional arguments. A record can't be spread into an external command. `...$options` with a record in `$options` is an "Unknown flag" error, and a literal such as `...{a: 1}` is passed as the text `...{a: 1}`.

### Choosing the command at run time

The caret can also run an executable whose name or path is stored in a variable:

```nu
let program = "git"
^$program status
```

A subexpression works too, as in `^($program) status`. When the value is a list, its first item is the command and the rest are arguments that come before the ones you type:

```nu
let cmd = [printf '[%s]\n' first]
^$cmd second
# => [first]
# => [second]
```

In a bare command name, a leading `~` expands to your home directory, and `...` and longer runs of dots expand to parent directories, so `^~/bin/tool` and `.../scripts/build.sh` work. A name in quotes or in a variable is used as written, so `^'~/bin/tool'` looks for a directory that is literally named `~`.

See [Strings as external commands](working_with_strings.md#strings-as-external-commands) for the supported string forms. An [`extern` declaration](externs.md) can add type checking and completions for a known external command, and its [`@structured`](externs.md#structured-output) attribute can turn the command's output into data. Calling it follows the same argument rules described here.

## Additional Windows Notes

When running an external command on Windows,
Nushell forwards some `CMD.EXE` internal commands to cmd instead of attempting to run external commands.
[Coming from CMD.EXE](coming_from_cmd.md) contains a list of these commands and describes the behavior in more detail.

Nushell can't safely pass every argument to these forwarded commands. An argument that contains a newline, a `%`, or a double quote is an error, unless the argument is one string wrapped in a single pair of double quotes, which is passed as it is. Nushell wraps an argument in double quotes when it contains a space or one of `<`, `>`, `&`, `|`, and `^`.

To find a command that you typed without its extension, Nushell tries the extensions listed in `PATHEXT` (see [`$env.PATHEXT`](./special_variables.md#env-pathext)). A `.ps1` script runs with `powershell.exe -File`. A file with an extension that you added to `PATHEXT` and associated with a program using `assoc` and `ftype` runs through `cmd.exe /D /C`, so the association applies.
