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

All HTTP commands attach response metadata (status, headers, redirect history):

```nu
http get https://api.example.com | metadata | get http_response.status
# => 200
```

To work with metadata while streaming the response body, use [`metadata access`](/commands/docs/metadata_access.md):

```nu
http get https://api.example.com/large-file
| metadata access {|meta|
    print $"Status: ($meta.http_response.status)"
    if $meta.http_response.status != 200 {
        error make {msg: "Request failed"}
    } else { }
  }
| lines  # body streams through
| each {|line| process $line }
```

Without `metadata access`, you'd need `--full` to get metadata, which consumes the entire response body and prevents streaming. With `metadata access`, the body continues streaming through the pipeline.

Metadata structure:
- `status` - HTTP status code (200, 404, 500, etc.)
- `headers` - Response headers as `[{name, value}, ...]`
- `urls` - Redirect history
