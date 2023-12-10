# Command signature

nu commands can be given explicit signatures; take [`str distance`](/commands/docs/str_distance.md) as an example, the signature is like this:

```nu
def "str distance" [comapare-string: string, ...rest: cell-path]: [string -> int, table -> table, record -> record]
```

The type names in the brackets after the `:` describe the command's input/output pipeline types. The input type for a given pipeline, in this case `string`, is given before the `->`; and the output type `int` is given after `->`. There can be multiple input/output types.

The `cell-path` type indicates that you can provide cell paths for `str distance` to apply an operation at the given cell path(s) in a nested structure or table, and replace the column or field with the result, like: `ls | str distance 'nushell' 'name'`

Here is another example, [`str join`](/commands/docs/str_join.md):

```nu
def "str join" [separator?: string]: [list<string> -> string, string -> string]
```

It says that the [`str join`](/commands/docs/str_join.md) command takes an optional `string` type argument, and an input pipeline of either a list of `string`s with output type of `string`, or a single `string`, again with output type of `string`.

Some commands don't accept or require data through the input pipeline, thus the input type will be `<nothing>`.
The same is true for the output type if the command returns `null` (e.g. [`rm`](/commands/docs/rm.md)).
