---
title: error make
categories: |
  core
version: 0.82.0
core: |
  Create an error.
usage: |
  Create an error.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> error make (error_struct) --unspanned```

## Parameters

 -  `error_struct`: the error to create
 -  `--unspanned` `(-u)`: remove the origin label from the error

## Examples

Create a simple custom error
```shell
> error make {msg: "my custom error message"}
{msg: my custom error message, debug: GenericError("my custom error message", "", None, None, []), raw: GenericError("my custom error message", "", None, None, [])}
```

Create a more complex custom error
```shell
> error make {
        msg: "my custom error message"
        label: {
            text: "my custom label text"  # not mandatory unless $.label exists
            start: 123  # not mandatory unless $.label.end is set
            end: 456  # not mandatory unless $.label.start is set
        }
    }
{msg: my custom error message, debug: GenericError("my custom error message", "my custom label text", Some(Span { start: 123, end: 456 }), None, []), raw: GenericError("my custom error message", "my custom label text", Some(Span { start: 123, end: 456 }), None, [])}
```

Create a custom error for a custom command that shows the span of the argument
```shell
> def foo [x] {
        let span = (metadata $x).span;
        error make {
            msg: "this is fishy"
            label: {
                text: "fish right here"
                start: $span.start
                end: $span.end
            }
        }
    }

```
