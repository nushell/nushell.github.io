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

Nushell records the content type of some pipeline data in its [metadata](/commands/docs/metadata.md) (the `content_type` field):

- `open` sets `application/x-nuscript` for `.nu` files. When `open` parses a file with a `from` command (for example a `.nuon`, `.json` or `.md` file), the parsed value has no content type. With `open --raw`, the file's content type is kept.
- `to nuon` sets `application/x-nuon`. Other `to` commands set their own types, e.g. `to json` sets `application/json`.
- `config nu --doc` and `view source` (for a custom command) set `application/x-nuscript`.

```nu
{a: 1} | to nuon | metadata | get content_type
# => application/x-nuon
{a: 1} | save --force data.nuon
open --raw data.nuon | metadata | get content_type
# => application/x-nuon
open data.nuon | metadata | get content_type? | describe
# => nothing
```

The HTTP commands use these types too:

- `http post`, `http put` and `http patch` send the content type from the metadata as the `Content-Type` header when `--content-type` is not given. So `{a: 1} | to nuon | http post $url` sends `Content-Type: application/x-nuon`.
- `http get` (like the other `http` commands) parses a response with the `from` command that matches the subtype of its content type, ignoring an `x-` prefix. A response with `Content-Type: application/x-nuon` is therefore parsed with `from nuon`.

`text/x-nushell` is not set or recognized by Nushell itself.
