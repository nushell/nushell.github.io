# Data Formats

[Loading Data](./loading_data.md) lists the formats that Nushell reads and writes, and covers [NUON](./loading_data.md#nuon) and the [notes on specific formats](./loading_data.md#notes-on-specific-formats) for JSON, Markdown, KDL, TOML, and YAML. This page covers the rest: writing CSV and TSV, `.env` files, MessagePack, spreadsheets, URL query strings, XML, HTML, and plain text. The last section is about the commands that turn binary data into text and back.

[[toc]]

## CSV and TSV

[`to csv`](/commands/docs/to_csv.md) and [`to tsv`](/commands/docs/to_tsv.md) write a table or a record as delimited text, with a header line followed by one line per row. [`save`](/commands/docs/save.md) runs them for `.csv` and `.tsv` files. The flags for reading are explained in [Options for `from csv` and `from tsv`](./working_with_strings.md#options-for-from-csv-and-from-tsv).

The header lists every column that appears in any row, in the order the columns first appear. A row that lacks a column gets an empty field:

```nu
[{name: a.txt, size: 10} {name: b.txt, owner: me}] | to csv
# => name,size,owner
# => a.txt,10,
# => b.txt,,me
```

`--columns` picks the columns and their order, and a name that no row has gives an empty column. `--noheaders` (`-n`) leaves out the header line:

```nu
[{name: a.txt, size: 10} {name: b.txt, owner: me}] | to csv --columns [owner name] --noheaders
# => ,a.txt
# => me,b.txt
```

A field that holds the separator, a double quote, or a line break is written in double quotes, with each quote inside it doubled. [`from csv`](/commands/docs/from_csv.md) reads such a field back as one value:

```nu
let row = [{file: 'notes, final.txt', title: 'The "best" one'}]
$row | to csv
# => file,title
# => "notes, final.txt","The ""best"" one"
$row | to csv | from csv
# => ╭───┬──────────────────┬────────────────╮
# => │ # │       file       │     title      │
# => ├───┼──────────────────┼────────────────┤
# => │ 0 │ notes, final.txt │ The "best" one │
# => ╰───┴──────────────────┴────────────────╯
```

The input has to be a table or a record. A list of plain values fails with `Command does not support list<int> input`; give the values a column name first, as in `[1 2 3] | wrap n | to csv`.

Each field has to hold a simple value. `null` becomes an empty field, and a list or record inside a row is an error:

```nu
[{name: a.txt, tags: [x y]}] | to csv
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to string.
# =>    ╭─[repl_entry #1:1:22]
# =>  1 │ [{name: a.txt, tags: [x y]}] | to csv
# =>    ·                      ──┬──
# =>    ·                        ╰── can't convert list<string> to string
# =>    ╰────
# =>   help: only simple values are supported for CSV output
[{name: a.txt, tags: [x y]}] | update tags { str join ";" } | to csv
# => name,tags
# => a.txt,x;y
```

Durations, file sizes, and dates are written the way Nushell displays them, so `from csv` reads them back as strings. A date comes out like `Tue, 2 Jan 2024 03:04:05 +0000 (2 years ago)`, following `$env.config.datetime_format.normal`, and a file size follows the `$env.config.filesize` settings. Convert those columns yourself when another program will read the file, with [`format date`](/commands/docs/format_date.md) for dates and [`into int`](/commands/docs/into_int.md) for nanoseconds and bytes:

```nu
[{name: a.txt, took: 90sec, size: 1kb}] | to csv
# => name,took,size
# => a.txt,1min 30sec,1.0 kB
[{name: a.txt, took: 90sec, size: 1kb}] | update took { into int } | update size { into int } | to csv
# => name,took,size
# => a.txt,90000000000,1000
```

`--separator` (`-s`) sets the separator of `to csv` to one ASCII character. A longer string fails with `Expected a single separator char from --separator`, except `'\t'`, which means a tab. `to tsv` is the tab-separated form and has no `--separator` flag.

When the input is a stream, such as the output of [`each`](/commands/docs/each.md), `to csv` writes the header as soon as the first row arrives. A later row with a column the first row didn't have can't fit under that header, so the output stops with an error:

```nu
[{name: a.txt} {name: b.txt, owner: me}] | each { $in } | to csv
# => name
# => a.txt
# => Error: nu::shell::error
# =>
# =>   × streamed csv schema changed: new column 'owner' appeared after output
# =>   │ started
# =>    ╭─[repl_entry #1:1:59]
# =>  1 │ [{name: a.txt} {name: b.txt, owner: me}] | each { $in } | to csv
# =>    ·                                                           ───┬──
# =>    ·                                                              ╰── CSV output started with a specific set of columns, but a later row contains an unexpected column.
# =>    ╰────
# =>   help: use `to csv --columns [...]` or `collect` before `to csv`
```

As the help says, list the columns with `--columns`, or put [`collect`](/commands/docs/collect.md) before `to csv` so that it sees every row first. A table that is already a value, like the literals in the other examples, isn't a stream.

## dotenv

A `.env` file holds `KEY=value` lines that set environment variables. [`open`](/commands/docs/open.md) reads files named `.env`, `.env.local`, or `prod.env` with [`from dotenv`](/commands/docs/from_dotenv.md), which returns a record, and [`load-env`](/commands/docs/load-env.md) puts that record into the environment:

```nu
open --raw .env
# => # database settings
# => export DB_HOST=localhost
# => DB_PORT=5432
# => DB_URL="postgres://${DB_HOST}:${DB_PORT}/app"
# => GREETING='Hello, $USER'
# => TIMEOUT=${NU_DOCS_TIMEOUT:-30}   # seconds
open .env
# => ╭──────────┬───────────────────────────────╮
# => │ DB_HOST  │ localhost                     │
# => │ DB_PORT  │ 5432                          │
# => │ DB_URL   │ postgres://localhost:5432/app │
# => │ GREETING │ Hello, $USER                  │
# => │ TIMEOUT  │ 30                            │
# => ╰──────────┴───────────────────────────────╯
open .env | load-env
$env.DB_URL
# => postgres://localhost:5432/app
```

`from dotenv` reads the file the way a shell would source it, but it never runs anything. A line may start with `export`, and `#` starts a comment at the start of a line or after a blank in an unquoted value. `${NAME}` and `$NAME` in an unquoted or double-quoted value expand to an earlier key in the file or to an environment variable, and single quotes or `\$` keep a `$` as written. A `$` that no name follows, as in `$5` or `$(whoami)`, stays as it is. The `sh` forms with a fallback work too. `${NAME:-word}` gives `word` when NAME is unset or empty and `${NAME-word}` only when it's unset, while `${NAME:+word}` gives `word` when NAME is set and not empty and `${NAME+word}` when it's set at all. Keys ignore case, as in `$env`, so `a=2` after `A=1` sets `A` again. The [`from dotenv` reference](/commands/docs/from_dotenv.md) has more examples.

Every value comes back as a string, `DB_PORT` included. Convert the ones you need with commands such as [`into int`](/commands/docs/into_int.md), as in `open .env | into int DB_PORT`.

A `.env` file that is really a shell script, such as an autoenv file, fails on its first line that isn't an assignment:

```nu
"source venv/bin/activate" | from dotenv
# => Error: nu::shell::error
# =>
# =>   × Error while parsing .env text
# =>    ╭─[repl_entry #1:1:30]
# =>  1 │ "source venv/bin/activate" | from dotenv
# =>    ·                              ─────┬─────
# =>    ·                                   ╰── expected `=` after the variable name
# =>    ╰────
# =>   help: a .env file holds `KEY=value` lines; a shell script, such as an
# =>         autoenv `.env` file, isn't one
```

An unclosed quote and text after a closing quote, as in `A="x" y`, are errors too.

[`to dotenv`](/commands/docs/to_dotenv.md) writes a record as `.env` text, and `save` uses it for a record saved to a file named like `.env`. Each value is written the way an external command would see it as an environment variable, so any `to_string` conversion in `$env.ENV_CONVERSIONS` applies. Numbers, booleans, and dates become their text, `null` becomes an empty value, binary data that is valid UTF-8 becomes that text, and `PATH` is joined with the path separator (`:`, or `;` on Windows). A plain value is written bare, one with spaces or other special characters in single quotes, and one holding a `'` or a line break in double quotes with escapes, so `from dotenv` reads back the same strings:

```nu
{PORT: 8080, NAME: "my app", DEBUG: true, EMPTY: null, PATH: [/usr/bin /bin], NOTE: "it's two\nlines"} | to dotenv
# => PORT=8080
# => NAME='my app'
# => DEBUG=true
# => EMPTY=
# => PATH=/usr/bin:/bin
# => NOTE="it's two\nlines"
```

A value that has no text form, such as a record, a duration, other binary data, or a list under any name other than `PATH`, fails:

```nu
{name: nu, tags: [a b]} | to dotenv
# => Error: nu::shell::error
# =>
# =>   × Can't write `tags` as .env text
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ {name: nu, tags: [a b]} | to dotenv
# =>    ·                  ──┬──
# =>    ·                    ╰── list has no text form
# =>    ╰────
# =>   help: select the variables to write, or convert this one to a string
```

A key has to start with a letter or `_` and hold only letters, digits, `_`, `.`, and `-`. Any other key, such as `my key`, fails with a `not a .env variable name` error.

## MessagePack

[MessagePack](https://msgpack.org/) is a binary format with the same shape as JSON, written in fewer bytes. [`to msgpack`](/commands/docs/to_msgpack.md) returns binary data, and [`from msgpack`](/commands/docs/from_msgpack.md) reads binary data or a byte stream, such as `open --raw`. `open` and `save` run them for `.msgpack` files:

```nu
[[name size]; [a.txt 10] [b.txt 20]] | save data.msgpack
open data.msgpack
# => ╭───┬───────┬──────╮
# => │ # │ name  │ size │
# => ├───┼───────┼──────┤
# => │ 0 │ a.txt │   10 │
# => │ 1 │ b.txt │   20 │
# => ╰───┴───────┴──────╯
```

Give `save` the data, not the output of `to msgpack`. `save` converts binary data too, so `to msgpack | save data.msgpack` encodes the data twice, and `open` returns the inner MessagePack as binary. Use `save --raw` if you have already converted it.

Values that MessagePack has a type for come back as the same type: strings, numbers, booleans, `null`, binary data, lists, and records. A date is written with the MessagePack timestamp extension and comes back in UTC. The other Nushell types are written as something simpler, and `from msgpack` doesn't turn them back:

| Nushell value | Written as                                          | Read back as |
| ------------- | --------------------------------------------------- | ------------ |
| duration      | integer number of nanoseconds                       | int          |
| filesize      | integer number of bytes                             | int          |
| range         | array of its values                                 | list         |
| cell path     | array of its members                                | list         |
| glob          | string                                              | string       |
| closure       | error, or with `--serialize` its source as a string | string       |

```nu
{name: nu, when: 2024-01-02T03:04:05Z, took: 90sec, size: 1kb, data: 0x[ff 00], path: $.a.0} | to msgpack | from msgpack | to nuon
# => {name: nu, when: 2024-01-02T03:04:05+00:00, took: 90000000000, size: 1000, data: 0x[FF00], path: [a, 0]}
```

`from msgpack` reads one value and expects the data to end there. To read several values written one after another, use `--objects`, which returns them as a list:

```nu
[1 2] | to msgpack | bytes add --end ([3] | to msgpack) | from msgpack --objects | to nuon
# => [[1, 2], [3]]
```

Without `--objects`, the same input fails with `Additional data after end of MessagePack object`. Other errors you may see: data that is cut short fails with `Error while reading MessagePack data`, a map whose keys aren't strings with `Invalid non-string value in MessagePack map`, an extension type other than the timestamp with `Unknown MessagePack extension`, an unsigned integer above the largest int with `MessagePack integer too big for Nushell`, a timestamp outside the date range with `Invalid MessagePack timestamp`, a string that isn't valid UTF-8 with `Non-UTF8 string`, a reserved type byte with `Invalid marker while reading MessagePack data`, and data nested more than 50 levels deep with `MessagePack data is nested too deeply`, in either direction.

### Compressed MessagePack (msgpackz)

[`to msgpackz`](/commands/docs/to_msgpackz.md) and [`from msgpackz`](/commands/docs/from_msgpackz.md) are the same format compressed with [Brotli](https://github.com/google/brotli). Nushell stores its plugin registry, the file at `$nu.plugin-path`, this way, so `open $nu.plugin-path` shows what `plugin add` has recorded:

```nu
open $nu.plugin-path | columns
# => ╭───┬─────────────────╮
# => │ 0 │ nushell_version │
# => │ 1 │ plugins         │
# => ╰───┴─────────────────╯
```

`--quality` (`-q`) is Brotli's compression level, from 0 to 11, with a default of 3. `--window-size` (`-w`) is the base 2 logarithm of the compression window, from 10 to 24, with a default of 20. A value above or below those ranges acts as the nearest end, and a negative number fails with `can't convert int to u32`. A higher quality doesn't always give smaller output, so measure with [`bytes length`](/commands/docs/bytes_length.md) if size matters:

```nu
let rows = 1..1000 | each {|n| {n: $n, s: hello} }
$rows | to msgpack | bytes length
# => 13621
$rows | to msgpackz | bytes length
# => 1016
```

`--serialize` and `--objects` work as they do for `msgpack`. Reading plain MessagePack with `from msgpackz` fails with `Error while reading MessagePack data` and the label `Invalid Data`.

## Spreadsheets

[`from xlsx`](/commands/docs/from_xlsx.md) reads Excel workbooks and [`from ods`](/commands/docs/from_ods.md) reads OpenDocument spreadsheets, such as those from LibreOffice. Both take binary data and return a record with one table per sheet, so `open` on a `.xlsx` or `.ods` file gives you the sheets by name. Nushell can't write either format; save the table as CSV instead.

```nu
open sales.xlsx | columns
# => ╭───┬───────────────╮
# => │ 0 │ Instructions  │
# => │ 1 │ SalesOrders   │
# => │ 2 │ SampleNumbers │
# => │ 3 │ MyLinks       │
# => ╰───┴───────────────╯
open sales.xlsx | get SalesOrders | first 2 | select Region Rep Units Total
# => ╭───┬─────────┬────────┬───────┬────────╮
# => │ # │ Region  │  Rep   │ Units │ Total  │
# => ├───┼─────────┼────────┼───────┼────────┤
# => │ 0 │ East    │ Jones  │ 95.00 │ 189.05 │
# => │ 1 │ Central │ Kivell │ 50.00 │ 999.50 │
# => ╰───┴─────────┴────────┴───────┴────────╯
```

The flags go on the `from` command, so read the file with `open --raw` to use them. `--sheets` (`-s`) takes a list of sheet names and reads only those. The names are case-sensitive, and a name the workbook doesn't have is skipped without an error, so a typo gives you an empty record.

Spreadsheets store most numbers as floats, so a count such as `Units` above is `95.0`. `--prefer-integers` (`-i`) turns every float without a fractional part into an int and leaves the others alone:

```nu
open --raw sales.xlsx | from xlsx --sheets [SalesOrders] --prefer-integers | get SalesOrders | first 2 | select Region Rep Units Total
# => ╭───┬─────────┬────────┬───────┬────────╮
# => │ # │ Region  │  Rep   │ Units │ Total  │
# => ├───┼─────────┼────────┼───────┼────────┤
# => │ 0 │ East    │ Jones  │    95 │ 189.05 │
# => │ 1 │ Central │ Kivell │    50 │ 999.50 │
# => ╰───┴─────────┴────────┴───────┴────────╯
```

Cells become strings, ints, floats, and booleans. A date or date-time cell becomes a date in your local time zone, since spreadsheets don't store one, and a duration cell becomes a duration. Empty cells and cells holding an error such as `#DIV/0!` become `null`.

The first row that isn't empty supplies the column names, and an empty header cell is named after its position, such as `column1`. `--noheaders` (`-n`) keeps that row as data and names every column `column0`, `column1`, and so on. `--first-row` (`-f`) starts reading at a row number counted from 0, which helps when a sheet has a title above its table:

```nu
open people.xlsx | get Sheet1
# => ╭───┬─────────┬─────────┬─────────┬─────────╮
# => │ # │ header0 │ column1 │ header2 │ column3 │
# => ├───┼─────────┼─────────┼─────────┼─────────┤
# => │ 0 │ r1c0    │ r1c1    │ r1c2    │ r1c3    │
# => │ 1 │ r2c0    │ r2c1    │ r2c2    │ r2c3    │
# => ╰───┴─────────┴─────────┴─────────┴─────────╯
open --raw people.xlsx | from xlsx --first-row 1 | get Sheet1
# => ╭───┬──────┬──────┬──────┬──────╮
# => │ # │ r1c0 │ r1c1 │ r1c2 │ r1c3 │
# => ├───┼──────┼──────┼──────┼──────┤
# => │ 0 │ r2c0 │ r2c1 │ r2c2 │ r2c3 │
# => ╰───┴──────┴──────┴──────┴──────╯
```

Data that isn't a workbook of the right kind, such as an `.ods` file given to `from xlsx`, fails with `Could not load XLSX file` (or `Could not load ODS file`).

## URL query strings

[`from url`](/commands/docs/from_url.md) parses the query part of a URL, the `key=value` pairs joined by `&`, into a record. It decodes `+` and `%` escapes, and every value is a string:

```nu
"q=hello+world&lang=nu&page=2&empty=" | from url
# => ╭───────┬─────────────╮
# => │ q     │ hello world │
# => │ lang  │ nu          │
# => │ page  │ 2           │
# => │ empty │             │
# => ╰───────┴─────────────╯
```

It expects only the query. Given a whole URL, it takes everything before the first `=` as the first key, `https://example.com/search?q` in this case. Take the query out with [`url parse`](/commands/docs/url_parse.md) first:

```nu
"https://example.com/search?q=nu&page=2" | url parse | get query | from url
# => ╭──────┬────╮
# => │ q    │ nu │
# => │ page │ 2  │
# => ╰──────┴────╯
```

A key that appears more than once, as in `tag=a&tag=b`, becomes a record with the same column twice, and `get tag` returns only the last value. [`url split-query`](/commands/docs/url_split-query.md) returns a table of `key` and `value` rows instead, which keeps every value:

```nu
"tag=a&tag=b" | url split-query
# => ╭───┬─────┬───────╮
# => │ # │ key │ value │
# => ├───┼─────┼───────┤
# => │ 0 │ tag │ a     │
# => │ 1 │ tag │ b     │
# => ╰───┴─────┴───────╯
```

There is no `to url`. [`url build-query`](/commands/docs/url_build-query.md) does the reverse: `{q: "hello world", lang: nu} | url build-query` returns `q=hello+world&lang=nu`.

## XML

[`from xml`](/commands/docs/from_xml.md) turns an XML document into nested records, one for each element, with three fields:

- `tag` is the element name.
- `attributes` is a record of the attribute values, all strings.
- `content` is a table of what the element contains, in the same form. Text is a row whose `tag` and `attributes` are `null` and whose `content` is the text.

Take this file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- generated nightly -->
<menu xmlns:m="https://example.com/menu">
  <!-- prices in euros -->
  <item id="1" m:price="9.50">Fish &amp; chips</item>
  <item id="2" m:price="2.00"><![CDATA[Tea <hot>]]></item>
</menu>
```

```nu
open menu.xml
# => ╭────────────┬───────────────────╮
# => │ tag        │ menu              │
# => │ attributes │ {record 0 fields} │
# => │ content    │ [table 2 rows]    │
# => ╰────────────┴───────────────────╯
open menu.xml | get content | each {|item| {id: $item.attributes.id, price: ($item.attributes.price | into float), name: $item.content.0.content} }
# => ╭───┬────┬───────┬──────────────╮
# => │ # │ id │ price │     name     │
# => ├───┼────┼───────┼──────────────┤
# => │ 0 │ 1  │  9.50 │ Fish & chips │
# => │ 1 │ 2  │  2.00 │ Tea <hot>    │
# => ╰───┴────┴───────┴──────────────╯
```

The example shows what `from xml` keeps and what it drops:

- The result is the root element. The XML declaration and anything else outside the root, such as the first comment, are dropped.
- Namespace prefixes are removed from element and attribute names, so `m:price` is `price`, and `xmlns` declarations don't appear in `attributes`.
- Entities such as `&amp;` are decoded, and CDATA sections become ordinary text.
- Text is trimmed, and text that is only whitespace, such as the line breaks between elements, is dropped.
- Comments and processing instructions inside the root are dropped, unless you ask for them. `--keep-comments` adds each comment as a row with the `tag` `!`, and `--keep-pi` adds each processing instruction as a row whose `tag` is `?` followed by its target, such as `?render` for `<?render fast?>`.

A document with a DTD (a `<!DOCTYPE ...>` with declarations) is rejected, because expanding its entities can take exponential time and memory. Use `--allow-dtd` only for files you trust:

```nu
'<!DOCTYPE note [<!ENTITY who "Nu">]><note>Hi &who;</note>' | from xml
# => Error: nu::shell::error
# =>
# =>   × Failed to parse XML
# =>    ╭─[repl_entry #1:1:63]
# =>  1 │ '<!DOCTYPE note [<!ENTITY who "Nu">]><note>Hi &who;</note>' | from xml
# =>    ·                                                               ────┬───
# =>    ·                                                                   ╰─┤ XML document with DTD detected.
# =>    ·                                                                     │ DTDs are disabled by default to prevent denial-of-service attacks (use `from xml --allow-dtd` to bypass this functionality)
# =>    ╰────
'<!DOCTYPE note [<!ENTITY who "Nu">]><note>Hi &who;</note>' | from xml --allow-dtd | to nuon
# => {tag: note, attributes: {}, content: [[tag, attributes, content]; [null, null, "Hi Nu"]]}
```

Other malformed XML fails with `Failed to parse XML` and a description of the problem, such as `Unexpected close tag a, expected b` for `<a><b></a>`.

[`to xml`](/commands/docs/to_xml.md) takes a record in the same form and writes it out on one line. You can leave out a field that is `null`, an empty record, or an empty list, and write text as a plain string instead of a record. `--indent` (`-i`) puts each element on its own line, indented by that many spaces, and a negative number fails with `use a positive value`:

```nu
let books = [[title year]; [Dune 1965] [Vendredi 1967]]
{tag: library, content: ($books | each {|b| {tag: book, attributes: {year: ($b.year | into string)}, content: [$b.title]} })} | to xml --indent 2
# => <library>
# =>   <book year="1965">Dune</book>
# =>   <book year="1967">Vendredi</book>
# => </library>
```

Attribute values and text have to be strings, which is why the example converts `year`. Anything else fails with `Can't convert to XML` and a help line that says what was expected:

```nu
{tag: book, attributes: {year: 1965}} | to xml
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to XML.
# =>    ╭─[repl_entry #1:1:32]
# =>  1 │ {tag: book, attributes: {year: 1965}} | to xml
# =>    ·                                ──┬─
# =>    ·                                  ╰── can't convert int to XML
# =>    ╰────
# =>   help: Attribute value expected to be a string
```

The input is one record, the root element. A list fails, and so does a record with fields other than `tag`, `attributes`, and `content`, or a root that is text, a comment, or a processing instruction. To write a comment or a processing instruction inside the document, add a row with the `tag` `!` or `?target`, as `from xml` produces them.

`to xml` escapes `<`, `>`, `&`, `'`, and `"` in text and attribute values. `--partial-escape` (`-p`) escapes only what XML requires, which leaves quotes in text alone:

```nu
{tag: p, content: ["it's <b>"]} | to xml
# => <p>it&apos;s &lt;b&gt;</p>
{tag: p, content: ["it's <b>"]} | to xml --partial-escape
# => <p>it's &lt;b&gt;</p>
```

`--self-closed` (`-s`) writes an element with no content as `<br/>` instead of `<br></br>`. `to xml` writes no XML declaration, so a file read and written back loses it, along with the namespace prefixes and CDATA sections. The [`std/xml`](./standard_library/xml.md) module has commands for finding and changing elements in this form.

## HTML

[`to html`](/commands/docs/to_html.md) writes its input as an HTML page. A table, or a record, becomes an HTML `table` with a header row, a list of other values becomes a numbered `ol` list, and a single value becomes text. `--partial` (`-p`) leaves out the `html` and `body` tags and wraps the result in a `div` instead, for pasting into a page of your own:

```nu
[[name size]; ["a.txt" 1kb] ["<b>.txt" 22kb]] | to html --partial
# => <div style="background-color:white;color:black;"><table><thead><tr><th>name</th><th>size</th></tr></thead><tbody><tr><td>a.txt</td><td>1.0 kB</td></tr><tr><td>&lt;b&gt;.txt</td><td>22.0 kB</td></tr></tbody></table></div>
```

Each cell holds the value as the terminal shows it, so a nested list is written as `[list 2 items]` and not as a nested table. Line breaks become `br` tags, and binary data becomes a hex dump in a `pre` block. The dump carries the terminal's color codes, which `--no-color` removes. `to html` escapes `<`, `>`, `&`, quotes, and `/` in the values. `--raw` (`-r`) writes them unescaped, which is how you put HTML you already have, such as the output of `to xml`, into the page.

The page is black text on white. `--dark` (`-d`) swaps the two. `--theme` (`-t`) takes the colors from one of the 228 terminal color schemes that Nushell includes, named without regard to case. The page uses the scheme's `white` and `black` colors, not its `background` and `foreground`, so a dark scheme gives a light page unless you add `--dark`:

```nu
"Total: 3" | to html --partial --theme dracula
# => <div style="background-color:#bbbbbb;color:#000000;">Total: 3</div>
"Total: 3" | to html --partial --theme dracula --dark
# => <div style="background-color:#000000;color:#bbbbbb;">Total: 3</div>
```

`--list` (`-l`) returns the schemes as a table, with a `name` column and a column for each color, and ignores the input. A name that isn't in the list fails with `Unknown HTML theme`. Screenshots of the schemes are in the [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) repository.

Strings that hold ANSI color codes, such as the output of [`ansi`](/commands/docs/ansi.md), keep them as raw escape characters unless you pick a flag. `--no-color` (`-n`) removes them:

```nu
$"(ansi red)failed(ansi reset) 2 tests" | to html --partial --no-color
# => <div style="background-color:white;color:black;">failed 2 tests</div>
```

`--html-color` (`-c`) replaces the eight basic colors and their bold forms with `span` tags in the theme's colors. The tags aren't closed where each color ends. They all close at the end of the output, after the closing `div` tag, so the result isn't well-formed HTML.

## Plain text

[`to txt`](/commands/docs/to_txt.md) is [`to text`](/commands/docs/to_text.md) under the name that `save` looks for, so saving structured data to a `.txt` file writes it as text instead of failing. [Output Result to External Commands](./pipelines.md#output-result-to-external-commands) explains how `to text` writes lists, records, and tables:

```nu
{name: nu, version: "0.117.0"} | save info.txt
open info.txt
# => name: nu
# => version: 0.117.0
```

## Binary data as text

Some formats need binary data written as plain text, such as an image in a data URL, a key in a config file, or a checksum. The `encode` subcommands turn bytes into text and their `decode` counterparts turn the text back into bytes:

| Encoding  | Encode                                                   | Decode                                                   | Alphabet                                         |
| --------- | -------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| Base64    | [`encode base64`](/commands/docs/encode_base64.md)       | [`decode base64`](/commands/docs/decode_base64.md)       | `A`-`Z`, `a`-`z`, `0`-`9`, `+`, `/`, `=` padding |
| Base32    | [`encode base32`](/commands/docs/encode_base32.md)       | [`decode base32`](/commands/docs/decode_base32.md)       | `A`-`Z`, `2`-`7`, `=` padding                    |
| base32hex | [`encode base32hex`](/commands/docs/encode_base32hex.md) | [`decode base32hex`](/commands/docs/decode_base32hex.md) | `0`-`9`, `A`-`V`, `=` padding                    |
| hex       | [`encode hex`](/commands/docs/encode_hex.md)             | [`decode hex`](/commands/docs/decode_hex.md)             | `0`-`9`, `A`-`F`                                 |

The `encode` commands take a string or binary data and return a string. A string is encoded as its UTF-8 bytes. The `decode` commands take a string and return binary data. Pipe the result to [`decode`](/commands/docs/decode.md) to get a string back:

```nu
"café" | encode base64
# => Y2Fmw6k=
"Y2Fmw6k=" | decode base64
# => Length: 5 (0x5) bytes | null_char printable whitespace ascii_other non_ascii
# => 00000000:   63 61 66 c3  a9                                      caf××
"Y2Fmw6k=" | decode base64 | decode
# => café
```

All of them read a whole stream before they start, so `open --raw photo.png | encode base64` works on a file of any size that fits in memory. A list of strings or binary values fails; convert each item with [`each`](/commands/docs/each.md).

Decoding is strict. A character outside the alphabet, a missing `=` at the end, or a trailing line break fails with `Incorrect value` and the position of the problem. Text from a file or an external command often ends with a line break, so trim it first:

```nu
"Y2Fmw6k=\n" | decode base64
# => Error: nu::shell::incorrect_value
# =>
# =>   × Incorrect value.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "Y2Fmw6k=\n" | decode base64
# =>    · ──────┬─────   ──────┬──────
# =>    ·       │              ╰── encountered here
# =>    ·       ╰── invalid length at 8
# =>    ╰────
"Y2Fmw6k=\n" | str trim | decode base64 | decode
# => café
```

The flags change the alphabet and the padding:

- `--nopad` on an `encode` command leaves out the `=` padding. On a `decode` command it rejects padding, so the input must have none. Without it, the `decode` commands require the padding.
- `--url` on `encode base64` and `decode base64` uses the URL-safe alphabet, with `-` and `_` in place of `+` and `/`. URLs and JSON Web Tokens use it, usually without padding:

  ```nu
  0x[fb ff] | encode base64
  # => +/8=
  0x[fb ff] | encode base64 --url --nopad
  # => -_8
  "-_8" | decode base64 --url --nopad
  # => Length: 2 (0x2) bytes | null_char printable whitespace ascii_other non_ascii
  # => 00000000:   fb ff                                                ××
  ```

- `--lower` on `encode hex` writes `a`-`f` instead of `A`-`F`. `decode hex` reads either case, but the Base32 decoders read only uppercase letters.

`decode hex` reads the digits only, so remove spaces and a `0x` prefix first. Don't confuse it with [`into binary`](/commands/docs/into_binary.md), which returns the bytes of the text itself: `"ffee" | into binary` is `0x[66666565]`, while `"ffee" | decode hex` is `0x[FFEE]`.

### Character encodings

Plain [`encode`](/commands/docs/encode.md), with the name of a character encoding, does a different job. It turns a string into the bytes for that encoding, for a program or file that expects something other than UTF-8. [`decode`](/commands/docs/decode.md) does the reverse, as [Raw Streams](./stdout_stderr_exit_codes.md#raw-streams) shows:

```nu
"café" | encode latin1
# => Length: 4 (0x4) bytes | null_char printable whitespace ascii_other non_ascii
# => 00000000:   63 61 66 e9                                          caf×
"café" | encode utf-8
# => Length: 5 (0x5) bytes | null_char printable whitespace ascii_other non_ascii
# => 00000000:   63 61 66 c3  a9                                      caf××
```

The names come from the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/#names-and-labels), as implemented by [encoding_rs](https://docs.rs/encoding_rs/latest/encoding_rs/#statics), and ignore case. The standard treats `ascii`, `latin1`, and `iso-8859-1` as names for `windows-1252`, so `"€" | encode ascii` succeeds and returns the byte `0x80`. An unknown name fails with `is not a valid encoding`.

`encode` can't produce UTF-16, because the standard defines no encoder for it, so `encode utf-16` fails with `utf-16 encoding is not supported`. `decode utf-16` works.

A character the encoding can't represent is an error. `--ignore-errors` (`-i`) writes it as an HTML character reference instead:

```nu
"π = 3.14" | encode latin1
# => Error: nu::shell::error
# =>
# =>   × error while encoding string
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "π = 3.14" | encode latin1
# =>    · ─────┬────
# =>    ·      ╰── string contained characters not in latin1
# =>    ╰────
"π = 3.14" | encode --ignore-errors latin1 | decode latin1
# => &#960; = 3.14
```

`encode` takes a string or a byte stream. Binary data and lists are errors.
