# Range

What it is: A range describes a range of values from a starting value to an ending value, with an optional stride.

Values are separated by `..` to create a range.

Annotation:`range`

Example 1:

Values from 1 to 10 inclusive:
`1..10`

Value from 1 to 10, striding with 2 (only odds):
`1..3..10`

You can also use `..<` to have values up to, but not including, the range end.

Values from 1 to 9:
`1..<10`

Ranges can range over int or float values.

Ranges can also work backward. For example, the values from 10 to 1 in reverse could be created with:

```nu
10..1
# => [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

Ranges can exclude either the `from` or the `to` side of the range:

Numbers from 0 to 10:

```nu
..10
# => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Numbers starting from 1:

```nu
1..
# => infinite range starting at 1
```

Ranges are lazy. They do not generate their values until needed. You can use a range with no specified end point and combine it with a command that takes only the first n elements. For example, you could generate the numbers from 1 to 10 using:

```nu
1.. | take 10
# => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## Casts

Ranges may be converted to `list<int>` using:

```nu
1..5 | each {||}
```
