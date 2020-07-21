---
title: Data Types
description: Nu's data types
---

Traditionally, Unix shell commands have communicated with each other using strings of text. One command would output text via standard out (often abbreviated 'stdout') and the other would read in text via standard in (or 'stdin'). In this way, the two commands could communicate.

We can think of this kind of communication as string-based.

Nu embraces this approach for its commands and grows it to include other kinds of data.  Currently, Nu supports two kinds of data types: simple and structured.

## Simple data

Like many programming languages, Nu models data using a set of simple and structured data types. Simple data types include integers, floats, strings, booleans, dates, and paths. It also includes a special type for filesizes.

### Integers

Integers (or round) numbers. Examples include 1, 5, and 100.

### Decimal

Decimal numbers are numbers with some fractional component. Examples include 1.5, 2.0, and 15.333.

### Strings

Strings are the fundamental way of representing text. They are quoted using double quotes. Examples include "Fred", "myname.txt", and "Lynchburg, VA".

Strings in Nu are Unicode aware by default, so you can pass UTF-8 text with ease.

### Lines

Lines are strings with an implied OS-dependent line ending. When used, the OS-specific line ending is used.

### Column paths

Column paths are a path through the table to a specific sub-table, column, row, or cell.

Eg) The value `foo.0.bar` in `open data.toml | get foo.0.bar`

### Patterns

Patterns, sometimes called "glob" patterns, are a way of matching filenames often used in shells.  Globs contain `*` to mean anything can match here, or `?` to mean a single character can match here.

Eg) The value `test*` in `ls test*` is a pattern

### Booleans

Booleans are the state of being true or false. Rather than writing the value directly, it is often a result of a comparison.

The two values of booleans are `$true` and `$false`.

### Dates

Dates and times are held together in the Date value type. Date values used by the system are timezone-aware, and by default use the UTC timezone.

### Duration

Durations represent a length of time.  A second, 5 weeks, and a year are all durations.

Eg) `1w` is the duration of one week.

This chart shows all durations currently supported:

| Duration | Length     |
|----------|------------|
|1s        | one second |
|1m        | one minute |
|1h        | one hour   |
|1d        | one day    |
|1w        | one week   |
|1M        | one month  |
|1y        | one year   |

### Ranges

You can also describe a range of values. Often, you might use this to describe numbers between a start and end number.

eg) `ls | range 1..4`

### Paths

Paths are a platform-independent way of representing a filepath in the given OS. Examples include /usr/bin and C:\Users\file.txt.

### Bytes

Filesizes are held in a special integer type called bytes. Examples include `100`, `15kb`, and `100mb`.

### Binary data

Binary data, like the data from an image file, is a group of raw bytes.

## Structured data

Structured data builds from the simple data. For example, instead of a single integer, structured data gives us a way to represent multiple integers in the same value. Here's a list of the currently supported structured data types: rows, lists, and blocks.

### Rows

The row data type represents what you would see in one row of data in the table. It has different elements of data, and each element of data is given a column name.

### Lists

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

### Blocks

Blocks represent a block of code in Nu. For example, in the command `each { echo $it }` the block is the portion contained in curly braces, `{ echo $it }`. Blocks are a useful way of representing code that can be executed on each row of data.

