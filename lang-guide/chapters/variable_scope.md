# Variable Scope

Nushell is lexically scoped. Every block (`{ ... }`) starts a new scope. A variable is visible from its declaration to the end of the block that contains it, including any blocks, closures and custom commands nested inside. The environment (`$env`, including the current directory) follows slightly different rules, described [below](#environment-scope).

See also: [Declarations](./declarations.md) for `let`, `mut` and `const`, [Environment - Scoping](/book/environment.md#scoping) in the Book, and [Nushell's Environment is Scoped](/book/thinking_in_nu.md#nushell-s-environment-is-scoped).

## Blocks

A variable declared inside a block is not visible after the block ends. Declaring a variable with the same name inside a block shadows the outer one only until the block ends:

```nu
let x = 1
if true {
  let x = 2
  print $"inside: ($x)"
}
print $"outside: ($x)"
# => inside: 2
# => outside: 1
```

```nu
if true { let inner = 1 }; $inner
# => Error: nu::parser::variable_not_found
# =>
# =>   × Variable not found.
# =>    ╭─[repl_entry #1:1:28]
# =>  1 │ if true { let inner = 1 }; $inner
# =>    ·                            ───┬──
# =>    ·                               ╰── variable not found.
# =>    ╰────
```

Variables are resolved while parsing, so a variable can only be used after its declaration. Each iteration of a loop gets a fresh scope, so a `let` in a loop body does not survive into the next iteration.

A block that belongs to `if`/`else`, `match`, `for`, `while`, `loop` or `try` runs in the scope of the surrounding code. It can therefore assign to a `mut` variable declared outside:

```nu
mut count = 1; if true { $count = 2 }; $count
# => 2
```

## Closures Capture Values

A closure (`{|args| ... }`, and also the blocks given to commands such as `each`, `where` and `do`) captures the variables it uses when the closure is _created_. Shadowing the variable afterwards does not change what the closure sees:

```nu
let x = 1
let get_x = {|| $x }
let x = 2
do $get_x
# => 1
```

Because the captured value is a copy, a closure cannot capture a `mut` variable:

```nu
mut x = 1; let c = {|| $x }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[repl_entry #1:1:24]
# =>  1 │ mut x = 1; let c = {|| $x }
# =>    ·                        ─┬
# =>    ·                         ╰── capture of mutable variable
# =>    ╰────
```

A closure keeps its captured variables after the scope that declared them has ended:

```nu
let c = do { let secret = 42; {|| $secret } }; do $c
# => 42
```

## Custom Commands

A custom command's body sees the variables in scope where the command is _defined_, not where it is called. Like a closure, it cannot capture `mut` variables. Parameters and variables declared in the body are local to the command.

```nu
let x = 1
def f [] { $x }
def g [] { let x = 5; f }
g
# => 1
```

`def` and `alias` definitions are scoped like variables: a command defined inside a block, closure or other command is not visible outside it. Unlike variables, definitions are available in their whole block, even before the line that defines them:

```nu
print (greet); def greet [] { 'defined later' }
# => defined later
```

```nu
def outer [] { def helper [] { 'helper' }; helper }; outer
# => helper
```

## Environment Scope

Changes to `$env`, including the current directory changed with `cd`, stay visible after `if`/`else`, `match`, `for`, `while`, `loop` and `try` (including its `catch` and `finally` parts). They are discarded when a closure or custom command returns, unless the closure is run with `do --env` or the command is defined with `def --env`.

| Where `$env` is changed      | Visible to the caller afterwards |
| ---------------------------- | -------------------------------- |
| `if`, `match`, loops, `try`  | Yes                              |
| `do { ... }`, `each { ... }` | No                               |
| `do --env { ... }`           | Yes                              |
| `def cmd [] { ... }`         | No                               |
| `def --env cmd [] { ... }`   | Yes                              |

```nu
$env.FOO = 'outer'
do { $env.FOO = 'inner'; print $env.FOO }
$env.FOO
# => inner
# => outer
```

```nu
def --env set-foo [] { $env.FOO = 'set in def --env' }
set-foo
$env.FOO
# => set in def --env
```

```nu
cd /tmp; if true { cd / }; pwd
# => /
```

```nu
cd /tmp; do { cd / }; pwd
# => /tmp
```

See [Changing the Environment in a Custom Command](/book/custom_commands.md#changing-the-environment-in-a-custom-command) in the Book for more on `def --env`.
