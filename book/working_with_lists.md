# Working with lists

A list is an ordered collection of values.
The literal syntax for creating a `list` is to include expressions
in square brackets separated by spaces or commas (for readability).
For example, `[foo bar baz]` or `[foo, bar, baz]`.

To iterate over the items in a list, use the `each` command with a [block](types_of_data.html#blocks)
of Nu code that specifies what to do to each item. The block parameter (e.g. `|it|` in `{ |it| echo $it }`) is normally the current list item, but the `--numbered` (`-n`) flag can change it to have `index` and `item` values if needed. For example:

```bash
let names = [Mark Tami Amanda Jeremy]
$names | each { |it| $"Hello, ($it)!" }
# Outputs "Hello, Mark!" and three more similar lines.

$names | each -n { |it| $"($it.index + 1) - ($it.item)" }
# Outputs "1 - Mark", "2 - Tami", etc.
```

The `split row` command creates a list from a string based on a delimiter.
For example, `let colors = ("red,green,blue" | split row ",")`
creates the list `[red green blue]`.

To access a list item at a given index, use `$name.index`
where `$name` is a variable that holds a list.
For example, the second element in the list above
which is "Tami" can be accessed with `$names.1`.

The `length` command returns the number of items in a list.
For example, `[red green blue] | length` outputs `3`.

The `empty?` command determines whether a string, list, or table is empty.
It can be used with lists as follows:

```bash
let colors = [red green blue]
$colors | empty? # false

let colors = []
$colors | empty? # true
```

The `in` and `not-in` operators are used to test whether a value is in a list. For example:

```bash
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
```

The `where` command can be used to create a subset of a list.
The following example gets all the colors whose names end in "e".

```bash
let colors = [red orange yellow green blue purple]
echo $colors | where ($it | str ends-with 'e')
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
echo $colors | any? ($it | str ends-with "e") # true

# Is the length of any color name less than 3?
echo $colors | any? ($it | str length) < 3 # false

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
echo $colors | all? ($it | str ends-with "e") # false

# Is the length of all color names greater than or equal to 3?
echo $colors | all? ($it | str length) >= 3 # true

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
let colors = ($colors | prepend red)
let colors = ($colors | append purple)
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
It uses a block which takes 2 parameters: the current item (conventionally named `it`) and an accumulator
(conventionally named `acc`). To specify an initial value for the accumulator, use the `--fold` (`-f`) flag.
To change `it` to have `index` and `item` values, add the `--numbered` (`-n`) flag.
For example:

```bash
let scores = [3 8 4]
echo "total =" ($scores | reduce { |it, acc| $acc + $it }) # 15

echo "total =" ($scores | math sum) # easier approach, same result

echo "product =" ($scores | reduce --fold 1 { |it, acc| $acc * $it }) # 96

echo $scores | reduce -n { |it, acc| $acc + $it.index * $it.item } # 3 + 1*8 + 2*4 = 19
```


The `wrap` command converts a list to a table. Each list value will
be converted to a separate row with a single column:
```bash
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# Show world clock for selected time zones
$zones | wrap 'Zone' | update Time {|it| (date now | date to-timezone $it.Zone | date format '%Y.%m.%d %H:%M')}
```
