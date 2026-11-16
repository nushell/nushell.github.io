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

The detailed record has more fields for some types. A record gets `columns`, which holds the same detailed description for each field. A list gets `length`, and its `value` is a list with the description of each item. Binary data and cell paths also get `length`, errors and custom values get a `subtype`, and closures get a `signature`:

```nu
{name: nu, tags: [shell]} | describe --detailed | get columns.tags | reject rust_type
# => ╭───────────────┬───────────────╮
# => │ type          │ list          │
# => │ detailed_type │ list<string>  │
# => │ length        │ 1             │
# => │ value         │ [table 1 row] │
# => ╰───────────────┴───────────────╯
```

Streams have their own shape. A list stream has `type` `stream`, `origin` `nushell`, a `subtype` that describes the collected list, and `metadata`. A byte stream has `type` `bytestream` and an `origin` of `file`, `external` for an external command's output, or `unknown`. `metadata` shows the stream's data source, or is empty when there is none.

`--no-collect` describes a stream without reading it. A list stream is then just `stream`, and with `--detailed` as well, its `subtype` is `any`. A byte stream is described as `byte stream`, `string (stream)` or `binary (stream)` with or without the flag:

```nu
[1 2 3] | each { $in } | describe --no-collect
# => stream
[1 2 3] | each { $in } | describe --detailed | reject rust_type subtype
# => ╭───────────────┬─────────────╮
# => │ type          │ stream      │
# => │ detailed_type │ list stream │
# => │ origin        │ nushell     │
# => │ metadata      │             │
# => ╰───────────────┴─────────────╯
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

`--raw-value` (`-v`) shows the string Nushell makes from a value when it needs one, quoted, with escapes such as `\t` visible. A filesize becomes a number of bytes and a duration a number of nanoseconds. Binary data becomes its text when it is valid UTF-8. Other binary data and closures have no string form, so they give an error:

```nu
[1kb 2sec "a\tb"] | debug --raw-value
# => ╭───┬──────────────╮
# => │ 0 │ "1000"       │
# => │ 1 │ "2000000000" │
# => │ 2 │ "a\tb"       │
# => ╰───┴──────────────╯
```

The subcommands [`debug profile`](/commands/docs/debug_profile.md) (see [below](#debug-profile)), [`debug info`](/commands/docs/debug_info.md), [`debug env`](/commands/docs/debug_env.md) and [`debug experimental-options`](/commands/docs/debug_experimental-options.md) cover other kinds of debugging.

`debug env` returns the environment as external commands receive it, as a record of strings. Each variable goes through the `to_string` closure in [`$env.ENV_CONVERSIONS`](/book/environment.md#environment-variable-conversions) if it has one. `PATH` becomes a single string joined with the platform's separator, other values that have a string form, such as numbers, become strings, and the rest, such as lists without a conversion, are left out:

```nu
$env.COUNT = 3
$env.ITEMS = [a b]
debug env | select --optional COUNT ITEMS | to nuon
# => {COUNT: "3", ITEMS: null}
```

`debug info` returns a record about the running `nu` process. It has `thread_id`, `pid`, the parent's process ID `ppid`, a `system` record with `total_memory`, `free_memory`, `used_memory` and `available_memory`, and a `process` record. The `process` record has `memory`, `virtual_memory`, `status`, `root`, `cwd`, `exe_path`, `command`, `name` and `environment`. `command` is the command line, and `environment` holds the variables the process was started with.

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

The table goes to stderr, so it never becomes part of the data, and it still shows when the pipeline's output is captured or redirected. `inspect` has to collect a stream into a value before it can show it, so the stage after it receives a list instead of a stream, and an endless stream never gets past `inspect`. The input passes through with its [metadata](/book/metadata.md). With no input, or `null`, `inspect` fails with a `Pipeline empty.` error.

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

`var_id` is the engine's internal number for the variable. It changes from session to session, so it's left out above. `mem_size` estimates the bytes the value takes up in memory: 48 for every value, plus the contents of strings and binary data, plus the size of every item in a list or record. The string `"nushell"` is 55, and `[1 2 3]` is 192.

Running [`scope`](/commands/docs/scope.md) by itself only prints its help.

`scope externs` lists the commands declared with [`extern`](/book/externs.md), sorted by name. Each row has the `name`, the `description` taken from the comment above the `extern`, and the `decl_id`. [`help externs`](/commands/docs/help_externs.md) returns the same table. The externs also appear in `scope commands`, with the type `external` and their full signatures.

```nu
# Show the working tree status
extern "git status" [--short(-s)]
scope externs | reject decl_id
# => ╭───┬────────────┬──────────────────────────────╮
# => │ # │    name    │         description          │
# => ├───┼────────────┼──────────────────────────────┤
# => │ 0 │ git status │ Show the working tree status │
# => ╰───┴────────────┴──────────────────────────────╯
```

`scope engine-stats` describes the whole engine, not the current scope. It returns a record with these fields:

- `source_bytes`: how many bytes of Nushell source the engine has read in this session, counting what it parsed at startup.
- `num_vars`, `num_decls`, `num_blocks` and `num_modules`: how many variables, declarations, blocks and modules the engine holds. Declarations are commands, aliases and externs, built-in ones included. These numbers never go down. A definition that has been hidden, or that belonged to a block that has ended, still counts, so they show how much a long session has accumulated rather than what you can use.
- `num_env_vars`: the number of environment variables, added up over all overlays. It counts them as they were when the current script or command line started, so variables set since then aren't included yet.
- `last_result`: a record about the [`$ans`](/book/special_variables.md#ans) variable. `size_limit` is `$env.config.max_last_result_size`, `memory_size` is the size of the result `$ans` holds now, `truncated` is `true` when that result was larger than the limit and was cut short, and `has_metadata` says whether the result kept its [metadata](/book/metadata.md).

With the limit set to `1MB`, after `[1 2 3]` has been displayed:

```nu
scope engine-stats | get last_result
# => ╭──────────────┬────────╮
# => │ name         │ $ans   │
# => │ size_limit   │ 1.0 MB │
# => │ memory_size  │ 192 B  │
# => │ truncated    │ false  │
# => │ has_metadata │ false  │
# => ╰──────────────┴────────╯
```

With the default limit of `0b`, `$ans` keeps no result, and `memory_size` stays `0 B`.

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

Each flattened row also has a `span`, counted in bytes from the start of the string you passed.

Without `--flatten`, `ast` returns a record with two strings. `block` is the parsed block, printed the way Rust prints its debug output, and `error` is the first parse error, or `None`. `--minify` (`-m`) puts each of them on one line:

```nu
ast --minify 'ls --al' | get error
# => Some(UnknownFlag("ls", "al", Span[170579..170583], "Did you mean: `--all`?"))
```

`--json` (`-j`) turns both strings into JSON, pretty-printed unless you also give `--minify`. In the JSON form of `block`, every span object also gets a `span_source` field with the code it covers. With `--flatten`, `--json` returns the rows as one JSON string instead of a table. The span numbers in `block` and `error` count from the start of everything Nushell has parsed in the session, as described in [metadata](#metadata), so they differ from run to run:

```nu
ast --json '1' | get block | from json | get pipelines.0.elements.0.expr.span | to nuon
# => {start: 170629, end: 170630, span_source: "1"}
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

