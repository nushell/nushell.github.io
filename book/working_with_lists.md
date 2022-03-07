# Working with lists

A list is an ordered collection of values.
The literal syntax for creating a `list` is to include expressions
in square brackets separated by spaces or commas (for readability).
For example, `[foo bar baz]` or `[foo, bar, baz]`.

To iterate over the elements in a list, use the `each` command.
The `$it` special variable holds the output of the previous command.
When used in a block passed to the `each` command, it holds the current item.
To change `$it` to have `$it.index` and `$it.item` values,
add the `--numbered` (`-n`) flag.
For example:

```bash
let names = [Mark Tami Amanda Jeremy]
echo $names | each { build-string "Hello, " $it "!" }
# Outputs "Hello, Mark!" and three more similar lines.

echo $names | each -n { build-string ($it.index + 1) ")" $it.item }
```

The `split row` command creates a list from a string based on a delimiter.
For example, `let colors = $(echo "red,green,blue" | split row ",")`
creates the list `[red green blue]`.

To access a list item at a given index, use `$name.index`
where `$name` is a variable that holds a list.
For example, the second element in the list above
which is "Tami" can be accessed with `$names.1`.

The `length` command returns the number of items in a list.
For example, `echo [red green blue] | length` outputs `3`.

The `empty?` command determines whether a string, list, or table is empty.
It can be used with lists as follows:

```bash
let colors = [red green blue]
= $colors | empty? # false

let colors = []
= $colors | empty? # true
```

The `in` and `not in` operators are used to test whether a value is in a list. For example:

```bash
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
```

The `where` command can be used to create a subset of a list.
The following example gets all the colors whose names end in "e".

```bash
let colors = [red orange yellow green blue purple]
echo $colors | where (echo $it | str ends-with 'e')
# The block passed to where must evaluate to a boolean.
# This outputs the list [orange blue purple].

let scores = [7 10 8 6 7]
echo $scores | where $it > 7 # [10 8]
```

The `any?` command determines if any item in a list
matches a given condition.
For example:

```bash
# Do any color names end with "e"?
echo $colors | any? (echo $it | str ends-with "e") # true

# Is the length of any color name less than 3?
echo $colors | any? (echo $it | str length) < 3 # false

# Are any scores greater than 7?
echo $scores | any? $it > 7 # true

# Are any scores odd?
echo $scores | any? $it mod 2 == 1 # true
```

The `all?` command determines if every item in a list
matches a given condition.
For example:

```bash
# Do all color names end with "e"?
echo $colors | all? (echo $it | str ends-with "e") # false

# Is the length of all color names greater than or equal to 3?
echo $colors | all? (echo $it | str length) >= 3 # true

# Are all scores greater than 7?
echo $scores | all? $it > 7 # false

# Are all scores even?
echo $scores | all? $it mod 2 == 0 # false
```

The `append` command appends a single value to the end of a list.
The `prepend` command prepends a single value to the beginning of a list.
For example:

```bash
let colors = [yellow green]
let colors = (echo $colors | prepend red)
let colors = (echo $colors | append purple)
echo $colors # [red yellow green purple]
```

The `flatten` command creates a new list from an existing list
by adding items in nested lists to the top-level list.
This can be called multiple times to flatten lists nested at any depth.
For example:

```bash
echo [1 [2 3] 4 [5 6]] | flatten # [1 2 3 4 5 6]

echo [[1 2] [3 [4 5 [6 7 8]]]] | flatten | flatten | flatten # [1 2 3 4 5 6 7 8]
```

The `reduce` command computes a single value from a list.
It takes a block which can use the special variables
`$acc` (for accumulator) and `$it` (for item).
To specify an initial value for `$acc`, use the `--fold` (`-f`) flag.
To change `$it` to have `$it.index` and `$it.item` values,
add the `--numbered` (`-n`) flag.
This also changes `$acc` to have a `$acc.item` value.
For example:

```bash
let scores = [3 8 4]
echo "total =" (echo $scores | reduce { $acc + $it }) # 15

echo "total =" (echo $scores | math sum) # easier approach, same result

echo "product =" (echo $scores | reduce --fold 1 { $acc * $it }) # 96

echo $scores | reduce -n { $acc.item + $it.index * $it.item }
# This should produce 0*3 + 1*8 + 2*4 = 16.
# But see https://github.com/nushell/nushell/issues/3298.
```


The `wrap` command converts list to a table. Each list value will
be converted to a separate row with a single column:
```bash
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# Show world clock for selected time zones
echo $zones | wrap 'Zone' | insert Time {(date now | date to-timezone $it.Zone | date format '%Y.%m.%d %H:%M')}
```
