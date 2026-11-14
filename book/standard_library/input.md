# `std/input`

The `std/input` module has one command, `input display`, which shows the keyboard and other terminal events that Nushell receives, one line per event. Use it to find out what a key combination looks like to Nushell, for example before you write a [keybinding](../line_editor.md#keybindings).

```nu
use std/input
input display
```

`input display` calls [`input listen`](/commands/docs/input_listen.md) in a loop and prints each event it returns, written as NUON on one line. It stops when you press <kbd>Esc</kbd> without modifiers. To get the events as records instead, call `input listen` yourself.

`--types` (`-t`) takes a list of the event types to listen for: `focus`, `key`, `mouse`, `paste` and `resize`. Without it, `input display` listens for all five. It always listens for key events, so that <kbd>Esc</kbd> still works, but if your list leaves out `key`, it doesn't print them. `--raw` (`-r`) adds two fields to key events: `raw_code`, the character's code in hexadecimal, for character keys only, and `raw_modifiers`, the modifier bits in binary. The flag's help text calls the second field `raw_flags`, but its name is `raw_modifiers`.

::: warning
In Nushell 0.117.0, `input display` works only for key events. It stores each event in a variable whose type allows only the fields of a key event, so the first focus, mouse, paste or resize event stops it with a type mismatch. Some terminals send a focus event as soon as a program turns on focus reporting, and there `input display` fails before you press anything. Run `input display --types [key]` to avoid this.

Each line also ends with a stray `}`, because `input display` removes the opening brace of the NUON record but not the closing one. A press of <kbd>a</kbd> prints:

```nu
input display --types [key]
# => type: key, key_type: char, code: a, modifiers: []}
```

:::
