---
title: http
categories: |
  network
version: 0.105.0
network: |
  Various commands for working with http methods.
usage: |
  Various commands for working with http methods.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `http` for [network](/commands/categories/network.md)

<div class='command-title'>Various commands for working with http methods.</div>

## Signature

```> http {flags} ```


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |
## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

## Subcommands:

| name                                             | description                                               | type     |
| ------------------------------------------------ | --------------------------------------------------------- | -------- |
| [`http delete`](/commands/docs/http_delete.md)   | Delete the specified resource.                            | built-in |
| [`http get`](/commands/docs/http_get.md)         | Fetch the contents from a URL.                            | built-in |
| [`http head`](/commands/docs/http_head.md)       | Get the headers from a URL.                               | built-in |
| [`http options`](/commands/docs/http_options.md) | Requests permitted communication options for a given URL. | built-in |
| [`http patch`](/commands/docs/http_patch.md)     | Patch a body to a URL.                                    | built-in |
| [`http post`](/commands/docs/http_post.md)       | Post a body to a URL.                                     | built-in |
| [`http put`](/commands/docs/http_put.md)         | Put a body to a URL.                                      | built-in |