# Custom Commands

A custom command is a named, reusable block of code defined with [`def`](/commands/docs/def.md). Once defined, it is called exactly like a built-in command: it takes positional arguments and flags, reads pipeline input through `$in`, shows up in `help`, and gets completions.

See also: [Custom Commands](/book/custom_commands.md) in the Book, which covers each feature below in tutorial form.

## Defining Custom Commands

```text
def <name> [<parameters>]: <input type> -> <output type> { <body> }
```

- The name may contain spaces to make a subcommand, e.g. `def "str shout" [] { ... }`. Parser keywords such as `if`, `let` or `def` cannot be used as names.
- The `: <input> -> <output>` part is optional. Several input/output pairs can be given in brackets: `[int -> int, string -> string]`.
- `def --env` keeps changes the body makes to the environment (see [Function Scope](#function-scope)).
- `def --wrapped` passes unknown flags through to a `...rest` parameter as strings, which is useful for wrapping external commands.
- A comment directly above the `def`, and comments after each parameter, become the command's `help` text.
- Inside a [module](/book/modules.md), `export def` makes the command available to `use`.

```nu
# Add two numbers
def add [
  a: int  # first number
  b: int  # second number
]: nothing -> int { $a + $b }
help add
# => Add two numbers
# =>
# => Usage:
# =>   > add <a> <b>
# =>
# => Flags:
# =>   -h, --help: Display the help message for this command
# =>
# => Command Type:
# =>   > custom
# =>
# => Parameters:
# =>   a <int>: first number
# =>   b <int>: second number
# =>
# => Input/output types:
# =>   ╭───┬─────────┬────────╮
# =>   │ # │  input  │ output │
# =>   ├───┼─────────┼────────┤
# =>   │ 0 │ nothing │ int    │
# =>   ╰───┴─────────┴────────╯
```

The body is checked against the declared output type while parsing. Because an empty body outputs its input, `def f []: nothing -> list { }` is rejected. Write `{ [] }` instead.

## Calling Custom Commands

Arguments and flags are parsed and type-checked while parsing, just like for built-in commands. The value of the body's last expression is the command's result (use [`return`](./flow_control/return.md) to leave early), and pipeline input is available as `$in`:

```nu
def double []: int -> int { $in * 2 }
21 | double
# => 42
```

```nu
def double []: int -> int { $in * 2 }; "a" | double
# => Error: nu::parser::input_type_mismatch
# =>
# =>   × Command does not support string input.
# =>    ╭─[repl_entry #1:1:46]
# =>  1 │ def double []: int -> int { $in * 2 }; "a" | double
# =>    ·                                              ───┬──
# =>    ·                                                 ╰── command doesn't support string input
# =>    ╰────
```

A few calling conventions apply to custom and built-in commands alike:

- `--` ends the flags. Everything after it is positional, even if it starts with `-`:

  ```nu
  def show [--flag, ...args] { {flag: $flag, args: $args} }
  show -- --flag x
  # => ╭──────┬────────────────╮
  # => │ flag │ false          │
  # => │      │ ╭───┬────────╮ │
  # => │ args │ │ 0 │ --flag │ │
  # => │      │ │ 1 │ x      │ │
  # => │      │ ╰───┴────────╯ │
  # => ╰──────┴────────────────╯
  ```

- A record can be spread into named flags with `...`. A switch is set by `true`. A `null` value (for any flag whose type does not accept `nothing`) leaves the flag out, so its default applies:

  ```nu
  def f [--color: string, --count: int = 1, --verbose] { {color: $color, count: $count, verbose: $verbose} }
  let opts = {color: red, count: null, verbose: true}
  f ...$opts
  # => ╭─────────┬──────╮
  # => │ color   │ red  │
  # => │ count   │ 1    │
  # => │ verbose │ true │
  # => ╰─────────┴──────╯
  ```

- A custom command may shadow a built-in of the same name. The `%` sigil still calls the built-in, just as `^` calls an external command:

  ```nu
  def length [] { 'my length' }
  [(length) ([1 2 3] | %length)]
  # => ╭───┬───────────╮
  # => │ 0 │ my length │
  # => │ 1 │         3 │
  # => ╰───┴───────────╯
  ```

## Function Scope

A custom command's body is scoped like a closure: see [Variable Scope](./variable_scope.md#custom-commands) for the details.

- It can read `let` and `const` variables that are in scope where it is defined, but not `mut` variables.
- Its parameters and local variables are not visible to the caller.
- A `def` is visible in the whole block it is defined in, even before its definition, and not outside that block. A `def` inside another `def` is local to it.
- Changes to `$env` (including `cd`) are discarded when the command returns, unless it is defined with `def --env`.

```nu
def --env go-tmp [] { cd /tmp }
go-tmp
pwd
# => /tmp
```

## Closures

A [closure](./types/basic_types/closure.md) (`{|params| body }`) is similar to a custom command, with these differences:

| Custom command                                              | Closure                                               |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| Has a name and is called directly                           | Is a value: stored in variables, passed as arguments  |
| Can have flags, docs, and input/output types                | Only positional parameters (with types, defaults, rest) |
| Arguments are type-checked while parsing                    | Arguments are type-checked when it runs               |
| Visible in its whole block (hoisted)                        | Usable after the `let` that stores it                 |

A closure is run with [`do`](/commands/docs/do.md), or by a command that takes one, such as `each` or `where`. A command can accept a closure parameter and call it:

```nu
def apply [f: closure, value] { do $f $value }
apply {|v| $v * 10 } 4
# => 40
```

## Arguments & Parameters

| Syntax in `[ ]`         | Meaning                                                          | Value when not given   |
| ----------------------- | ---------------------------------------------------------------- | ---------------------- |
| `name`, `name: type`    | Required positional parameter                                    | (error)                |
| `name?`, `name?: type`  | Optional positional parameter                                    | `null`                 |
| `name = value`          | Optional positional parameter with a default                     | the default            |
| `--flag`, `--flag (-f)` | Switch (a `bool`; no type annotation allowed)                    | `false`                |
| `--flag: type`          | Flag that takes a value                                          | `null`                 |
| `--flag: type = value`  | Flag with a default value                                        | the default            |
| `...rest`, `...rest: type` | Any number of remaining positional arguments, as a list       | `[]`                   |

Parameters can be separated by spaces, commas or newlines. Without a type, a parameter accepts `any` value. Flag values can be written as `--flag value` or `--flag=value`, and switches as `--flag` or `--flag=false`.

```nu
def greet [
  name: string          # required positional
  greeting?: string     # optional positional
  --shout (-s)          # switch
  --times: int = 1      # flag with a value and a default
] {
  let text = $"($greeting | default 'Hello'), ($name)!"
  let text = if $shout { $text | str uppercase } else { $text }
  1..$times | each { $text } | str join ' '
}
[(greet Ada) (greet Ada Hi --shout) (greet Ada --times 2)]
# => ╭───┬─────────────────────────╮
# => │ 0 │ Hello, Ada!             │
# => │ 1 │ HI, ADA!                │
# => │ 2 │ Hello, Ada! Hello, Ada! │
# => ╰───┴─────────────────────────╯
```

```nu
def f [x: int] { $x }; f "a"
# => Error: nu::parser::parse_mismatch
# =>
# =>   × Parse mismatch: expected int.
# =>    ╭─[repl_entry #1:1:26]
# =>  1 │ def f [x: int] { $x }; f "a"
# =>    ·                          ─┬─
# =>    ·                           ╰── expected int
# =>    ╰────
# =>   help: Check the syntax around this position — a typo, missing delimiter, or wrong separator is common.
```

See [Parameters](/book/custom_commands.md#parameters) and [Rest Parameters with Wrapped External Commands](/book/custom_commands.md#rest-parameters-with-wrapped-external-commands) in the Book for more examples, and [Type Signatures](./types/type_signatures.md) for the type syntax.
