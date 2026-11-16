# Metadata

In using Nu, you may have come across times where you felt like there was something extra going on behind the scenes. For example, let's say that you try to open a file that Nu supports only to forget and try to convert again:

```nu
open Cargo.toml | from toml
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ open Cargo.toml | from toml
# =>    · ──┬─              ────┬────
# =>    ·   │                   ╰── only string input data is supported
# =>    ·   ╰── input type: record<package: record<name: string, version: string, edition: string>>
# =>    ╰────
```

The error message tells us not only that what we gave [`from toml`](/commands/docs/from_toml.md) wasn't a string, but also where the value originally came from. How would it know that?

Values that flow through a pipeline in Nu often have a set of additional information, or metadata, attached to them. These are known as tags, like the tags on an item in a store. These tags don't affect the data, but they give Nu a way to improve the experience of working with that data.

Let's run the [`open`](/commands/docs/open.md) command again, but this time, we'll look at the tags it gives back:

```nu
metadata (open Cargo.toml)
# => ╭──────┬────────────────────╮
# => │      │ ╭───────┬────────╮ │
# => │ span │ │ start │ 169459 │ │
# => │      │ │ end   │ 169463 │ │
# => │      │ ╰───────┴────────╯ │
# => ╰──────┴────────────────────╯
```

Every value carries a span, which records where in the source code the value came from. Let's take a closer look at that:

```nu
metadata (open Cargo.toml) | get span
# => ╭───────┬────────╮
# => │ start │ 169485 │
# => │ end   │ 169489 │
# => ╰───────┴────────╯
```

