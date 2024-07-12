# Command signature

nu commands can be given explicit signatures; take [`str stats`](/commands/docs/str_stats.md) as an example, the signature is like this:

```nu
def "str stats" []: string -> record { }
```

The type names between the `:` and the opening curly brace `{` describe the command's input/output pipeline types. The input type for a given pipeline, in this case `string`, is given before the `->`; and the output type `record` is given after `->`. There can be multiple input/output types. If there are multiple input/output types, they can be placed within brackets and separated with commas, as in [`str join`](/commands/docs/str_join.md):

```nu
def "str join" [separator?: string]: [list -> string, string -> string] { }
```

It says that the [`str join`](/commands/docs/str_join.md) command takes an optional `string` type argument, and an input pipeline of either a `list` (implying `list<any>`) with output type of `string`, or a single `string`, again with output type of `string`.

Some commands don't accept or require data through the input pipeline, thus the input type will be `<nothing>`.
The same is true for the output type if the command returns `null` (e.g. [`rm`](/commands/docs/rm.md) or [`hide`](/commands/docs/hide.md)):

```nu
def hide [module: string, members?]: nothing -> nothing { }
```
