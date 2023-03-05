# Working with lists

## Creating lists

A list is an ordered collection of values.
You can create a `list` with square brackets, surrounded values separated by spaces and/or commas (for readability).
For example, `[foo bar baz]` or `[foo, bar, baz]`.

## Updating lists

You can `update` and `insert` values into lists as they flow through the pipeline, for example let's insert the value `10` into the middle of a list:

```
> [1, 2, 3, 4] | insert 2 10
```

We can also use `update` to replace the 2nd element with the value `10`.

```
> [1, 2, 3, 4] | update 1 10
```
## Removing or adding items from list
In addition to `insert` and `update`, we also have `prepend` and `append`. These let you insert to the beginning of a list or at the end of the list, respectively.

For example:

```bash
let colors = [yellow green]
let colors = ($colors | prepend red)
let colors = ($colors | append purple)
$colors # [red yellow green purple]
```

In case you want to remove items from list, there are many ways. `skip` allows you skip first rows from input, while `drop` allows you to skip specific numbered rows from end of list. 
```bash
let colors = [red yellow green purple]
let colors = ($colors | skip 1)
let colors = ($colors | drop 2)
$colors # [yellow]
```
We also have `last` and `first` which allow you to `take` from the end or beginning of the list, respectively.
```bash
let colors = [red yellow green purple black magenta]
let colors = ($colors | last 3)
$colors # [purple black magenta]
```
And from the beginning of a list,
```bash
let colors = [yellow green purple]
let colors = ($colors | first 2)
$colors # [yellow green]
```

## Iterating over lists

To iterate over the items in a list, use the [`each`](/commands/docs/each.md) command with a [block](types_of_data.html#blocks)
of Nu code that specifies what to do to each item. The block parameter (e.g. `|it|` in `{ |it| print $it }`) is the current list
item, but the [`enumerate`](/commands/docs/enumerate.md) filter can be used to provide `index` and `item` values if needed. For example:

```bash
let names = [Mark Tami Amanda Jeremy]
$names | each { |it| $"Hello, ($it)!" }
# Outputs "Hello, Mark!" and three more similar lines.

$names | enumerate | each { |it| $"($it.index + 1) - ($it.item)" }
# Outputs "1 - Mark", "2 - Tami", etc.
```

The [`where`](/commands/docs/where.md) command can be used to create a subset of a list, effectively filtering the list based on a condition.

The following example gets all the colors whose names end in "e".

```bash
let colors = [red orange yellow green blue purple]
$colors | where ($it | str ends-with 'e')
# The block passed to `where` must evaluate to a boolean.
# This outputs the list [orange blue purple].
```

In this example, we keep only values higher than `7`.

```bash
let scores = [7 10 8 6 7]
$scores | where $it > 7 # [10 8]
```

The [`reduce`](/commands/docs/reduce.md) command computes a single value from a list.
It uses a block which takes 2 parameters: the current item (conventionally named `it`) and an accumulator
(conventionally named `acc`). To specify an initial value for the accumulator, use the `--fold` (`-f`) flag.
To change `it` to have `index` and `item` values, use the [`enumerate`](/commands/docs/enumerate.md) filter.
For example:

```bash
let scores = [3 8 4]
$"total = ($scores | reduce { |it, acc| $acc + $it })" # total = 15

$"total = ($scores | math sum)" # easier approach, same result

$"product = ($scores | reduce --fold 1 { |it, acc| $acc * $it })" # total = 96

$scores | enumerate | reduce --fold 0 { |it, acc| $acc + $it.index * $it.item } # 0*3 + 1*8 + 2*4 = 16
```

## Accessing the list

To access a list item at a given index, use the `$name.index` form where `$name` is a variable that holds a list.

For example, the second element in the list below can be accessed with `$names.1`.

```bash
let names = [Mark Tami Amanda Jeremy]
$names.1 # gives Tami
```

If the index is in some variable `$index` we can use the `get` command to extract the item from the list.

```bash
let names = [Mark Tami Amanda Jeremy]
let index = 1
$names | get $index # gives Tami
```

The [`length`](/commands/docs/length.md) command returns the number of items in a list.
For example, `[red green blue] | length` outputs `3`.

The [`is-empty`](/commands/docs/is-empty.md) command determines whether a string, list, or table is empty.
It can be used with lists as follows:

```bash
let colors = [red green blue]
$colors | is-empty # false

let colors = []
$colors | is-empty # true
```

The `in` and `not-in` operators are used to test whether a value is in a list. For example:

```bash
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
'gold' not-in $colors # true
```

The [`any`](/commands/docs/any.md) command determines if any item in a list
matches a given condition.
For example:

```bash
# Do any color names end with "e"?
$colors | any {|it| $it | str ends-with "e" } # true

# Is the length of any color name less than 3?
$colors | any {|it| ($it | str length) < 3 } # false

# Are any scores greater than 7?
$scores | any {|it| $it > 7 } # true

# Are any scores odd?
$scores | any {|it| $it mod 2 == 1 } # true
```

The [`all`](/commands/docs/all.md) command determines if every item in a list
matches a given condition.
For example:

```bash
# Do all color names end with "e"?
$colors | all {|it| $it | str ends-with "e" } # false

# Is the length of all color names greater than or equal to 3?
$colors | all {|it| ($it | str length) >= 3 } # true

# Are all scores greater than 7?
$scores | all {|it| $it > 7 } # false

# Are all scores even?
$scores | all {|it| $it mod 2 == 0 } # false
```

## Converting the list

The [`flatten`](/commands/docs/flatten.md) command creates a new list from an existing list
by adding items in nested lists to the top-level list.
This can be called multiple times to flatten lists nested at any depth.
For example:

```bash
[1 [2 3] 4 [5 6]] | flatten # [1 2 3 4 5 6]

[[1 2] [3 [4 5 [6 7 8]]]] | flatten | flatten | flatten # [1 2 3 4 5 6 7 8]
```

The [`wrap`](/commands/docs/wrap.md) command converts a list to a table. Each list value will
be converted to a separate row with a single column:

```bash
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# Show world clock for selected time zones
$zones | wrap 'Zone' | upsert Time {|it| (date now | date to-timezone $it.Zone | date format '%Y.%m.%d %H:%M')}
```

