# `std/clip`

The `std/clip` module copies to and pastes from the system clipboard through the terminal. Its commands don't talk to the operating system. They send an OSC 52 escape sequence, which asks the terminal emulator to do the copying or pasting. That also works over SSH, and the clipboard they reach is the one on the machine where the terminal runs.

```nu
use std/clip
```

`std/clip` is the only standard library module that `use std` and `use std *` leave out, so there is no `std clip copy52`. Import it on its own, as above.

[[toc]]

## Terminal support

Everything here depends on the terminal. It has to understand OSC 52, and many terminals have settings that turn copying or pasting through OSC 52 on or off. Terminal multiplexers such as tmux, screen and zellij sit between Nushell and the terminal and may block the sequence or need configuration to pass it on.

## `clip copy52`

`clip copy52` copies its input to the clipboard:

```nu
"Hello" | clip copy52
```

It returns nothing. It writes the escape sequence, with the text encoded as base64, to standard output, so it only reaches the terminal when stdout is the terminal. Redirect it to a file and the file gets the escape sequence instead.

A string is copied as it is. A table, record or list is first rendered with [`table -e`](/commands/docs/table.md), the way it would look on the screen, and that text is copied. The rendering has no colors unless you pass `--ansi` (`-a`), which keeps the ANSI color codes in the copied text. `--ansi` doesn't affect strings, so a string that already contains ANSI codes is copied with them. Remove them first with [`ansi strip`](/commands/docs/ansi_strip.md) if you don't want them.

## `clip paste52`

`clip paste52` asks the terminal for the clipboard's content and returns it as a string. It sends the OSC 52 query with [`term query`](/commands/docs/term_query.md) and reads the terminal's reply from standard input.

If the terminal doesn't answer, `clip paste52` waits until you press a key and then fails, because a key press isn't the reply it expects. When stdin isn't a terminal, it fails at once. The error is `Terminal did not responds to OSC 52 paste request.`, with the hint `Check if your terminal supports OSC 52.`

## `clip prefix`

`clip prefix` adds a prefix to the start of every line of its input and returns the result as a string. Like `clip copy52`, it first renders a table, record or list with `table -e`. The last line of a rendered table is empty, and it gets the prefix too:

```nu
[1 2 3] | clip prefix "# => "
# => # => ╭───┬───╮
# => # => │ 0 │ 1 │
# => # => │ 1 │ 2 │
# => # => │ 2 │ 3 │
# => # => ╰───┴───╯
# => # =>
```

Its help suggests `ls | clip prefix '# => ' | clip copy52` for copying output into documentation written the way this book shows output. Unlike `clip copy52`, though, `clip prefix` doesn't turn colors off. At the prompt, where standard output is a terminal, the table it renders contains ANSI color codes, and `clip copy52` copies a string with its codes. Strip them on the way:

```nu
ls | clip prefix '# => ' | ansi strip | clip copy52
```

## Native clipboard commands

Nushell also has built-in `clip copy` and `clip paste` commands that use the operating system's clipboard directly instead of OSC 52. They are behind the `native-clip` [experimental option](../configuration.md#experimental-options) and exist only when it is turned on, for example with:

```nu
nu --experimental-options '[native-clip]'
```

Without the option, `clip copy` isn't a command at all, and Nushell looks for an external program named `clip`. With it, the commands work on macOS, Windows and Linux. On other platforms they exist but fail with `Clipboard not supported`. Unlike the `std/clip` commands, they don't need a terminal, but they reach only the clipboard of the machine Nushell runs on, not the one at the other end of an SSH session. See `help clip copy` and `help clip paste` for their flags.
