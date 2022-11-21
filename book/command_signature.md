# Command signature

nu commands contains a signature section, take `str distance` as example, the signature is like this:

```
Signatures(Cell paths are supported):
  <string> | str distance <string> -> <int>
```

The first one before `|` is the type of input pipeline, then required argument type for the comamnd, finally the output type is `int`.  `(Cell paths are supported)` indicates that you can provide cell paths for `str distance` to apply operation at the given cell paths, and replace with the result, like:  `ls | str distance 'nushell' 'name'`

Here is another one example, `str join`:

```
Signatures:
  list<string> | str join <string?> -> <string>
```

It says that `str join` command expect input pipeline is a list of string, and take optional `string` type argument, finally the output type is `string`.

Some commands don't required input pipepline data, the first argument type will be `<nothing>`, the same is happened to output type if one command returns empty.
