# CustomValue

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | An opaque data type that is only used internally in Nushell by built-in commands or plugins.
| **_Annotation:_**     | None
| **_Literal syntax:_** | None
| **_Casts:_**          | None

## Additional Language Notes

1. Custom values are those that might be created by Nushell internal commands or plugins. For instance, a plugin might generate a custom value that encodes data in a binary format or some other data type like structured data used by the Polars plugin or SQLite.

   Example - SQLite:

   ```nu
   [[a b]; [c d] [e f]] | into sqlite test.db
   open test.db | describe
   # => SQLiteDatabase
   ```

   The output from describe is `SQLiteDatabase`, which is a CustomValue data type.

   Example - Polars Plugin (formerly DataFrame)

   Note: The `nu_plugin_polars` plugin is required for the following example to work - See [the Polars release announcement](https://www.nushell.sh/blog/2024-04-30-nushell_0_93_0.html#installation) or [The Book](https://www.nushell.sh/book/plugins.html#downloading-and-installing-a-plugin) for instructions on installing and registering.

   ```nu
   ls | polars into-df | describe
   # => NuDataFrameCustomValue
   ```

1. Values used by external commands (e.g., `curl`) are **not** of the `CustomValue` type.

1. You might encounter a custom value in your interaction with parts of Nushell. Depending on the specific example, you should let the command handle it as described in the help documentation for that command or plugin.

1. There is not necessarily a string representation of any custom value.
