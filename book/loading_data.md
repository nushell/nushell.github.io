# Loading Data

Earlier, we saw how you can use commands like [`ls`](/commands/docs/ls.md), [`ps`](/commands/docs/ps.md), [`date`](/commands/docs/date.md), and [`sys host`](/commands/docs/sys_host.md) to load information about your files, processes, time of day, and the system itself. Each command gives us a table of information that we can explore. There are other ways we can load in a table of data to work with.

## Opening files

One of Nu's most powerful assets in working with data is the [`open`](/commands/docs/open.md) command. It is a multi-tool that can work with a number of different data formats. To see what this means, let's try opening a json file:

@[code](@snippets/loading_data/vscode.sh)

In a similar way to [`ls`](/commands/docs/ls.md), opening a file type that Nu understands will give us back something that is more than just text (or a stream of bytes). Here we open a "package.json" file from a JavaScript project. Nu can recognize the JSON text and parse it to a table of data.

If we wanted to check the version of the project we were looking at, we can use the [`get`](/commands/docs/get.md) command.

```nu
open editors/vscode/package.json | get version
# => 1.0.0
```

Nu currently supports the following formats for loading data directly into tables:

- csv
- eml
- ics
- ini
- json
- [kdl](#kdl)
- [md (Markdown)](#markdown)
- msgpack / msgpackz
- [nuon](#nuon)
- ods
- plist
- [SQLite databases](#sqlite)
- ssv
- toml
- tsv
- url
- vcf
- xlsx
- xml
- [yaml / yml](#yaml)

The eml, ics, ini, plist, and vcf formats are provided by the `formats` [core plugin](plugins.md#core-plugins).

::: tip Did you know?
Under the hood `open` will look for a `from ...` subcommand in your scope which matches the extension of your file.
You can thus simply extend the set of supported file types of `open` by creating your own `from ...` subcommand.
:::

But what happens if you load a text file that isn't one of these? Let's try it:

```nu
open notes.txt
# => Remember to water the plants.
# => Call Mom on Sunday.
```

We're shown the contents of the file.

Below the surface, what Nu sees in these text files is one large string. Next, we'll talk about how to work with these strings to get the data we need out of them.

## NUON

Nushell Object Notation (NUON) aims to be for Nushell what JavaScript Object Notation (JSON) is for JavaScript.
That is, NUON code is a valid Nushell code that describes some data structure.
For example, this is a valid NUON (adapted from the [documented configuration file](https://github.com/nushell/nushell/blob/main/crates/nu-config/default_files/doc_config.nu), which you can also view with `config nu --doc`):

```nu
{
  menus: [
    # Configuration for default nushell menus
    # Note the lack of source parameter
    {
      name: completion_menu
      input_mode: cursor_prefix
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

One limitation of NUON currently is that it cannot represent all of the Nushell [data types](types_of_data.md).
Most notably, NUON does not allow the serialization of closures (`to nuon --serialize` writes them as strings, which are not turned back into closures when read).

## Markdown, KDL, and YAML

### Markdown

Markdown is one of the formats that `open` understands, so opening a `.md` file doesn't give you a string. Take this `README.md`, shown here as text with [`open --raw`](#opening-in-raw-mode):

```nu
open --raw README.md
# => # My Project
# =>
# => A short description.
# =>
# => ## Install
# =>
# => - Download it
# => - Run it
```

Without `--raw`, [`from md`](/commands/docs/from_md.md) turns it into a table with one row for each heading, paragraph, list item, and so on:

```nu
open README.md | select element content
# => ╭───┬─────────┬──────────────────────╮
# => │ # │ element │       content        │
# => ├───┼─────────┼──────────────────────┤
# => │ 0 │ text    │ My Project           │
# => │ 1 │ text    │ A short description. │
# => │ 2 │ text    │ Install              │
# => │ 3 │ text    │ Download it          │
# => │ 4 │ text    │ Run it               │
# => ╰───┴─────────┴──────────────────────╯
```

The table also has a `content_span` column with each element's position in the file and, for elements that have them, `attributes` such as a heading's level. Use `from md --verbose` to get the full syntax tree.

### KDL

[KDL](https://kdl.dev) documents are read as a table of nodes. Each row has the node's `name`, its positional `args`, its named `props`, and its `children`:

```nu
'package name=nu version="0.116.0"' | from kdl | get 0.props
# => ╭─────────┬─────────╮
# => │ name    │ nu      │
# => │ version │ 0.116.0 │
# => ╰─────────┴─────────╯
```

[`from kdl`](/commands/docs/from_kdl.md) reads KDL version 2 by default. Use `--spec 1` for KDL 1 documents.

### YAML

[`from yaml`](/commands/docs/from_yaml.md) follows YAML 1.2 by default, so a value like `yes` stays a string instead of becoming a boolean. Use `--spec 1.1` to read a file with the older YAML 1.1 rules:

```nu
'enabled: yes' | from yaml
# => ╭─────────┬─────╮
# => │ enabled │ yes │
# => ╰─────────┴─────╯
'enabled: yes' | from yaml --spec 1.1
# => ╭─────────┬──────╮
# => │ enabled │ true │
# => ╰─────────┴──────╯
```

## Handling Strings

An important part of working with data coming from outside Nu is that it's not always in a format that Nu understands. Often this data is given to us as a string.

Let's imagine that we're given this data file:

```nu
open people.txt
# => Octavia | Butler | Writer
# => Bob | Ross | Painter
# => Antonio | Vivaldi | Composer
```

Each bit of data we want is separated by the pipe ('|') symbol, and each person is on a separate line. Nu doesn't have a pipe-delimited file format by default, so we'll have to parse this ourselves.

The first thing we want to do when bringing in the file is to work with it a line at a time:

```nu
open people.txt | lines
# => ╭───┬──────────────────────────────╮
# => │ 0 │ Octavia | Butler | Writer    │
# => │ 1 │ Bob | Ross | Painter         │
# => │ 2 │ Antonio | Vivaldi | Composer │
# => ╰───┴──────────────────────────────╯
```

We can see that we're working with the lines because we're back into a list. Our next step is to see if we can split up the rows into something a little more useful. For that, we'll use the [`split`](/commands/docs/split.md) command. [`split`](/commands/docs/split.md), as the name implies, gives us a way to split a delimited string. We will use [`split`](/commands/docs/split.md)'s `column` subcommand to split the contents across multiple columns. We tell it what the delimiter is, and it does the rest:

```nu
open people.txt | lines | split column "|"
# => ╭───┬──────────┬───────────┬───────────╮
# => │ # │ column0  │  column1  │  column2  │
# => ├───┼──────────┼───────────┼───────────┤
# => │ 0 │ Octavia  │  Butler   │  Writer   │
# => │ 1 │ Bob      │  Ross     │  Painter  │
# => │ 2 │ Antonio  │  Vivaldi  │  Composer │
# => ╰───┴──────────┴───────────┴───────────╯
```

That _almost_ looks correct. It looks like there's an extra space there. Let's [`trim`](/commands/docs/str_trim.md) that extra space:

```nu
open people.txt | lines | split column "|" | str trim
# => ╭───┬─────────┬─────────┬──────────╮
# => │ # │ column0 │ column1 │ column2  │
# => ├───┼─────────┼─────────┼──────────┤
# => │ 0 │ Octavia │ Butler  │ Writer   │
# => │ 1 │ Bob     │ Ross    │ Painter  │
# => │ 2 │ Antonio │ Vivaldi │ Composer │
# => ╰───┴─────────┴─────────┴──────────╯
```

Not bad. The [`split`](/commands/docs/split.md) command gives us data we can use. It also goes ahead and gives us default column names:

```nu
open people.txt | lines | split column "|" | str trim | get column0
# => ╭───┬─────────╮
# => │ 0 │ Octavia │
# => │ 1 │ Bob     │
# => │ 2 │ Antonio │
# => ╰───┴─────────╯
```

We can also name our columns instead of using the default names:

```nu
open people.txt | lines | split column "|" first_name last_name job | str trim
# => ╭───┬────────────┬───────────┬──────────╮
# => │ # │ first_name │ last_name │   job    │
# => ├───┼────────────┼───────────┼──────────┤
# => │ 0 │ Octavia    │ Butler    │ Writer   │
# => │ 1 │ Bob        │ Ross      │ Painter  │
# => │ 2 │ Antonio    │ Vivaldi   │ Composer │
# => ╰───┴────────────┴───────────┴──────────╯
```

Now that our data is in a table, we can use all the commands we've used on tables before:

```nu
open people.txt | lines | split column "|" first_name last_name job | str trim | sort-by first_name
# => ╭───┬────────────┬───────────┬──────────╮
# => │ # │ first_name │ last_name │   job    │
# => ├───┼────────────┼───────────┼──────────┤
# => │ 0 │ Antonio    │ Vivaldi   │ Composer │
# => │ 1 │ Bob        │ Ross      │ Painter  │
# => │ 2 │ Octavia    │ Butler    │ Writer   │
# => ╰───┴────────────┴───────────┴──────────╯
```

There are other commands you can use to work with strings:

- [`str`](/commands/docs/str.md)
- [`lines`](/commands/docs/lines.md)

There is also a set of helper commands we can call if we know the data has a structure that Nu should be able to understand. For example, let's look at the first few lines of a Rust lock file:

```nu
open Cargo.lock | lines | first 6
# => ╭───┬───────────────────────────────────────────────────╮
# => │ 0 │ # This file is automatically @generated by Cargo. │
# => │ 1 │ # It is not intended for manual editing.          │
# => │ 2 │ version = 4                                       │
# => │ 3 │                                                   │
# => │ 4 │ [[package]]                                       │
# => │ 5 │ name = "adhoc_derive"                             │
# => ╰───┴───────────────────────────────────────────────────╯
```

The "Cargo.lock" file is actually a .toml file, but the file extension isn't .toml. That's okay, we can use the [`from`](/commands/docs/from.md) command using the `toml` subcommand:

@[code](@snippets/loading_data/cargo-toml.sh)

The [`from`](/commands/docs/from.md) command can be used for each of the structured data text formats that Nu can open and understand by passing it the supported format as a subcommand.

## Opening in raw mode

While it's helpful to be able to open a file and immediately work with a table of its data, this is not always what you want to do. To get to the underlying text, the [`open`](/commands/docs/open.md) command can take an optional `--raw` flag:

```nu
open Cargo.toml --raw
# => [package]
# => name = "demo"
# => version = "0.1.0"
# => edition = "2024"
# =>
# => [dependencies]
# => adhoc_derive = "0.1.2"
```

## SQLite

SQLite databases are automatically detected by [`open`](/commands/docs/open.md), no matter what their file extension is. To try this out, create a small database with [`into sqlite`](/commands/docs/into_sqlite.md):

```nu
[[name age]; [Alice 30] [Bob 25]] | into sqlite foo.db --table-name some_table
```

You can open a whole database:

```nu
open foo.db
# => ╭────────────┬─────────────────────╮
# => │            │ ╭───┬───────┬─────╮ │
# => │ some_table │ │ # │ name  │ age │ │
# => │            │ ├───┼───────┼─────┤ │
# => │            │ │ 0 │ Alice │  30 │ │
# => │            │ │ 1 │ Bob   │  25 │ │
# => │            │ ╰───┴───────┴─────╯ │
# => ╰────────────┴─────────────────────╯
```

Or [`get`](/commands/docs/get.md) a specific table:

```nu
open foo.db | get some_table
# => ╭───┬───────┬─────╮
# => │ # │ name  │ age │
# => ├───┼───────┼─────┤
# => │ 0 │ Alice │  30 │
# => │ 1 │ Bob   │  25 │
# => ╰───┴───────┴─────╯
```

Or run any SQL query you like:

```nu
open foo.db | query db "select * from some_table where age > 26"
# => ╭───┬───────┬─────╮
# => │ # │ name  │ age │
# => ├───┼───────┼─────┤
# => │ 0 │ Alice │  30 │
# => ╰───┴───────┴─────╯
```

## Fetching URLs

In addition to loading files from your filesystem, you can also load URLs by using the [`http get`](/commands/docs/http_get.md) command. This will fetch the contents of the URL from the internet and return it:

@[code](@snippets/loading_data/rust-lang-feed.sh)
