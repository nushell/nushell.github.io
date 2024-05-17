# CustomValue

What it is: An opaque data type that is used internal to Nushell by compiled in commands or plugins.

Annotation: None

Custom values are values that might be created vy Nushell internal commands or plugins. For instance, a plugin might generate a custom value that encodes data in a binary format or some other data type like structured data used by DataFrames or SQLite.

Note: Custom values used by external commands are not this data type.

You might encounter a custom value in your interaction with parts of Nushell. Depending on the specific example, you should let the command handle it as described in the help documentation for that command or plugin.

There is not necessarily a string representation of any custom value.

## Examples

Some examples where you might encounter Custom Values:

### SQLite

```nu
[[a b]; [c d] [e f]] | into sqlite test.db
open test.db | describe
# => SQLiteDatabase
```

The output from describe is `SQLiteDatabase`, which is a CustomValue data type.

### Polars Plugin (formerly DataFrame)

Note: The `nu_plugin_polars` plugin is required for the following example to work - See [the Polars release announcement](https://www.nushell.sh/blog/2024-04-30-nushell_0_93_0.html#installation) or [The Book](https://www.nushell.sh/book/plugins.html#downloading-and-installing-a-plugin) for instructions on installing and registering.

```nu
> ls | polars into-df | describe
NuDataFrameCustomValue
```
