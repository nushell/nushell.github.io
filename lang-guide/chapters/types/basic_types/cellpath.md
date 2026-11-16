# Cell-Path

|                               |                                                                                                                                                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **_Description:_**            | An expression that is used to navigated to an inner value in a structured value.                                                                                                                           |
| **_Annotation:_**             | `cell-path`                                                                                                                                                                                                |
| **_Literal syntax example:_** | A dot-separated list of row (int) and column (string) IDs. E.g., `temps.3.2`. Optionally, use a leading `$.` when needed for disambiguation, such as when assigning a cell-path to a variable (see below). |
| **_Casts:_**                  | [`into cell-path`](/commands/docs/into_cell-path.md)                                                                                                                                                       |
| **_See also:_**               | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) for an in-depth overview.                                                                                                  |

## Literal Syntax Options

The examples on this page use the weather data from [Navigating and Accessing Structured Data](/book/navigating_structured_data.md#tables):

```nu
let data = [
    [date                        temps                                   condition      ];
    [2022-02-01T14:30:00+05:00,  [38.24, 38.50, 37.99, 37.98, 39.10],   'sunny'       ],
    [2022-02-02T14:30:00+05:00,  [35.24, 35.94, 34.91, 35.24, 36.65],   'sunny'       ],
    [2022-02-03T14:30:00+05:00,  [35.17, 36.67, 34.42, 35.76, 36.52],   'cloudy'      ],
    [2022-02-04T14:30:00+05:00,  [39.24, 40.94, 39.21, 38.99, 38.80],   'rain'        ]
]
```

- Relaxed form:

  ```nu
  $data | get condition.2
  # => cloudy
  ```

- Leading `$.` form:

  When assigning a cell path to a variable, the leading `$.` syntax is required. Without it, `condition.2` is treated as the name of an external command:

  ```nu
  let cp: cell-path = condition.2
  # => Error: nu::shell::external_command
  # =>
  # =>   × External command failed
  # =>    ╭─[repl_entry #1:1:21]
  # =>  1 │ let cp: cell-path = condition.2
  # =>    ·                     ─────┬─────
  # =>    ·                          ╰── Command `condition.2` not found
  # =>    ╰────
  # =>   help: `condition.2` is neither a Nushell built-in or a known external command

  let cp: cell-path = $.condition.2
  $data | get $cp
  # => cloudy
  ```

  This is not required when using cell-path arguments to a custom command.

- Member modifiers:

  A `?` after a member makes it optional (a missing value becomes `null` instead of an error), and a `!` makes it case-insensitive:

  ```nu
  {a: 1}.b? | describe
  # => nothing
  {Name: 1}.name!
  # => 1
  ```

  One member can have both modifiers, in either order. `?!` and `!?` mean the same thing, and Nushell displays the combination as `!?`. Repeating a modifier is a parse error: `{a: 1}.a??` fails with "expected . or !", and `.a!!` with "expected . or ?".

  ```nu
  {Name: 1}.name?!
  # => 1
  {Name: 1}.age!? | describe
  # => nothing
  ```

- Negative indexes:

  A row index counts from the start, and there is no negative form for counting from the end. `$list.-1` is a parse error:

  ```nu
  [1 2 3].-1
  # => Error: nu::parser::error
  # =>
  # =>   × Invalid literal
  # =>    ╭─[repl_entry #1:1:9]
  # =>  1 │ [1 2 3].-1
  # =>    ·         ─┬
  # =>    ·          ╰── negative index is not supported in cell path
  # =>    ╰────
  ```

  A negative int passed to `get` fails at runtime with "can't convert negative number to cell path". Use [`last`](/commands/docs/last.md) to get items from the end of a list.

- Directly on a value:

  A cell path can follow a variable, as in `$data.condition`, and it can also follow a list, record or table literal, or a subexpression in parentheses:

  ```nu
  [1 2].0
  # => 1
  {a: {b: 2}}.a.b
  # => 2
  [[a]; [1] [2]].a | to nuon
  # => [1, 2]
  (1..5).2
  # => 3
  ({a: 1} | insert b 2).b
  # => 2
  ```

  A command's output in parentheses works the same way, so `(ls).name` is the list of file names.

  A quoted string can't take a cell path. `"abc".0` is a parse error ("Invalid characters after closing delimiter"), and `("abc").0` fails with "string doesn't support cell paths".

## Additional Language Notes

1. Ordering

   - When accessing a cell in a table using a cell-path, either the row index or the column name can be listed first.

     ```nu
     # Returns the condition of the first day
     $data | get condition.0
     # => sunny
     # Same result - The condition of the first day
     $data | get 0.condition
     # => sunny
     ```

- However, when accessing **nested** data, the ordering of _subsequent_ (nested) rows and columns is important.

  Using the nested weather data from above:

  ```nu
  # Accesses the second day, third temperature
  $data.1.temps.2
  # => 34.91
  # Also accesses the second day, third temperature
  $data.temps.1.2
  # => 34.91
  # Accesses the third day, second temperature
  $data.temps.2.1
  # => 36.67
  ```

  Notice that the first row/column can be swapped without changing the meaning, but swapping the position of the two row indices results in a different path.

1. `cell-path` can be used as a type annotation.

   Example: A pure-Nushell implementation of the versatile `get` command.

   ```nu
   def my-get [p: cell-path] {
   get $p
   }

   # Now call it
   [1 2 3 4] | my-get 2
   # => 3
   # structured data
   {foo: 1, bar: { baz: {quo: 4}}} | my-get bar.baz.quo
   # => 4
   # with the $ prefix
   {foo: 1, bar: { baz: {quo: 4}}} | my-get $.bar.baz.quo
   # => 4
   # Create a var: $p
   let p: cell-path = $.bar.baz.quo
   # works so far
   # let's try for standard get
   {foo: 1, bar: { baz: {quo: 4}}} | get $p
   # => 4
   # Now with my-get
   {foo: 1, bar: { baz: {quo: 4}}} | my-get $p
   # => 4
   ```

1. Cell-paths are not restricted to just the literal values demonstrated above. Cell-paths can also be constructed programmatically using the [`into cell-path`](/commands/docs/into_cell-path.md) command.

   For example, you can construct the cell path in the temp data programmatically with this code which knows that the location desired is for Grand Rapids, Mich., U.S.A.

   ```nu
   let grr = 2 # using IATA codes for variable names
   let cp: cell-path = ([3, temps, $grr] | into cell-path)
   $cp
   # => $.3.temps.2
   # Returns the GRR temperature for the fourth day
   $data | get $cp
   # => 39.21
   ```

   `into cell-path` takes three kinds of input:

   - An int gives a one-member path: `5 | into cell-path` is `$.5`. A negative int is an error.
   - A list of ints and strings gives one member per item. An int is a row index and a string is a column name, so the string `"1"` names a column called `1`, not row 1.
   - A table with a `value` column gives one member per row. The optional `optional` and `insensitive` columns hold bools that add the `?` and `!` modifiers. Other columns are ignored.

   ```nu
   [[value optional insensitive]; [a true false] [B false true]] | into cell-path
   # => $.a?.B!
   ```

   A string on its own is rejected on purpose. Text such as `"a.b"` could name the column `a.b` or the path `a` then `b`, so split it yourself, and convert the parts that are row numbers to ints:

   ```nu
   "x.1" | split row "." | into cell-path
   # => $.x."1"
   "x.1" | split row "." | each {|m| try { $m | into int } catch { $m } } | into cell-path
   # => $.x.1
   ```

1. [`split cell-path`](/commands/docs/split_cell-path.md) goes the other way. It takes a cell path apart into a table with one row per member, in the same `value`, `optional` and `insensitive` columns that `into cell-path` reads, so the two commands undo each other:

   ```nu
   $.temps?.2.Name! | split cell-path
   # => ╭───┬───────┬──────────┬─────────────╮
   # => │ # │ value │ optional │ insensitive │
   # => ├───┼───────┼──────────┼─────────────┤
   # => │ 0 │ temps │ true     │ false       │
   # => │ 1 │     2 │ false    │ false       │
   # => │ 2 │ Name  │ false    │ true        │
   # => ╰───┴───────┴──────────┴─────────────╯
   ```

   A row index comes out as an int and a column name as a string, so `$.a."2"` gives the string `"2"`, not the int `2`. `insensitive` is always `false` for a row index. This lets a command inspect or change a path it received as an argument. For example, dropping the last member gives the path of the parent:

   ```nu
   def parent [p: cell-path] { $p | split cell-path | drop 1 | into cell-path }
   parent config.color.fg
   # => $.config.color
   ```

   The input has to be a cell-path value. A string such as `"a.b"` is an "Input type not supported" error, so turn it into a cell path first, as shown above.

## Common commands that can be used with `cell-path`

- `get`
- `select`
- `update`/`upsert`
- `into cell-path`, `split cell-path`
