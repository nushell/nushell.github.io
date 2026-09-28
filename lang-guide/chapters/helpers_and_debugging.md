# Helpers and debugging commands

Nushell has a set of built-in commands for looking at values, types, pipelines and the code itself. Most of them pass their input through or return plain data, so they can be dropped into the middle of a pipeline while you debug it.

| Command                                                       | Shows                                                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`describe`](/commands/docs/describe.md)                      | The type of the input                                                   |
| [`debug`](/commands/docs/debug.md)                            | The input as a string, or its internal representation with `--raw`      |
| [`inspect`](/commands/docs/inspect.md)                        | The type and value flowing through a pipeline, then passes it on        |
| [`metadata`](/commands/docs/metadata.md)                      | The span, data source and other metadata of a value or stream           |
| [`error make`](/commands/docs/error_make.md)                  | Raises your own error                                                   |
| [`scope`](/commands/docs/scope.md)                            | The variables, commands, aliases and modules currently defined          |
| [`ast`](/commands/docs/ast.md), [`explain`](/commands/docs/explain.md), [`view ir`](/commands/docs/view_ir.md) | How code is parsed and compiled                       |
| [`view source`](/commands/docs/view_source.md), [`view span`](/commands/docs/view_span.md) | The source text of a definition or span              |
| [`timeit`](/commands/docs/timeit.md), [`debug profile`](/commands/docs/debug_profile.md) | How long code takes                                    |
| [`print`](/commands/docs/print.md), [`echo`](/commands/docs/echo.md) | Output values                                                     |

## describe

`describe` returns the type of its input as a string. Streams are collected first and marked `(stream)`. `--no-collect` (`-n`) avoids collecting a stream, and `--detailed` (`-d`) returns a record with more information:

```nu
{name: nu, tags: [shell]} | describe
# => record<name: string, tags: list<string>>
```

```nu
[1 2 3] | each { $in } | describe
# => list<int> (stream)
```

```nu
42 | describe --detailed
# => ╭───────────────┬─────╮
# => │ type          │ int │
# => │ detailed_type │ int │
# => │ rust_type     │ i64 │
# => │ value         │ 42  │
# => ╰───────────────┴─────╯
```

## debug

`debug` turns a value into a debugging string (a list becomes a list of strings). With `--raw` it prints the internal Rust representation, including the value's span (the span numbers differ from session to session):

```nu
{a: 1} | debug
# => {a: 1}
```

```nu
1kb | debug --raw
# => Filesize {
# =>     val: Filesize(
# =>         1000,
# =>     ),
# =>     internal_span: Span[169215..169218],
# => }
```

