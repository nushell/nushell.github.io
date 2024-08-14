# Cell-Path

| **_Description:_** | An expression that is used to navigated to an inner value in a structured value.
| **_Annotation:_** | `cell-path`
| **_Literal syntax example:_** | A dot-separated list of row (int) and column (string) IDs. E.g., `name.4.5`. Optionally, use a leading `$.` when needed for disambiguation, such as when assigning a cell-path to a variable (see below).
| **_Casts:_** | [`into cell-path](/commands/docs/into_cell-path.md)

See [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) for an in-depth overview.

## Additional Language Notes

### Literal Syntax Options

- Relaxed form:

  ```nu
  > $data | get name.5
  ```

- Leading `$.` form:

  When assigning a cell path to a variable, the leading `$.` syntax is required:

  ```nu
  > let cp: cell-path = name.5
  # => Error
  > let cp: cell-path = $.name.5

  This is not required when using cell-path arguments to a custom command.
  ```

### Ordering

When accessing a cell in a table using a cell-path, either the row index or the column name can be listed first.

```nu
> ls | get name.0
# Returns the name of the first file
> ls | get 0.name
# Same result - The name of the first file
```

However, when accessing **nested** data, the ordering of _subsequent_ (nested) rows and columns is important.

Using the [nested weather data example](/book/navigating_structured_data.md#tables):

```nu
# Accesses the second day, third temperature
> $data.1.temps.2
34.91
# Also accesses the second day, third temperature
> $data.temps.1.2
34.91
# Accesses the third day, second temperature
> $data.temps.2.1
36.67
```

Notice that the first row/column can be swapped without changing the meaning, but swapping the position of the two row indices results in a different path.

### Using cell-path as a type annotation

Let's say we wanted our own version of the versatile `get` command.

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

## Casts

Cell-paths are not restricted to just the literal values demonstrated above. Cell-paths can also be constructed programmatically using the [`into cell-path`](/commands/docs/into_cell-path.md) command.

For example, you could construct the cell path in the temp data programmatically with this code which knows that the location desired is for Grand Rapids, Mich., U.S.A.

```nu
let grr = 2 # using IATA codes for variable names
let cp: cell-path = ([3, temps, $grr] | into cell-path)
$data | get $cp
# returns just temps for GRR
```
