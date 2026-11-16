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

Nu currently supports the following formats. The [`from`](/commands/docs/from.md) subcommands parse text in a format into structured data, and `open` runs them for you. The [`to`](/commands/docs/to.md) subcommands go the other way, turning structured data into text, or into binary for MessagePack, and [`save`](#saving-data) runs them for you.

| Format                                                                | Read with                                                                                            | Write with                                                                                   |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [CSV](./data_formats.md#csv-and-tsv)                                  | [`from csv`](/commands/docs/from_csv.md)                                                             | [`to csv`](/commands/docs/to_csv.md)                                                         |
| [dotenv](./data_formats.md#dotenv) (`.env`, `.env.local`, `prod.env`) | [`from dotenv`](/commands/docs/from_dotenv.md)                                                       | [`to dotenv`](/commands/docs/to_dotenv.md)                                                   |
| eml (plugin)                                                          | [`from eml`](/commands/docs/from_eml.md)                                                             |                                                                                              |
| [HTML](./data_formats.md#html)                                        |                                                                                                      | [`to html`](/commands/docs/to_html.md)                                                       |
| ics (plugin)                                                          | [`from ics`](/commands/docs/from_ics.md)                                                             |                                                                                              |
| ini (plugin)                                                          | [`from ini`](/commands/docs/from_ini.md)                                                             |                                                                                              |
| [JSON](#json)                                                         | [`from json`](/commands/docs/from_json.md)                                                           | [`to json`](/commands/docs/to_json.md)                                                       |
| [KDL](#kdl)                                                           | [`from kdl`](/commands/docs/from_kdl.md)                                                             | [`to kdl`](/commands/docs/to_kdl.md)                                                         |
| [Markdown (md)](#markdown)                                            | [`from md`](/commands/docs/from_md.md)                                                               | [`to md`](/commands/docs/to_md.md)                                                           |
| [MessagePack](./data_formats.md#messagepack) (msgpack, msgpackz)      | [`from msgpack`](/commands/docs/from_msgpack.md), [`from msgpackz`](/commands/docs/from_msgpackz.md) | [`to msgpack`](/commands/docs/to_msgpack.md), [`to msgpackz`](/commands/docs/to_msgpackz.md) |
| [NUON](#nuon)                                                         | [`from nuon`](/commands/docs/from_nuon.md)                                                           | [`to nuon`](/commands/docs/to_nuon.md)                                                       |
| [ods](./data_formats.md#spreadsheets)                                 | [`from ods`](/commands/docs/from_ods.md)                                                             |                                                                                              |
| plist (plugin)                                                        | [`from plist`](/commands/docs/from_plist.md)                                                         | [`to plist`](/commands/docs/to_plist.md)                                                     |
| [SQLite databases](#sqlite)                                           | `open`                                                                                               | [`into sqlite`](/commands/docs/into_sqlite.md)                                               |
| ssv                                                                   | [`from ssv`](/commands/docs/from_ssv.md)                                                             |                                                                                              |
| [Plain text](./data_formats.md#plain-text) (txt)                      |                                                                                                      | [`to text`](/commands/docs/to_text.md), [`to txt`](/commands/docs/to_txt.md)                 |
| [TOML](#toml)                                                         | [`from toml`](/commands/docs/from_toml.md)                                                           | [`to toml`](/commands/docs/to_toml.md)                                                       |
| [TSV](./data_formats.md#csv-and-tsv)                                  | [`from tsv`](/commands/docs/from_tsv.md)                                                             | [`to tsv`](/commands/docs/to_tsv.md)                                                         |
| [url (query strings)](./data_formats.md#url-query-strings)            | [`from url`](/commands/docs/from_url.md)                                                             |                                                                                              |
| vcf (plugin)                                                          | [`from vcf`](/commands/docs/from_vcf.md)                                                             |                                                                                              |
| [xlsx](./data_formats.md#spreadsheets)                                | [`from xlsx`](/commands/docs/from_xlsx.md)                                                           |                                                                                              |
| [XML](./data_formats.md#xml)                                          | [`from xml`](/commands/docs/from_xml.md)                                                             | [`to xml`](/commands/docs/to_xml.md)                                                         |
| [YAML (yaml, yml)](#yaml)                                             | [`from yaml`](/commands/docs/from_yaml.md), [`from yml`](/commands/docs/from_yml.md)                 | [`to yaml`](/commands/docs/to_yaml.md), [`to yml`](/commands/docs/to_yml.md)                 |

The eml, ics, ini, plist, and vcf formats are provided by the `formats` [core plugin](./plugins.md#the-formats-plugin).

The format names in the table link to notes on how each one reads and writes data. JSON, NUON, Markdown, KDL, TOML, and YAML are covered further down this page. The others are in [Data Formats](./data_formats.md), which also covers base64, hex, and the other ways to write binary data as text.

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

`open` can't open a directory. It fails with an `Is a directory` error. Use [`ls`](/commands/docs/ls.md) to see what's inside.

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

[`from nuon`](/commands/docs/from_nuon.md) reads NUON text back into values, and `open` uses it for `.nuon` files. Because NUON is Nushell syntax, it keeps the types that JSON has no way to write:

```nu
'{size: 1.5kb, wait: 90sec, when: 2024-01-02, data: 0x[ff], path: $.a.0, steps: 1..3}' | from nuon | describe
# => record<size: filesize, wait: duration, when: datetime, data: binary, path: cell-path, steps: range>
```

`from nuon` reads data, never code. A variable, a subexpression, a closure, or a command call is an error that points at the part it can't load:

```nu
'{name: nu, home: $env.HOME}' | from nuon
# => Error: nu::shell::error
# =>
# =>   × error when loading nuon text
# =>    ╭─[repl_entry #1:1:33]
# =>  1 │ '{name: nu, home: $env.HOME}' | from nuon
# =>    ·                                 ────┬────
# =>    ·                                     ╰── could not load nuon text
# =>    ╰────
# =>
# => Error: nu::shell::outsidespan
# =>
# =>   × Error when loading
# =>    ╭────
# =>  1 │ {name: nu, home: $env.HOME}
# =>    ·                  ────┬────
# =>    ·                      ╰── subexpressions and cellpaths not supported in nuon
# =>    ╰────
```

The text has to hold one value. Two values in a row, such as `{a: 1} {b: 2}`, fail with `error when parsing nuon text`, and so does a table row with too few cells. A record that names a field twice fails with `Record field or table column used twice`. That error also prints the environment variables of the `nu` process, which can include secrets, so check it before you share it. A file size or duration too large for 64 bits fails with `filesize too large` or `duration too large`. Empty text gives `null`.

## Notes on specific formats

### JSON

[`from json`](/commands/docs/from_json.md) reads more than strict JSON. Like [Hjson](https://hjson.github.io/), it accepts comments that start with `//`, `#`, or `/*`, trailing commas, keys without quotes, and line breaks in place of commas. That lets `open` read hand-edited files such as editor settings:

```nu
open --raw settings.json
# => {
# =>   // editor settings
# =>   "tabSize": 4,
# =>   "rulers": [80, 100,],  # trailing comma
# => }
open settings.json
# => ╭─────────┬────────────────╮
# => │ tabSize │ 4              │
# => │ rulers  │ [list 2 items] │
# => ╰─────────┴────────────────╯
```

Bare words are read as strings too, so `"not json" | from json` returns the string `not json` instead of failing. `--strict` (`-s`) follows the JSON specification exactly. Use it to check that text is valid JSON:

```nu
open --raw settings.json | from json --strict
# => Error: nu::shell::error
# =>
# =>   × Error while parsing JSON text
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ open --raw settings.json | from json --strict
# =>    · ──┬─
# =>    ·   ╰── error parsing JSON text
# =>    ╰────
# =>
# => Error: nu::shell::outsidespan
# =>
# =>   × Error while parsing JSON text
# =>    ╭─[2:3]
# =>  1 │ {
# =>  2 │   // editor settings
# =>    ·   ┬
# =>    ·   ╰── key must be a string at line 2 column 3
# =>  3 │   "tabSize": 4,
# =>    ╰────
```

A whole number becomes an int when it fits in 64 bits and a float when it doesn't, and a number with a decimal point or an exponent is always a float. Strings stay strings even when they hold a date, so convert those with [`into datetime`](/commands/docs/into_datetime.md). Empty input gives `null`.

Log files and streaming APIs often write one JSON value per line, a format called JSON Lines or NDJSON. Plain `from json` fails on it with `trailing characters` at the second value. `--objects` (`-o`) reads each line as a separate value, skips blank lines, and returns a list:

```nu
open --raw app.log
# => {"level": "info", "msg": "started"}
# =>
# => {"level": "warn", "msg": "disk almost full"}
open app.log | from json --objects
# => ╭───┬───────┬──────────────────╮
# => │ # │ level │       msg        │
# => ├───┼───────┼──────────────────┤
# => │ 0 │ info  │ started          │
# => │ 1 │ warn  │ disk almost full │
# => ╰───┴───────┴──────────────────╯
```

With `--objects`, a value can't span lines, and a line that fails to parse is an error when the list reaches it. The list is a stream, read line by line as later commands ask for items, so `from json --objects | first 10` stops reading after ten values. `--objects` takes text, such as a string or the output of an external command, and fails on binary data. The [`std/formats`](./standard_library/formats.md) module wraps it as `from jsonl` and `from ndjson`, so that `open` parses `.jsonl` and `.ndjson` files.

[`to json`](/commands/docs/to_json.md) writes JSON, indented with two spaces. `--indent` (`-i`) sets the number of spaces, and `--tabs` (`-t`) indents with that many tabs instead. `--raw` (`-r`) leaves out all the whitespace. `--raw` wins over the other two, and `--tabs` wins over `--indent`. The text never ends with a newline.

```nu
{name: nu, tags: [a b]} | to json --raw
# => {"name":"nu","tags":["a","b"]}
{name: nu, tags: [a b]} | to json --indent 4
# => {
# =>     "name": "nu",
# =>     "tags": [
# =>         "a",
# =>         "b"
# =>     ]
# => }
```

JSON has fewer types than Nushell, so `to json` writes some values as plain numbers or strings, and `from json` reads them back as those, not as the original types:

| Nushell value        | JSON                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| filesize             | number of bytes                                                                                  |
| duration             | number of nanoseconds                                                                            |
| datetime             | RFC 3339 string, such as `"2025-04-18T16:00:00+00:00"`                                           |
| binary               | list of byte values                                                                              |
| range                | list of its numbers when it's the whole input, a string such as `"1..3"` inside a list or record |
| glob, cell path      | string                                                                                           |
| `NaN`, `inf`, `-inf` | `null`                                                                                           |
| closure              | an error, unless you add `--serialize`                                                           |

```nu
{size: 1kb, wait: 2sec, when: 2025-04-18T16:00:00Z, data: 0x[01 ff]} | to json --raw
# => {"size":1000,"wait":2000000000,"when":"2025-04-18T16:00:00+00:00","data":[1,255]}
```

A closure fails with `closures are currently not deserializable`. `--serialize` (`-s`) writes its source code as a string instead, as in `{"inc":"{|x| $x + 1}"}`, and `from json` reads that back as a string. [NUON](#nuon) keeps all of these types except globs and closures.

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

[`to md`](/commands/docs/to_md.md) goes the other way, but it doesn't rebuild a document from the rows `from md` returns. It writes a table as a Markdown table. `--pretty` (`-p`) pads the columns so they line up in the source, and `--center` (`-c`) takes a list of columns to center:

```nu
[[name size]; [a.txt 1kb] [notes.md 22kb]] | to md
# => | name | size |
# => | --- | --- |
# => | a.txt | 1.0 kB |
# => | notes.md | 22.0 kB |
[[name size]; [a.txt 1kb] [notes.md 22kb]] | to md --pretty --center [size]
# => | name     |  size   |
# => | -------- |:-------:|
# => | a.txt    | 1.0 kB  |
# => | notes.md | 22.0 kB |
```

Each cell holds the value as text. A nested list or record is written in NUON-like form, such as `[x, y]`, a line break becomes a `<br>` tag, and a `|` or `\` is escaped with a backslash so it doesn't break the table:

```nu
[[name tags note]; [a.txt [x y] "first\nsecond"] ["b|c.txt" [] ""]] | to md
# => | name | tags | note |
# => | --- | --- | --- |
# => | a.txt | [x, y] | first<br>second |
# => | b\|c.txt | [] |  |
```

A list of plain values becomes a bulleted list. `--list ordered` (`-l`) numbers the items, `--list none` writes one item per line without a marker, and `--list unordered` is the default. Any other style is an `Invalid value` error. A single plain value, such as a string, becomes a list of one item, `* done`.

A list of records is one table, even if some records stand for a heading. `--per-element` (`-e`) writes each item of the list as its own element instead. A record with a single `h1`, `h2`, `h3`, or `blockquote` field, in any case, becomes that heading or a quote, consecutive records with the same columns become one table, and other values become list items:

```nu
[{h1: Report} {blockquote: "Made with Nushell"} {h2: Files} {name: a.txt, size: 1kb} {name: b.txt, size: 2kb} {h2: Tags} cli shell] | to md --per-element
# => # Report
# => > Made with Nushell
# => ## Files
# => | name | size |
# => | --- | --- |
# => | a.txt | 1.0 kB |
# => | b.txt | 2.0 kB |
# =>
# => ## Tags
# => * cli
# => * shell
```

The text in cells and items is otherwise written as it is, so Markdown or HTML in your data takes effect when the result is rendered. `--escape-md` (`-m`) puts a backslash before Markdown punctuation, `--escape-html` (`-t`) turns `<`, `>`, `&`, quotes, and `/` into HTML entities, and `--escape-all` (`-a`) does both:

```nu
[[file note]; [my_notes.md "<b>see #3</b>"]] | to md --escape-md
# => | file | note |
# => | --- | --- |
# => | my\_notes\.md | \<b\>see \#3\</b\> |
[[file note]; [my_notes.md "<b>see #3</b>"]] | to md --escape-html
# => | file | note |
# => | --- | --- |
# => | my_notes.md | &lt;b&gt;see #3&lt;&#x2f;b&gt; |
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

A node with a type annotation, such as `(widget)button`, also gets a `type` column holding the annotation, `widget`. Rows for nodes without an annotation don't have that column.

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

`--format jik` fails on a document with more than one top-level node, and on an annotation it doesn't know. Add `--ignore-types` to read those as plain values.

`to kdl` does write nodes when its input came from `from kdl`. `from kdl` records the format and KDL version in the [pipeline metadata](metadata.md), and `to kdl` writes the rows back as nodes in that version, so you can change a document and save it:

```nu
'package name=nu version="0.116.0"' | from kdl | update 0.props.version 0.117.0 | to kdl
# => package name=nu version="0.117.0"
```

With `--format nodes` or `--format jik` you choose the format yourself, and with `--spec 1` or `--spec 2` the version. `--format nodes` needs rows with `name`, `args`, `props`, and `children` columns, or a single record with them. A row can also have a `type` column, which is written as the node's annotation, so `{name: n, args: [1], props: {}, children: [], type: t}` becomes `(t)n 1`. A missing column, any other column, or data that isn't node rows fails with an `Unsupported input` error that lists the columns a row may have. Any `--format` other than `nodes` or `jik` fails with `KDL --format must be 'nodes' or 'jik'`.

The values in `args` and `props` have to be plain values, and a nested list or record there fails with `nested list/record is not a KDL literal`. The one exception is a record with `value` and `type` keys, such as `{value: 1, type: u8}`, which is written as an annotated value, `(u8)1`. Both formats write dates, durations, file sizes, binary data, ranges, globs, and cell paths with the type annotations that `from kdl` reads back. `--spec 1` writes the KDL 1 keywords `true`, `false`, and `null` instead of `#true`, `#false`, and `#null`. Any other version fails with `KDL --spec must be 1 or 2`.

A closure can't be written as KDL and read back, so `to kdl` fails on one. `--non-roundtrip 'null'` writes `#null` in its place, and `--non-roundtrip lossy` writes its source code as a string, which is what `--serialize` (`-s`) does too. Put `'null'` in quotes. The flag takes a string, and a bare `null` is the null value, which fails with `expected string`. Another word fails with ``expected `error`, `null` or `lossy` ``, and `--serialize` together with `--non-roundtrip 'null'` is an `Incompatible parameters` error. The flag treats error values and plugin custom values the same way as closures.

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

[`to toml`](/commands/docs/to_toml.md) takes only a record, because a TOML document is a table of keys. A list or a table is an error. Nushell reports `Command does not support table<...> input`, or `list<...>`, when it knows the input type before the pipeline runs, and `Input type not supported` when it finds out at run time. Put it in a record, such as `{bins: $table} | to toml`, and it becomes an array of tables. A nested record becomes a `[section]`:

```nu
{name: demo, released: 2024-01-02T03:04:05Z, tags: [cli shell], deps: {serde: "1.0"}, bins: [[name path]; [a src/a.rs]]} | to toml
# => name = "demo"
# => released = 2024-01-02T03:04:05.0+00:00
# => tags = [
# =>     "cli",
# =>     "shell",
# => ]
# =>
# => [deps]
# => serde = "1.0"
# =>
# => [[bins]]
# => name = "a"
# => path = "src/a.rs"
```

TOML has no null and no type for durations or ranges, and `to toml` writes such values in forms that don't read back as the original type. `null` becomes the string `"<Nothing>"`, a duration a string holding its nanoseconds, a range the string `"<Range>"`, a file size an integer number of bytes, binary data a list of byte values, a cell path a list of its members, a glob a plain string, and a plugin's custom value the string `"<Custom Value>"`. Drop or convert those fields before you write the file:

```nu
{name: demo, timeout: 30sec, license: null} | to toml
# => name = "demo"
# => timeout = "30000000000"
# => license = "<Nothing>"
```

A closure is written as `closure_` and a number, or as its source code with `--serialize` (`-s`).

When the record came from opening a `.toml` file, `to toml` and `save` keep that file's comments and layout and change only the values that differ. The [pipeline metadata](metadata.md#data-source) remembers which file the data came from, and `--serialize` turns this off. Here only the version changes:

```nu
open --raw demo.toml
# => # Project settings
# => [package]
# => name = "demo"   # the crate name
# => version = "0.1.0"
open demo.toml | upsert package.version "0.2.0" | to toml
# => # Project settings
# => [package]
# => name = "demo"   # the crate name
# => version = "0.2.0"
```

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

[`from yml`](/commands/docs/from_yml.md) and [`to yml`](/commands/docs/to_yml.md) are `from yaml` and `to yaml` under another name, with the same flags. They exist so that `open` and `save` find a converter for files that end in `.yml`.

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

A table you `get` from a database isn't read right away. Commands such as `select`, `first`, and `length` become part of an SQL query that SQLite runs, as [Tables from a SQLite file](/lang-guide/chapters/filters/selecting_data.md#tables-from-a-sqlite-file) explains. To keep a database in memory instead of in a file, use the `stor` commands described in [Working with SQLite](./working_with_sqlite.md).

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

`query db` works the same way on the in-memory database that [`stor open`](/commands/docs/stor_open.md) returns, and fails on input that isn't a database, as [Working with SQLite](./working_with_sqlite.md#database-files-and-the-in-memory-database) explains.

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

Strings and byte streams, such as the output of `open --raw` or an external command, are written as they are. A string that already holds JSON goes into a `.json` file unchanged. Binary data is written as it is only when no `to` command matches the extension. Otherwise `save` converts it like any other value, so `0x[01 02] | save data.json` writes the JSON list `[1, 2]`, and the output of `to msgpack` saved to a `.msgpack` file is [encoded twice](./data_formats.md#messagepack). `--raw` (`-r`) skips the conversion for other input as well, and a list is then written with one item per line. Structured data that has no matching `to` command fails with an error that suggests converting it first, for example with `to json`.

`save` doesn't replace a file that exists. It fails with a `Destination file already exists` error instead. Use `--force` (`-f`) to overwrite the file, or `--append` (`-a`) to add to its end. `--force` also creates missing parent directories; without it, a missing directory is a `Directory not found` error.

::: warning
Don't save to the file the pipeline is reading from. `save` empties the file before it writes, so the rest of the data still streaming in from that file is lost. Put [`collect`](/commands/docs/collect.md) before `save` so the whole file is read first:

```nu
open notes.txt | lines | where $it != "" | collect | save -f notes.txt
```

When `open --raw` streams straight into `save`, as in `open --raw notes.txt | save -f notes.txt`, `save` stops with a `pipeline input and output are the same file` error that suggests the same fix.

When `open` parses the file into a value, as with `open Cargo.toml`, the whole file has been read before `save` starts, so no `collect` is needed.
:::

When the input comes from an external command, `--stderr <file>` (`-e`) writes the command's stderr to a second file while its stdout goes to the first. Naming the same file for both is an error, and the error suggests the `o+e>` [redirection](stdout_stderr_exit_codes.md#file-redirections) instead.

```nu
^cargo build | save build.log --stderr build-errors.log
```

`--progress` (`-p`) shows a progress bar while a stream is written, such as the output of `open --raw` on a large file or a download from `http get`. The bar shows the total size when it's known, and only the bytes written so far when it isn't.
