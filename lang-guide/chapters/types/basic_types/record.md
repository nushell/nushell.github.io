# Record

What it is: A record is the foundational associative map.

Annotation: `record`

A record contains items of any value that are addressed by a string key. (TBD: complex hashable/equality checkable keys)
The keys maintain the order of insertion or the order defined in a record literal.
Keys are guaranteed to be unique. Inserting twice with the same key will only keep the last insertion or definition.

`{a: b, c: d}`

## Casts

The command `into record` can be used to convert other data types into records.
See the command: `help into record` fro a complete list of input data types.

## Commands that use record

Since the record data type is foundational to Nushell's structured nature, many commands use records as inputs or as parameters. See the list of commands for tables because many of those also take records.

Here are a few commands that use records:

- `get`
- `insert`
- `merge`
- `update`
- `upsert`
