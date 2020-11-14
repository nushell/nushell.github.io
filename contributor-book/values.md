---
title: Values
---

# Values

A Value is the basic structure datatype in Nu.

```rust
pub struct Value {
    pub value: UntaggedValue,
    pub tag: Tag,
}
```

Where the `value` field is any given value type `UntaggedValue` and the `tag` field holds [metadata](metadata.md) associated with it.

An `UntaggedValue` covers the following value types:

```rust
pub enum UntaggedValue {
    Primitive(Primitive),
    Row(Dictionary),
    Table(Vec<Value>),

    Error(ShellError),

    Block(Evaluate),
}
```

Where `Primitive` is:

```rust
pub enum Primitive {
    Nothing,
    Int(BigInt),
    Decimal(BigDecimal),
    Bytes(u64),
    String(String),
    Line(String),
    ColumnPath(ColumnPath),
    Pattern(String),
    Boolean(bool),
    Date(DateTime<Utc>),
    Duration(u64),
    Range(Box<Range>),
    Path(PathBuf),
    Binary(Vec<u8>),

    // Stream markers (used as bookend markers rather than actual values)
    BeginningOfStream,
    EndOfStream,
}
```

Let's look at these in reverse order to see how Primitives build towards our full Value types:

## Primitive

A `Primitive` data type is a fundamental type in Nu. While these have similarities to the fundamental datatypes of programming languages, there are a few differences because of the shell capabilities of Nu.

Nu comes with two 'big' number types: `BigInt` for integers and `BigDecimal` for decimal numbers. This allows Nu in the future to do mathematical operations and maintain precision for longer.

Other data types that are perhaps a bit different from the norm:

* `Nothing` = An empty value
* `Bytes(u64)` = filesize in number of bytes
* `Line(String)` = A string value with an implied carriage return (or cr/lf) ending
* `ColumnPath(ColumnPath)` = A path to travel to reach a value in a table
* `Pattern(string)` = a glob pattern (like the `nu*` in `ls nu*`)
* `Duration(u64)` = A count in the number of seconds (like `1h`, `3600s`, `1440m`, `1d`, `86400s` in `echo 1h 3600s 1440m 1d 86400s`)
* `Range(Box<Range>)` = A range of values (like `0..2` in `ls | range 0..2`)
* `Path(PathBuf)` = a filepath
* `Binary(Vec<u8>)` = an array of bytes
* `BeginningOfStream` = a marker to denote the beginning of a stream
* `EndOfStream` = a marker to denote the end of a stream

## UntaggedValue

In addition to the primitive types, Nu supports aggregate data types. Collectively, these aggregate types are called `UntaggedValue`s.

Currently, Nu supports 5 `UntaggedValue` types: `Row`, `Table`, `Block`, `Primitive`, and `Error`.

### Tables and Rows

Nu uses a set of terms that match a bit more closely to spreadsheets. Rather than having lists of objects, Nu has a table, which contains rows. Each Row contains the column names and their corresponding Values.

### Blocks

Blocks represent code that is ready to be executed by the evaluator. One example of this is the condition in `where {$it > 10}`. 

### Errors

Represents errors that can happen when pipelines are run.
