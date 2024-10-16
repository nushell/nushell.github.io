# Sorting

Nushell offers many ways of sorting data, and which method you reach for will depend on the problem and what kind of data you're working with. Let's take a look at some of the ways you might wish to sort data.

## Basic sorting

### Lists

Sorting a basic list works exactly how you might expect:

```nu
> [9 3 8 1 4 6] | sort
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 3 │
│ 2 │ 4 │
│ 3 │ 6 │
│ 4 │ 8 │
│ 5 │ 9 │
╰───┴───╯
```

However, things get a bit more complex when you start combining types. For example, let's see what happens when we have a list with numbers _and_ strings:

```nu
> ["hello" 4 9 2 1 "foobar" 8 6] | sort
╭───┬────────╮
│ 0 │      1 │
│ 1 │      2 │
│ 2 │      4 │
│ 3 │      6 │
│ 4 │      8 │
│ 5 │      9 │
│ 6 │ foobar │
│ 7 │ hello  │
╰───┴────────╯
```

We can see that the numbers are sorted in order, and the strings are sorted to the end of the list, also in order. If you are coming from other programming languages, this may not be quite what you expect. In Nushell, as a general rule, **data can always be sorted without erroring**.

::: tip
If you _do_ want a sort containing differing types to error, see [strict sort](#strict-sort).
:::

Nushell's sort is also **stable**, meaning equal values will retain their original ordering relative to each other. This is illustrated here using the [case insensitive](#case-insensitive-sort) sort option:

```nu
> ["foo" "FOO" "BAR" "bar"] | sort -i
╭───┬─────╮
│ 0 │ BAR │
│ 1 │ bar │
│ 2 │ foo │
│ 3 │ FOO │
╰───┴─────╯
```

Since this sort is case insensitive, `foo` and `FOO` are considered equal to each other, and the same is true for `bar` and `BAR`. In the result, the uppercase `BAR` precedes the lowercase `bar`, since the uppercase `BAR` also precedes the lowercase `bar` in the input. Similarly, the lowercase `foo` precedes the uppercase `FOO` in both the input and the result.

### Records

Records can be sorted two ways: by key, and by value. By default, passing a record to `sort` will sort in order of its keys:

```nu
{x: 123, a: hello!, foo: bar} | sort
╭─────┬────────╮
│ a   │ hello! │
│ foo │ bar    │
│ x   │ 123    │
╰─────┴────────╯
```

To instead sort in order of values, use the `-v` flag:

```nu
{x: 123, a: hello! foo: bar} | sort -v
╭─────┬────────╮
│ x   │ 123    │
│ foo │ bar    │
│ a   │ hello! │
╰─────┴────────╯
```

### Tables

Table rows are sorted by comparing rows by the columns in order. If two rows have equal values in their first column, they are sorted by their second column. This repeats until the rows are sorted different or all columns are equal.

```nu
> let items = [
    {id: 100, quantity: 10, price: 5 }
    {id: 100, quantity: 5,  price: 8 }
    {id: 100, quantity: 5,  price: 1 }
]
> $items | sort
╭───┬─────┬──────────┬───────╮
│ # │ id  │ quantity │ price │
├───┼─────┼──────────┼───────┤
│ 0 │ 100 │        5 │     1 │
│ 1 │ 100 │        5 │     8 │
│ 2 │ 100 │       10 │     5 │
╰───┴─────┴──────────┴───────╯
```

In this example, the `id` column for all items is equal. Then, the two items with price `5` are sorted before the item with price `10`. Finally, the `item` with quantity `1` is sorted before the item with quantity `8`.

## Sorting structured data

### Cell path

In order to sort more complex types, such as tables, you can use the `sort-by` command. `sort-by` can order its input by a [cell path](navigating_structured_data.html#cell-paths).

Here's an example directory, sorted by filesize:

```nu
> ls | sort-by size
╭───┬─────────────────────┬──────┬──────────┬────────────────╮
│ # │        name         │ type │   size   │    modified    │
├───┼─────────────────────┼──────┼──────────┼────────────────┤
│ 0 │ my-secret-plans.txt │ file │    100 B │ 10 minutes ago │
│ 1 │ shopping_list.txt   │ file │    100 B │ 2 months ago   │
│ 2 │ myscript.nu         │ file │  1.1 KiB │ 2 weeks ago    │
│ 3 │ bigfile.img         │ file │ 10.0 MiB │ 3 weeks ago    │
╰───┴─────────────────────┴──────┴──────────┴────────────────╯
```

We can also provide multiple cell paths to `sort-by`, which will sort by each cell path in order of priority. You can think of providing multiple cell paths as a "tiebreaker" for elements which have equal values. Let's sort first by size, then by modification time:

```nu
> ls | sort-by size modified
╭───┬─────────────────────┬──────┬──────────┬────────────────╮
│ # │        name         │ type │   size   │    modified    │
├───┼─────────────────────┼──────┼──────────┼────────────────┤
│ 0 │ shopping_list.txt   │ file │    100 B │ 2 months ago   │
│ 1 │ my-secret-plans.txt │ file │    100 B │ 10 minutes ago │
│ 2 │ myscript.nu         │ file │  1.1 KiB │ 2 weeks ago    │
│ 3 │ bigfile.img         │ file │ 10.0 MiB │ 3 weeks ago    │
╰───┴─────────────────────┴──────┴──────────┴────────────────╯
```

This time, `shopping_list.txt` comes before `my-secret-plans.txt`, since it has an earlier modification time, but two larger files remain sorted after the `.txt` files.

Furthermore, we can use more complex cell paths to sort nested data:

```nu
> let cities = [
    {name: 'New York', info: { established: 1624, population: 18_819_000 } }
    {name: 'Kyoto', info: { established: 794, population: 37_468_000 } }
    {name: 'São Paulo', info: { established: 1554, population: 21_650_000 } }
]
> $cities | sort-by info.established
╭───┬───────────┬────────────────────────────╮
│ # │   name    │            info            │
├───┼───────────┼────────────────────────────┤
│ 0 │ Kyoto     │ ╭─────────────┬──────────╮ │
│   │           │ │ established │ 794      │ │
│   │           │ │ population  │ 37468000 │ │
│   │           │ ╰─────────────┴──────────╯ │
│ 1 │ São Paulo │ ╭─────────────┬──────────╮ │
│   │           │ │ established │ 1554     │ │
│   │           │ │ population  │ 21650000 │ │
│   │           │ ╰─────────────┴──────────╯ │
│ 2 │ New York  │ ╭─────────────┬──────────╮ │
│   │           │ │ established │ 1624     │ │
│   │           │ │ population  │ 18819000 │ │
│   │           │ ╰─────────────┴──────────╯ │
╰───┴───────────┴────────────────────────────╯
```

### Sorting records

Records can be sorted in order of their keys using `sort`:

```nu
> {foo: 123, bar: 456, baz: 89} | sort
╭─────┬─────╮
│ bar │ 456 │
│ baz │ 89  │
│ foo │ 123 │
╰─────┴─────╯
```

To instead sort in order of a record's values, use `sort -v`:

```nu
> {foo: 123, bar: 456, baz: 89} | sort -v
╭─────┬─────╮
│ baz │ 89  │
│ foo │ 123 │
│ bar │ 456 │
╰─────┴─────╯
```

### Sort by key closure

Sometimes, it's useful to sort data in a more complicated manner than "increasing" or "decreasing". Instead of using `sort-by` with a cell path, you can supply a [closure](types_of_data.html#closures), which will transform each value into a [sorting key](https://en.wikipedia.org/wiki/Collation#Sort_keys) _without changing the underlying data_. Here's an example of a key closure, where we want to sort a list of assignments by their average grade:

```nu
> let assignments = [
    {name: 'Homework 1', grades: [97 89 86 92 89] }
    {name: 'Homework 2', grades: [91 100 60 82 91] }
    {name: 'Exam 1', grades: [78 88 78 53 90] }
    {name: 'Project', grades: [92 81 82 84 83] }
]
> $assignments | sort-by { get grades | math avg }
╭───┬────────────┬───────────────────────╮
│ # │    name    │        grades         │
├───┼────────────┼───────────────────────┤
│ 0 │ Exam 1     │ [78, 88, 78, 53, 90]  │
│ 1 │ Project    │ [92, 81, 82, 84, 83]  │
│ 2 │ Homework 2 │ [91, 100, 60, 82, 91] │
│ 3 │ Homework 1 │ [97, 89, 86, 92, 89]  │
╰───┴────────────┴───────────────────────╯
```

The value is passed into the pipeline input of the key closure, however, you can also use it as a parameter:

```nu
> let weight = {alpha: 10, beta: 5, gamma: 3}
> [alpha gamma beta gamma alpha] | sort-by {|val| $weight | get $val }
╭───┬───────╮
│ 0 │ gamma │
│ 1 │ gamma │
│ 2 │ beta  │
│ 3 │ alpha │
│ 4 │ alpha │
╰───┴───────╯
```

### Custom sort order

In addition to [key closures](#sort-by-key-closure), `sort-by` also supports closures which specify a custom sort order. The `--custom`, or `-c`, flag will tell `sort-by` to interpret closures as custom sort closures. A custom sort closure has two parameters, and returns a boolean. The closure should return `true` if the first parameter comes _before_ the second parameter in the sort order.

For a simple example, we could rewrite a cell path sort as a custom sort. This can be read as "If $a.size is less than $b.size, a should appear before b in the sort order":

```nu
> ls | sort-by -c {|a, b| $a.size < $b.size }
╭───┬─────────────────────┬──────┬──────────┬────────────────╮
│ # │        name         │ type │   size   │    modified    │
├───┼─────────────────────┼──────┼──────────┼────────────────┤
│ 0 │ my-secret-plans.txt │ file │    100 B │ 10 minutes ago │
│ 1 │ shopping_list.txt   │ file │    100 B │ 2 months ago   │
│ 2 │ myscript.nu         │ file │  1.1 KiB │ 2 weeks ago    │
│ 3 │ bigfile.img         │ file │ 10.0 MiB │ 3 weeks ago    │
╰───┴─────────────────────┴──────┴──────────┴────────────────╯
```

::: tip
The parameters are also passed to the custom closure as a two element list, so the following are equivalent:

- `{|a, b| $a < $b }`
- `{ $in.0 < $in.1 }`
  :::

Here's an example of a custom sort which couldn't be trivially written as a key sort. In this example, we have a queue of tasks with some amount of work time and a priority. We want to sort by priority (highest first). If a task has had zero work time, we want to schedule it immediately; otherwise, we ignore the work time.

```nu
> let queue = [
    {task: 139, work_time: 0,   priority: 1 }
    {task: 52,  work_time: 355, priority: 8 }
    {task: 948, work_time: 72,  priority: 2 }
    {task: 583, work_time: 0,   priority: 5 }
]
> let my_sort = {|a, b|
    match [$a.work_time, $b.work_time] {
        [0, 0] => ($a.priority > $b.priority) # fall back to priority if equal work time
        [0, _] => true, # only a has 0 work time, so a comes before b in the sort order
        [_, 0] => false, # only b has 0 work time, so a comes after b in the sort order
        _ => ($a.priority > $b.priority) # both have non-zero work time, sort by priority
    }
}
> $queue | sort-by -c $my_sort
╭───┬──────┬───────────┬──────────╮
│ # │ task │ work_time │ priority │
├───┼──────┼───────────┼──────────┤
│ 0 │  583 │         0 │        5 │
│ 1 │  139 │         0 │        1 │
│ 2 │   52 │       355 │        8 │
│ 3 │  948 │        72 │        2 │
╰───┴──────┴───────────┴──────────╯
```

## Special sorts

### Case insensitive sort

When using case insensitive sort, strings (and globs) which are the same except for different casing will be considered equal for sorting, while other types remain unaffected:

```nu
> let data = [
    Nushell,
    foobar,
    10,
    nushell,
    FoOBaR,
    9
]
> $data | sort -i
╭───┬─────────╮
│ 0 │       9 │
│ 1 │      10 │
│ 2 │ foobar  │
│ 3 │ FoOBaR  │
│ 4 │ Nushell │
│ 5 │ nushell │
╰───┴─────────╯
```

### Natural sort

The [natural sort option](https://en.wikipedia.org/wiki/Natural_sort_order) allows strings which contain numbers to be sorted in the same way that numbers are normally sorted. This works both for strings which consist solely of numbers, and strings which have numbers and letters:

```nu
> let data = ["10", "9", "foo123", "foo20", "bar123", "bar20"]
> $data | sort
╭───┬────────╮
│ 0 │ 10     │
│ 1 │ 9      │
│ 2 │ bar123 │
│ 3 │ bar20  │
│ 4 │ foo123 │
│ 5 │ foo20  │
╰───┴────────╯
> # "1" is sorted before "9", so "10" is sorted before "9"
> $data | sort -n
╭───┬────────╮
│ 0 │ 9      │
│ 1 │ 10     │
│ 2 │ bar20  │
│ 3 │ bar123 │
│ 4 │ foo20  │
│ 5 │ foo123 │
╰───┴────────╯
```

Furthermore, natural sort allows you to sort numbers together with numeric strings:

```nu
> let data = [4, "6.2", 1, "10", 2, 8.1, "3", 5.5, "9", 7]
> $data | sort -n
╭───┬──────╮
│ 0 │    1 │
│ 1 │    2 │
│ 2 │ 3    │
│ 3 │    4 │
│ 4 │ 5.50 │
│ 5 │ 6.2  │
│ 6 │    7 │
│ 7 │ 8.10 │
│ 8 │ 9    │
│ 9 │ 10   │
╰───┴──────╯
```

### Sorting with mixed types

Under some circumstances, you might need to sort data containing mixed types. There are a couple things to be aware of when sorting mixed types:

- Generally, values of the same type will appear next to each other in the sort order. For example, sorted numbers come first, then sorted strings, then sorted lists.
- Some types will be intermixed in the sort order. These are:
  - Integers and floats. For example, `[2.2, 1, 3]` will be sorted as `[1, 2.2, 3]`.
  - Strings and globs. For example, `[("b" | into glob) a c]` will be sorted as `[a b c]` (where b is still a glob).
  - If using [natural sort](#natural-sort), integers, floats, and strings will be intermixed as described in that section.
- The ordering between non-intermixed types is not guaranteed, **except** for `null` values, which will always be sorted to the end of a list.
  - Within the same Nushell version the ordering should always be the same, but this should not be relied upon. If you have code which is sensitive to the ordering across types, consider using a [custom sort](#custom-sort-order) which better expresses your requirements.

If you need to sort data which may contain mixed types, consider one of the following strategies:

- [Strict sort](#strict-sort) to disallow sorting of incompatible types
- [Natural sort](#natural-sort) to sort intermixed numbers and numeric strings
- A [key sort](#sort-by-key-closure) using [`to text`](/commands/docs/to_text.html), [`to nuon`](/commands/docs/to_nuon.html), or [`to json`](/commands/docs/to_json.html), as appropriate
- A [custom sort](#custom-sort-order) using [`describe`](/commands/docs/describe.html) to explicitly check types

### Strict sort

Custom sort closures also provide a simple way to sort data while ensuring only types with well-defined comparisons are sorted together. This takes advantage of [operators requiring compatible data types](operators.html#types):

```nu
> let compatible = [8 3.2 null 58 2]
> let incompatible = ["hello" 4 9 2 1 "meow" 8 6]
> $compatible | sort-by -c {|a, b| $a < $b | default ($a != null) }
╭───┬──────╮
│ 0 │    2 │
│ 1 │ 3.20 │
│ 2 │    8 │
│ 3 │   58 │
│ 4 │      │
╰───┴──────╯
> $incompatible | sort-by -c {|a, b| $a < $b | default ($a != null) }
Error: nu::shell::type_mismatch

  × Type mismatch during operation.
   ╭─[entry #26:1:36]
 1 │ $incompatible | sort-by -c {|a, b| $a < $b | default ($a != null) }
   ·                                    ─┬ ┬ ─┬
   ·                                     │ │  ╰── string
   ·                                     │ ╰── type mismatch for operator
   ·                                     ╰── int
   ╰────

```

Special handling is required for `null` values, since comparison between any value and `null` returns `null`. To instead reject `null` values, try the following:

```nu
> let baddata = [8 3.2 null 58 2]
> let strict = {|a, b|
    match [$a, $b] {
        [null, _] => (error make {msg: "Attempt to sort null"}),
        [_, null] => (error make {msg: "Attempt to sort null"}),
        _ => ($a < $b)
    }
}
> $baddata | sort-by -c $strict
Error:   × Attempt to sort null
   ╭─[entry #3:4:21]
 3 │   match [$a, $b] {
 4 │       [null, _] => (error make {msg: "Attempt to sort null"}),
   ·                     ─────┬────
   ·                          ╰── originates from here
 5 │       [_, null] => (error make {msg: "Attempt to sort null"}),
   ╰────
```
