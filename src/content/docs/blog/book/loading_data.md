---
title: Loading Data
---

Earlier, we saw how you can use commands like [`ls`](/commands/docs/ls), [`ps`](/commands/docs/ps), [`date`](/commands/docs/date), and [`sys`](/commands/docs/sys) to load information about your files, processes, time of date, and the system itself. Each command gives us a table of information that we can explore. There are other ways we can load in a table of data to work with.

## Opening files

One of Nu's most powerful assets in working with data is the [`open`](/commands/docs/open) command. It is a multi-tool that can work with a number of different data formats. To see what this means, let's try opening a json file:

```nu frame="terminal"
open package.json
╭─────────────────┬──────────────────────────────────╮
│ name            │ nushell.github.io                │
│ type            │ module                           │
│ version         │ 0.0.0                            │
│ description     │ The Nushell website (nushell.sh) │
│ repository      │ github:nushell/nushell.github.io │
│ license         │ MIT                              │
│ engines         │ {record 2 fields}                │
│ scripts         │ {record 11 fields}               │
│ dependencies    │ {record 5 fields}                │
│ devDependencies │ {record 3 fields}                │
╰─────────────────┴──────────────────────────────────╯
```

In a similar way to [`ls`](/commands/docs/ls), opening a file type that Nu understands will give us back something that is more than just text (or a stream of bytes). Here we open a "package.json" file from a JavaScript project. Nu can recognize the JSON text and parse it to a table of data.

If we wanted to check the version of the project we were looking at, we can use the [`get`](/commands/docs/get) command.

```nu frame="terminal"
open editors/vscode/package.json | get version
1.0.0
```

Nu currently supports the following formats for loading data directly into tables:

