# `std/formats`

The `std/formats` module adds `from` and `to` commands for three line-based formats, in which each line of the text is one value:

| Format | Commands                   | Each line holds                             | Content type           |
| ------ | -------------------------- | ------------------------------------------- | ---------------------- |
| JSONL  | `from jsonl`, `to jsonl`   | one JSON value                              | `application/jsonl`    |
| NDJSON | `from ndjson`, `to ndjson` | one JSON value                              | `application/x-ndjson` |
| NDNUON | `from ndnuon`, `to ndnuon` | one [NUON](/commands/docs/to_nuon.md) value | `application/x-ndnuon` |

[JSON Lines](https://jsonlines.org/) and [NDJSON](https://github.com/ndjson/ndjson-spec) describe the same format, and their commands behave the same. Only the content type that `to` sets in the [pipeline metadata](../metadata.md) differs.

Import the module with a glob:

```nu
use std/formats *
```

The glob matters. [`open`](/commands/docs/open.md) parses a file by calling the `from` command named after its extension, and [`save`](/commands/docs/save.md) calls the matching `to` command. After `use std/formats *`, `from jsonl` and the others are in scope under those names, so `open` and `save` handle `.jsonl`, `.ndjson` and `.ndnuon` files:

```nu
[{name: a, size: 1} {name: b, size: 2}] | save data.jsonl
open data.jsonl
# => ╭───┬──────┬──────╮
# => │ # │ name │ size │
# => ├───┼──────┼──────┤
# => │ 0 │ a    │    1 │
# => │ 1 │ b    │    2 │
# => ╰───┴──────┴──────╯
open --raw data.jsonl
# => {"name":"a","size":1}
# => {"name":"b","size":2}
```

After `use std/formats` without the glob, the commands are named `formats from jsonl` and so on, and `open data.jsonl` returns the file's contents unparsed. Without either import, `save data.jsonl` fails, because no `to jsonl` command exists.

## JSON Lines and NDJSON

`from jsonl` and `from ndjson` are the same as [`from json --objects`](/commands/docs/from_json.md). They parse each line as a JSON value and return a list of the values, skipping blank lines. A line that isn't valid JSON, such as `{bad`, makes the whole conversion fail with `Error while parsing JSON text`. The parser is lenient about bare words, though, so a line such as `not json` comes back as the string `not json`.

`to jsonl` and `to ndjson` write each item of a list as compact JSON on its own line, with a newline after every line, including the last. A single record or other value that isn't a list becomes one line, with no newline after it.

## NDNUON

`from ndnuon` and `to ndnuon` do the same with NUON, so values keep Nushell types that JSON doesn't have, such as file sizes, durations and dates. `to nuon` writes a string that contains a newline with a real line break in it, which would split the value across two lines. `to ndnuon` replaces each line break inside a value with the two characters `\n`, which NUON reads back as a newline:

```nu
[{name: "two\nlines"}, [1 2]] | to ndnuon
# => {name: "two\nlines"}
# => [1, 2]
[{name: "two\nlines"}, [1 2]] | to ndnuon | from ndnuon | get 0.name
# => two
# => lines
```

`from ndnuon` skips blank lines too.
