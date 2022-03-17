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

We can sort a table by calling the [`sort-by`](commands/sort-by.md) command and telling it which columns we want to use in the sort. Let's say we wanted to sort our table by the size of the file:

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

We can select data from a table by choosing to select specific columns or specific rows.  Let's [`select`](commands/select.md) a few columns from our table to use:

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

This helps to create a table that's more focused on what we need.  Next, let's say we want to only look at the 5 smallest files in this directory:

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

You can also `skip` rows that you don't want.  Let's skip the first two of the 5 rows we returned above:

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

Let's look at a few other commands for selecting data.  You may have wondered why the rows of the table are numbers. This acts as a handy way to get to a single row.  Let's sort our table by the file name and then pick one of the rows with the `nth` command using its row number:

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

> ls | sort-by name | nth 5
──────────┬────────────
 name     │ shapes.rs 
 type     │ File 
 size     │ 4.7 KB 
 modified │ 5 days ago 
──────────┴────────────
```

## Getting data out of a table

So far, we've worked with tables by trimming the table down to only what we need. Sometimes we may want to go a step further and only look at the values in the cells themselves rather than taking a whole column. Let's say, for example, we wanted to only get a list of the names of the files. For this, we use the [`get`](commands/get.md) command:

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

This might look like the [`select`](commands/select.md) command we saw earlier, so let's put that here as well to compare the two:

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

* [`select`](commands/select.md) - creates a new table which includes only the columns specified
* [`get`](commands/get.md) - returns the values inside the column specified as a list

The one way to tell these apart looking at the table is that the column names are missing, which lets us know that this is going to be a list of values we can work with.

The [`get`](commands/get.md) command can go one step further and take a path to data deeper in the table. This simplifies working with more complex data, like the structures you might find in a .json file.

## Changing data in a table

In addition to selecting data from a table, we can also update what the table has. We may want to combine tables, add new columns, or edit the contents of a cell. In Nu, rather than editing in place, each of the commands in the section will return a new table in the pipeline.

### Concatenating Tables

We can concatenate tables with identical column names using [`echo`](commands/echo.md):

```
> let $first = [[a b]; [1 2]]
> let $second = [[a b]; [3 4]]
> echo $first $second
───┬───┬───
 # │ a │ b
───┼───┼───
 0 │ 1 │ 2
 1 │ 3 │ 4
───┴───┴───
```

### Adding a new column

We can use the `insert` command to add a new column to the table. Let's look at an example:

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

Notice that we if open the original file, the contents have stayed the same:

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018 
─────────┴──────
```

Changes in Nu are functional changes, meaning that they work on the values themselves rather than trying to cause a permanent change. This lets us do many different types of work in our 
pipeline until we're ready to write out the result with any changes we'd like if we choose to. Here we could write out the result using the `save` command:

```
> open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
> open rustfmt2.toml
──────────────┬──────
 edition      │ 2018 
 next_edition │ 2021 
──────────────┴──────
```

### Updating a column

In a similar way to the `insert` command, we can also use the `update` command to change the contents of a column to a new value. To see it in action let's open the same file:

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018 
─────────┴──────
```

And now, let's update the edition to point at the next edition we hope to support:

```
> open rustfmt.toml | upsert edition 2021
─────────┬──────
 edition │ 2021 
─────────┴──────
```

### Incrementing values

There's one more command that Nu supports that will help us work with numbers and versions: [`inc`](commands/inc.md). 

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018 
─────────┴──────
> open rustfmt.toml | inc edition
─────────┬──────
 edition │ 2019 
─────────┴──────
```

Because the value in "edition" is a number, we can use [`inc`](commands/inc.md) to update it.  Where [`inc`](commands/inc.md) really shines is working with versions:

```
> open Cargo.toml | get package.version
0.1.3
> open Cargo.toml | inc package.version --minor | get package.version
0.2.0
```

When working with versions, we can use the flag to say how to increment the version:

* **--major** - increment the major version (0.1.3 -> 1.0.0)
* **--minor** - increment the minor version (0.1.3 -> 0.2.0)
* **--patch** - increment the patch version (0.1.3 -> 0.1.4)
