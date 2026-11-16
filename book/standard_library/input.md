# `std/input`

The `std/input` module has one command, `input display`, which shows the key presses that Nushell receives, one line per key. Use it to find out what a key combination looks like to Nushell, for example before you write a [keybinding](../line_editor.md#keybindings).

```nu
use std/input
input display --types [key]
```

`input display` calls [`input listen`](/commands/docs/input_listen.md) in a loop and prints each event it returns on its own line. It stops when you press <kbd>Esc</kbd> without modifiers. To get the events as records instead, call `input listen` yourself.

`--types` (`-t`) sets the kinds of event to listen for. Use `[key]`, as above, to show key presses. `--raw` (`-r`) adds two fields to key events: `raw_code`, the character's code in hexadecimal, for character keys only, and `raw_modifiers`, the modifier bits in binary.
