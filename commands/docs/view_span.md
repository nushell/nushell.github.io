---
title: view span
categories: |
  debug
version: 0.77.0
debug: |
  View the contents of a span.
usage: |
  View the contents of a span.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> view span (start) (end)```

## Parameters

 -  `start`: start of the span
 -  `end`: end of the span

## Notes
This command is meant for debugging purposes.
It allows you to view the contents of nushell spans.
One way to get spans is to pipe something into 'debug --raw'.
Then you can use the Span { start, end } values as the start and end values for this command.
## Examples

View the source of a span. 1 and 2 are just example values. Use the return of debug -r to get the actual values
```shell
> some | pipeline | or | variable | debug -r; view span 1 2

```