`explain` doesn't run the commands it lists. `cmd_index` has the form `pipeline_element`, so `0_1` is the second command of the first pipeline. `cmd_name` is `no-op` for an element that isn't a command call, such as the list above. `type` is the output type the command declares, not the type of any real output. `span_start` and `span_end` locate the element for [`view span`](/commands/docs/view_span.md).

`cmd_args` has a row for each argument, with `arg_type` (`positional`, `named` for a flag, or `expr` for a flag's value), `name`, `type` and the argument's span. For a positional argument or a flag's value, `name` holds the value itself. `explain` works out literals, variables and cell paths, but not subexpressions, which show up with the type `error`.

```nu
let n = 3
explain { ls | first $n } | get cmd_args.1 | reject span_start span_end
# => ╭───┬────────────┬──────┬──────╮
# => │ # │  arg_type  │ name │ type │
# => ├───┼────────────┼──────┼──────┤
# => │ 0 │ positional │ 3    │ int  │
# => ╰───┴────────────┴──────┴──────╯
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

## view

[`view`](/commands/docs/view.md) on its own only prints its help, which lists its subcommands: `view source`, `view blocks`, `view files`, `view ir` and `view span`.

[`view source`](/commands/docs/view_source.md) prints the source of a custom command, alias, module or closure. Built-in commands have none. It also takes a block ID from [`view blocks`](#view-blocks). For a module it prints the code between the module's braces, as written:

```nu
def greet [name: string] { $"Hello, ($name)!" }
view source greet
# => def greet [ name: string ] { $"Hello, ($name)!" }
```

The `def` line is rebuilt from the command's signature rather than copied from the file, so `export` and attributes such as `@example` are missing from it. `--dependencies` (`-d`) also prints every custom command the command calls, and the commands those call, along with the constants their bodies read. A constant is printed as `const <name> = <value>` with the value it has, not the expression that produced it. Given this module file, `hello.nu`:

```nu
const GREETING = "hello"

@example "greet ada" { greet ada }
export def greet [name: string] {
    $"($GREETING), ($name)"
}

export def shout [name: string] {
    greet $name | str uppercase
}
```

```nu
use hello.nu *
view source shout --dependencies
# => const GREETING = "hello"
# =>
# => def shout [ name: string ] {
# =>     greet $name | str uppercase
# => }
# =>
# => def greet [ name: string ] {
# =>     $"($GREETING), ($name)"
# => }
```

`--dependencies` works only on a custom command. With an alias, a module, a closure or a block ID, it changes nothing. It follows the calls written in the command's body, including the calls in a closure that the body defines and then runs through a variable. A closure that the command receives as an argument isn't part of its body, so the commands that closure calls don't appear. It lists the constants the body uses that are declared without a type, such as `const LIMIT = 3`. It doesn't list `$nu`, or the record that `use <module>` binds under the module's name.

The output's [metadata](/book/metadata.md#data-source) has the content type `application/x-nuscript`. Its `source` is the file the definition came from, or a name such as `repl_entry #3` for a definition typed at the prompt.

[`view span`](/commands/docs/view_span.md) prints the source text for a span (see [metadata](#metadata)). Both ends must lie in the same parsed file. A start after the end is an `Invalid span` error, and a span outside the code Nushell has parsed is a `Cannot view span` error.

[`view files`](/commands/docs/view_files.md) lists the files the engine has parsed, with their `filename`, `start`, `end` and `size`. `start` and `end` are the range of span positions the file takes up, so `view span $file.start $file.end` prints the whole file, and `size` is its length in bytes. The first row, `Host Environment Variables`, holds the environment variables Nushell inherited. After it come the standard library, your configuration files, scripts, and each command line you run, named `repl_entry #1`, `repl_entry #2` and so on in the REPL, or `source` for `nu -c`:

```nu
view files | first 2
# => ╭───┬────────────────────────────┬───────┬───────┬───────╮
# => │ # │          filename          │ start │  end  │ size  │
# => ├───┼────────────────────────────┼───────┼───────┼───────┤
# => │ 0 │ Host Environment Variables │     0 │ 20769 │ 20769 │
# => │ 1 │ std/mod.nu                 │ 20769 │ 21341 │   572 │
# => ╰───┴────────────────────────────┴───────┴───────┴───────╯
```

### view blocks

[`view blocks`](/commands/docs/view_blocks.md) lists the blocks the engine has parsed: command bodies, closures, and the top level of each file and command line. Each row has the `block_id`, the block's source as `content`, and its span as `start` and `end`. Pass a `block_id` to [`view ir`](/commands/docs/view_ir.md) to see a block's compiled instructions, or to `view source`. IR listings refer to closures by block ID, as in `closure(307)`, so this is also how to follow one. Block IDs differ between sessions, so use the one `view blocks` shows you:

```nu
def double [x: int] { $x * 2 }
view blocks | where content == '{ $x * 2 }'
# => ╭───┬──────────┬────────────┬────────┬────────╮
# => │ # │ block_id │  content   │ start  │  end   │
# => ├───┼──────────┼────────────┼────────┼────────┤
# => │ 0 │      306 │ { $x * 2 } │ 170517 │ 170527 │
# => ╰───┴──────────┴────────────┴────────┴────────╯
view ir 306
# => # 2 registers, 5 instructions, 0 bytes of data
# =>    0: load-variable          %0, var 75
# =>    1: load-literal           %1, int(2)
# =>    2: binary-op              %0, Math(Multiply), %1
# =>    3: span                   %0
# =>    4: return                 %0
```

## timeit

[`timeit`](/commands/docs/timeit.md) runs a closure and returns how long it took, as a `duration`. `--output` (`-o`) returns a record with the closure's output as well. Pipeline input becomes the closure's input. If that input is a stream, producing it counts toward the time, so put [`collect`](/commands/docs/collect.md) before `timeit` to time only the closure. The closure's output is collected before the clock stops, and an error in the closure stops `timeit` with that error:

```nu
timeit --output { 1..1000 | math sum } | get output
# => 500500
[3 1 2] | timeit --output { sort } | get output | to nuon
# => [1, 2, 3]
```

## debug profile

[`debug profile`](/commands/docs/debug_profile.md) runs a closure and returns a table with a row for each compiled instruction it ran. It steps into the commands and closures the closure calls, up to `--max-depth` (`-m`) levels deep, 2 by default. The columns are:

- `depth`: how many blocks deep the instruction ran. The closure's own instructions are at depth 1.
- `id` and `parent_id`: a number for each row, and the `id` of the call that entered the row's block.
- `source`: the code the instruction came from, cut to its first line with `...` when it spans several.
- `pc`: the instruction's position in its block, as numbered by [`view ir`](/commands/docs/view_ir.md).
- `instruction`: the instruction itself.
- `duration_ms`: the time it took, in milliseconds as a float. With `--duration-values` (`-d`), the column is `duration` and holds `duration` values.

Other flags add columns. `--spans` (`-s`) adds `span`, for [`view span`](/commands/docs/view_span.md), `--lines` (`-l`) adds the `file` and `line` of the source, and `--values` (`-v`) adds `output`, the value an instruction produced, on the rows that produce one:

```nu
debug profile --values { 1 + 2 } | select depth source instruction output?
# => ╭───┬───────┬──────────────────────────────────┬──────────────────────────────────────────┬────────╮
# => │ # │ depth │              source              │               instruction                │ output │
# => ├───┼───────┼──────────────────────────────────┼──────────────────────────────────────────┼────────┤
# => │ 0 │     0 │ debug profile --values { 1 + 2 } │ <start>                                  │        │
# => │ 1 │     1 │ 1                                │ load-literal           %0, int(1)        │      1 │
# => │ 2 │     1 │ 2                                │ load-literal           %1, int(2)        │      2 │
# => │ 3 │     1 │ +                                │ binary-op              %0, Math(Add), %1 │      3 │
# => │ 4 │     1 │ 1 + 2                            │ span                   %0                │      3 │
# => │ 5 │     1 │ { 1 + 2 }                        │ return                 %0                │        │
# => ╰───┴───────┴──────────────────────────────────┴──────────────────────────────────────────┴────────╯
```

To find what makes your startup slow, profile your configuration and sort by time: `debug profile --max-depth 4 { source $nu.config-path } | sort-by duration_ms --reverse | first 10`.

## others

- [`print`](/commands/docs/print.md) writes values to the terminal (or to stderr with `--stderr`) and returns `nothing`, which makes it the tool for output from inside loops and custom commands. [`echo`](/commands/docs/echo.md) returns its arguments as a value, so the result goes into the pipeline:

  ```nu
  [(print hi) (echo hi)] | to nuon
  # => hi
  # => [null, hi]
  ```

For stepping through scripts in an editor, Nushell also includes a Debug Adapter Protocol server (`nu --dap`).
