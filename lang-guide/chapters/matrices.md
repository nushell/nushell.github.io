# Matrices

A `matrix` is a block of floating-point numbers with a fixed shape, such as 2 rows by 3 columns. You make one from a list of lists or a table, and then the `matrix` commands do arithmetic, products, sums and reshaping on the whole block at once, in compiled code instead of a closure per item. Reach for a matrix when the data is all numbers and you want linear algebra or totals along rows and columns. For anything with text, records or mixed types, keep a list of lists or a table.

This page covers creating matrices, the shape rules, element-wise and matrix operations, `matrix map` and `matrix reduce`, and converting back. [Custom values](./types/other_types/custom_value.md#matrices) describes the `matrix` value type itself. Bare [`matrix`](/commands/docs/matrix.md) prints the list of subcommands, the same as `help matrix`.

## Creating a matrix

### `into matrix`

[`into matrix`](/commands/docs/into_matrix.md) takes a list of lists of numbers, or a table whose cells are numbers. Every value becomes a float. A matrix displays like the list of lists it came from, so the examples on this page convert the result back with `matrix into-nu | to nuon` to show it on one line:

```nu
[[1 2] [3 4] [5 6]] | into matrix | matrix into-nu | to nuon
# => [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]
```

The input has to be rectangular. Every inner list must have the same length, or `into matrix` fails with `Inconsistent row lengths`. For a table, the column names of the first row decide which columns are read and in what order. Later rows are looked up by those names, so a row with its fields in a different order still lines up, a column that only later rows have is ignored, and a row that lacks one of the first row's columns is a `Missing column` error.

A table with a text column can't be converted. Select the numeric columns first:

```nu
[[name score]; [a 1] [b 2]] | into matrix
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to float.
# =>    ╭─[repl_entry #1:1:31]
# =>  1 │ [[name score]; [a 1] [b 2]] | into matrix
# =>    ·                               ─────┬─────
# =>    ·                                    ╰── can't convert string to float
# =>    ╰────
[[name score]; [a 1] [b 2]] | select score | into matrix | matrix into-nu | to nuon
# => [[1.0], [2.0]]
```

A string that holds a number, such as the cells of a CSV file read with `from csv --no-infer`, is converted to a float. A literal list of strings like `[["1" "2"]]` is rejected when the pipeline is parsed, because its type is known to be wrong. A flat list of numbers is rejected the same way. Wrap it in another list to get a matrix with one row, or see [one-dimensional matrices](#one-dimensional-and-larger-matrices) below. An empty list gives a matrix with the shape `[0, 0]`.

### `matrix identity` and `matrix zeros`

[`matrix identity n`](/commands/docs/matrix_identity.md) makes an `n` by `n` matrix with ones on the diagonal and zeros elsewhere. [`matrix zeros`](/commands/docs/matrix_zeros.md) takes one or more sizes and makes a matrix of zeros with that many dimensions, so `matrix zeros 3` is a vector of three values and `matrix zeros 2 3 4` has three dimensions. To fill a matrix with another value, add it to the zeros:

```nu
matrix zeros 2 3 | matrix add 7 | matrix into-nu | to nuon
# => [[7.0, 7.0, 7.0], [7.0, 7.0, 7.0]]
```

Neither command takes pipeline input. Every size must be a positive integer, so `matrix zeros 0 2` or `matrix identity -1` fails with `Invalid dimensions`.

### Shape and indexing

A matrix has three read-only fields that you reach with a cell path: `shape` is a list of the sizes, `ndim` is the number of dimensions, and `size` is the number of elements. An integer in the cell path picks a row, which comes back as a list of floats, and a second integer picks the element:

```nu
let m = [[1 2 3] [4 5 6]] | into matrix
{shape: $m.shape, ndim: $m.ndim, size: $m.size} | to nuon
# => {shape: [2, 3], ndim: 2, size: 6}
$m.1 | to nuon
# => [4.0, 5.0, 6.0]
$m.1.2
# => 6.0
```

A row index past the end is an `access_beyond_end` error, and any other name is `column_not_found`. To replace values, see [`matrix set-row` and `matrix set-col`](#rows-and-columns) below, or use `update` with a cell path as shown in [Adding and changing data](./filters/changing_data.md#matrices).

## Changing the shape

[`matrix reshape`](/commands/docs/matrix_reshape.md) takes the new sizes and refills them with the same elements in row order: all of the first row, then all of the second, and so on. The new sizes must multiply to the number of elements:

```nu
[[1 2 3] [4 5 6]] | into matrix | matrix reshape 3 2 | matrix into-nu | to nuon
# => [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]
[[1 2 3] [4 5 6]] | into matrix | matrix reshape 4 2
# => Error: nu::shell::error
# =>
# =>   × Shape mismatch
# =>    ╭─[repl_entry #1:1:35]
# =>  1 │ [[1 2 3] [4 5 6]] | into matrix | matrix reshape 4 2
# =>    ·                                   ───────┬──────
# =>    ·                                          ╰── cannot reshape 6 elements into shape [4, 2] (would have 8 elements)
# =>    ╰────
```

`--flatten` (`-f`) turns any matrix into a vector of all its elements and ignores sizes given with it. Without `--flatten`, at least one size is required (`Missing dimensions`), and every size must be positive.

[`matrix transpose`](/commands/docs/matrix_transpose.md) swaps the rows and columns of a two-dimensional matrix, so a 2 by 3 matrix becomes 3 by 2. With more dimensions it reverses their order, so shape `[2, 3, 4]` becomes `[4, 3, 2]`. A vector is returned unchanged.

### One-dimensional and larger matrices

Most examples here are two-dimensional, but a matrix can have one dimension or several. A vector comes from `matrix zeros n`, `matrix reshape n`, `matrix reshape --flatten`, or the `--axis` form of `matrix sum` and `matrix max`. A vector is not a one-row matrix. Its shape is `[3]`, not `[1, 3]`.

Some commands only handle certain shapes. `matrix get-col` and `matrix set-col` need exactly two dimensions. `matrix multiply` takes one or two. On a vector, each "row" holds a single element, so `matrix get-row 1` returns a one-element list and `matrix set-row 1 [5]` replaces one element. On three or more dimensions, `matrix get-row` returns all the values under that first index as one flat list, but `matrix set-row` crashes with a panic (`ndarray: index out of bounds`), so reshape to two dimensions before you set a row.

## Element-wise arithmetic

### Operators

The `+`, `-`, `*` and `/` operators work element by element. The right side is a number, which applies to every element, or a matrix of exactly the same shape. `*` multiplies matching elements, so it is not the matrix product; that is [`matrix multiply`](#the-matrix-product):

```nu
let a = [[1 2] [3 4]] | into matrix
let b = [[10 20] [30 40]] | into matrix
$a * $b | matrix into-nu | to nuon
# => [[10.0, 40.0], [90.0, 160.0]]
$a / 2 | matrix into-nu | to nuon
# => [[0.5, 1.0], [1.5, 2.0]]
```

The matrix has to be on the left. `2 * $a` is an `operator_incompatible_types` error, so write `$a * 2`. Two matrices of different shapes are the same error, with the hint `shapes do not match`:

```nu
([[1 2] [3 4]] | into matrix) + (matrix zeros 2 3)
# => Error: nu::shell::operator_incompatible_types
# =>
# =>   × Types 'matrix' and 'matrix' are not compatible for the '+' operator.
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ ([[1 2] [3 4]] | into matrix) + (matrix zeros 2 3)
# =>    ·                  ─────┬─────  ┬  ──────┬─────
# =>    ·                       │       │        ╰── matrix
# =>    ·                       │       ╰── does not operate between 'matrix' and 'matrix'
# =>    ·                       ╰── matrix
# =>    ╰────
# =>   help: shapes do not match
```

Other math operators, such as `**`, `mod` and `//`, don't accept a matrix. For those, use [`matrix map`](#matrix-map-and-matrix-reduce).

### `matrix add`, `matrix subtract` and `matrix scale`

[`matrix add`](/commands/docs/matrix_add.md) and [`matrix subtract`](/commands/docs/matrix_subtract.md) do the same as `+` and `-`. Their argument is a number or a matrix, and anything else, such as a string or a list, is an `Invalid argument` error. Two matrices must have the same shape:

```nu
matrix zeros 2 3 | matrix add (matrix zeros 3 2)
# => Error: nu::shell::error
# =>
# =>   × Shape mismatch
# =>    ╭─[repl_entry #1:1:20]
# =>  1 │ matrix zeros 2 3 | matrix add (matrix zeros 3 2)
# =>    ·                    ─────┬────
# =>    ·                         ╰── shapes do not match: [2, 3] vs [3, 2]. Use --broadcast to enable broadcasting.
# =>    ╰────
```

`--broadcast` (`-b`) relaxes that rule. The argument is stretched to the input's shape by repeating it along any dimension where its size is 1. Sizes are matched from the last dimension backwards, and a dimension the argument doesn't have counts as size 1. So a one-row matrix or a vector is applied to every row, and a one-column matrix to every column:

```nu
let scores = [[70 80 90] [60 75 85]] | into matrix
$scores | matrix subtract --broadcast ([[10 20 30]] | into matrix) | matrix into-nu | to nuon
# => [[60.0, 60.0, 60.0], [50.0, 55.0, 55.0]]
$scores | matrix add --broadcast ([[1] [2]] | into matrix) | matrix into-nu | to nuon
# => [[71.0, 81.0, 91.0], [62.0, 77.0, 87.0]]
```

Only the argument is stretched, never the input, so the result always has the input's shape. A one-row input with a two-row argument fails, as does an argument whose sizes don't fit:

```nu
matrix zeros 2 3 | matrix add --broadcast ([[1 2]] | into matrix)
# => Error: nu::shell::error
# =>
# =>   × Broadcast error
# =>    ╭─[repl_entry #1:1:20]
# =>  1 │ matrix zeros 2 3 | matrix add --broadcast ([[1 2]] | into matrix)
# =>    ·                    ─────┬────
# =>    ·                         ╰── shapes are not compatible for broadcasting
# =>    ╰────
```

[`matrix scale`](/commands/docs/matrix_scale.md) multiplies every element by a number, the same as `* n`. There is no divide command. Use the `/` operator, or scale by the reciprocal.

## The matrix product

[`matrix multiply`](/commands/docs/matrix_multiply.md) computes the matrix product of its input and its argument. Each element of the result is the dot product of a row of the input with a column of the argument. An `m` by `n` input needs an `n` by `p` argument and gives an `m` by `p` result. When the inner sizes differ, the error shows both shapes:

```nu
let a = [[1 2] [3 4]] | into matrix
let b = [[0 1] [1 0]] | into matrix
$a | matrix multiply $b | matrix into-nu | to nuon
# => [[2.0, 1.0], [4.0, 3.0]]
matrix zeros 2 3 | matrix multiply (matrix zeros 2 3)
# => Error: nu::shell::error
# =>
# =>   × Shape mismatch
# =>    ╭─[repl_entry #1:1:20]
# =>  1 │ matrix zeros 2 3 | matrix multiply (matrix zeros 2 3)
# =>    ·                    ───────┬───────
# =>    ·                           ╰── inner dimensions do not match: (2 x 3) dot (2 x 3)
# =>    ╰────
```

A vector times a vector of the same length is their dot product, and the result is a plain float, not a matrix. A two-dimensional matrix times a vector, or a vector times a matrix, gives a vector. Three or more dimensions are an `Unsupported dimensions` error. The argument must already be a matrix; a list of lists is a `cant_convert` error, so pipe it through `into matrix` first.

The order matters, since `A × B` is usually not `B × A`. `--swap` (`-s`) computes the argument times the input:

```nu
$a | matrix multiply --swap $b | matrix into-nu | to nuon
# => [[3.0, 4.0], [1.0, 2.0]]
```

`--multall` (`-a`) multiplies by every matrix argument in turn, left to right, so `$a | matrix multiply --multall $b $c` is `A × B × C`. Without `--multall`, matrices after the first argument are silently ignored. With both flags, `--swap` only swaps the input and the first argument, and the rest still multiply on the right:

```nu
$a | matrix multiply $b $b | matrix into-nu | to nuon
# => [[2.0, 1.0], [4.0, 3.0]]
$a | matrix multiply --multall $b $b | matrix into-nu | to nuon
# => [[1.0, 2.0], [3.0, 4.0]]
```

## Comparing matrices

`==`, `!=`, `<`, `<=`, `>` and `>=` compare two matrices element by element and return a single `bool`, which is `true` only when the comparison holds for every pair of elements. `!=` is `true` when any pair differs. A number on the right is compared with every element:

```nu
let a = [[1 2] [3 4]] | into matrix
[($a == ([[1 2] [3 4]] | into matrix)) ($a > 0) ($a > 2) ($a == (matrix zeros 3 3))] | to nuon
# => [true, true, false, false]
```

Because every pair has to agree, `$a < $b` and `$a >= $b` can both be `false`, for example for `[[1 3]]` and `[[2 2]]`. Matrices of different shapes are never equal, so `==` returns `false` and `!=` returns `true`, but the ordering operators fail with `cannot compare matrices with different shapes`.

## Rows and columns

[`matrix get-row`](/commands/docs/matrix_get-row.md) and [`matrix get-col`](/commands/docs/matrix_get-col.md) return one row or column as a list of floats, not as a matrix. [`matrix set-row`](/commands/docs/matrix_set-row.md) and [`matrix set-col`](/commands/docs/matrix_set-col.md) take an index and a list of numbers and return a new matrix with that row or column replaced. Indices start at 0:

```nu
let m = [[1 2 3] [4 5 6]] | into matrix
$m | matrix get-col 1 | to nuon
# => [2.0, 5.0]
$m | matrix set-row 0 [7 8 9] | matrix into-nu | to nuon
# => [[7.0, 8.0, 9.0], [4.0, 5.0, 6.0]]
```

An index past the end is an `Index out of bounds` error, and so is a negative index. The replacement list must have exactly as many numbers as the row or column:

```nu
[[1 2 3] [4 5 6]] | into matrix | matrix set-row 0 [7 8]
# => Error: nu::shell::error
# =>
# =>   × Size mismatch
# =>    ╭─[repl_entry #1:1:35]
# =>  1 │ [[1 2 3] [4 5 6]] | into matrix | matrix set-row 0 [7 8]
# =>    ·                                   ───────┬──────
# =>    ·                                          ╰── replacement has 2 elements, but row has 3 columns
# =>    ╰────
```

## Sums, means and maximums

[`matrix sum`](/commands/docs/matrix_sum.md), [`matrix mean`](/commands/docs/matrix_mean.md) and [`matrix max`](/commands/docs/matrix_max.md) reduce the whole matrix to one float:

```nu
let m = [[1 2 3] [4 5 6]] | into matrix
[($m | matrix sum) ($m | matrix mean) ($m | matrix max)] | to nuon
# => [21.0, 3.5, 6.0]
```

`matrix sum` and `matrix max` also take `--axis` (`-a`), which collapses one dimension and returns a matrix with one dimension fewer. For a two-dimensional matrix, `--axis 0` collapses the rows and gives one value per column, and `--axis 1` gives one value per row. The result is a vector, so `into value` shows it as a flat list:

```nu
$m | matrix sum --axis 0 | into value | to nuon
# => [5.0, 7.0, 9.0]
$m | matrix max --axis 1 | into value | to nuon
# => [3.0, 6.0]
```

An axis must be less than the number of dimensions, or the command fails with `Invalid axis`. A negative axis fails the same way. `matrix mean` has no `--axis`.

On an empty matrix, `matrix sum` returns `0.0`, `matrix max` returns `-inf`, and `matrix mean` fails with `Empty matrix`. There is no `matrix min`. Use `matrix reduce` as shown below, or negate: `$m | matrix scale -1 | matrix max | $in * -1`.

## `matrix map` and `matrix reduce`

[`matrix map`](/commands/docs/matrix_map.md) runs a closure on every element and returns a matrix of the same shape. The element is a float, passed as the closure's argument and as `$in`. The closure must return a number. A string that holds a number is accepted too, but anything else, including a `bool`, is an error:

```nu
[[1 2] [3 4]] | into matrix | matrix map { $in ** 2 } | matrix into-nu | to nuon
# => [[1.0, 4.0], [9.0, 16.0]]
[[1 2] [3 4]] | into matrix | matrix map {|x| $x > 2 }
# => Error: nu::shell::error
# =>
# =>   × Invalid result
# =>    ╭─[repl_entry #1:1:31]
# =>  1 │ [[1 2] [3 4]] | into matrix | matrix map {|x| $x > 2 }
# =>    ·                               ─────┬────
# =>    ·                                    ╰── closure must return a number
# =>    ╰────
```

To turn a test into a matrix, return `1` or `0`, as in `{|x| if $x > 2 { 1 } else { 0 } }`.

[`matrix reduce`](/commands/docs/matrix_reduce.md) works like [`reduce`](./filters/summarizing_lists.md#reduce) on the elements in row order. The closure gets the current element and the accumulator, in that order, and the accumulator is also `$in`. Without `--fold` (`-f`), the first element is the starting accumulator, so the closure first runs on the second element:

```nu
[[1 2] [3 4]] | into matrix | matrix reduce {|x, acc| print $"x=($x) acc=($acc)"; $acc * $x }
# => x=2.0 acc=1.0
# => x=3.0 acc=2.0
# => x=4.0 acc=6.0
# => 24.0
[[1 2 3] [4 5 6]] | into matrix | matrix reduce {|x, acc| [$x $acc] | math min }
# => 1.0
```

Unlike `matrix map`, the result can be any value, and `--fold` can start from any value, such as `0` for a count or `[]` to collect elements into a list. An empty matrix without `--fold` is an `Empty matrix` error. With `--fold`, an empty matrix returns the fold value.

Commands that walk through a list, such as `each`, `par-each` and `length`, don't accept a matrix. `each` points you to `matrix map` and `matrix reduce`:

```nu
[[1 2] [3 4]] | into matrix | each { $in }
# => Error: nu::shell::error
# =>
# =>   × Unsupported type
# =>    ╭─[repl_entry #1:1:31]
# =>  1 │ [[1 2] [3 4]] | into matrix | each { $in }
# =>    ·                               ──┬─
# =>    ·                                 ╰── Use `matrix map` for element-wise operations or `matrix reduce` to fold values.
# =>    ╰────
```

## Converting back

[`matrix into-nu`](/commands/docs/matrix_into-nu.md) and [`into value`](/commands/docs/into_value.md) both turn a matrix back into lists of floats. They agree for two and three dimensions and differ otherwise:

- For a vector, `matrix into-nu` returns a list that holds one list, like a one-row matrix, while `into value` returns a flat list.
- `matrix into-nu` nests at most three levels deep. With four or more dimensions, the innermost ones are flattened together. `into value` nests one level per dimension.

```nu
[[1 2 3]] | into matrix | matrix reshape 3 | matrix into-nu | to nuon
# => [[1.0, 2.0, 3.0]]
[[1 2 3]] | into matrix | matrix reshape 3 | into value | to nuon
# => [1.0, 2.0, 3.0]
```

`matrix into-nu --as-records` (`-r`) returns a table instead, with columns named `col0`, `col1` and so on. Use it only on a two-dimensional matrix. For other shapes, the records it returns hold `0.0` instead of the matrix's values.

The values stay floats in both cases. `to json` converts a matrix the same way `into value` does, but `to nuon` rejects it with `custom values are currently not nuon-compatible`, so convert it first.
