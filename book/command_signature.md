# Command signature

nu commands contains a signature section, take `str distance` as example, the signature is like this:

```
Signatures(Cell paths are supported):
  <string> | str distance <string> -> <int>
```

The first type name before `|` describes the type of input pipeline. The command name is followed by the required argument type(s) for the command. The output type is `int` and given after `->`.
  
`(Cell paths are supported)` indicates that you can provide cell paths for `str distance` to apply an operation at the given cell path(s) in a nested structure or table, and replace the column or field with the result, like:  `ls | str distance 'nushell' 'name'`

Here is another one example, `str join`:

```
Signatures:
  list<string> | str join <string?> -> <string>
```

It says that `str join` command expect input pipeline is a list of string, and take optional `string` type argument, finally the output type is `string`.

Some commands don't required input pipepline data, the first argument type will be `<nothing>`, the same is happened to output type if one command returns empty.
