# Metadata

In using Nu, you may have come across times where you felt like there was something extra going on behind the scenes. For example, let's say that you try to open a file that Nu supports only to forget and try to convert again:

```nu
open Cargo.toml | from toml
# => error: Expected a string from pipeline
# => - shell:1:18
# => 1 | open Cargo.toml | from toml
# =>   |                   ^^^^^^^^^ requires string input
# => - shell:1:5
# => 1 | open Cargo.toml | from toml
# =>   |      ---------- object originates from here
```

The error message tells us not only that what we gave [`from toml`](/commands/docs/from_toml.md) wasn't a string, but also where the value originally came from. How would it know that?

Values that flow through a pipeline in Nu often have a set of additional information, or metadata, attached to them. These are known as tags, like the tags on an item in a store. These tags don't affect the data, but they give Nu a way to improve the experience of working with that data.

Let's run the [`open`](/commands/docs/open.md) command again, but this time, we'll look at the tags it gives back:

```nu
metadata (open Cargo.toml)
# => ╭──────┬───────────────────╮
# => │ span │ {record 2 fields} │
# => ╰──────┴───────────────────╯
```

Currently, we track only the span of where values come from. Let's take a closer look at that:

```nu
metadata (open Cargo.toml) | get span
# => ╭───────┬────────╮
# => │ start │ 212970 │
# => │ end   │ 212987 │
# => ╰───────┴────────╯
```

The span "start" and "end" here refer to where the underline will be in the line. If you count over 5, and then count up to 15, you'll see it lines up with the "Cargo.toml" filename. This is how the error we saw earlier knew what to underline.

## Custom Metadata

You can attach arbitrary metadata to pipeline data using the [`metadata set`](/commands/docs/metadata_set.md) command with the `--merge` flag:

```nu
"data" | metadata set --merge {custom_key: "custom_value"}
```

This allows you to attach any key-value pairs to data flowing through the pipeline. To avoid key collisions between different commands and plugins, it's recommended to use namespaced keys with an underscore separator:

- `"http_response"` - HTTP response metadata
- `"polars_schema"` - DataFrame schema information
- `"custom_plugin_field"` - Plugin-specific metadata

This naming convention helps ensure different parts of the system don't overwrite each other's metadata.

## HTTP Response Metadata

All HTTP commands (`http get`, `http post`, etc.) automatically attach response metadata under the `"http_response"` key. This includes the status code, headers, and redirect history.

You can access this metadata using the [`metadata access`](/commands/docs/metadata_access.md) command, which is especially useful for streaming large responses:

```nu
# Check status code while streaming the response
http get https://api.example.com/large-file
| metadata access {|meta|
    if $meta.http_response.status != 200 {
        error make {msg: "Request failed"}
    } else { }
  }
| lines
| each {|line| process $line }
```

The `else { }` clause passes the input through when the check succeeds, allowing the response body to stream through the pipeline. This pattern lets you fail fast on error responses without downloading the entire body.
