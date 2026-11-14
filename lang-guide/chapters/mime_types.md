# MIME Types for Nushell

[MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types),
also known as media or content types, are used to identify data formats.
Since Nushell is not officially recognized by the _Internet Assigned Numbers
Authority (IANA)_, all Nushell MIME types are prefixed with "x-" to indicate
their unofficial status.
Despite this, some tools still rely on MIME types to identify data formats.

The three MIME types we define and recommend for consistent use are:

- **`application/x-nuscript`:**
  This type is used for Nushell scripts and is similar to
  `application/x-shellscript` for Bash scripts.
  The "application" type is used because these scripts can be executable if the
  correct shebang is included.
- **`text/x-nushell`:**
  This is an alias for `application/x-nuscript` but emphasizes that the script
  is human-readable, similar to `text/x-python`.
- **`application/x-nuon`:**
  This type is used for the [NUON data format](../../book/loading_data.html#nuon).

## How Nushell uses these types

Nushell records the content type of some pipeline data in its [metadata](/book/metadata.md) (the `content_type` field). These commands set it:

| Command                                       | Content type                |
| --------------------------------------------- | --------------------------- |
| `to csv`                                      | `text/csv`                  |
| `to html`                                     | `text/html; charset=utf-8`  |
| `to json`                                     | `application/json`          |
| `to kdl`                                      | `application/x-kdl`         |
| `to md`                                       | `text/markdown`             |
| `to msgpack`                                  | `application/x-msgpack`     |
| `to nuon`                                     | `application/x-nuon`        |
| `to text`, `to txt`                           | `text/plain`                |
| `to toml`                                     | `text/x-toml`               |
| `to tsv`                                      | `text/tab-separated-values` |
| `to xml`                                      | `application/xml`           |
| `to yaml`, `to yml`                           | `application/yaml`          |
| `config nu --doc`, `view source`, `view span` | `application/x-nuscript`    |

`open` sets a type only when it doesn't parse the file, that is with `--raw` or when no `from` command matches the file's extension. The type comes from the extension. `.yaml` and `.yml` get `application/yaml`, `.json`, `.jsonl` and `.ndjson` get `application/json`, `.nu` gets `application/x-nuscript`, and `.nuon` gets `application/x-nuon`. Other extensions are looked up in a standard table, so `.toml` gives `text/x-toml` and `.csv` gives `text/csv`, and an extension that isn't in the table gives no type. When `open` parses a file with a `from` command, the parsed value has no content type:

```nu
{a: 1} | to nuon | metadata | get content_type
# => application/x-nuon
{a: 1} | save --force data.nuon
open --raw data.nuon | metadata | get content_type
# => application/x-nuon
open data.nuon | metadata | get content_type? | describe
# => nothing
```

[`metadata set --content-type`](/commands/docs/metadata_set.md) sets the type by hand, and `--content-type null` removes it.

Commands that pass data along, such as `where` or `str trim`, keep the type. These commands remove it, because their output is no longer data of that type:

- every `from` command
- [`str substring`](/commands/docs/str_substring.md)
- [`first`](/commands/docs/first.md), [`last`](/commands/docs/last.md), [`skip`](/commands/docs/skip.md) and [`take`](/commands/docs/take.md) on binary data, along with [`bytes at`](/commands/docs/bytes_at.md) and [`bytes remove`](/commands/docs/bytes_remove.md). The first bytes of a PNG image aren't a PNG image. On a list these commands keep the type.
- [`detect type`](/commands/docs/detect_type.md), when it turns the string into another type
- [`nu-highlight`](/commands/docs/nu-highlight.md) and [`to dotenv`](/commands/docs/to_dotenv.md)

Commands that build new data from their input, such as `lines`, usually return no metadata at all. A value stored in a variable doesn't keep its metadata either.

The HTTP commands use these types too:

- `http post`, `http put`, `http patch` and `http delete` send the content type from the metadata as the `Content-Type` header when `--content-type` is not given. So `{a: 1} | to nuon | http post $url` sends `Content-Type: application/x-nuon`. Only a body piped into the command has metadata. For a body given as an argument, or with `--data` for `http delete`, use `--content-type`.
- `http get` (like the other `http` commands) parses a response with the `from` command that matches the subtype of its content type, ignoring an `x-` prefix. A response with `Content-Type: application/x-nuon` is therefore parsed with `from nuon`.

`text/x-nushell` is not set or recognized by Nushell itself.
