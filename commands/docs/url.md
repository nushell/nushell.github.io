---
title: url
categories: |
  network
version: 0.84.0
network: |
  Various commands for working with URLs.
usage: |
  Various commands for working with URLs.
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url ```


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |

## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

## Subcommands:

| name                                                   | type    | usage                                                                 |
| ------------------------------------------------------ | ------- | --------------------------------------------------------------------- |
| [`url build-query`](/commands/docs/url_build-query.md) | Builtin | Converts record or table into query string applying percent-encoding. |
| [`url encode`](/commands/docs/url_encode.md)           | Builtin | Converts a string to a percent encoded web safe string.               |
| [`url join`](/commands/docs/url_join.md)               | Builtin | Converts a record to url.                                             |
| [`url parse`](/commands/docs/url_parse.md)             | Builtin | Parses a url.                                                         |