# Loading data

Earlier, we saw how you can use commands like [`ls`](commands/ls.md), [`ps`](commands/ps.md), [`date`](commands/date.md), and [`sys`](commands/sys.md) to load information about your files, processes, time of date, and the system itself. Each command gives us a table of information that we can explore. There are other ways we can load in a table of data to work with.

## Opening files

One of Nu's most powerful assets in working with data is the [`open`](commands/open.md) command. It is a multi-tool that can work with a number of different data formats. To see what this means, let's try opening a json file:

```
> open editors/vscode/package.json
──────────────────┬───────────────────────────────────────────────────────────────────────────────
 name             │ lark
 description      │ Lark support for VS Code
 author           │ Lark developers
 license          │ MIT
 version          │ 1.0.0
 repository       │ [row type url]
 publisher        │ vscode
 categories       │ [table 0 rows]
 keywords         │ [table 1 rows]
 engines          │ [row vscode]
 activationEvents │ [table 1 rows]
 main             │ ./out/extension
 contributes      │ [row configuration grammars languages]
 scripts          │ [row compile postinstall test vscode:prepublish watch]
 devDependencies  │ [row @types/mocha @types/node tslint typescript vscode vscode-languageclient]
──────────────────┴───────────────────────────────────────────────────────────────────────────────
```

In a similar way to [`ls`](commands/ls.md), opening a file type that Nu understands will give us back something that is more than just text (or a stream of bytes). Here we open a "package.json" file from a JavaScript project. Nu can recognize the JSON text and parse it to a table of data.

If we wanted to check the version of the project we were looking at, we can use the [`get`](commands/get.md) command.

```
> open editors/vscode/package.json | get version
1.0.0
```

Nu currently supports the following formats for loading data directly into tables:

- csv
- eml
- ics
- ini
- json
- nuon
- ods
- ssv
- toml
- tsv
- url
- vcf
- xlsx / xls
- xml
- yaml / yml

But what happens if you load a text file that isn't one of these? Let's try it:

```
> open README.md
```

We're shown the contents of the file.

Below the surface, what Nu sees in these text files is one large string. Next, we'll talk about how to work with these strings to get the data we need out of them.

## Handling Strings

An important part of working with data coming from outside Nu is that it's not always in a format that Nu understands. Often this data is given to us as a string.

Let's imagine that we're given this data file:

```
> open people.txt
Octavia | Butler | Writer
Bob | Ross | Painter
Antonio | Vivaldi | Composer
```

Each bit of data we want is separated by the pipe ('|') symbol, and each person is on a separate line. Nu doesn't have a pipe-delimited file format by default, so we'll have to parse this ourselves.

The first thing we want to do when bringing in the file is to work with it a line at a time:

```
> open people.txt | lines
───┬──────────────────────────────
 0 │ Octavia | Butler | Writer
 1 │ Bob | Ross | Painter
 2 │ Antonio | Vivaldi | Composer
───┴──────────────────────────────
```

We can see that we're working with the lines because we're back into a table. Our next step is to see if we can split up the rows into something a little more useful. For that, we'll use the [`split`](commands/split.md) command. [`split`](commands/split.md), as the name implies, gives us a way to split a delimited string. We will use [`split`](commands/split.md)'s `column` subcommand to split the contents across multiple columns. We tell it what the delimiter is, and it does the rest:

```
> open people.txt | lines | split column "|"
───┬──────────┬───────────┬───────────
 # │ column1  │ column2   │ column3
───┼──────────┼───────────┼───────────
 0 │ Octavia  │  Butler   │  Writer
 1 │ Bob      │  Ross     │  Painter
 2 │ Antonio  │  Vivaldi  │  Composer
───┴──────────┴───────────┴───────────
```

That _almost_ looks correct. It looks like there's an extra space there. Let's [`trim`](commands/str_trim.md) that extra space:

```
> open people.txt | lines | split column "|" | str trim
───┬─────────┬─────────┬──────────
 # │ column1 │ column2 │ column3
───┼─────────┼─────────┼──────────
 0 │ Octavia │ Butler  │ Writer
 1 │ Bob     │ Ross    │ Painter
 2 │ Antonio │ Vivaldi │ Composer
───┴─────────┴─────────┴──────────
```

Not bad. The [`split`](commands/split.md) command gives us data we can use. It also goes ahead and gives us default column names:

```
> open people.txt | lines | split column "|" | str trim | get column1
───┬─────────
 0 │ Octavia
 1 │ Bob
 2 │ Antonio
───┴─────────
```

We can also name our columns instead of using the default names:

```
> open people.txt | lines | split column "|" first_name last_name job | str trim
───┬────────────┬───────────┬──────────
 # │ first_name │ last_name │ job
───┼────────────┼───────────┼──────────
 0 │ Octavia    │ Butler    │ Writer
 1 │ Bob        │ Ross      │ Painter
 2 │ Antonio    │ Vivaldi   │ Composer
───┴────────────┴───────────┴──────────
```

Now that our data is in a table, we can use all the commands we've used on tables before:

```
> open people.txt | lines | split column "|" first_name last_name job | str trim | sort-by first_name
───┬────────────┬───────────┬──────────
 # │ first_name │ last_name │ job
───┼────────────┼───────────┼──────────
 0 │ Antonio    │ Vivaldi   │ Composer
 1 │ Bob        │ Ross      │ Painter
 2 │ Octavia    │ Butler    │ Writer
───┴────────────┴───────────┴──────────
```

There are other commands you can use to work with strings:

- `str`
- [`lines`](commands/lines.md)
- [`size`](commands/size.md)

There is also a set of helper commands we can call if we know the data has a structure that Nu should be able to understand. For example, let's open a Rust lock file:

```
> open Cargo.lock
# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
[[package]]
name = "adhoc_derive"
version = "0.1.2"
```

The "Cargo.lock" file is actually a .toml file, but the file extension isn't .toml. That's okay, we can use the `from` command using the `toml` subcommand:

```
> open Cargo.lock | from toml
──────────┬───────────────────
 metadata │ [row 107 columns]
 package  │ [table 130 rows]
──────────┴───────────────────
```

The `from` command can be used for each of the structured data text formats that Nu can open and understand by passing it the supported format as a subcommand.

## Opening in raw mode

While it's helpful to be able to open a file and immediately work with a table of its data, this is not always what you want to do. To get to the underlying text, the [`open`](commands/open.md) command can take an optional `--raw` flag:

```
> open Cargo.toml --raw
[package]                                                                                        name = "nu"
version = "0.1.3"
authors = ["Yehuda Katz <wycats@gmail.com>", "Jonathan Turner <jonathan.d.turner@gmail.com>"]
description = "A shell for the GitHub era"
license = "MIT"
```

## Fetching URLs

In addition to loading files from your filesystem, you can also load URLs by using the [`fetch`](commands/fetch.md) command. This will fetch the contents of the URL from the internet and return it:

```
> fetch https://blog.rust-lang.org/feed.xml
──────┬───────────────────
 feed │ {record 2 fields}
──────┴───────────────────
```
