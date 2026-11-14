# Loading Data

Earlier, we saw how you can use commands like [`ls`](/commands/docs/ls.md), [`ps`](/commands/docs/ps.md), [`date now`](/commands/docs/date_now.md), and [`sys host`](/commands/docs/sys_host.md) to load information about your files, processes, time of day, and the system itself. `ls` and `ps` return tables, `date now` returns a [date](types_of_data.md#dates), and `sys host` returns a record. Each of these is structured data that we can explore. There are other ways we can load data to work with.

## Opening files

One of Nu's most powerful assets in working with data is the [`open`](/commands/docs/open.md) command. It is a multi-tool that can work with a number of different data formats. To see what this means, let's try opening a json file:

@[code](@snippets/loading_data/vscode.sh)

In a similar way to [`ls`](/commands/docs/ls.md), opening a file type that Nu understands will give us back something that is more than just text (or a stream of bytes). Here we open a "package.json" file from a JavaScript project. Nu can recognize the JSON text and parse it to a table of data.

If we wanted to check the version of the project we were looking at, we can use the [`get`](/commands/docs/get.md) command.

```nu
open editors/vscode/package.json | get version
# => 1.0.0
```

Nu currently supports the following formats. The [`from`](/commands/docs/from.md) subcommands parse text in a format into structured data, and `open` runs them for you. The [`to`](/commands/docs/to.md) subcommands go the other way and serialize structured data into text in a format (binary for MessagePack), and [`save`](#saving-data) runs them for you.

| Format                                    | Read with                                                                                            | Write with                                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| CSV                                       | [`from csv`](/commands/docs/from_csv.md)                                                             | [`to csv`](/commands/docs/to_csv.md)                                                         |
| dotenv (`.env`, `.env.local`, `prod.env`) | [`from dotenv`](/commands/docs/from_dotenv.md)                                                       | [`to dotenv`](/commands/docs/to_dotenv.md)                                                   |
| eml (plugin)                              | [`from eml`](/commands/docs/from_eml.md)                                                             |                                                                                              |
| HTML                                      |                                                                                                      | [`to html`](/commands/docs/to_html.md)                                                       |
| ics (plugin)                              | [`from ics`](/commands/docs/from_ics.md)                                                             |                                                                                              |
| ini (plugin)                              | [`from ini`](/commands/docs/from_ini.md)                                                             |                                                                                              |
| JSON                                      | [`from json`](/commands/docs/from_json.md)                                                           | [`to json`](/commands/docs/to_json.md)                                                       |
| [KDL](#kdl)                               | [`from kdl`](/commands/docs/from_kdl.md)                                                             | [`to kdl`](/commands/docs/to_kdl.md)                                                         |
| [Markdown (md)](#markdown)                | [`from md`](/commands/docs/from_md.md)                                                               | [`to md`](/commands/docs/to_md.md)                                                           |
| MessagePack (msgpack, msgpackz)           | [`from msgpack`](/commands/docs/from_msgpack.md), [`from msgpackz`](/commands/docs/from_msgpackz.md) | [`to msgpack`](/commands/docs/to_msgpack.md), [`to msgpackz`](/commands/docs/to_msgpackz.md) |
| [NUON](#nuon)                             | [`from nuon`](/commands/docs/from_nuon.md)                                                           | [`to nuon`](/commands/docs/to_nuon.md)                                                       |
| ods                                       | [`from ods`](/commands/docs/from_ods.md)                                                             |                                                                                              |
| plist (plugin)                            | [`from plist`](/commands/docs/from_plist.md)                                                         | [`to plist`](/commands/docs/to_plist.md)                                                     |
| [SQLite databases](#sqlite)               | `open`                                                                                               | [`into sqlite`](/commands/docs/into_sqlite.md)                                               |
| ssv                                       | [`from ssv`](/commands/docs/from_ssv.md)                                                             |                                                                                              |
| Plain text (txt)                          |                                                                                                      | [`to text`](/commands/docs/to_text.md), [`to txt`](/commands/docs/to_txt.md)                 |
| [TOML](#toml)                             | [`from toml`](/commands/docs/from_toml.md)                                                           | [`to toml`](/commands/docs/to_toml.md)                                                       |
| TSV                                       | [`from tsv`](/commands/docs/from_tsv.md)                                                             | [`to tsv`](/commands/docs/to_tsv.md)                                                         |
| url (query strings)                       | [`from url`](/commands/docs/from_url.md)                                                             |                                                                                              |
| vcf (plugin)                              | [`from vcf`](/commands/docs/from_vcf.md)                                                             |                                                                                              |
| xlsx                                      | [`from xlsx`](/commands/docs/from_xlsx.md)                                                           |                                                                                              |
| XML                                       | [`from xml`](/commands/docs/from_xml.md)                                                             | [`to xml`](/commands/docs/to_xml.md)                                                         |
| [YAML (yaml, yml)](#yaml)                 | [`from yaml`](/commands/docs/from_yaml.md), [`from yml`](/commands/docs/from_yml.md)                 | [`to yaml`](/commands/docs/to_yaml.md), [`to yml`](/commands/docs/to_yml.md)                 |

The eml, ics, ini, plist, and vcf formats are provided by the `formats` [core plugin](plugins.md#core-plugins).

::: tip Did you know?
Under the hood `open` will look for a `from ...` subcommand in your scope which matches the extension of your file.
You can thus simply extend the set of supported file types of `open` by creating your own `from ...` subcommand.
[`save`](/commands/docs/save.md) looks for a matching `to ...` subcommand in the same way.

`open` lowercases the file name first, so `DATA.JSON` opens as JSON. For a name with several dots, it tries the longest extension first: `backup.tar.gz` looks for `from tar.gz`, then for `from gz`. A file named like `.env`, `.env.local`, or `prod.env` that matches no other `from` command is read with `from dotenv`. A file whose extension matches no `from` command opens as plain text or binary data.

The converter has to be a command defined with `def`. An alias such as `alias "from jsonc" = from json` doesn't work, and `open` and `save` report an error that suggests the equivalent `def`:

```nu
def "from jsonc" [] { from json }
open deno.jsonc
```

:::

But what happens if you load a text file that isn't one of these? Let's try it:

```nu
open notes.txt
# => Remember to water the plants.
# => Call Mom on Sunday.
```

We're shown the contents of the file.

Below the surface, what Nu sees in these text files is one large string. Next, we'll talk about how to work with these strings to get the data we need out of them.

### Opening several files

`open` takes more than one path, and each path can be a glob. The results come out as one stream, so the rows of several tables end up in a single table:

```nu
open jan.json feb.json
# => ╭───┬───────┬───────╮
# => │ # │ month │ total │
# => ├───┼───────┼───────┤
# => │ 0 │ jan   │   120 │
# => │ 1 │ feb   │    95 │
# => ╰───┴───────┴───────╯
open *.json | length
# => 2
```

When no path is given, `open` takes it from its input. The input has to be a single path, so spread a list of paths into arguments instead:

```nu
"jan.json" | open | get total
# => ╭───┬─────╮
# => │ 0 │ 120 │
# => ╰───┴─────╯
open ...(ls *.json | get name)
```

`open` can't open a directory. Passing one fails with an `Is a directory` error; use [`ls`](/commands/docs/ls.md) to see what's inside.

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

[`to nuon`](/commands/docs/to_nuon.md) writes everything on one line by default. A table is written in table syntax, with the column names once at the start, rather than as a list of records:

```nu
let people = [[name age]; [Alice 30] [Bob 25]]
$people | to nuon
# => [[name, age]; [Alice, 30], [Bob, 25]]
$people | to nuon --pretty
# => [
# =>   [name,  age];
# =>   [Alice, 30],
# =>   [Bob,   25]
# => ]
$people | to nuon --list-of-records
# => [{name: Alice, age: 30}, {name: Bob, age: 25}]
```

The other flags change the layout:

- `--pretty` spreads the output over several lines, indented by two spaces, with table columns lined up. `--indent <n>` does the same with `n` spaces, and `--tabs <n>` with `n` tabs.
- `--raw` removes every space and newline, and wins over `--pretty`, `--indent`, and `--tabs`.
- `--no-commas` separates items with spaces instead of commas, the way you'd type them in Nushell: `[[name age]; [Alice 30] [Bob 25]]`. It can't be combined with `--raw`, which would leave no separator at all.
- `--raw-strings` writes a string that contains quotes or backslashes as a [raw string](working_with_strings.md#raw-strings), so `C:\Users\me` becomes `r#'C:\Users\me'#` instead of `"C:\\Users\\me"`.

## Notes on specific formats

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

The table also has a `content_span` column with each element's position in the file and, for elements that have them, `attributes` such as a heading's level.

YAML front matter at the top of a file becomes the first row. Its `element` is `yaml` and its `content` is the YAML text, which [`from yaml`](#yaml) can read:

```nu
open post.md | select element content
# => ╭───┬─────────┬───────────────────╮
# => │ # │ element │      content      │
# => ├───┼─────────┼───────────────────┤
# => │ 0 │ yaml    │ title: My Project │
# => │   │         │ version: 1.2.0    │
# => │ 1 │ text    │ My Project        │
# => │ 2 │ text    │ A short           │
# => │ 3 │ text    │ description       │
# => │ 4 │ text    │ .                 │
# => ╰───┴─────────┴───────────────────╯
open post.md | where element == yaml | get 0.content | from yaml
# => ╭─────────┬────────────╮
# => │ title   │ My Project │
# => │ version │ 1.2.0      │
# => ╰─────────┴────────────╯
```

The paragraph in `post.md` is `A short *description*.`, and the emphasis splits it into three rows.

Use `from md --verbose` to get the full syntax tree. It takes text, so start from `open --raw`. Every node in the tree is a record with the same four fields:

- `type` is the node kind, such as `h1`, `text`, `emphasis`, `list`, `code`, or `yaml`.
- `position` holds the `start` and `end` of the node, each with a `line` and `column`.
- `attrs` holds the node's attributes, such as a heading's `depth`, a code block's `lang`, or a link's `url`. Nodes without children also get a `value` with their text.
- `children` is a list of the nested nodes, in the same form.

```nu
let tree = open --raw post.md | from md --verbose
$tree | get type
# => ╭───┬──────────╮
# => │ 0 │ yaml     │
# => │ 1 │ h1       │
# => │ 2 │ text     │
# => │ 3 │ emphasis │
# => │ 4 │ text     │
# => ╰───┴──────────╯
$tree.1.attrs
# => ╭───────┬───╮
# => │ depth │ 1 │
# => │ level │ 1 │
# => ╰───────┴───╯
$tree.1.children.0.attrs.value
# => My Project
```

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

A KDL value can carry a type annotation in parentheses. `from kdl` turns `(duration)` (nanoseconds), `(filesize)` (bytes), `(timestamp)` or `(datetime)`, `(binary)` (base64 text), `(range)`, `(glob)`, and `(cell-path)` values into the matching Nushell type. A value with any other annotation becomes a record holding the `value` and its `type`. With `--ignore-types`, every annotation is dropped and each value keeps its plain KDL type:

```nu
let doc = 'server timeout=(duration)30000000000 color=(rgb)"#ff0000"'
$doc | from kdl | get 0.props
# => ╭─────────┬─────────────────────╮
# => │ timeout │ 30sec               │
# => │         │ ╭───────┬─────────╮ │
# => │ color   │ │ value │ #ff0000 │ │
# => │         │ │ type  │ rgb     │ │
# => │         │ ╰───────┴─────────╯ │
# => ╰─────────┴─────────────────────╯
$doc | from kdl --ignore-types | get 0.props
# => ╭─────────┬─────────────╮
# => │ timeout │ 30000000000 │
# => │ color   │ #ff0000     │
# => ╰─────────┴─────────────╯
```

[`to kdl`](/commands/docs/to_kdl.md) doesn't write node rows by default. It writes [JSON-in-KDL](https://github.com/kdl-org/kdl/blob/main/JSON-IN-KDL.md) (JiK), a way of storing any value, such as a record, in one top-level `-` node. Read it back with `from kdl --format jik`, which returns the value itself instead of a table of nodes:

```nu
{name: nu, wait: 5sec} | to kdl
# => - name=nu wait=(duration)5000000000
{name: nu, wait: 5sec} | to kdl | from kdl --format jik
# => ╭──────┬──────╮
# => │ name │ nu   │
# => │ wait │ 5sec │
# => ╰──────┴──────╯
```

`--format jik` fails on a document with more than one top-level node, and on an annotation it doesn't know (add `--ignore-types` to read those as plain values).

### TOML

TOML has four kinds of date and time values. [`from toml`](/commands/docs/from_toml.md) turns the three that include a date into Nushell [dates](types_of_data.md#dates). A date-time without an offset is read as UTC, and a date on its own becomes midnight UTC. A time on its own has no date to attach to, so it stays a string:

```nu
'released = 1979-05-27T07:32:00-08:00
built = 1979-05-27T07:32:00
day = 1979-05-27
alarm = 07:32:00' | from toml | to nuon
# => {released: 1979-05-27T07:32:00-08:00, built: 1979-05-27T07:32:00+00:00, day: 1979-05-27T00:00:00+00:00, alarm: "07:32:00"}
```

Text that isn't valid TOML fails with a `Can't convert to structured toml data` error. Its help text shows the line and column where parsing stopped and what the parser expected there.

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

The same goes for an unquoted date such as `2024-01-02T03:04:05Z`, which YAML 1.2 reads as a string and YAML 1.1 as a date.

A YAML file can hold several documents separated by `---` lines. `from yaml` returns a list with one item per document, and the document itself when there's only one. `--multiple list` always returns a list, and `--multiple single` fails with a `Too many documents` error when there's more than one:

```nu
"name: a\n---\nname: b\n" | from yaml
# => ╭───┬──────╮
# => │ # │ name │
# => ├───┼──────┤
# => │ 0 │ a    │
# => │ 1 │ b    │
# => ╰───┴──────╯
```

Record keys in Nushell are always strings, but YAML reads an unquoted key such as `404`, `true`, or `null` as a number, a boolean, or null. `from yaml` rejects those keys with a `Found unsupported key` error. `--key-resolution verbatim` keeps the key's text instead:

```nu
"404: Not Found\n500: Server Error\n" | from yaml --key-resolution verbatim
# => ╭─────┬──────────────╮
# => │ 404 │ Not Found    │
# => │ 500 │ Server Error │
# => ╰─────┴──────────────╯
```

[`to yaml`](/commands/docs/to_yaml.md) writes the Nushell types that YAML doesn't have with tags: `!duration` (nanoseconds), `!filesize` (bytes), `!range`, `!glob`, and `!cell-path`. Dates get the standard `!!timestamp` tag and binary data `!!binary` (base64). `from yaml` reads these tags back into the original types:

```nu
{when: 2024-01-02T03:04:05Z, took: 90sec, size: 1kb, path: $.a.0} | to yaml
# => when: !!timestamp 2024-01-02T03:04:05Z
# => took: !duration 90000000000
# => size: !filesize 1000
# => path: !cell-path $.a.0
{when: 2024-01-02T03:04:05Z, took: 90sec, size: 1kb, path: $.a.0} | to yaml | from yaml | describe
# => record<when: datetime, took: duration, size: filesize, path: cell-path>
```

A tag `from yaml` doesn't know, such as `!foo`, is an `Unknown tag` error. `--ignore-tags` reads every tagged value as if it had no tag, so `!filesize 1000` becomes the integer `1000`.

A closure can't be written as YAML and read back, so `to yaml` fails on one. `--non-roundtrip null` writes `null` in its place, and `--serialize` writes its source code with a `!closure` tag, which `from yaml` doesn't read back.

The other `to yaml` flags change the layout:

- `--spec 1.1` writes for YAML 1.1 readers, quoting strings such as `"yes"` that they would read as booleans.
- `--multiple` writes each item of a list as its own document, separated by `---`.
- `--add-directives` starts the output with `%YAML` and `%TAG` lines and a `---`.
- `--indent <n>` sets the indentation width.
- `--list-indent indented` indents list items under their key. The default, `compact`, lines up the `-` with the key.
- `--quote single` or `--quote double` quotes every string. The default, `auto`, quotes a string only when it would otherwise be read as another type or as YAML syntax.

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

`--raw` is also the way out when a file's contents don't match its extension. If the `from` command fails, `open` reports an `Error while parsing as <format>` error that names the file and the `from` command, shows the parser's own error below it, and suggests `open --raw` in its help text. Open the file raw to look at it, or to parse it another way.

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

A table you `get` this way isn't read right away. Commands such as `select`, `first`, and `length` become part of an SQL query that SQLite runs, as [Tables from a SQLite file](/lang-guide/chapters/filters/selecting_data.md#tables-from-a-sqlite-file) explains.

Or run any SQL query you like:

```nu
open foo.db | query db "select * from some_table where age > 26"
# => ╭───┬───────┬─────╮
# => │ # │ name  │ age │
# => ├───┼───────┼─────┤
# => │ 0 │ Alice │  30 │
# => ╰───┴───────┴─────╯
```

To put values into the SQL without pasting them into the string, use `--params`. A list fills `?` placeholders in order, and a record fills named placeholders. A record key matches the `:key` placeholder, unless the key itself starts with `:`, `@`, or `$`:

```nu
open foo.db | query db "select * from some_table where name = :name" --params {name: Bob}
# => ╭───┬──────┬─────╮
# => │ # │ name │ age │
# => ├───┼──────┼─────┤
# => │ 0 │ Bob  │  25 │
# => ╰───┴──────┴─────╯
```

[`query db`](/commands/docs/query_db.md) runs other statements too. An `INSERT`, `UPDATE`, or `DELETE` returns an empty list, and its changes are saved to the database file:

```nu
open foo.db | query db "insert into some_table values (?, ?)" --params [Carol 41]
# => ╭────────────╮
# => │ empty list │
# => ╰────────────╯
open foo.db | query db "select * from some_table where age > ?" --params [26]
# => ╭───┬───────┬─────╮
# => │ # │ name  │ age │
# => ├───┼───────┼─────┤
# => │ 0 │ Alice │  30 │
# => │ 1 │ Carol │  41 │
# => ╰───┴───────┴─────╯
```

The input has to be a database: a file from `open`, or the in-memory database that [`stor open`](/commands/docs/stor_open.md) returns. Anything else fails with a `Can't convert to database` error.

`into sqlite` takes a record as well as a table, and a record becomes one row. Without `--table-name`, the table is named `main`. If the database file already exists, `into sqlite` adds to it, and if the table already exists, the new rows are appended to it. The columns of an existing table don't change, so a row with a column the table lacks fails with a `has no column named` error.

When `into sqlite` creates a table, it gives each column a SQLite type based on the value in the first row:

| Nushell type           | SQLite column type | Stored as                                     |
| ---------------------- | ------------------ | --------------------------------------------- |
| string                 | `TEXT`             | text                                          |
| int                    | `INTEGER`          | integer                                       |
| float                  | `REAL`             | floating point number                         |
| bool                   | `BOOLEAN`          | `1` or `0`                                    |
| date                   | `DATETIME`         | text, such as `2024-01-02 03:04:05+00:00`     |
| duration               | `BIGINT`           | integer number of nanoseconds                 |
| filesize               | `INTEGER`          | integer number of bytes                       |
| binary                 | `BLOB`             | bytes                                         |
| list, record, or table | `JSONB`            | JSON text                                     |
| null                   | `TEXT`             | `NULL`, with a warning about the guessed type |

Any other type, such as a range or a closure, is an error. `query db` returns the stored values as they are, except for columns declared as `JSON` or `JSONB`, which come back as lists and records:

```nu
{name: Alice, tags: [admin dev]} | into sqlite users.db
open users.db | query db "select * from main"
# => ╭───┬───────┬───────────────╮
# => │ # │ name  │     tags      │
# => ├───┼───────┼───────────────┤
# => │ 0 │ Alice │ ╭───┬───────╮ │
# => │   │       │ │ 0 │ admin │ │
# => │   │       │ │ 1 │ dev   │ │
# => │   │       │ ╰───┴───────╯ │
# => ╰───┴───────┴───────────────╯
```

## Fetching URLs

In addition to loading files from your filesystem, you can also load URLs by using the [`http get`](/commands/docs/http_get.md) command. This will fetch the contents of the URL from the internet and return it:

@[code](@snippets/loading_data/rust-lang-feed.sh)

Like `open`, `http get` parses the response when its content type names a format Nu knows, such as JSON or XML. The [HTTP cookbook](/cookbook/http.md) covers headers, authentication, error statuses, and sending data with `http post`.

## Saving data

[`save`](/commands/docs/save.md) writes its input to a file. It converts structured data with the `to` command that matches the file's extension, which it finds the same way `open` finds a `from` command. A record saved to a file named like `.env` or `.env.local` is written with `to dotenv`.

```nu
[[name age]; [Alice 30] [Bob 25]] | save people.json
open --raw people.json
# => [
# =>   {
# =>     "name": "Alice",
# =>     "age": 30
# =>   },
# =>   {
# =>     "name": "Bob",
# =>     "age": 25
# =>   }
# => ]
```

Strings and binary data are written as they are. A string that already holds JSON goes into a `.json` file unchanged. `--raw` (`-r`) skips the conversion for other input as well, and a list is then written with one item per line. Structured data that has no matching `to` command fails with an error that suggests converting it first, for example with `to json`.

`save` doesn't replace a file that exists. It fails with a `Destination file already exists` error instead. Use `--force` (`-f`) to overwrite the file, or `--append` (`-a`) to add to its end. `--force` also creates missing parent directories; without it, a missing directory is a `Directory not found` error.

::: warning
Don't save to the file the pipeline is reading from. `save` empties the file before it writes, so the rest of the data still streaming in from that file is lost. `save` catches the simplest case, `open --raw notes.txt | save -f notes.txt`, with a `pipeline input and output are the same file` error. It can't tell when another command sits in between: `open notes.txt | lines | where $it != "" | save -f notes.txt` leaves `notes.txt` empty. Put [`collect`](/commands/docs/collect.md) before `save` so the whole file is read first:

```nu
open notes.txt | lines | where $it != "" | collect | save -f notes.txt
```

When `open` parses the file into a value, as with `open Cargo.toml`, the whole file has been read before `save` starts, so no `collect` is needed.
:::

When the input comes from an external command, `--stderr <file>` (`-e`) writes the command's stderr to a second file while its stdout goes to the first. Naming the same file for both is an error, and the error suggests the `o+e>` [redirection](stdout_stderr_exit_codes.md#file-redirections) instead.

```nu
^cargo build | save build.log --stderr build-errors.log
```

`--progress` (`-p`) shows a progress bar while a stream is written, such as the output of `open --raw` on a large file or a download from `http get`. The bar shows the total size when it's known, and only the bytes written so far when it isn't.
