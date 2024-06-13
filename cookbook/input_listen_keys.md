---
title: Acting on keypresses using `input listen`
---

# Acting on keypresses using `input listen`

A common "key listening" pattern is to:

- Listen for a specific key (or one of a set of keys) to be pressed
- Take action depending on which key was pressed
- Loop if one of the expected keys wasn't pressed

There are several patterns that can accomplish this, each with advantages and disadvantages. You can choose from one of the following patterns that best fits your use-case and coding style:

1.  A first attempt might be the following simple loop. This will work for some cases, but a `loop` cannot itself return a _value_:

    ```nu
    def run_some_code [] {
      print "I'm running the code, but I can't return a"
      print "value because I need to `break` out of the loop."
      42
      break
    }

    print '(a) Run some code (x) Exit'

    loop {
      let key = (input listen --types [key])
      if ($key.code == 'a') and ($key.modifiers == []) {
          run_some_code
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

    let key_generator = {|_|
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

    generate null $key_generator | get 0
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
mut key = {keycode: '', modifiers: ['']}
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
