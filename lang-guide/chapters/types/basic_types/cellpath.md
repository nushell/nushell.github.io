# CellPath

What it is: An expression to reach into a structured value and return the inner value, in whole or in part.

Annotation: `cell-path`

Indexing into values is done by using a cell path. Cell paths are based on the spreadsheet idea where columns have names and rows have numbers. To reach a column, Nushell will use the name of the column. To reach a row, it will use the name of the row.

In this example, we get the 2nd element inside of `$x`:`$x.1`. Rows are 0-based, so the row with number `1` is the second row.

Likewise, `$x.foo` means to reach into `$x` and get the data in column `foo`.

Rows also double as indices into lists. `$x.2` will get the 3rd element of the list.

Column names also double as fields in records. `$x.bar` will return the value in the field named `bar` inside of the record held by `$x`.

You can create cell paths as deeply nested as you need, simply add a period between parts.

For example, assume you want the 3rd element of the column temps in the 4th row of the following table:

```nu
# Temp values captured at 5 locations over a span of 4 days
let data = [[date temps conditions];
[2022-02-01T14:30:00+05:00,[    39.24,    42.94,    16.21,    31.24,    38.65  ], , 'good'],
[2022-02-02T14:30:00+05:00,[    39.24,    42.94,    16.21,    31.24,    38.65], 'sunny'],
[2022-02-03T14:30:00+05:00,[    19.17,    22.67,    42.42,    41.76,    24.52  ] , 'cloudy'],
[2022-02-04T14:30:00+05:00,[39.24,    42.94,    16.21,    31.24,    38.65  ], 'windy'],
]

# Get the 3rd temp from the 4th row of  the table:
$data | get $.3.temps.2
# => 16.21
```

Note that we can also represent cell paths with the leading `$.`. In the above example, the cell path could have been written as `$data | get 3.temps.2` without the leading `$.`. However, if assigning a cell path to a variable that begins with a numerical index, then you must use the leading `$.` syntax.

```nu
# Correct
let cp: cell-path = $.0.foo
# Error
let cp: cell-path = 0.foo
```

This does not affect using cell paths s arguments to a custom command.

#### Optional cell paths

By default, cell path access will fail if it can't access the requested row or column. To suppress these errors, you can add a `?` to a cell path member to mark it as optional:

Using the temp data from above:

```nu
let cp: cell-path = $.temps?.1 # only get the 2nd location from the temps column

# Ooops, we've removed the temps column
$data | reject temps | get $cp
```

By default missing cells will be replaced by null.

## Using cell paths with tables

The order of parts of a cell path might depend on the structure of the data
you are trying to extract from. Note that the above table could also be accessed with

```nu
let cp = $.temps.0.2
```

In this case, the first part: `$.temps` will return a list of the entire temps column from the table. Then the `.0` part will get the list in that row and the `.2` part will get the 3rd item from that list.

## Using cell-path as a type annotation

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

Cell paths are not restricted to just literal values in your program source. You can also construct them on the fly with the `into cell-path` command.

For example, you could construct the cell path in the temp data programmatically with this code which knows that the location desired is for Grand Rapids, Mich., U.S.A.

```nu
let grr = 2 # using IATA codes for variable names
let cp: cell-path = ([3, temps, $grr] | into cell-path)
$data | get $cp
# returns just temps for GRR
```

See `help into cell-path` for full description and further examples.
