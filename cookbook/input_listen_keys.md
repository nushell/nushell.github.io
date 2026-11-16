---
title: Acting on keypresses using `input listen`
---

# Acting on keypresses using `input listen`

A common "key listening" pattern is to:

- Listen for a specific key (or one of a set of keys) to be pressed
- Take action depending on which key was pressed
- Loop if one of the expected keys wasn't pressed

`input listen --types [key]` waits for a single keypress and returns a record that describes it. For example, pressing <kbd>Ctrl</kbd>+<kbd>C</kbd> returns:

```nu
input listen --types [key]
# => ╭───────────┬───────────────────────────────╮
# => │ type      │ key                           │
# => │ key_type  │ char                          │
# => │ code      │ c                             │
# => │           │ ╭───┬───────────────────────╮ │
# => │ modifiers │ │ 0 │ keymodifiers(control) │ │
# => │           │ ╰───┴───────────────────────╯ │
# => ╰───────────┴───────────────────────────────╯
```

The examples below compare the `code` and `modifiers` fields of this record against the keys they expect.

There are several patterns that can accomplish this, each with advantages and disadvantages. You can choose from one of the following patterns that best fits your use-case and coding style:

1.  A first attempt might be the following simple loop. This will work for some cases, but a `loop` cannot itself return a _value_:

    ```nu
    def run_some_code [] {
      print "I'm running the code, but I can't return a"
      print "value because I need to `break` out of the loop."
      42
    }

    print '(a) Run some code (x) Exit'

    loop {
      let key = (input listen --types [key])
      if ($key.code == 'a') and ($key.modifiers == []) {
          run_some_code
          break
      } else if ($key.code == 'x') and ($key.modifiers == []) {
          print 'User exited'
          break
      } else if ($key.code == 'c') and ($key.modifiers == ['keymodifiers(control)']) {
          print 'Terminated with Ctrl-C'
          break
      } else {
          print "That key wasn't recognized."
          print 'Press (a) to run some code or (x) to Exit'
          continue
      }
    }
    ```

2.  If you need to return a value, you can use a mutable variable to hold the key result after the input loop has ended, _then_ return a value based on the captured keypress:

    ```nu
    def run_some_code [] {
      print "I'm running the code and returning 42"
      42
    }

    mut key_props = []
    print '(a) Run some code (x) Exit'

    loop {
      let key = (input listen --types [key])
      $key_props = [$key.code $key.modifiers]
      let valid_keys = [
        [ 'a' [] ]
        [ 'x' [] ]
        [ 'c' ['keymodifiers(control)'] ]
      ]

      if $key_props in $valid_keys {
          break
      } else {
          print "That key wasn't recognized."
          print 'Press (a) to run some code or (x) to Exit'
          continue
      }
    }

    # Act on the captured keypress from the mutable variable
    if $key_props == [ 'a' [] ] {
        run_some_code
    } else if $key_props == [ 'x' [] ] {
        print 'User exited'
    } else if $key_props == [ 'c' ['keymodifiers(control)'] ] {
        print 'Terminated with Ctrl-C'
    }
    ```

3.  This version uses a custom command that recursively calls itself until one of the desired keys is pressed. However, keep in mind that Nushell limits the number of recursive calls based on the value of `$env.config.recursion_limit` (default 50). Hold down the <kbd>y</kbd> key (not monitored) to demonstrate an early exit based on recursion limits.

    Note that `break` statements are not needed in this version.

    ```nu
    def run_some_code [] {
      print "I'm running the code and returning 42"
      42
    }

    print '(a) Run some code (x) Exit'

    def input_loop [] {
      let key = (input listen --types [key])
      if ($key.code == 'a') and ($key.modifiers == []) {
          run_some_code
      } else if ($key.code == 'x') and ($key.modifiers == []) {
          print 'User exited'
      } else if ($key.code == 'c') and ($key.modifiers == ['keymodifiers(control)']) {
          print 'Terminated with Ctrl-C'
      } else {
          print "That key wasn't recognized."
          print 'Press (a) to run some code or (x) to Exit'
          # Recurse
          input_loop
      }
    }
    # Start the loop
    try {
      input_loop
    } catch {|e| print ($e.debug)}
    ```

4.  The `generate` command offers a functional loop alternative, without recursion limits or mutable variables. `generate` can also collect multiple results into a list, and the output is streamed.

    ```nu
    def run_some_code [] {
      print "I'm running the code and returning 42"
      42
    }

    print '(a) Run some code (x) Exit'

    # The parameter's default value is the initial value that `generate` requires
    let key_generator = {|_ = null|
      let key = (input listen --types [key])

      if ($key.code == 'a') and ($key.modifiers == []) {
          # Returning an "out" record without a "next" terminates the loop
          { out: (run_some_code) }
      } else if ($key.code == 'x') and ($key.modifiers == []) {
          print 'User exited'
          { out: null }
      } else if ($key.code == 'c') and ($key.modifiers == ['keymodifiers(control)']) {
          print 'Terminated with Ctrl-C'
          { out: null }
      } else {
          print "That key wasn't recognized."
          print 'Press (a) to run some code or (x) to Exit'
          # Next key generation
          { next: null }
      }
    }

    generate $key_generator | get 0
    ```