- csv
- eml
- ics
- ini
- json
- [nuon](#nuon)
- ods
- [SQLite databases](#sqlite)
- ssv
- toml
- tsv
- url
- vcf
- xlsx / xls
- xml
- yaml / yml

:::tip[Did you know?]
Under the hood `open` will look for a `from ...` subcommand in your scope which matches the extension of your file.
You can thus simply extend the set of supported file types of `open` by creating your own `from ...` subcommand.
:::

But what happens if you load a text file that isn't one of these? Let's try it:

```nu frame="terminal"
open README.md
```

We're shown the contents of the file.

Below the surface, what Nu sees in these text files is one large string. Next, we'll talk about how to work with these strings to get the data we need out of them.

## NUON

Nushell Object Notation (NUON) aims to be for Nushell what JavaScript Object Notation (JSON) is for JavaScript.
That is, NUON code is a valid Nushell code that describes some data structure.
For example, this is a valid NUON (example from the [default configuration file](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_config.nu)):

```nu title="default_config.nu"
{
  menus: [
    # Configuration for default nushell menus
    # Note the lack of source parameter
    {
      name: completion_menu
      only_buffer_difference: false
      marker: "| "
      type: {
          layout: columnar
          columns: 4
          col_width: 20   # Optional value. If missing all the screen width is used to calculate column width
          col_padding: 2
      }
      style: {
          text: green
          selected_text: green_reverse
          description_text: yellow
      }
    }
  ]
}
```

You might notice it is quite similar to JSON, and you're right.
**NUON is a superset of JSON!**
That is, any JSON code is a valid NUON code, therefore a valid Nushell code.
Compared to JSON, NUON is more "human-friendly".
For example, comments are allowed and commas are not required.

One limitation of NUON currently is that it cannot represent all of the Nushell [data types](types_of_data).
Most notably, NUON does not allow to serialize blocks.

## Handling Strings

An important part of working with data coming from outside Nu is that it's not always in a format that Nu understands. Often this data is given to us as a string.

Let's imagine that we're given this data file:

```nu frame="terminal"
open people.txt
Octavia | Butler | Writer
Bob | Ross | Painter
Antonio | Vivaldi | Composer
```

Each bit of data we want is separated by the pipe ('|') symbol, and each person is on a separate line. Nu doesn't have a pipe-delimited file format by default, so we'll have to parse this ourselves.

The first thing we want to do when bringing in the file is to work with it a line at a time:

```nu frame="terminal"
open people.txt | lines
───┬──────────────────────────────
 0 │ Octavia | Butler | Writer
 1 │ Bob | Ross | Painter
 2 │ Antonio | Vivaldi | Composer
───┴──────────────────────────────
```

We can see that we're working with the lines because we're back into a list. Our next step is to see if we can split up the rows into something a little more useful. For that, we'll use the [`split`](/commands/docs/split) command. [`split`](/commands/docs/split), as the name implies, gives us a way to split a delimited string. We will use [`split`](/commands/docs/split)'s `column` subcommand to split the contents across multiple columns. We tell it what the delimiter is, and it does the rest:

```nu frame="terminal"
open people.txt | lines | split column "|"
───┬──────────┬───────────┬───────────
 # │ column1  │ column2   │ column3
───┼──────────┼───────────┼───────────
 0 │ Octavia  │  Butler   │  Writer
 1 │ Bob      │  Ross     │  Painter
 2 │ Antonio  │  Vivaldi  │  Composer
───┴──────────┴───────────┴───────────
```

That _almost_ looks correct. It looks like there's an extra space there. Let's [`trim`](/commands/docs/str_trim) that extra space:

```nu frame="terminal"
open people.txt | lines | split column "|" | str trim
───┬─────────┬─────────┬──────────
 # │ column1 │ column2 │ column3
───┼─────────┼─────────┼──────────
 0 │ Octavia │ Butler  │ Writer
 1 │ Bob     │ Ross    │ Painter
 2 │ Antonio │ Vivaldi │ Composer
───┴─────────┴─────────┴──────────
```

Not bad. The [`split`](/commands/docs/split) command gives us data we can use. It also goes ahead and gives us default column names:

```nu frame="terminal"
open people.txt | lines | split column "|" | str trim | get column1
───┬─────────
 0 │ Octavia
 1 │ Bob
 2 │ Antonio
───┴─────────
```

We can also name our columns instead of using the default names:

```nu frame="terminal"
open people.txt | lines | split column "|" first_name last_name job | str trim
───┬────────────┬───────────┬──────────
 # │ first_name │ last_name │ job
───┼────────────┼───────────┼──────────
 0 │ Octavia    │ Butler    │ Writer
 1 │ Bob        │ Ross      │ Painter
 2 │ Antonio    │ Vivaldi   │ Composer
───┴────────────┴───────────┴──────────
```

Now that our data is in a table, we can use all the commands we've used on tables before:

```nu frame="terminal"
open people.txt | lines | split column "|" first_name last_name job | str trim | sort-by first_name
───┬────────────┬───────────┬──────────
 # │ first_name │ last_name │ job
───┼────────────┼───────────┼──────────
 0 │ Antonio    │ Vivaldi   │ Composer
 1 │ Bob        │ Ross      │ Painter
 2 │ Octavia    │ Butler    │ Writer
───┴────────────┴───────────┴──────────
```

There are other commands you can use to work with strings:

- [`str`](/commands/docs/str)
- [`lines`](/commands/docs/lines)
- [`size`](/commands/docs/size)

There is also a set of helper commands we can call if we know the data has a structure that Nu should be able to understand. For example, let's open a Rust lock file:

```nu frame="terminal"
open Cargo.lock
# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
[[package]]
name = "adhoc_derive"
version = "0.7.20"
```

The "Cargo.lock" file is actually a .toml file, but the file extension isn't .toml. That's okay, we can use the [`from`](/commands/docs/from) command using the `toml` subcommand:

```nu frame="terminal"
open Cargo.lock | from toml
╭─────────┬──────────────────╮
│ package │ [table 102 rows] │
│ version │ 3                │
╰─────────┴──────────────────╯
```

The [`from`](/commands/docs/from) command can be used for each of the structured data text formats that Nu can open and understand by passing it the supported format as a subcommand.

## Opening in raw mode

While it's helpful to be able to open a file and immediately work with a table of its data, this is not always what you want to do. To get to the underlying text, the [`open`](/commands/docs/open) command can take an optional `--raw` flag:

```nu frame="terminal"
[package]
name = "rustlings"
description = "Small exercises to get you used to reading and writing Rust code!"
version = "5.6.1"
authors = [
  "Liv <mokou@fastmail.com>",
  "Carol (Nichols || Goulding) <carol.nichols@gmail.com>",
]
edition = "2021"
```

## SQLite

SQLite databases are automatically detected by [`open`](/commands/docs/open), no matter what their file extension is. You can open a whole database:

```nu frame="terminal"
open foo.db
```

Or [`get`](/commands/docs/get) a specific table:

```nu frame="terminal"
open foo.db | get some_table
```

Or run any SQL query you like:

```nu frame="terminal"
open foo.db | query db "select * from some_table"
```

(Note: some older versions of Nu use `into db | query` instead of `query db` )

## Fetching URLs

In addition to loading files from your filesystem, you can also load URLs by using the [`http get`](/commands/docs/http) command. This will fetch the contents of the URL from the internet and return it:

```nu frame="terminal"
http get https://blog.rust-lang.org/feed.xml
╭────────────┬──────────────────╮
│ tag        │ feed             │
│ attributes │ {record 1 field} │
│ content    │ [table 18 rows]  │
╰────────────┴──────────────────╯
```
