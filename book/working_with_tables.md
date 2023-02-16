# Working with tables

One of the common ways of seeing data in Nu is through a table. Nu comes with a number of commands for working with tables to make it convenient to find what you're looking for, and for narrowing down the data to just what you need.

To start off, let's get a table that we can use:

```
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

## Sorting the data

We can sort a table by calling the [`sort-by`](/commands/commands/sort-by.md) command and telling it which columns we want to use in the sort. Let's say we wanted to sort our table by the size of the file:

```
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

## Selecting the data you want

We can select data from a table by choosing to select specific columns or specific rows. Let's [`select`](/commands/commands/select.md) a few columns from our table to use:

```
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

```
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

You can also `skip` rows that you don't want. Let's skip the first two of the 5 rows we returned above:

```
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

Let's look at a few other commands for selecting data. You may have wondered why the rows of the table are numbers. This acts as a handy way to get to a single row. Let's sort our table by the file name and then pick one of the rows with the `select` command using its row number:

```
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

## Getting data out of a table

So far, we've worked with tables by trimming the table down to only what we need. Sometimes we may want to go a step further and only look at the values in the cells themselves rather than taking a whole column. Let's say, for example, we wanted to only get a list of the names of the files. For this, we use the [`get`](/commands/commands/get.md) command:

```
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

This might look like the [`select`](/commands/commands/select.md) command we saw earlier, so let's put that here as well to compare the two:

```
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

- [`select`](/commands/commands/select.md) - creates a new table which includes only the columns specified
- [`get`](/commands/commands/get.md) - returns the values inside the column specified as a list

The one way to tell these apart looking at the table is that the column names are missing, which lets us know that this is going to be a list of values we can work with.

The [`get`](/commands/commands/get.md) command can go one step further and take a path to data deeper in the table. This simplifies working with more complex data, like the structures you might find in a .json file.

## Changing data in a table

In addition to selecting data from a table, we can also update what the table has. We may want to combine tables, add new columns, or edit the contents of a cell. In Nu, rather than editing in place, each of the commands in the section will return a new table in the pipeline.

### Concatenating Tables

We can concatenate tables with identical column names using [`append`](/commands/commands/append.md):

```
> let $first = [[a b]; [1 2]]
> let $second = [[a b]; [3 4]]
> $first | append $second
───┬───┬───
 # │ a │ b
───┼───┼───
 0 │ 1 │ 2
 1 │ 3 │ 4
───┴───┴───
```

### Merging Tables

We can use the [`merge`](/commands/commands/merge.md) command to merge two (or more) tables together

```
> let $first = [[a b]; [1 2]]
> let $second = [[c d]; [3 4]]
> $first | merge $second
───┬───┬───┬───┬───
 # │ a │ b │ c │ d
───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 3 │ 4
───┴───┴───┴───┴───
```

Let's add a third table:

```
> let $third = [[e f]; [5 6]]
```

We could join all three tables together like this:

```
> $first | merge $second  | merge $third
───┬───┬───┬───┬───┬───┬───
 # │ a │ b │ c │ d │ e │ f
───┼───┼───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
───┴───┴───┴───┴───┴───┴───
```

Or we could use the [`reduce`](/commands/commands/reduce.md) command to dynamically merge all tables:

```
> [$first $second $third] | reduce {|it, acc| $acc | merge $it }
───┬───┬───┬───┬───┬───┬───
 # │ a │ b │ c │ d │ e │ f
───┼───┼───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
───┴───┴───┴───┴───┴───┴───
```

### Adding a new column

We can use the [`insert`](/commands/commands/insert.md) command to add a new column to the table. Let's look at an example:

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

Let's add a column called "next_edition" with the value 2021:

```
> open rustfmt.toml | insert next_edition 2021
──────────────┬──────
 edition      │ 2018
 next_edition │ 2021
──────────────┴──────
```

This visual may be slightly confusing, because it looks like what we've just done is add a row. In this case, remember: rows have numbers, columns have names. If it still is confusing, note that appending one more row will make the table render as expected:

```
> open rustfmt.toml | insert next_edition 2021 | append {edition: 2021 next_edition: 2024}
───┬─────────┬──────────────
 # │ edition │ next_edition
───┼─────────┼──────────────
 0 │    2018 │         2021
 1 │    2021 │         2024
───┴─────────┴──────────────

```

Notice that if we open the original file, the contents have stayed the same:

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

Changes in Nu are functional changes, meaning that they work on values themselves rather than trying to cause a permanent change. This lets us do many different types of work in our pipeline until we're ready to write out the result with any changes we'd like if we choose to. Here we could write out the result using the [`save`](/commands/commands/save.md) command:

```
> open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
> open rustfmt2.toml
──────────────┬──────
 edition      │ 2018
 next_edition │ 2021
──────────────┴──────
```

### Updating a column

In a similar way to the [`insert`](/commands/commands/insert.md) command, we can also use the [`update`](/commands/commands/update.md) command to change the contents of a column to a new value. To see it in action let's open the same file:

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

And now, let's update the edition to point at the next edition we hope to support:

```
> open rustfmt.toml | update edition 2021
─────────┬──────
 edition │ 2021
─────────┴──────
```

You can also use the [`upsert`](/commands/commands/upsert.md) command to insert or update depending on whether the column already exists.

### Moving columns

You can use `move` to move columns in the table. For example, if we wanted to move the "name" column from `ls` after the "size" column, we could do:

```
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

### Renaming columns

You can also `rename` columns in a table by passing it through the rename command. If we wanted to run `ls` and rename the columns, we can use this example:

```
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
