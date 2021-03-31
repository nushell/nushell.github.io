# Types of data

Traditionally, Unix shell commands have communicated with each other using strings of text. One command would output text via standard out (often abbreviated 'stdout') and the other would read in text via standard in (or 'stdin'). In this way, the two commands could communicate.

We can think of this kind of communication as string-based.

Nu embraces this approach for its commands and grows it to include other kinds of data.  Currently, Nu supports two kinds of data types: simple and structured.

Like many programming languages, Nu models data using a set of simple and structured data types. Simple data types include integers, floats, strings, booleans, dates, and paths. It also includes a special type for filesizes.

## Integers

Integers (or round) numbers. Examples include 1, 5, and 100.

## Decimal

Decimal numbers are numbers with some fractional component. Examples include 1.5, 2.0, and 15.333.

## Strings

A string of characters that represents text. There are a few ways we can represent text in Nushell:

**Double quotes**

```
"my message"
```

Double quotes are the most common form of quotes and one you may see whenever text is required.

**Single quotes**
```
'my message'
```

Single quotes also give you a string value, just like double quotes. The difference here is that they allow you to use double quotes in the text: `'he said "can you grab my glass?"'`

**Backtick quotes**
```
`my message`
```
A powerful form of string uses backticks. These allow you to create a string from inputs in the pipeline.

```
> ls | each { echo `{{name}} is {{size}}` }
───┬─────────────────────
 0 │ genawait is 4.1 KB  
 1 │ learncpp is 4.1 KB  
 2 │ nuscripts is 4.1 KB 
───┴─────────────────────
```

**Bare strings**

```
> echo hello
```

A unique trait of Nushell is that you can also create a string of one word without any quotes at all.

The above is the same as if we had written:

```
> echo "hello"
```

## Lines

Lines are strings with an implied OS-dependent line ending. When used, the OS-specific line ending is used.

## Column paths

Column paths are a path through the table to a specific sub-table, column, row, or cell.

Eg) The value `foo.0.bar` in `open data.toml | get foo.0.bar`

## Glob patterns (wildcards)

In Nushell, file operations may also allow you to pass in a glob pattern, sometimes called a 'wildcard'. This allows you to give a pattern that may match multiple file paths.

The most general pattern is the `*`, which will match all paths. More often, you'll see this pattern used as part of another pattern, for example `*.bak` and `temp*`.

In Nushell, we also support double `*` to talk about traversing deeper paths that are nested inside of other directories. For example, `ls **/*` will list all the non-hidden paths nested under the current directory.

In addition to `*`, there is also the `?` pattern which will match a single character. For example, you can match the word "port" by using the pattern `p???`.

## Booleans

Booleans are the state of being true or false. Rather than writing the value directly, it is often a result of a comparison.

The two values of booleans are `$true` and `$false`.

## Dates

Dates and times are held together in the Date value type. Date values used by the system are timezone-aware, and by default use the UTC timezone.

## Duration

Durations represent a length of time.  A second, 5 weeks, and a year are all durations.

Eg) `1wk` is the duration of one week.

This chart shows all durations currently supported:

| Duration | Length     |
|----------|------------|
|1sec      | one second |
|1min      | one minute |
|1hr       | one hour   |
|1day      | one day    |
|1wk       | one week   |
|1mon      | one month  |
|1yr       | one year   |

## Ranges

A range is a way of expressing a sequence of values from start to finish. They take the form 'start' + '..' + 'end'. For example, the range `1..3` means the numbers 1, 2, and 3.

## Inclusive and non-inclusive ranges

Ranges are inclusive by default, meaning that the ending value is counted as part of the range. The range `1..3` includes the number `3` as the last value in the range.

Sometimes, you may want a range that comes up to a number but doesn't use that number in the output. For this case, you can use `..<` instead of `..`. For example, `1..<5` is the numbers 1, 2, 3, and 4.

## Open-ended ranges

Ranges can also be open-ended. You can remove the start or the end of the range to make it open-ended.

Let's say you wanted to start counting at 3, but you didn't have a specific end in mind. You could use the range `3..` to represent this. When you use a range that's open-ended on the right side, remember that this will continue counting for as long as possible, which could be a very long time! You'll often want to use open-ended ranges with commands like `first`, so you can take the number of elements you want from the range.

You can also make the start of the range open. In this case, Nushell will start counting with `0`, and go up from there. The range `..2` is the numbers 0, 1, and 2.

## File paths

File paths are a platform-independent way of representing a file path in the given OS. Examples include /usr/bin and C:\Users\file.txt.

## File sizes

File sizes are held in a special integer type called bytes. Examples include `100b`, `15kb`, and `100mb`.

The full list of filesize units are:
* `pb`: petabytes
* `tb`: terabytes
* `gb`: gigabytes
* `mb`: megabytes
* `kb`: kilobytes
* `b`: bytes

## Binary data

Binary data, like the data from an image file, is a group of raw bytes.

## Structured data

Structured data builds from the simple data. For example, instead of a single integer, structured data gives us a way to represent multiple integers in the same value. Here's a list of the currently supported structured data types: rows, lists, and blocks.

## Rows

The row data type represents what you would see in one row of data in the table. It has different elements of data, and each element of data is given a column name.

## Lists

Lists can hold more than one value. These can be simple values.  They can also hold rows, and the combination of a list of rows is often called a "table".

Example: a list of strings

```
> echo [sam fred george]
───┬────────
 0 │ sam 
 1 │ fred 
 2 │ george 
───┴────────
```

## Tables

The table is core data structure in Nushell. You'll see as you run commands that many of them return tables as output. A table has both rows and columns.

We can create our own tables similarly to how we create a list. Because tables also contain columns and not just values, we pass in the name of the column values:

```
> echo [[Column1, Column2]; [Value1, Value2]]
───┬─────────┬─────────
 # │ Column1 │ Column2 
───┼─────────┼─────────
 0 │ Value1  │ Value2  
───┴─────────┴─────────
```

We can also create a table with multiple rows of data:

```
> echo [[Column1, Column2]; [Value1, Value2] [Value3, Value4]]
───┬─────────┬─────────
 # │ Column1 │ Column2 
───┼─────────┼─────────
 0 │ Value1  │ Value2  
 1 │ Value3  │ Value4  
───┴─────────┴─────────
```

## Blocks

Blocks represent a block of code in Nu. For example, in the command `each { echo $it }` the block is the portion contained in curly braces, `{ echo $it }`. Blocks are a useful way of representing code that can be executed on each row of data.

## Groups

Take this example:

```
foo {
  line1
  line2; line3 | line4
}
```

Inside the block, you have two separate groups that run to completion, a group
is a semicolon-separated list of pipelines, the last of which is output to the
screen.

- `line1` is a group unto itself, so that command will run to completion and get
displayed on the screen.
- `line2` is a pipeline inside of the second group. It runs, but its contents
  are not viewed on the screen.
- `line3` | `line4` is the second pipeline in the second group. It runs, and its
  contents get viewed.
