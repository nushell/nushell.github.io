# `std/xml`

The `std/xml` module reads and changes XML data in the form that [`from xml`](/commands/docs/from_xml.md) produces and [`to xml`](/commands/docs/to_xml.md) accepts. In that form, every entry is a record with `tag`, `attributes` and `content` fields. A tag's `content` is a list of entries, and a text entry has a `null` tag and its text as `content`. Import the commands without a prefix:

```nu
use std/xml *
```

The examples on this page use a file `books.xml` with this content:

```xml
<library>
  <book lang="en"><title>Dune</title><year>1965</year></book>
  <book lang="fr"><title>Vendredi</title><year>1967</year></book>
</library>
```

[[toc]]

## Paths

`xaccess`, `xupdate` and `xinsert` find entries with a path, a list of steps loosely modeled on XPath. The first step applies to the root element itself, and each later step works on the entries that the step before it selected. There are four kinds of step:

| Step       | Selects                                                                   |
| ---------- | ------------------------------------------------------------------------- |
| A tag name | the children with that tag, like `child::name` in XPath                   |
| `'*'`      | all children, whatever their tag, including text entries                  |
| An integer | the entry at that position among the current selection, counting from `0` |
| A closure  | the entries of the current selection for which the closure returns `true` |

`*` selects only the direct children, not their descendants. A closure receives each entry as its parameter.

## `xaccess`

`xaccess` returns the entries that a path selects:

```nu
open books.xml | xaccess [library book title *] | get content
# => ╭───┬──────────╮
# => │ 0 │ Dune     │
# => │ 1 │ Vendredi │
# => ╰───┴──────────╯
```

`library` selects the root, `book` its two `book` children, `title` their titles, and `*` the text inside each title. An integer step picks one entry, and a closure filters the selection:

```nu
open books.xml | xaccess [library book 1 title *] | get content
# => ╭───┬──────────╮
# => │ 0 │ Vendredi │
# => ╰───┴──────────╯
open books.xml | xaccess [library book {|b| $b.attributes.lang == "fr" } year *] | get content
# => ╭───┬──────╮
# => │ 0 │ 1967 │
# => ╰───┴──────╯
```

When a step selects nothing, `xaccess` returns an empty list. A first step that doesn't match the root's tag selects nothing, so `xaccess [book]` returns `[]`. An integer past the end of the selection is an error, `Row number too large`. A step of any other type, such as a float, fails with `Incorrect path step type`. The path can't be empty:

```nu
open books.xml | xaccess []
# => Error: nu::shell::error
# =>
# =>   × Empty path provided
# =>    ╭─[repl_entry #1:1:26]
# =>  1 │ open books.xml | xaccess []
# =>    ·                          ─┬
# =>    ·                           ╰── Use a non-empty  list of path steps
# =>    ╰────
```

## `xupdate`

`xupdate` takes a path and a closure. It calls the closure once for each entry that the path selects, puts whatever the closure returns in that entry's place, and returns the whole document:

```nu
open books.xml | xupdate [library book year *] {|t| $t | update content { into int | $in + 1 | into string } } | to xml
# => <library><book lang="en"><title>Dune</title><year>1966</year></book><book lang="fr"><title>Vendredi</title><year>1968</year></book></library>
```

The closure gets the entry as its parameter and must return an entry, a record that `to xml` accepts.

## `xinsert`

`xinsert` adds a new entry to the content of each tag that a path selects. It takes the path, the new entry and an optional position. Without a position, the entry goes at the end of the content. With one, it goes at that index, counting from `0`, and a position past the end means the end:

```nu
open books.xml | xinsert [library book 0] {tag: author, attributes: {}, content: ["Frank Herbert"]} 1 | to xml
# => <library><book lang="en"><title>Dune</title><author>Frank Herbert</author><year>1965</year></book><book lang="fr"><title>Vendredi</title><year>1967</year></book></library>
```

Only tags have content to insert into. If the path selects a text entry, a comment or a processing instruction, `xinsert` fails with `Can insert entry only into content of a tag node`.

## `xtype`

`xtype` returns the kind of the entry it receives: `tag`, `text`, `comment`, or `pi` for a processing instruction. A plain string also counts as `text`. Comments and processing instructions appear only when `from xml` keeps them with `--keep-comments` and `--keep-pi`:

```nu
"<r><?target data?><!-- note --><a>text</a>tail</r>" | from xml --keep-comments --keep-pi | get content | each { xtype } | to nuon
# => [pi, comment, tag, text]
```

Input that isn't an XML entry, such as `{a: 1}`, is an error, `Not an xml emtry`.

The [`std-rfc/xml`](./std_rfc.md) module has a different `xaccess`, with another path syntax.
