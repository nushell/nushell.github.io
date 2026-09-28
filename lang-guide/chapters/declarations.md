# Declarations

Nushell has three keywords that declare variables:

| Keyword                              | Value computed    | Reassignable | Captured by closures | Usable at parse time |
| ------------------------------------ | ----------------- | ------------ | -------------------- | -------------------- |
| [`let`](/commands/docs/let.md)       | When it runs      | No           | Yes                  | No                   |
| [`mut`](/commands/docs/mut.md)       | When it runs      | Yes          | No                   | No                   |
| [`const`](/commands/docs/const.md)   | While parsing     | No           | Yes                  | Yes                  |

[`unlet`](/commands/docs/unlet.md) removes a variable again. Commands, aliases, modules and externals are declared with [`def`](./custom_commands.md), [`alias`](/commands/docs/alias.md), [`module`](/commands/docs/module.md) and [`extern`](/commands/docs/extern.md).

See also: [Variables](/book/variables.md) in the Book. Where declarations are visible is covered in [Variable Scope](./variable_scope.md).

## `let`

`let` binds a name to a value. The binding is immutable. The right-hand side of `=` is a whole pipeline:

```nu
let big_files = ls | where size > 1mb | length
```

An optional type annotation is checked by the parser:

```nu
let x: int = "ten"
# => Error: nu::parser::type_mismatch
# =>
# =>   × Type mismatch.
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ let x: int = "ten"
# =>    ·              ──┬──
# =>    ·                ╰── expected int, found string
# =>    ╰────
```

`let` without `=` takes its value from the pipeline. It also passes that value on, so it can sit at the end or in the middle of a pipeline:

```nu
10 | let x | $x + 5
# => 15
```

```nu
[3 1 2] | sort | let sorted | length
# => 3
```

An immutable variable cannot be assigned to, but a new `let` with the same name _shadows_ the old one:

```nu
let x = 1; $x = 2
# => Error: nu::parser::assignment_requires_mutable_variable
# =>
# =>   × Assignment to an immutable variable.
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ let x = 1; $x = 2
# =>    ·            ─┬
# =>    ·             ╰── needs to be a mutable variable
# =>    ╰────
# =>   help: declare the variable with `mut`, or shadow it again with `let`
```

```nu
let x = 1
let x = $x + 1
$x
# => 2
```

## `mut`

`mut` declares a variable that can be reassigned with `=` or with the compound operators `+=`, `-=`, `*=`, `/=` and `++=`. It always needs an initial value. Fields of a mutable record or list can be assigned through a cell path:

```nu
mut x = 0; $x += 5; $x *= 2; $x
# => 10
```

```nu
mut rec = {a: {b: 1}}; $rec.a.b = 2; $rec.c = 3; $rec
# => ╭───┬───────────╮
# => │   │ ╭───┬───╮ │
# => │ a │ │ b │ 2 │ │
# => │   │ ╰───┴───╯ │
# => │ c │ 3         │
# => ╰───┴───────────╯
```

The variable's type comes from its annotation or, if there is none, from the initial value. Assignments are type-checked while parsing, so a variable that starts as an `int` cannot later hold a `string`, and `/=` (which produces a float) is rejected on an `int`. Annotate the variable (for example `mut x: any = 1`) if it must hold other types:

```nu
mut x = 1; $x = "a"
# => Error: nu::parser::operator_incompatible_types
# =>
# =>   × Types 'int' and 'string' are not compatible for the '=' operator.
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ mut x = 1; $x = "a"
# =>    ·            ─┬ ┬ ─┬─
# =>    ·             │ │  ╰── string
# =>    ·             │ ╰── does not operate between 'int' and 'string'
# =>    ·             ╰── int
# =>    ╰────
```

Mutable variables cannot be captured by closures, including the closures given to `each`, `where` or `do`. Loops (`for`, `while`, `loop`) and `if`/`match`/`try` blocks are not closures, so they can update them. See [Variable Scope](./variable_scope.md#closures-capture-values).

## `const`

`const` evaluates its value while the code is being _parsed_, before anything runs. The value can be a literal, an operator expression, another constant, or a call to one of the built-in commands that can run at parse time (`scope commands | where is_const` lists them):

```nu
const x = 1 + 2 * 3; $x
# => 7
```

```nu
const x = (ls | length)
# => Error: nu::parser::error
# =>
# =>   × Error: nu::shell::not_a_const_command
# =>   │
# =>   │   × Not a const command.
# =>   │    ╭─[repl_entry #1:1:12]
# =>   │  1 │ const x = (ls | length)
# =>   │    ·            ─┬
# =>   │    ·             ╰── This command cannot run at parse time.
# =>   │    ╰────
# =>   │   help: Only a subset of builtin commands can run at parse time.
# =>   │
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ const x = (ls | length)
# =>    ·           ──────┬──────
# =>    ·                 ╰── Encountered error during parse-time evaluation
# =>    ╰────
```

Constants are required wherever the parser needs a value: the path given to `source` or `use`, and a value pattern in `match`. For example, with a file `greet.nu` containing `export def hello [name: string] { $"Hello, ($name)!" }`:

```nu
const lib = 'greet.nu'
use $lib hello
hello Nushell
# => Hello, Nushell!
```

With `let lib = 'greet.nu'` instead, the `use` line fails with `nu::shell::not_a_constant` ("Value is not a parse-time constant").

The `$nu` record is available at parse time, so paths such as `const cfg = $nu.default-config-dir | path join 'extra.nu'` can be constants. A `const` cannot be reassigned, but it can be shadowed.

## `unlet`

`unlet` deletes one or more variables. Using a deleted variable afterwards is an error. Built-in variables such as `$nu`, `$env` and `$in` cannot be deleted, and the arguments must be variable references. `unlet` is currently in the `experimental` category.

```nu
let x = 42; unlet $x; $x
# => Error: nu::shell::variable_not_found
# =>
# =>   × Variable not found
# =>    ╭─[repl_entry #1:1:23]
# =>  1 │ let x = 42; unlet $x; $x
# =>    ·                       ─┬
# =>    ·                        ╰── variable not found
# =>    ╰────
```

```nu
unlet $nu
# => Error: nu::compile::invalid_literal
# =>
# =>   × Invalid literal
# =>    ╭─[repl_entry #1:1:7]
# =>  1 │ unlet $nu
# =>    ·       ─┬─
# =>    ·        ╰── '$nu' is a built-in variable and cannot be deleted
# =>    ╰────
```

## Reserved Names

The names of the built-in variables `nu`, `env`, `in` and `ans` cannot be used for your own variables:

```nu
let ans = 1
# => Error: nu::parser::name_is_builtin_var
# =>
# =>   × `ans` used as variable name.
# =>    ╭─[repl_entry #1:1:5]
# =>  1 │ let ans = 1
# =>    ·     ─┬─
# =>    ·      ╰── already a builtin variable
# =>    ╰────
# =>   help: 'ans' is the name of a builtin Nushell variable and cannot be used as a variable name
```

See [Variable Names](/book/variables.md#variable-names) in the Book for the characters allowed in a name.
