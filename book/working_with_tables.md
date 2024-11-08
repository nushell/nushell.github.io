# Working with Tables

[[toc]]

## Overview

One of the common ways of seeing data in Nu is through a table. Nu comes with a number of commands for working with tables to make it convenient to find what you're looking for, and for narrowing down the data to just what you need.

To start off, let's get a table that we can use:

```nu
> ls
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ files.rs      │ File │  4.6 KB │ 5 days ago
 1 │ lib.rs        │ File │   330 B │ 5 days ago
 2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
 3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
 4 │ path.rs       │ File │  2.1 KB │ 5 days ago
 5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
 6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
───┴───────────────┴──────┴─────────┴────────────
```

::: tip Changing how tables are displayed
Nu will try to expands all table's structure by default. You can change this behavior by changing the `display_output` hook.
See [hooks](/book/hooks.md#changing-how-output-is-displayed) for more information.
:::

## Sorting the Data

We can sort a table by calling the [`sort-by`](/commands/docs/sort-by.md) command and telling it which columns we want to use in the sort. Let's say we wanted to sort our table by the size of the file:

```nu
> ls | sort-by size
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ lib.rs        │ File │   330 B │ 5 days ago
 1 │ signature.rs  │ File │  1.2 KB │ 5 days ago
 2 │ path.rs       │ File │  2.1 KB │ 5 days ago
 3 │ files.rs      │ File │  4.6 KB │ 5 days ago
 4 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
 5 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
 6 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
───┴───────────────┴──────┴─────────┴────────────
```

We can sort a table by any column that can be compared. For example, we could also have sorted the above using the "name", "accessed", or "modified" columns.

For more info on sorting, see [Sorting](/book/sorting.md).

## Selecting the Data you Want

::: tip Note
The following is a basic overview. For a more in-depth discussion of this topic, see the chapter, [Navigating and Accessing Structured Data](/book/navigating_structured_data.md).
:::

We can select data from a table by choosing to select specific columns or specific rows. Let's [`select`](/commands/docs/select.md) a few columns from our table to use:

```nu
> ls | select name size
───┬───────────────┬─────────
 # │ name          │ size
───┼───────────────┼─────────
 0 │ files.rs      │  4.6 KB
 1 │ lib.rs        │   330 B
 2 │ lite_parse.rs │  6.3 KB
 3 │ parse.rs      │ 49.8 KB
 4 │ path.rs       │  2.1 KB
 5 │ shapes.rs     │  4.7 KB
 6 │ signature.rs  │  1.2 KB
───┴───────────────┴─────────
```

This helps to create a table that's more focused on what we need. Next, let's say we want to only look at the 5 smallest files in this directory:

```nu
> ls | sort-by size | first 5
───┬──────────────┬──────┬────────┬────────────
 # │ name         │ type │ size   │ modified
───┼──────────────┼──────┼────────┼────────────
 0 │ lib.rs       │ File │  330 B │ 5 days ago
 1 │ signature.rs │ File │ 1.2 KB │ 5 days ago
 2 │ path.rs      │ File │ 2.1 KB │ 5 days ago
 3 │ files.rs     │ File │ 4.6 KB │ 5 days ago
 4 │ shapes.rs    │ File │ 4.7 KB │ 5 days ago
───┴──────────────┴──────┴────────┴────────────
```

You'll notice we first sort the table by size to get to the smallest file, and then we use the `first 5` to return the first 5 rows of the table.

You can also [`skip`](/commands/docs/skip.md) rows that you don't want. Let's skip the first two of the 5 rows we returned above:

```nu
> ls | sort-by size | first 5 | skip 2
───┬───────────┬──────┬────────┬────────────
 # │ name      │ type │ size   │ modified
───┼───────────┼──────┼────────┼────────────
 0 │ path.rs   │ File │ 2.1 KB │ 5 days ago
 1 │ files.rs  │ File │ 4.6 KB │ 5 days ago
 2 │ shapes.rs │ File │ 4.7 KB │ 5 days ago
───┴───────────┴──────┴────────┴────────────
```

We've narrowed it to three rows we care about.

Let's look at a few other commands for selecting data. You may have wondered why the rows of the table are numbers. This acts as a handy way to get to a single row. Let's sort our table by the file name and then pick one of the rows with the [`select`](/commands/docs/select.md) command using its row number:

```nu
> ls | sort-by name
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ files.rs      │ File │  4.6 KB │ 5 days ago
 1 │ lib.rs        │ File │   330 B │ 5 days ago
 2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
 3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
 4 │ path.rs       │ File │  2.1 KB │ 5 days ago
 5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
 6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
───┴───────────────┴──────┴─────────┴────────────

> ls | sort-by name | select 5
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
───┴───────────────┴──────┴─────────┴────────────
```

## Getting Data out of a Table

So far, we've worked with tables by trimming the table down to only what we need. Sometimes we may want to go a step further and only look at the values in the cells themselves rather than taking a whole column. Let's say, for example, we wanted to only get a list of the names of the files. For this, we use the [`get`](/commands/docs/get.md) command:

```nu
> ls | get name
───┬───────────────
 0 │ files.rs
 1 │ lib.rs
 2 │ lite_parse.rs
 3 │ parse.rs
 4 │ path.rs
 5 │ shapes.rs
 6 │ signature.rs
───┴───────────────
```

We now have the values for each of the filenames.

This might look like the [`select`](/commands/docs/select.md) command we saw earlier, so let's put that here as well to compare the two:

```nu
> ls | select name
───┬───────────────
 # │ name
───┼───────────────
 0 │ files.rs
 1 │ lib.rs
 2 │ lite_parse.rs
 3 │ parse.rs
 4 │ path.rs
 5 │ shapes.rs
 6 │ signature.rs
───┴───────────────
```

These look very similar! Let's see if we can spell out the difference between these two commands to make it clear:

- [`select`](/commands/docs/select.md) - creates a new table which includes only the columns specified
- [`get`](/commands/docs/get.md) - returns the values inside the column specified as a list

:::tip
The arguments provided to `select` and `get` are [cell-paths](/book/types_of_data.html#cell-paths), a fundamental part of Nu's query language. For a more in-depth discussion of cell-paths and other navigation topics, see the next chapter, [Navigating and Accessing Structured Data](/book/navigating_structured_data.md).
:::

## Changing Data in a Table

In addition to selecting data from a table, we can also update what the table has. We may want to combine tables, add new columns, or edit the contents of a cell. In Nu, rather than editing in place, each of the commands in the section will return a new table in the pipeline.

### Concatenating Tables

We can concatenate tables using [`append`](/commands/docs/append.md):

```nu
let first = [[a b]; [1 2]]
let second = [[a b]; [3 4]]
$first | append $second
───┬───┬───
 # │ a │ b
───┼───┼───
 0 │ 1 │ 2
 1 │ 3 │ 4
───┴───┴───
```

If the column names are not identical then additionally columns and values will be created as necessary:

```nu
let first = [[a b]; [1 2]]
let second = [[a b]; [3 4]]
let third = [[a c]; [3 4]]
$first | append $second | append $third
───┬───┬────┬────
 # │ a │ b  │ c
───┼───┼────┼────
 0 │ 1 │  2 │ ❎
 1 │ 3 │  4 │ ❎
 2 │ 3 │ ❎ │  4
───┴───┴────┴────
```

You can also use the `++` operator as an inline replacement for `append`:

```nu
$first ++ $second ++ $third
───┬───┬────┬────
 # │ a │ b  │ c
───┼───┼────┼────
 0 │ 1 │  2 │ ❎
 1 │ 3 │  4 │ ❎
 2 │ 3 │ ❎ │  4
───┴───┴────┴───
```

### Merging Tables

We can use the [`merge`](/commands/docs/merge.md) command to merge two (or more) tables together

```nu
let first = [[a b]; [1 2]]
let second = [[c d]; [3 4]]
$first | merge $second
───┬───┬───┬───┬───
 # │ a │ b │ c │ d
───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 3 │ 4
───┴───┴───┴───┴───
```

Let's add a third table:

```nu
> let third = [[e f]; [5 6]]
```

We could join all three tables together like this:

```nu
> $first | merge $second  | merge $third
───┬───┬───┬───┬───┬───┬───
 # │ a │ b │ c │ d │ e │ f
───┼───┼───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
───┴───┴───┴───┴───┴───┴───
```

Or we could use the [`reduce`](/commands/docs/reduce.md) command to dynamically merge all tables:

```nu
> [$first $second $third] | reduce {|elt, acc| $acc | merge $elt }
───┬───┬───┬───┬───┬───┬───
 # │ a │ b │ c │ d │ e │ f
───┼───┼───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
───┴───┴───┴───┴───┴───┴───
```

### Adding a new Column

We can use the [`insert`](/commands/docs/insert.md) command to add a new column to the table. Let's look at an example:

```nu
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

Let's add a column called "next_edition" with the value 2021:

```nu
> open rustfmt.toml | insert next_edition 2021
──────────────┬──────
 edition      │ 2018
 next_edition │ 2021
──────────────┴──────
```

This visual may be slightly confusing, because it looks like what we've just done is add a row. In this case, remember: rows have numbers, columns have names. If it still is confusing, note that appending one more row will make the table render as expected:

```nu
> open rustfmt.toml | insert next_edition 2021 | append {edition: 2021 next_edition: 2024}
───┬─────────┬──────────────
 # │ edition │ next_edition
───┼─────────┼──────────────
 0 │    2018 │         2021
 1 │    2021 │         2024
───┴─────────┴──────────────

```

Notice that if we open the original file, the contents have stayed the same:

```nu
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

Changes in Nu are functional changes, meaning that they work on values themselves rather than trying to cause a permanent change. This lets us do many different types of work in our pipeline until we're ready to write out the result with any changes we'd like if we choose to. Here we could write out the result using the [`save`](/commands/docs/save.md) command:

```nu
> open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
> open rustfmt2.toml
──────────────┬──────
 edition      │ 2018
 next_edition │ 2021
──────────────┴──────
```

### Updating a Column

In a similar way to the [`insert`](/commands/docs/insert.md) command, we can also use the [`update`](/commands/docs/update.md) command to change the contents of a column to a new value. To see it in action let's open the same file:

```nu
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

And now, let's update the edition to point at the next edition we hope to support:

```nu
> open rustfmt.toml | update edition 2021
─────────┬──────
 edition │ 2021
─────────┴──────
```

You can also use the [`upsert`](/commands/docs/upsert.md) command to insert or update depending on whether the column already exists.

### Moving Columns

You can use [`move`](/commands/docs/move.md) to move columns in the table. For example, if we wanted to move the "name" column from [`ls`](/commands/docs/ls.md) after the "size" column, we could do:

```nu
> ls | move name --after size
╭────┬──────┬─────────┬───────────────────┬──────────────╮
│ #  │ type │  size   │       name        │   modified   │
├────┼──────┼─────────┼───────────────────┼──────────────┤
│  0 │ dir  │   256 B │ Applications      │ 3 days ago   │
│  1 │ dir  │   256 B │ Data              │ 2 weeks ago  │
│  2 │ dir  │   448 B │ Desktop           │ 2 hours ago  │
│  3 │ dir  │   192 B │ Disks             │ a week ago   │
│  4 │ dir  │   416 B │ Documents         │ 4 days ago   │
...
```

### Renaming Columns

You can also [`rename`](/commands/docs/rename.md) columns in a table by passing it through the rename command. If we wanted to run [`ls`](/commands/docs/ls.md) and rename the columns, we can use this example:

```nu
> ls | rename filename filetype filesize date
╭────┬───────────────────┬──────────┬──────────┬──────────────╮
│ #  │     filename      │ filetype │ filesize │     date     │
├────┼───────────────────┼──────────┼──────────┼──────────────┤
│  0 │ Applications      │ dir      │    256 B │ 3 days ago   │
│  1 │ Data              │ dir      │    256 B │ 2 weeks ago  │
│  2 │ Desktop           │ dir      │    448 B │ 2 hours ago  │
│  3 │ Disks             │ dir      │    192 B │ a week ago   │
│  4 │ Documents         │ dir      │    416 B │ 4 days ago   │
...
```

### Rejecting/Deleting Columns

You can also [`reject`](/commands/docs/reject.md) columns in a table by passing it through the reject command. If we wanted to run [`ls`](/commands/docs/ls.md) and delete the columns, we can use this example:

```nu
> ls -l / | reject readonly num_links inode created accessed modified
╭────┬────────┬─────────┬─────────┬───────────┬──────┬───────┬────────╮
│  # │  name  │  type   │ target  │   mode    │ uid  │ group │  size  │
├────┼────────┼─────────┼─────────┼───────────┼──────┼───────┼────────┤
│  0 │ /bin   │ symlink │ usr/bin │ rwxrwxrwx │ root │ root  │    7 B │
│  1 │ /boot  │ dir     │         │ rwxr-xr-x │ root │ root  │ 1.0 KB │
│  2 │ /dev   │ dir     │         │ rwxr-xr-x │ root │ root  │ 4.1 KB │
│  3 │ /etc   │ dir     │         │ rwxr-xr-x │ root │ root  │ 3.6 KB │
│  4 │ /home  │ dir     │         │ rwxr-xr-x │ root │ root  │   12 B │
│  5 │ /lib   │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
│  6 │ /lib64 │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
│  7 │ /mnt   │ dir     │         │ rwxr-xr-x │ root │ root  │    0 B │
...
```

### The # Index Column

You've noticed that every table, by default, starts with a column with the heading `#`. This column can operate in one of two modes:

1. Internal #

   - The default mode
   - Nushell provides a 0-based, consecutive index
   - Always corresponds to the cell-path row-number, where `select 0` will return the first item in the list, and `select <n-1>` returns the nth item
   - Is a display of an internal representation only. In other words, it is not accessible by column name. For example, `get index` will not work, nor `get #`

1. "Index"-Renamed #

   - When a column named "index" is created, either directly or as a side-effect of another command, then this `index` column takes the place of the `#` column in the table display. In the table output, the column header is still `#`, but the _name_ of the column is now `index`.

     Example:

     ```nu
     ls | each { insert index { 1000 }} | first 5
     # => ╭──────┬─────────────────┬──────┬─────────┬──────────────╮
     # => │    # │      name       │ type │  size   │   modified   │
     # => ├──────┼─────────────────┼──────┼─────────┼──────────────┤
     # => │ 1000 │ CNAME           │ file │    15 B │ 9 months ago │
     # => │ 1000 │ CONTRIBUTING.md │ file │ 4.3 KiB │ 9 hours ago  │
     # => │ 1000 │ LICENSE         │ file │ 1.0 KiB │ 9 months ago │
     # => │ 1000 │ README.md       │ file │ 2.2 KiB │ 3 weeks ago  │
     # => │ 1000 │ assets          │ dir  │ 4.0 KiB │ 9 months ago │
     # => ╰──────┴─────────────────┴──────┴─────────┴──────────────╯
     ```

     - If an `index` key is added to each row in the table, then it can be accessed via `select` and `get`:

     ```nu
     ls | each { insert index { 1000 }} | first 5 | select index name
     # => ╭──────┬─────────────────╮
     # => │    # │      name       │
     # => ├──────┼─────────────────┤
     # => │ 1000 │ CNAME           │
     # => │ 1000 │ CONTRIBUTING.md │
     # => │ 1000 │ LICENSE         │
     # => │ 1000 │ README.md       │
     # => │ 1000 │ assets          │
     # => ╰──────┴─────────────────╯
     ```

     - On the other hand, if some rows have an `index` key and others don't, the result is no longer a table; it is a `list<any>` due to the different record types:

       ```nu
       ls | upsert 3.index { "--->" } | first 5
       # => ╭──────┬─────────────────┬──────┬─────────┬──────────────╮
       # => │    # │      name       │ type │  size   │   modified   │
       # => ├──────┼─────────────────┼──────┼─────────┼──────────────┤
       # => │    0 │ CNAME           │ file │    15 B │ 9 months ago │
       # => │    1 │ CONTRIBUTING.md │ file │ 4.3 KiB │ 9 hours ago  │
       # => │    2 │ LICENSE         │ file │ 1.0 KiB │ 9 months ago │
       # => │ ---> │ README.md       │ file │ 2.2 KiB │ 3 weeks ago  │
       # => │    4 │ assets          │ dir  │ 4.0 KiB │ 9 months ago │
       # => ╰──────┴─────────────────┴──────┴─────────┴──────────────╯

       ls | upsert 3.index { "--->" } | first 5 | describe
       # => list<any> (stream)

       ls | upsert 3.index { "--->" } | select index name
       # Error: cannot find column 'index'

       ls | upsert 3.index { "--->" } | select index? name | first 5
       # => ╭──────┬─────────────────╮
       # => │    # │      name       │
       # => ├──────┼─────────────────┤
       # => │      │ CNAME           │
       # => │      │ CONTRIBUTING.md │
       # => │      │ LICENSE         │
       # => │ ---> │ README.md       │
       # => │      │ assets          │
       # => ╰──────┴─────────────────╯
       ```

   - As demonstrated in the example above, any rows (records) in the table without an `index` key will continue to display the internal representation.

#### Additional Index Examples

##### Convert # to Index

A useful pattern for converting an internal `#` into an index for all rows, while maintaining the original numbering, is:

```nu
ls | enumerate | flatten
```

While the results _look_ the same, the `index` is now decoupled from the internal cell-path. For example:

```nu
ls | enumerate | flatten | sort-by modified | first 5
# => ╭────┬──────────────┬──────┬─────────┬──────────────╮
# => │  # │     name     │ type │  size   │   modified   │
# => ├────┼──────────────┼──────┼─────────┼──────────────┤
# => │  0 │ CNAME        │ file │    15 B │ 9 months ago │
# => │  2 │ LICENSE      │ file │ 1.0 KiB │ 9 months ago │
# => │  4 │ assets       │ dir  │ 4.0 KiB │ 9 months ago │
# => │ 17 │ lefthook.yml │ file │ 1.1 KiB │ 9 months ago │
# => │ 24 │ snippets     │ dir  │ 4.0 KiB │ 9 months ago │
# => ╰────┴──────────────┴──────┴─────────┴──────────────╯

ls | enumerate | flatten | sort-by modified | select 4
# => ╭────┬──────────┬──────┬─────────┬──────────────╮
# => │  # │   name   │ type │  size   │   modified   │
# => ├────┼──────────┼──────┼─────────┼──────────────┤
# => │ 24 │ snippets │ dir  │ 4.0 KiB │ 9 months ago │
# => ╰────┴──────────┴──────┴─────────┴──────────────╯
```

The `sort-by modified` now _also_ sorts the `index` along with the rest of the columns.

##### Adding a Row Header

```nu
let table = [
[additions   deletions   delta ];
[       10          20     -10 ]
[       15           5      10 ]
[        8           6       2 ]]

let totals_row = ($table | math sum | insert index {"Totals"})
$table | append $totals_row
# => ╭────────┬───────────┬───────────┬───────╮
# => │      # │ additions │ deletions │ delta │
# => ├────────┼───────────┼───────────┼───────┤
# => │      0 │        10 │        20 │   -10 │
# => │      1 │        15 │         5 │    10 │
# => │      2 │         8 │         6 │     2 │
# => │ Totals │        33 │        31 │     2 │
# => ╰────────┴───────────┴───────────┴───────╯
```

### The `table` command

The [`table`](/commands/docs/table.md) command is used to _render_ structured data. This includes:

- Tables
- Lists
- Records
- Ranges

Perhaps contrary to initial assumptions, the result of rendering these types is a `string`. For example:

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table | describe
# => string (stream)
```

Other data types are passed through the `table` command unchanged.

With no arguments, the output rendered from the `table` command will often _display_ the same as unrendered form. For example:

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ]
# => ╭───┬───────────╮
# => │ 0 │ Nagasaki  │
# => │ 1 │ Ghent     │
# => │ 2 │ Cambridge │
# => │ 3 │ Izmir     │
# => │ 4 │ Graz      │
# => │ 5 │ Lubango   │
# => ╰───┴───────────╯
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table
# => ╭───┬───────────╮
# => │ 0 │ Nagasaki  │
# => │ 1 │ Ghent     │
# => │ 2 │ Cambridge │
# => │ 3 │ Izmir     │
# => │ 4 │ Graz      │
# => │ 5 │ Lubango   │
# => ╰───┴───────────╯
```

This can be useful when you need to store the rendered view of structured data as a string. For example, to remove all ANSI formatting (colors) from a table:

```
ls | table | ansi strip
```

The `table` command also has multiple options for _changing_ the rendering of a table, such as:

- `-e` to expand data that would normally be collapsed when rendering. Compare `scope modules | table` to `scope modules | table -e`.
- `-i false` to hide the `index`/`#` column
- `-a 5` to abbreviate the table to just the first and last 5 entries
- And more
