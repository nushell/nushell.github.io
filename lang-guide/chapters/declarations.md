# Declarations

Nushell has three keywords that declare variables:

| Keyword                            | Value computed | Reassignable | Captured by closures | Usable at parse time |
| ---------------------------------- | -------------- | ------------ | -------------------- | -------------------- |
| [`let`](/commands/docs/let.md)     | When it runs   | No           | Yes                  | No                   |
| [`mut`](/commands/docs/mut.md)     | When it runs   | Yes          | No                   | No                   |
| [`const`](/commands/docs/const.md) | While parsing  | No           | Yes                  | Yes                  |

[`unlet`](/commands/docs/unlet.md) removes a variable again. Commands, aliases, modules and externals are declared with [`def`](./custom_commands.md), [`alias`](/commands/docs/alias.md), [`module`](/commands/docs/module.md) and [`extern`](/commands/docs/extern.md). Names for types are declared with [`type`](#type). The syntax of [comments](#comments) is at the end of this chapter.

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

The parser can only check a value whose type it knows. When the right-hand side is a command whose output type is `any`, such as [`from json`](/commands/docs/from_json.md) or a custom command without an output type, Nushell checks the value when the `let` runs:

```nu
let x: int = '"five"' | from json
# => Error: nu::shell::type_mismatch
# =>
# =>   × Type mismatch.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ let x: int = '"five"' | from json
# =>    · ─┬─                     ────┬────
# =>    ·  │                          ╰── the value is a string
# =>    ·  ╰── expected int, got string
# =>    ╰────
```

Nushell checks an assignment to an annotated `mut` variable the same way. This runtime check is the experimental option `enforce-runtime-annotations`, which is on by default. To turn it off, start Nushell with `--experimental-options '[enforce-runtime-annotations=false]'`. Then only the parser checks the annotation, and `$x` above would hold the string. See [Experimental options](/book/configuration.md#experimental-options) in the Book.

`let` without `=` takes its value from the pipeline. It also passes that value on, so it can sit at the end or in the middle of a pipeline:

```nu
10 | let x | $x + 5
# => 15
```

```nu
[3 1 2] | sort | let sorted | length
# => 3
```

After a pipe, only this form is allowed. `let x = ...` after a `|` is an error, even when the value is `$in`:

```nu
[a b] | let x = $in
# => Error: nu::parser::assignment_requires_variable
# =>
# =>   × Assignment operations require a variable.
# =>    ╭─[repl_entry #1:1:9]
# =>  1 │ [a b] | let x = $in
# =>    ·         ──┬──
# =>    ·           ╰── needs to be a variable
# =>    ╰────
# =>   help: try assigning to a variable or a cell path of a variable
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

The compound operators work on cell paths too, including fields of `$env`:

```nu
mut rec = {a: 1, b: {c: [10 20]}, ratio: 1.0}; $rec.a += 5; $rec.b.c.0 -= 1; $rec.b.c.1 *= 3; $rec.ratio /= 4; $rec | to nuon
# => {a: 6, b: {c: [9, 60]}, ratio: 0.25}
```

```nu
$env.COUNT = 1; $env.COUNT += 1; $env.COUNT
# => 2
```

A compound operator reads the current value first, so the field has to exist. `$rec.z += 1` on a record without a `z` field is a `nu::shell::column_not_found` error, while `$rec.z = 1` adds the field.

As with `let`, the right-hand side of an assignment is a whole pipeline:

```nu
mut count = 0; $count = [a b c] | length; $count
# => 3
```

An assignment is a statement and produces no value. A block or command whose last statement is an assignment returns `null`, so end it with the variable to return the new value:

```nu
def bump [] { mut n = 1; $n += 1 }; bump | describe
# => nothing
```

```nu
def bump [] { mut n = 1; $n += 1; $n }; bump
# => 2
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

[`if`](/commands/docs/if.md) can run at parse time, so a constant can be chosen from other constants or from `$nu`, for example `const x = if $nu.is-interactive { ... } else { null }`:

```nu
const debug = false
const log_level = if $debug { "debug" } else { "info" }
$log_level
# => info
```

`match`, `try` and `do` can't run at parse time. Using them in a `const` is a `nu::shell::not_a_const_command` error like the one above.

::: details Commands that can run at parse time

In Nushell 0.117.0, without plugins, `scope commands | where is_const` lists these 88 commands:

- Core: `const`, `describe`, `echo`, `first`, `get`, `if`, `ignore`, `last`, `version`
- Attributes: `attr category`, `attr complete`, `attr complete external`, `attr deprecated`, `attr example`, `attr interactive`, `attr search-terms`, `attr structured`
- Strings: `ansi`, `char`, `detect columns`, `parse`, `split chars`, `split column`, `split list`, `split row`, `split words`, `str capitalize`, `str contains`, `str distance`, `str downcase`, `str ends-with`, `str escape-regex`, `str expand`, `str index-of`, `str join`, `str length`, `str lowercase`, `str replace`, `str reverse`, `str starts-with`, `str stats`, `str substring`, `str trim`, `str upcase`, `str uppercase`
- Bytes and formats: `bytes length`, `decode`, `decode base32`, `decode base32hex`, `decode base64`, `decode hex`, `encode`, `encode base32`, `encode base32hex`, `encode base64`, `encode hex`, `format date`, `format duration`, `format filesize`
- Math: `math abs`, `math avg`, `math cbrt`, `math ceil`, `math floor`, `math log`, `math max`, `math median`, `math min`, `math mode`, `math product`, `math round`, `math sqrt`, `math stddev`, `math sum`, `math variance`
- Paths: `path basename`, `path dirname`, `path exists`, `path expand`, `path join`, `path parse`, `path relative-to`, `path self`, `path split`, `path type`
- System: `config default`, `sys host`, `uname`

:::

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

A constant behaves differently, because the parser copies a constant's value into the code that uses it. `unlet` on a constant hides the name from the parser for the rest of the current block, so a later `$x` is a parse error (`nu::parser::variable_not_found`) and nothing in the block runs. Code parsed before the `unlet`, such as a command or closure that uses the constant, keeps its value:

```nu
const x = 42; def show [] { $x }; unlet $x; show
# => 42
```

With `let x = 42`, the same `show` fails with `nu::shell::variable_not_found` when it runs, because the variable is gone. A constant hidden inside a nested block, as in `do { unlet $x }`, is visible again after that block. At the REPL, a constant hidden at the top level stays hidden in later entries.

## `type`

`type` declares a type alias, a name that stands for a type signature. How aliases expand is described in [Type aliases](./types/type_signatures.md#type-aliases). This section covers where one is visible.

A type alias is visible from its definition to the end of the enclosing block, the same as `alias` and `const`. At the REPL, it stays defined for later lines. An alias defined in a block isn't visible after the block:

```nu
do { type Id = int; let x: Id = 1 }; let y: Id = 2
# => Error: nu::parser::unknown_type
# =>
# =>   × Unknown type.
# =>    ╭─[repl_entry #1:1:45]
# =>  1 │ do { type Id = int; let x: Id = 1 }; let y: Id = 2
# =>    ·                                             ─┬
# =>    ·                                              ╰── unknown type
# =>    ╰────
# =>   help: check the spelling; a type alias must be defined with `type Name = <type>` above this line, or imported with `use <module> Name`
```

Type aliases are defined in order. Using one above its definition is an error that points at both places:

```nu
let x: Id = 1; type Id = int
# => Error: nu::parser::type_alias_used_before_definition
# =>
# =>   × Type alias `Id` is used before its definition.
# =>    ╭─[repl_entry #1:1:8]
# =>  1 │ let x: Id = 1; type Id = int
# =>    ·        ─┬      ──────┬──────
# =>    ·         │            ╰── defined here
# =>    ·         ╰── used here
# =>    ╰────
# =>   help: move the `type` statement above its first use
```

A second `type` with the same name shadows the first from that point on.

In a module, a type alias is private unless it is declared with `export type`. An exported alias is imported by `use <module> Name`, `use <module> [Name ...]`, `use <module> *`, `export use`, and `overlay use` without `--prefix`. A bare `use <module>` doesn't import it, because a type name can't take the module-name prefix that commands get. See [Using Modules](/book/modules/using_modules.md#importing-type-aliases) in the Book.

`type` and `export type` are parser keywords. A command, alias or extern can't be named `type` (`nu::parser::name_is_keyword`), and `alias ty = type` is an error (`nu::parser::cant_alias_keyword`).

A type alias can't take the name of a built-in type such as `int` or `number` (`nu::parser::type_alias_shadows_builtin`), and it has no type parameters, so `Point<int>` is a `nu::parser::type_alias_with_params` error. See [Type Aliases](/book/custom_commands.md#type-aliases) in the Book for the full list of reserved names.

## Reserved Names

The names of the built-in variables `nu`, `env`, `in` and `ans` cannot be used for your own variables. The rule covers `let`, `mut` and `const`, and also the parameters and flags of a custom command, so `def f [in] {}` and `def f [--env] {}` fail the same way:

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

## Comments

`#` starts a comment, which runs to the end of the line. There are no block comments, so a comment over several lines needs a `#` on each one. A comment directly above a `def` becomes the command's description. See [Documenting Your Command](/book/custom_commands.md#documenting-your-command).

A `#` starts a comment only where a new word could start: at the beginning of a line, after a space or tab, or right after a `;` or `|`. Inside a word, it's an ordinary character, and inside quotes, it's part of the string:

```nu
echo foo#bar
# => foo#bar
echo foo #bar
# => foo
echo https://example.com/page#top
# => https://example.com/page#top
"a # b"
# => a # b
```

Comments can go between the items of a list or record written over several lines, and between the lines of a pipeline that continues on the next line:

```nu
[1 2 3]
# keep the big ones
| where $it > 1
| to nuon
# => [2, 3]

{
    name: "nu"   # the shell
    version: 117 # the release
} | to nuon
# => {name: nu, version: 117}
```

A comment also swallows any closing bracket that follows it on the same line. In `print (echo foo #bar)`, the `)` is part of the comment. In a script, that's a `nu::parser::unclosed_delimiter` error, and at the prompt, Nushell waits for the `)` on another line. Put the closing bracket on the next line, or the comment after it.
