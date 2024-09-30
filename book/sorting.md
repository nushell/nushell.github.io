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

Nushell's sort is also **stable**, meaning equal values will retain their original ordering relative to each other. This is illustrated here using the [insensitive](#insensitive-sort) sort option:

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
    {id: 100, price: 10, quantity: 5 }
    {id: 100, price: 5,  quantity: 8 }
    {id: 100, price: 5,  quantity: 1 }
]
> $items | sort
╭───┬─────┬───────┬──────────╮
│ # │ id  │ price │ quantity │
├───┼─────┼───────┼──────────┤
│ 0 │ 100 │     5 │        1 │
│ 1 │ 100 │     5 │        8 │
│ 2 │ 100 │    10 │        5 │
╰───┴─────┴───────┴──────────╯
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

Furthermore, we use more complex cell paths to sort nested data:

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

The value is passed into the pipeline input of the key closure, however you can also use it as a parameter:

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

### Sorting records

## Custom sort order

In addition to [key closures](#sort-by-key-closure), `sort-by` also supports closures which specify a custom sort order. The `--custom`, or `-c`, flag will tell `sort-by` to interpret closures as custom sort closures. A custom sort closure has two parameters, and returns a boolean. The closure should return `true` if the first parameter comes _before_ the second parameter in the sort order.

For a simple example, we could rewrite a cell path sort as a custom sort:

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

Here's an example of a custom sort which couldn't be trivially written as a key sort. In this example, we have a queue of tasks with some amount of work time and a priority. We want to sort by priority (highest first), but if a task has had zero work time, we want to schedule it immediately. Otherwise, we ignore the work time.

```nu
> let queue = [
    {task: 139, work_time: 0,   priority: 1 }
    {task: 52,  work_time: 355, priority: 8 }
    {task: 948, work_time: 72,  priority: 2 }
    {task: 583, work_time: 0,   priority: 5 }
]
> let my_sort = {|a, b|
    if ($a.work_time == 0) {
        true
    } else if ($b.work_time == 0) {
        false
    } else {
        $a.priority > $b.priority
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

### Strict sort

Custom sort closures also provide a simple way to sort data while enforcing type homogeneity. This takes advantage of [operators requiring compatible data types](operators.html#types):

```nu
> let data = ["hello" 4 9 2 1 "foobar" 8 6]
> $data | sort-by -c {|a, b| $a < $b}
Error: nu::shell::type_mismatch

  × Type mismatch during operation.
   ╭─[entry #173:1:28]
 1 │ $data | sort-by -c {|a, b| $a < $b}
   ·                            ─┬ ┬ ─┬
   ·                             │ │  ╰── string
   ·                             │ ╰── type mismatch for operator
   ·                             ╰── int
   ╰────

```

::: warning
This does not currently work with `null` values due to comparison between any value and `null` returning `null`.
:::

## Special sorts

### Insensitive sort

### Natural sort

### Sorting with mixed types

Under some circumstances, you might end up with values containing mixed types.