## Using match statements with a list of keycodes

The above examples use `if`/`else` statements with hard-coded key values. You may find it easier to maintain your code using `match` statements with a list of keycodes and modifiers. Using this technique, the second example above might look like:

```nu
def run_some_code [] {
  print "I'm running the code and returning 42"
  42
}

let keys = {
  # [ key.code key.modifiers ]
  a:      [ 'a' [] ]
  x:      [ 'x' [] ]
  ctrl-c: [ 'c' ['keymodifiers(control)'] ]
}
mut key: record = {}
print '(a) Run some code (x) Exit'

loop {
  $key = (input listen --types [key])
  match [$key.code $key.modifiers] {
    $keymatch if $keymatch == $keys.a => {break}
    $keymatch if $keymatch == $keys.x  => {print 'User exited'; break}
    $keymatch if $keymatch == $keys.ctrl-c => {print 'Terminated with Ctrl-C'; break}
    _ => {
      print "That key wasn't recognized"
      print 'Press (a) to run some code or (x) to Exit'
      continue
    }
  }
}

# Act on the captured keypress from the mutable variable
match [$key.code $key.modifiers] {
  $k if $k == $keys.a => {run_some_code}
}
```

## The records `input listen` returns

[`input listen`](/commands/docs/input_listen.md) waits for one event from the terminal and returns it
as a record. `--types` takes a list of the kinds of events to wait for: `key`, `mouse`, `paste`,
`resize` and `focus`. Events of other kinds are skipped. Without `--types` it returns the first event
of any kind. Some terminals report focus as soon as focus reporting is turned on, so a plain
`input listen` can return `{type: focus, event: gained}` before you press anything. Name the types
you want.

Every record has a `type` field with the kind of event:

| `type`   | Other fields                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`    | `key_type`, `code` and `modifiers`, described below                                                                                                         |
| `mouse`  | `col` and `row` of the cell, counted from 0; `kind`, such as `Left_down`, `Right_up`, `Middle_drag`, `moved`, `scroll_up` or `scroll_down`; and `modifiers` |
| `paste`  | `content`, the pasted text, newlines included                                                                                                               |
| `resize` | `col` and `row`, the new width and height of the terminal                                                                                                   |
| `focus`  | `event`, which is `gained` or `lost`                                                                                                                        |

For a key, `key_type` says what `code` holds:

- `char`: the character, such as `a`, `A` or `$`
- `f`: the number of a function key, such as `5` for <kbd>F5</kbd>
- `media`: a media key, such as `play` or `tracknext`
- `modifier`: a modifier key pressed on its own, such as `leftshift`. Terminals send these only in a
  kitty keyboard protocol mode that `input listen` doesn't turn on, so you won't normally see them.
- `other`: any other key, in lowercase, such as `up`, `enter`, `backspace` or `esc`

`modifiers` lists the modifiers held down, each written as `keymodifiers(<name>)`, where the name is
`shift`, `control`, `alt`, `super`, `hyper` or `meta`.

With `--raw`, key and mouse records also get `raw_modifiers`, the modifiers as a number with one bit
each: 1 for <kbd>Shift</kbd>, 2 for <kbd>Ctrl</kbd>, 4 for <kbd>Alt</kbd>, 8 for super, 16 for hyper
and 32 for meta. A key record for a character key also gets `raw_code`, the character's code point.
Pressing <kbd>Ctrl</kbd>+<kbd>A</kbd> gives:

```nu
input listen --types [key] --raw
# => ╭───────────────┬───────────────────────────────╮
# => │ type          │ key                           │
# => │ key_type      │ char                          │
# => │ code          │ a                             │
# => │               │ ╭───┬───────────────────────╮ │
# => │ modifiers     │ │ 0 │ keymodifiers(control) │ │
# => │               │ ╰───┴───────────────────────╯ │
# => │ raw_code      │ 97                            │
# => │ raw_modifiers │ 2                             │
# => ╰───────────────┴───────────────────────────────╯
```

`--timeout` sets how long to wait. When nothing arrives in time, `input listen` fails with
`Timed out while waiting for user input`, which you can catch with [`try`](/commands/docs/try.md):

```nu
try { input listen --types [key] --timeout 5sec } catch { print "No key pressed" }
```

To keep an event in a variable, give the variable the type `record`, as in
`let event: record = input listen --types [mouse]`.

`input listen` needs a terminal. Run with its input redirected, as in `nu -c 'input listen' < file`,
it fails with an I/O error. Where Nushell has detached the terminal, such as in a completer, it fails
with `Interactive input is unavailable in this context`. When `$env.config.use_kitty_protocol` is
on, `input listen` turns on the kitty keyboard protocol while it waits, and first prints
`WARN: The terminal doesn't support use_kitty_protocol config.` if the terminal lacks it. Keys then
come back as the protocol reports them, which can tell apart keys such as <kbd>Tab</kbd> and
<kbd>Ctrl</kbd>+<kbd>I</kbd>.
