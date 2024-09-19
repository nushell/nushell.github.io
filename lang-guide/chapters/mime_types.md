# MIME Types for Nushell

[MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types),
also known as media or content types, are used to identify data formats.
Since Nushell is not officially recognized by the _Internet Assigned Numbers
Authority (IANA)_, all Nushell MIME types are prefixed with "-x" to indicate
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