The span "start" and "end" are byte offsets into all of the code Nushell has read in the current session (the standard library, your configuration files, and every commandline you've entered), which is why the numbers are so large. The [`view span`](/commands/docs/view_span.md) command shows the code that a span refers to:

```nu
let span = (metadata (open Cargo.toml)).span
view span $span.start $span.end
# => open
```

The span points to the `open` command that produced the value. This is how the error we saw earlier knew what to underline.

When you pipe a command's output into [`metadata`](/commands/docs/metadata.md), rather than passing it as an argument, you can also see the metadata the command attached to its output. For example, `open` records the file that the data came from:

```nu
open Cargo.toml | metadata
# => ╭────────┬───────────────────────────────╮
# => │        │ ╭───────┬────────╮            │
# => │ span   │ │ start │ 169587 │            │
# => │        │ │ end   │ 169591 │            │
# => │        │ ╰───────┴────────╯            │
# => │ source │ /home/user/project/Cargo.toml │
# => ╰────────┴───────────────────────────────╯
```

Other commands attach other metadata. [`to json`](/commands/docs/to_json.md) and the other `to` commands set a `content_type`, such as `application/json`, and [MIME types](/lang-guide/chapters/mime_types.md#how-nushell-uses-these-types) lists them all. [`ls`](/commands/docs/ls.md) marks its `name` column as containing [paths](#path-columns), and the HTTP commands attach the [HTTP response](#http-response-metadata).

The two forms don't mix. When `metadata` is given an argument, it returns only that argument's `span` and ignores any pipeline input. That makes it safe to use inside a closure or block, whose first command receives the block's input:

```nu
[1 2] | each {|x| (metadata $x).span } | to nuon
# => [[start, end]; [170379, 170380], [170381, 170382]]
```

This also means `metadata $in` reports only a span. To see the metadata that came with the pipeline input, such as `source` or `content_type`, use `metadata` without an argument.

## Data source

The `source` key records where the data came from. `open` sets it to the full path of the file it read, and [`view source`](/commands/docs/view_source.md) sets it to the file that defines the command you asked for, or to a name such as `repl_entry #3` when you typed the definition at the prompt. A few commands read it back:

- [`save`](/commands/docs/save.md) won't stream data into the file named in `source`. Writing would empty the file before it had been read, so `save` stops with the error `pipeline input and output are the same file`. Add [`collect`](/commands/docs/collect.md) to read the whole file first. `collect` also drops the file from `source`, because the data no longer streams from it:

  ```nu
  open --raw notes.txt | collect | save --force notes.txt
  ```

- [`to toml`](/commands/docs/to_toml.md), and `save` to a `.toml` file, keep the comments and layout of the TOML file named in `source` and change only the values that differ. That is how `open Cargo.toml | upsert ... | save --force Cargo.toml` leaves the rest of the file alone:

  ```nu
  open demo.toml | update package.version 0.2.0 | to toml
  # => # demo settings
  # => [package]
  # => name = "demo" # the crate name
  # => version = "0.2.0"
  ```

- [`ansi opt --html`](/commands/docs/ansi_opt.md) uses the file's name as the title of its report.

[`metadata set --datasource-filepath`](/commands/docs/metadata_set.md) (`-f`) sets `source` to a path you choose. Here a record built from scratch borrows the comments of `demo.toml`:

```nu
{package: {name: demo, version: "0.3.0"}} | metadata set --datasource-filepath demo.toml | to toml
# => # demo settings
# => [package]
# => name = "demo" # the crate name
# => version = "0.3.0"
```

`source` has one value that isn't a path. [`to html --list`](/commands/docs/to_html.md) marks its table of HTML themes with `into html --list`:

```nu
to html --list | metadata | reject span
# => ╭────────┬──────────────────╮
# => │ source │ into html --list │
# => ╰────────┴──────────────────╯
```

## Custom Metadata

You can attach arbitrary metadata to pipeline data using the [`metadata set`](/commands/docs/metadata_set.md) command with the optional closure parameter:

```nu
"data" | metadata set { merge {custom_key: "custom_value"} } | metadata
# => ╭────────────┬────────────────────╮
# => │            │ ╭───────┬────────╮ │
# => │ span       │ │ start │ 169613 │ │
# => │            │ │ end   │ 169619 │ │
# => │            │ ╰───────┴────────╯ │
# => │ custom_key │ custom_value       │
# => ╰────────────┴────────────────────╯
```

The closure gets the current metadata as a record, both as `$in` and as its parameter, and whatever record it returns becomes the new metadata. The record has no `span`, and `metadata set` ignores a `span` key in the result. Keys you leave out are removed, so build on the record you were given unless you mean to drop them:

```nu
{a: 1} | to json | metadata set {|meta| $meta | insert note "from the API" } | metadata | reject span
# => ╭──────────────┬──────────────────╮
# => │ content_type │ application/json │
# => │ note         │ from the API     │
# => ╰──────────────┴──────────────────╯
{a: 1} | to json | metadata set {|meta| {note: "from the API"} } | metadata | reject span
# => ╭──────┬──────────────╮
# => │ note │ from the API │
# => ╰──────┴──────────────╯
```

The closure must return a record. It can't be combined with the flags of `metadata set` (`--datasource-filepath`, `--path-columns`, `--content-type` and `--table-width-priority-columns`), and passing both is an `Incompatible parameters` error. Each flag changes only the key it names and leaves the rest alone. `--content-type null` removes the content type.

## Path Columns

Commands that list files, such as [`ls`](/commands/docs/ls.md), mark the columns that contain paths:

```nu
ls | metadata
# => ╭──────────────────────────────┬────────────────────╮
# => │                              │ ╭───────┬────────╮ │
# => │ span                         │ │ start │ 169684 │ │
# => │                              │ │ end   │ 169686 │ │
# => │                              │ ╰───────┴────────╯ │
# => │                              │ ╭───┬──────╮       │
# => │ path_columns                 │ │ 0 │ name │       │
# => │                              │ ╰───┴──────╯       │
# => │                              │ ╭───┬──────╮       │
# => │ table_width_priority_columns │ │ 0 │ name │       │
# => │                              │ ╰───┴──────╯       │
# => ╰──────────────────────────────┴────────────────────╯
```

When [`table`](/commands/docs/table.md) displays a column listed in `path_columns`, it colors the paths according to `$env.LS_COLORS`, and `table --icons` also adds an icon for each file type. Besides `ls`, [`du`](/commands/docs/du.md) and [`which`](/commands/docs/which.md) mark their `path` column, and [`history`](/commands/docs/history.md) marks its `cwd` column when the history file uses the SQLite format.

The `table_width_priority_columns` list tells `table` which columns to give space to first when the table is too wide for the terminal. `table` narrows the other columns first and the listed ones last. If that isn't enough, it hides the columns to the right of the last listed column, until each listed column can have up to a third of the table width, or all of its natural width when that is less. A listed column is never hidden when it would have shown without the list. [`ps`](/commands/docs/ps.md) lists `name`, or `command` and `name` with `--long`. Here the list keeps a file name on one line, at the expense of the `notes` column:

```nu
let files = [[name size notes]; [sales-2026-q3-v2.pdf 2.1MB "numbers for the third quarter"]]
$files | table --width 50
# => ╭───┬─────────────────┬────────┬─────────────────╮
# => │ # │      name       │  size  │      notes      │
# => ├───┼─────────────────┼────────┼─────────────────┤
# => │ 0 │ sales-2026-q3-v │ 2.1 MB │ numbers for the │
# => │   │ 2.pdf           │        │  third quarter  │
# => ╰───┴─────────────────┴────────┴─────────────────╯
$files | metadata set --table-width-priority-columns [name] | table --width 50
# => ╭───┬──────────────────────┬────────┬────────────╮
# => │ # │         name         │  size  │   notes    │
# => ├───┼──────────────────────┼────────┼────────────┤
# => │ 0 │ sales-2026-q3-v2.pdf │ 2.1 MB │ numbers    │
# => │   │                      │        │ for the    │
# => │   │                      │        │ third      │
# => │   │                      │        │ quarter    │
# => ╰───┴──────────────────────┴────────┴────────────╯
```

You can set both on your own data with `metadata set`:

```nu
[[name size]; [Cargo.toml 1.2kB]]
| metadata set --path-columns [name] --table-width-priority-columns [name]
| metadata
| reject span
# => ╭──────────────────────────────┬──────────────╮
# => │                              │ ╭───┬──────╮ │
# => │ path_columns                 │ │ 0 │ name │ │
# => │                              │ ╰───┴──────╯ │
# => │                              │ ╭───┬──────╮ │
# => │ table_width_priority_columns │ │ 0 │ name │ │
# => │                              │ ╰───┴──────╯ │
# => ╰──────────────────────────────┴──────────────╯
```

## Using Metadata in a Pipeline

[`metadata access`](/commands/docs/metadata_access.md) runs a closure with the metadata of its input, while the data itself stays available as `$in`:

```nu
{foo: bar} | to json --raw | metadata access {|meta| {in: $in, content: $meta.content_type}}
# => ╭─────────┬──────────────────╮
# => │ in      │ {"foo":"bar"}    │
# => │ content │ application/json │
# => ╰─────────┴──────────────────╯
```

## Peeking at a Stream

[`peek`](/commands/docs/peek.md) stores the first few elements of a stream in its metadata, so you can inspect them without collecting the whole stream:

```nu
seq 1 5 | peek 2 | metadata | get peek
# => ╭────────┬───────────╮
# => │ type   │ list      │
# => │ stream │ true      │
# => │        │ ╭───┬───╮ │
# => │ value  │ │ 0 │ 1 │ │
# => │        │ │ 1 │ 2 │ │
# => │        │ ╰───┴───╯ │
# => ╰────────┴───────────╯
```

`type` is the kind of input, such as `list`, `string` or `byte stream`, and `empty` when there was no input. `stream` is `true` when the input is a stream rather than a value. Only lists and list streams get a `value`, and only when you give `peek` a count. Without one, `peek` records just `type` and `stream`. A string, a record, or a byte stream, like the output of an external command, never gets a `value`:

```nu
seq 1 5 | peek | metadata | get peek
# => ╭────────┬──────╮
# => │ type   │ list │
# => │ stream │ true │
# => ╰────────┴──────╯
open --raw notes.txt | peek 2 | metadata | get peek
# => ╭────────┬─────────────╮
# => │ type   │ byte stream │
# => │ stream │ true        │
# => ╰────────┴─────────────╯
```

## HTTP Response Metadata

All HTTP commands attach response metadata:

```nu
http get https://example.com | metadata | get http_response.status
# => 200
```

For working with metadata while streaming response bodies, see the [HTTP cookbook](/cookbook/http.html#accessing-http-response-metadata-while-streaming).
