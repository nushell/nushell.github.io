# Custom Commands

A custom command is a named, reusable block of code defined with [`def`](/commands/docs/def.md). Once defined, it is called exactly like a built-in command: it takes positional arguments and flags, reads pipeline input through `$in`, shows up in `help`, and gets completions.

See also: [Custom Commands](/book/custom_commands.md) in the Book, which covers each feature below in tutorial form.

## Defining Custom Commands

```text
def <name> [<parameters>]: <input type> -> <output type> { <body> }
```

- The name may contain spaces to make a subcommand, e.g. `def "str shout" [] { ... }`. Parser keywords such as `if`, `let` or `def` cannot be used as names.
- A name whose first word is a value literal (a number, filesize, duration, datetime, binary literal or range, such as `5sec` or `1..2`), or that contains `#`, `^` or `%`, or uses whitespace other than single spaces between words, could never be called. `def`, `extern` and `alias` reject it with `nu::parser::variable_not_valid` ("Command name not supported"). See [Naming Commands](/book/custom_commands.md#naming-commands).
- The name and the signature must be separated by whitespace. `def greet[name] {}` fails with "no space between name and parameters".
- The signature may be written in parentheses instead of brackets: `def add (a: int, b: int) { $a + $b }`.
- The body must be written out as a `{ ... }` block. A variable holding a closure is rejected with `Parse mismatch: expected definition body closure { ... }`.
- A block can define each name once. A second `def` or `extern` with the same name in the same block (including a whole script or module) is a `nu::parser::duplicate_command_def` error. A `def` in a nested block shadows the outer one inside that block, and each REPL entry is a new block, so redefining a command at the prompt replaces it. See [Defining a command more than once](/book/custom_commands.md#defining-a-command-more-than-once).
- The `: <input> -> <output>` part is optional. Several input/output pairs can be given in brackets: `[int -> int, string -> string]`.
- `def --env` keeps changes the body makes to the environment (see [Function Scope](#function-scope)).
- `def --wrapped` passes unknown flags and arguments through to a `...rest` parameter, which is useful for wrapping external commands. The rest parameter is required (`nu::parser::missing_positional` without one) and must be untyped or `string` (`nu::parser::type_mismatch_help` otherwise). An untyped rest parameter has the `external_arg` shape, so bare words and flags arrive as the strings that were typed, while a subexpression keeps its value. A wrapped command gets no `--help` flag, so `--help` and `-h` go to the rest parameter. See [Rest Parameters with Wrapped External Commands](/book/custom_commands.md#rest-parameters-with-wrapped-external-commands).
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

Parameters can be separated by spaces, commas or newlines, and a parameter name may be written with a leading `$` (`def f [$x]`). Without a type, a parameter accepts `any` value, unless it has a default value, in which case it takes the default's type, so `count = 1` only accepts an `int`. A `null` default gives the type `nothing`, so write `x?` or `x: any = null` for a parameter that may be left out. A flag with a default but no type, such as `--count = 1`, is a flag that takes a value of that type, not a switch. Flag values can be written as `--flag value` or `--flag=value`, and switches as `--flag` or `--flag=false`.

The parser also checks these rules:

- Required positional parameters come before optional ones. A required parameter after an optional one is a `nu::parser::required_after_optional` error.
- Inside the body, an optional parameter `name?: T` without a default has the type `oneof<T, nothing>`, because it is `null` when the argument is left out.
- A default value must be a parse-time constant: a literal, an expression of literals, or a `const` variable. Anything else is a `nu::parser::non_constant_default_value` error.
- There can be only one rest parameter (`nu::parser::multiple_rest_params`). It must be the last positional parameter (`nu::parser::positional_after_rest`), though flags may follow it, and it can't have a default value (`nu::parser::assignment_mismatch`).
- `--help` is reserved, so declaring it is an error ("The `--help` flag is reserved"). Its short form `-h` isn't. Another flag may use it, and then `-h` sets that flag instead of showing help.
- A switch can't have a type annotation, so `--flag: bool` is an error.
- `block` is not a valid type. The error's hint says to use `closure` instead.

Every parameter binds a variable, and all of them share one namespace:

- A positional or rest parameter binds its own name. `$name` in the signature is the same as `name`.
- A long flag binds its name with `-` replaced by `_`, so `--foo-bar` binds `$foo_bar`. A flag with only a short form, such as `-v`, binds `$v`.
- No two parameters or flags may bind the same variable, and no two flags may share a short letter. A repeat is a `nu::parser::duplicate_parameter` error that points at both uses.
- `_` is the exception. Positional parameters named `_` may repeat, to ignore arguments.
- The names of the built-in variables `in`, `nu`, `env` and `ans` can't be used, so `def f [in] {}` and `def f [--env] {}` are `nu::parser::name_is_builtin_var` errors. See [Reserved Names](./declarations.md#reserved-names).
- Nushell doesn't check `extern` signatures, because an `extern` binds no variables.

See [Flags](/book/custom_commands.md#flags) in the Book for an example of the error.

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

## Inspecting commands

[`scope commands`](/commands/docs/scope_commands.md) returns a row for every command in scope, built-in or custom. [`help commands`](/commands/docs/help_commands.md) gives a shorter view of the same commands. The columns of `scope commands` are:

| Column              | Contents                                                                                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | The command name. A subcommand's name contains a space.                                                                                                                          |
| `category`          | The category, set with `@category` for a custom command. Empty for a custom command without one.                                                                                 |
| `signatures`        | A record with one key per input type. Each value is a table of the command's parameters (see below).                                                                             |
| `description`       | The first paragraph of the doc comment.                                                                                                                                          |
| `examples`          | A table with `description`, `example` and `result` columns, from `@example`.                                                                                                     |
| `attributes`        | A table with `name` and `value` columns for the attributes Nushell stores rather than applies, such as `@deprecated` and [your own attributes](/book/custom_commands.md#defining-your-own-attributes). |
| `type`              | `built-in`, `custom`, `keyword`, `plugin`, or `external` for a command declared with `extern`.                                                                                   |
| `is_sub`            | `true` when the name contains a space.                                                                                                                                           |
| `is_const`          | `true` when the command can run at parse time. See [`const`](./declarations.md#const).                                                                                           |
| `creates_scope`     | `false` for every command in Nushell 0.117.0.                                                                                                                                    |
| `extra_description` | The rest of the doc comment.                                                                                                                                                     |
| `search_terms`      | The `@search-terms` values, joined with `, `.                                                                                                                                     |
| `complete`          | The command-wide completer set with `@complete`: the `decl_id` of the completer command, `external` for `@complete external`, or `null`.                                          |
| `deprecation_info`  | A table with a row for each `@deprecated` attribute: `type` (`Command` or `Flag`), `label`, `flag`, `since`, `expected_removal` and `help`.                                        |
| `decl_id`           | A number that identifies the command in this session. The `complete` column and the `aliased_decl_id` column of `scope aliases` refer to commands by this number.                  |

Each table in `signatures` has a row for the input type, one for each parameter and flag, and one for the output type. Its columns are `parameter_name`, `parameter_type`, `syntax_shape`, `is_optional`, `short_flag`, `description`, `completion` and `parameter_default`. `parameter_type` is one of `input`, `positional`, `rest`, `named` (a flag that takes a value), `switch` or `output`. The built-in `--help` flag isn't listed.

```nu
def greet [name: string, --times (-t): int = 1, --loud]: nothing -> string { "" }
scope commands | where name == greet | get 0.signatures.nothing | select parameter_name parameter_type syntax_shape short_flag parameter_default
# => ╭───┬────────────────┬────────────────┬──────────────┬────────────┬───────────────────╮
# => │ # │ parameter_name │ parameter_type │ syntax_shape │ short_flag │ parameter_default │
# => ├───┼────────────────┼────────────────┼──────────────┼────────────┼───────────────────┤
# => │ 0 │                │ input          │ nothing      │            │                   │
# => │ 1 │ name           │ positional     │ string       │            │                   │
# => │ 2 │ times          │ named          │ int          │ t          │                 1 │
# => │ 3 │ loud           │ switch         │              │            │                   │
# => │ 4 │                │ output         │ string       │            │                   │
# => ╰───┴────────────────┴────────────────┴──────────────┴────────────┴───────────────────╯
```
