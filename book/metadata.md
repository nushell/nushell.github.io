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

Other commands attach other metadata. For instance, [`to json`](/commands/docs/to_json.md) and the other `to` commands set a `content_type` (such as `application/json`), [`ls`](/commands/docs/ls.md) marks its `name` column as containing [paths](#path-columns), and the HTTP commands attach the [HTTP response](#http-response-metadata).

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

When [`table`](/commands/docs/table.md) displays a column listed in `path_columns`, it colors the paths according to `$env.LS_COLORS`, and `table --icons` also adds an icon for each file type. The `table_width_priority_columns` list tells `table` which columns to give space to first when the table is too wide for the terminal.

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

## HTTP Response Metadata

All HTTP commands attach response metadata:

```nu
http get https://example.com | metadata | get http_response.status
# => 200
```

For working with metadata while streaming response bodies, see the [HTTP cookbook](/cookbook/http.html#accessing-http-response-metadata-while-streaming).