The subcommands [`debug profile`](/commands/docs/debug_profile.md) (see [others](#others)), [`debug info`](/commands/docs/debug_info.md) (process and memory information), [`debug env`](/commands/docs/debug_env.md) (the environment as external commands see it) and [`debug experimental-options`](/commands/docs/debug_experimental-options.md) cover other kinds of debugging.

## metadata

Values carry a span that points at their source, and pipelines carry metadata such as the file they were opened from or a content type. `metadata` returns it as a record. It can be given an expression as an argument, or read its pipeline input:

```nu
let s = (metadata "hello").span; view span $s.start $s.end
# => "hello"
```

```nu
"<b>hi</b>" | metadata set --content-type text/html | metadata | reject span
# => ╭──────────────┬───────────╮
# => │ content_type │ text/html │
# => ╰──────────────┴───────────╯
```

[`peek`](/commands/docs/peek.md) stores the first items of a stream in the metadata without consuming the stream:

```nu
seq 1 5 | peek 2 | metadata | get peek.value
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => ╰───┴───╯
```

See [Metadata](/book/metadata.md) in the Book for more.

## error make

`error make` raises an error. It takes a message string, or a record with `msg` and optional fields such as `label`, `help` and `code`. A label with a `span` taken from a value's metadata makes the error point at that value in the caller's code:

```nu
def check [x: int] {
  if $x < 0 {
    error make {msg: "negative value", label: {text: "must be >= 0", span: (metadata $x).span}}
  }
  $x
}
check (-5)
# => Error: nu::shell::error
# =>
# =>   × negative value
# =>    ╭─[repl_entry #1:7:8]
# =>  6 │ }
# =>  7 │ check (-5)
# =>    ·        ─┬
# =>    ·         ╰── must be >= 0
# =>    ╰────
```

Errors can be caught with [`try`/`catch`](./flow_control/try-catch.md). See [Creating Your Own Errors](/book/creating_errors.md) in the Book for all the fields.

## inspect

`inspect` prints the type and value of its input, then passes the input on unchanged. Put it between two pipeline stages to see what flows between them:

```nu
[3 1 2] | inspect | sort
# => ╭─────────────┬───────────╮
# => │ description │ list<int> │
# => ├─────────────┴───────────┤
# => │                         │
# => ├─────────────────────────┤
# => │ 3                       │
# => │ 1                       │
# => │ 2                       │
# => ╰─────────────────────────╯
# =>
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
```

## scope

The `scope` subcommands list what is defined in the current scope: [`scope variables`](/commands/docs/scope_variables.md), [`scope commands`](/commands/docs/scope_commands.md), [`scope aliases`](/commands/docs/scope_aliases.md), [`scope modules`](/commands/docs/scope_modules.md), [`scope externs`](/commands/docs/scope_externs.md) and [`scope engine-stats`](/commands/docs/scope_engine-stats.md).

```nu
let answer = 42; scope variables | where name == '$answer' | reject var_id
# => ╭───┬─────────┬──────┬───────┬──────────┬──────────╮
# => │ # │  name   │ type │ value │ is_const │ mem_size │
# => ├───┼─────────┼──────┼───────┼──────────┼──────────┤
# => │ 0 │ $answer │ int  │    42 │ false    │       48 │
# => ╰───┴─────────┴──────┴───────┴──────────┴──────────╯
```

## ast

`ast` parses a string of Nushell code and returns its abstract syntax tree. `--flatten` gives one row per token with its syntax shape, which shows how the parser read each word. Here `size` is a column name in the row condition, and `1kb` is split into a number and a unit:

```nu
ast --flatten 'ls | where size > 1kb' | select content shape
# => ╭───┬─────────┬────────────────────╮
# => │ # │ content │       shape        │
# => ├───┼─────────┼────────────────────┤
# => │ 0 │ ls      │ shape_internalcall │
# => │ 1 │ |       │ shape_pipe         │
# => │ 2 │ where   │ shape_internalcall │
# => │ 3 │ size    │ shape_string       │
# => │ 4 │ size    │ shape_variable     │
# => │ 5 │ >       │ shape_operator     │
# => │ 6 │ 1       │ shape_int          │
# => │ 7 │ kb      │ shape_string       │
# => ╰───┴─────────┴────────────────────╯
```

[`explain`](/commands/docs/explain.md) lists the commands in a closure with their types and arguments. [`view ir`](/commands/docs/view_ir.md) shows the compiled instructions:

```nu
explain { [1 2 3] | each { $in * 2 } | math sum } | select cmd_name type
# => ╭───┬──────────┬───────────────────────────────────────────╮
# => │ # │ cmd_name │                   type                    │
# => ├───┼──────────┼───────────────────────────────────────────┤
# => │ 0 │ no-op    │ list<int>                                 │
# => │ 1 │ each     │ any                                       │
# => │ 2 │ math sum │ oneof<number, duration, filesize, record> │
# => ╰───┴──────────┴───────────────────────────────────────────╯
```

```nu
view ir { 1 + 2 }
# => # 2 registers, 5 instructions, 0 bytes of data
# =>    0: load-literal           %0, int(1)
# =>    1: load-literal           %1, int(2)
# =>    2: binary-op              %0, Math(Add), %1
# =>    3: span                   %0
# =>    4: return                 %0
```

## others

- [`view source`](/commands/docs/view_source.md) prints the source of a custom command, alias or closure (built-in commands have none). `--dependencies` also prints the custom commands it calls.

  ```nu
  def greet [name: string] { $"Hello, ($name)!" }
  view source greet
  # => def greet [ name: string ] { $"Hello, ($name)!" }
  ```

- [`view span`](/commands/docs/view_span.md) prints the source text for a span (see [metadata](#metadata)). [`view files`](/commands/docs/view_files.md) and [`view blocks`](/commands/docs/view_blocks.md) list the files and blocks the engine has parsed.
- [`timeit`](/commands/docs/timeit.md) runs a closure and returns how long it took, as a `duration`. `--output` returns a record with the closure's output as well. [`debug profile`](/commands/docs/debug_profile.md) runs a closure and returns a table with the time spent in each pipeline element.

  ```nu
  timeit --output { 1..1000 | math sum } | get output
  # => 500500
  ```

- [`print`](/commands/docs/print.md) writes values to the terminal (or to stderr with `--stderr`) and returns `nothing`, which makes it the tool for output from inside loops and custom commands. [`echo`](/commands/docs/echo.md) returns its arguments as a value, so the result goes into the pipeline:

  ```nu
  [(print hi) (echo hi)] | to nuon
  # => hi
  # => [null, hi]
  ```

For stepping through scripts in an editor, Nushell also includes a Debug Adapter Protocol server (`nu --dap`).
