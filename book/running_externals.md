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

## Passing Arguments

External arguments are separated by Nushell syntax, not by spaces inside a quoted string. Quote a string to keep its spaces inside one argument:

```nu
git commit -m "Update external command documentation"
```

Nushell does not automatically convert a list into external arguments, and passing a list directly produces an error. Use the spread operator (`...`) to pass each list item as its own argument:

```nu
let paths = ["file one.txt" "file two.txt"]
git add ...$paths
```

Here, `git` receives two path arguments, and the space in each path remains part of that argument. See [the spread operator in command calls](operators.md#in-command-calls) for more examples and the complete spreading rules.

The caret can also run an executable whose name or path is stored in a variable:

```nu
let program = "git"
^$program status
```

See [Strings as external commands](working_with_strings.md#strings-as-external-commands) for the supported string forms. An [`extern` declaration](externs.md) can add type checking and completions for a known external command; calling it follows the same argument rules described here.

## Additional Windows Notes

When running an external command on Windows,
Nushell forwards some `CMD.EXE` internal commands to cmd instead of attempting to run external commands.
[Coming from CMD.EXE](coming_from_cmd.md) contains a list of these commands and describes the behavior in more detail.
