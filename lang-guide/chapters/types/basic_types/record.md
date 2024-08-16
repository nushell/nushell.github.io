# Record

|                       |                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | The foundational associative map. Holds key-value pairs, which associate string keys with various data values. |
| **_Annotation:_**     | `record`                                                                                                       |
| **_Literal syntax:_** | See below                                                                                                      |
| **_Casts:_**          | [`into record`](/commands/docs/into_record.md)                                                                 |
| **_See Also:_**       | [Working with Records](/book/working_with_records.md)                                                          |
|                       | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md)                                |
|                       | [Types of Data - Records](/book/types_of_data.md#records)                                                      |

# Language Notes

- The keys maintain the order of insertion or the order defined in a record literal.
- Keys are guaranteed to be unique. Inserting the same key twice will keep only the last insertion or definition.

(TBD: complex hashable/equality checkable keys)

# Record-Literal Syntax

Record syntax is very similar to objects in JSON. However, commas are _not_ required to separate values when Nushell can easily distinguish them. The key-value pairs of a record may be delimited by:

- Commas

  ```nu
  > {name: "Sam", rank: 10}
  ╭──────┬─────╮
  │ name │ Sam │
  │ rank │ 10  │
  ╰──────┴─────╯
  ```

- Spaces (when unambiguous):

  ```nu
  > {name: "Sam" rank: 10}
  ╭──────┬─────╮
  │ name │ Sam │
  │ rank │ 10  │
  ╰──────┴─────╯
  ```

- Line breaks:

  ```nu
  > {
      name: "Sam"
      rank: 10
    }
  ╭──────┬─────╮
  │ name │ Sam │
  │ rank │ 10  │
  ╰──────┴─────╯
  ```

## Common commands that can be used with `record`

Since the record data type is foundational to Nushell's structured nature, many commands use records as inputs or as parameters. See the list of commands for tables as many of those also take records.

Here are a few commands that use records:

- `get`
- `insert`
- `merge`
- `update`
- `upsert`
