# Dataframes

::: warning Important!
This feature requires the Polars plugin.  See the
[Plugins Chapter](plugins.md) to learn how to install it.

To test that this plugin is properly installed, run `help polars`.
Running [`polars`](/commands/docs/polars.md) with no subcommand prints the same
help text, which lists every `polars` subcommand.
:::

As we have seen so far, Nushell makes working with data its main priority.
`Lists` and `Tables` are there to help you cycle through values in order to
perform multiple operations or find data in a breeze. However, there are
certain operations where a row-based data layout is not the most efficient way
to process data, especially when working with extremely large files. Operations
like group-by or join using large datasets can be costly memory-wise, and may
lead to large computation times if they are not done using the appropriate
data format.

For this reason, the `DataFrame` structure was introduced to Nushell. A
`DataFrame` stores its data in a columnar format using as its base the [Apache
Arrow](https://arrow.apache.org/) specification, and uses
[Polars](https://github.com/pola-rs/polars) as the motor for performing
extremely [fast columnar operations](https://h2oai.github.io/db-benchmark/).

You may be wondering now how fast this combo could be, and how could it make
working with data easier and more reliable. For this reason, we'll start this
chapter by presenting benchmarks on common operations that are done when
processing data.

[[toc]]

## Benchmark Comparisons

For this little benchmark exercise we will be comparing native Nushell
commands, dataframe Nushell commands and [Python
Pandas](https://pandas.pydata.org/) commands. For the time being don't pay too
much attention to the [`Dataframe` commands](/commands/categories/dataframe.md). They will be explained in later
sections of this page.

::: tip System Details
The benchmarks presented in this section were run using a Macbook with a processor M1 pro and 32gb of ram. The timings were measured on Nushell version 0.97 using `nu_plugin_polars 0.97`, so treat them as illustrative. Current versions of `bench --pretty` print durations at full precision.
:::

### File Information

The file that we will be using for the benchmarks is the
[New Zealand business demography](https://www.stats.govt.nz/assets/Uploads/New-Zealand-business-demography-statistics/New-Zealand-business-demography-statistics-At-February-2020/Download-data/Geographic-units-by-industry-and-statistical-area-2000-2020-descending-order-CSV.zip) dataset.
Feel free to download it if you want to follow these tests.

The dataset has 5 columns and 5,429,252 rows. We can check that by using the
`polars store-ls` command:

```nu
let df_0 = polars open --eager Data7602DescendingYearOrder.csv
polars store-ls | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬───────────┬─────────┬─────────┬────────────────╮
# => │ # │                 key                  │   type    │ columns │  rows   │ estimated_size │
# => ├───┼──────────────────────────────────────┼───────────┼─────────┼─────────┼────────────────┤
# => │ 0 │ 468d6c93-d7ee-4596-8d80-5893f03380cf │ DataFrame │       5 │ 5429252 │       184.4 MB │
# => ╰───┴──────────────────────────────────────┴───────────┴─────────┴─────────┴────────────────╯
```

::: tip
`polars open` opens a file as a lazy dataframe by default.
To open it as an eager dataframe, use the `--eager` flag.
JSON and Avro files always open as eager dataframes. See [Reading options](#reading-options).
:::

We can have a look at the first lines of the file using [`polars first`](/commands/docs/polars_first.md):

```nu
$df_0 | polars first
# => ╭───┬──────────┬─────────┬──────┬───────────┬──────────╮
# => │ # │ anzsic06 │  Area   │ year │ geo_count │ ec_count │
# => ├───┼──────────┼─────────┼──────┼───────────┼──────────┤
# => │ 0 │ A        │ A100100 │ 2000 │        96 │      130 │
# => ╰───┴──────────┴─────────┴──────┴───────────┴──────────╯
```

...and finally, we can get an idea of the inferred data types:

```nu
$df_0 | polars schema
# => ╭───────────┬─────╮
# => │ anzsic06  │ str │
# => │ Area      │ str │
# => │ year      │ i64 │
# => │ geo_count │ i64 │
# => │ ec_count  │ i64 │
# => ╰───────────┴─────╯
```

### Group-by Comparison

To output more statistically correct timings, let's load and use the `std bench` command.

```nu
use std/bench
```

::: details More about `bench`
[`bench`](./standard_library/bench.md) runs each closure you give it 50 times unless you pass `--rounds` (`-n`), and returns a record with the `mean`, `min`, `max`, and `std` (standard deviation) of the run times. `--verbose` (`-v`) adds a `times` list with every round's duration. `--pretty` (`-p`) returns a string such as `3sec 268ms +/- 50ms` instead, and then `--verbose` has no effect.

Give it several closures and it times each one and returns a table with a `code` column holding each closure's source and a `ratio` column, where the fastest closure has a ratio of `1.0`. With `--pretty` it prints each benchmark and then a line saying how many times faster the fastest closure ran than each of the others.

The other flags control what runs around the timed code:

- `--warmup` (`-w`) runs each closure that many extra times before timing starts. Use it to fill the disk cache before timing a command that reads files.
- `--setup` (`-s`) and `--cleanup` (`-c`) take closures that run once, before the first benchmark and after the last one.
- `--prepare` (`-S`) and `--conclude` (`-C`) take closures that run before and after every round, warmup rounds included. With several closures to compare, they receive the index of the closure being timed, starting at 0, both as an argument and as `$in`, so they can prepare different things for each one.
- `--ignore-errors` (`-i`) keeps going when the timed closure fails.
- `--progress` (`-P`) prints a round counter while it runs.

Every 10 rounds, `bench` also writes an OSC 9;4 escape sequence with the percentage done. Terminals such as Windows Terminal show it as a progress bar, and `bench` clears it when it finishes.
:::

We are going to group the data by year, and sum the column `geo_count`.

First, let's measure the performance of a Nushell native commands pipeline.

```nu
bench -n 10 --pretty {
    open 'Data7602DescendingYearOrder.csv'
    | group-by year --to-table
    | update items {|i|
        $i.items.geo_count
        | math sum
    }
}
# => 3sec 268ms +/- 50ms
```

So, 3.3 seconds to perform this aggregation.

Let's try the same operation in pandas:

```nu
('import pandas as pd

df = pd.read_csv("Data7602DescendingYearOrder.csv")
res = df.groupby("year")["geo_count"].sum()
print(res)'
| save load.py -f)
```

And the result from the benchmark is:

```nu
bench -n 10 --pretty {
    python load.py | complete | null
}
# => 1sec 322ms +/- 6ms
```

Not bad at all. Pandas managed to get it 2.6 times faster than Nushell.
And with bigger files, the superiority of Pandas should increase here.

To finish the comparison, let's try Nushell dataframes. We are going to put
all the operations in one `nu` file, to make sure we are doing the correct
comparison:

```nu
( 'polars open Data7602DescendingYearOrder.csv
    | polars group-by year
    | polars agg (polars col geo_count | polars sum)
    | polars collect'
| save load.nu -f )
```

and the benchmark with dataframes (together with loading a new nushell and `polars`
instance for each test in order of honest comparison) is:

```nu
bench -n 10 --pretty {
    nu load.nu | complete | null
}
# => 135ms +/- 4ms
```

The `polars` dataframes plugin managed to finish operation 10 times
faster than `pandas` with python. Isn't that great?

As you can see, the Nushell's `polars` plugin is performant like `polars` itself.
Coupled with Nushell commands and pipelines, it is capable of conducting sophisticated
analysis without leaving the terminal.

Let's clean up the cache from the dataframes that we used during benchmarking.
To do that, let's stop the `polars`.
When we execute our next commands, we will start a new instance of plugin.
[The object store](#the-object-store) explains what stopping the plugin does to the dataframes it holds.

```nu
plugin stop polars
```

## Working with Dataframes

After seeing a glimpse of the things that can be done with [`Dataframe` commands](/commands/categories/dataframe.md),
now it is time to start testing them. To begin let's create a sample
CSV file that will become our sample dataframe that we will be using along with
the examples. In your favorite file editor paste the next lines to create our
sample csv file.

```nu
("int_1,int_2,float_1,float_2,first,second,third,word
1,11,0.1,1.0,a,b,c,first
2,12,0.2,1.0,a,b,c,second
3,13,0.3,2.0,a,b,c,third
4,14,0.4,3.0,b,a,c,second
0,15,0.5,4.0,b,a,a,third
6,16,0.6,5.0,b,a,a,second
7,17,0.7,6.0,b,c,a,third
8,18,0.8,7.0,c,c,b,eight
9,19,0.9,8.0,c,c,b,ninth
0,10,0.0,9.0,c,c,b,ninth"
| save --raw --force test_small.csv)
```

Save the file and name it however you want to, for the sake of these examples
the file will be called `test_small.csv`.

Now, to read that file as a dataframe use the `polars open` command like
this:

```nu
let df_1 = polars open --eager test_small.csv
```

This should create the value `$df_1` in memory which holds the data we just
created.

::: tip
The `polars open` command can read files in formats: **csv**, **tsv**, **parquet**, **json(l)**, **arrow**, and **avro**.
:::

To see all the dataframes that are stored in memory you can use

```nu
polars store-ls | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬───────────┬─────────┬──────┬────────────────╮
# => │ # │                 key                  │   type    │ columns │ rows │ estimated_size │
# => ├───┼──────────────────────────────────────┼───────────┼─────────┼──────┼────────────────┤
# => │ 0 │ e780af47-c106-49eb-b38d-d42d3946d66e │ DataFrame │       8 │   10 │          403 B │
# => ╰───┴──────────────────────────────────────┴───────────┴─────────┴──────┴────────────────╯
```

As you can see, the command shows the created dataframes together with basic
information about them.

And if you want to see a preview of the loaded dataframe you can send the
dataframe variable to the stream

```nu
$df_1
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
# => │ 1 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 2 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
# => │ 3 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 4 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 5 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 6 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => │ 7 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => │ 8 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 9 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

With the dataframe in memory we can start doing column operations with the
`DataFrame`

::: tip
If you want to see all the dataframe commands that are available you
can use `scope commands | where category =~ dataframe`
:::

### Cloud Storage

`polars open` and `polars save` also accept a URL in cloud storage in place of a file path:

```nu
# Read a Parquet file from Amazon S3 as a lazy dataframe
polars open s3://my-bucket/sales.parquet

# Write a dataframe to Azure Blob Storage
$df | polars save az://my-container/sales.parquet
```

The URL's scheme picks the provider, and each provider has its own way of finding credentials:

| Schemes                                              | Provider             | Where the credentials come from                                                                                                                                                                                          |
| ---------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `s3://`, `s3a://`                                    | Amazon S3            | The AWS SDK's default chain: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`, then the shared config and credentials files (with `AWS_PROFILE`), web identity, ECS, and EC2 instance metadata. Other `AWS_` variables, such as `AWS_REGION`, are read too. |
| `az://`, `azure://`, `abfs://`, `abfss://`, `adl://` | Azure                | Variables whose names start with `AZURE_`, such as `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_STORAGE_ACCOUNT_KEY`, `AZURE_STORAGE_SAS_TOKEN`, or `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID`.             |
| `gs://`, `gcs://`                                    | Google Cloud Storage | `SERVICE_ACCOUNT`, the path to a service account key file, and variables whose names start with `GOOGLE_`, such as `GOOGLE_SERVICE_ACCOUNT` (which wins over `SERVICE_ACCOUNT`) and `GOOGLE_APPLICATION_CREDENTIALS`. |

When no AWS credentials turn up, the command fails with `Could not fetch AWS credentials`, followed by each place the SDK looked. Other schemes, such as `https://` and `file://`, fail with `Could not determine a supported cloud type from path`.

The plugin reads these variables from its own environment, which it gets from `$env` when Nushell starts it. If you set or change them while the plugin is running, run `plugin stop polars`, and the next `polars` command starts the plugin with the new values. [The object store](#the-object-store) explains what stopping the plugin does to the dataframes it holds.

Not every format works with cloud storage. `polars open` reads CSV, TSV, Parquet, Arrow, and NDJSON files from a cloud URL, always as a lazy dataframe, so `--eager` fails with `Cloud URLs are not supported with --eager`. JSON and Avro files can't be read from the cloud. `polars save` writes Parquet, Arrow, NDJSON, and CSV files to the cloud, but not Avro.

### Reading options

[`polars open`](/commands/docs/polars_open.md) picks a reader from the file extension: `csv`, `tsv`, `parquet` (or `parq` and `pq`), `arrow` (or `ipc`), `json`, `jsonl` (or `ndjson`), and `avro`. Any other extension fails with `Unsupported type`, and a file without an extension fails with an I/O error. Use `--type` (`-t`) with one of those names to choose the reader yourself, for example `--type csv` for a `.txt` file.

CSV, TSV, Parquet, Arrow, and NDJSON files open as lazy dataframes, and the file isn't read until the plan runs. That means a problem in the file, such as a value that doesn't fit its column's type, is reported when you collect the dataframe, not when you open it. JSON and Avro files are always read eagerly, with or without `--eager`.

CSV and TSV files take the most options:

- `--delimiter` (`-d`) sets the one-character field separator. To open a `.tsv` file with `--eager`, also pass `--delimiter "\t"`.
- `--no-header` reads the first line as data and names the columns `column_1`, `column_2`, and so on.
- `--skip-rows` skips that many lines at the top of the file, before the header.
- `--infer-schema` sets how many rows Polars reads to guess each column's type. The default is 100. If a column holds only numbers in those rows and text further down, collecting fails with `could not parse ... as dtype`, and you need a larger number or `--schema`.
- `--schema` (`-s`) sets the types yourself, as a record of column name to type name. It applies by position. Its names replace the header's names, and it must have one entry for every column in the file. `--schema` also works for JSON and NDJSON files.
- `--truncate-ragged-lines` drops the extra fields on a line that has more fields than the header. Without it, such a line fails with `found more fields than defined in 'Schema'`.
- With `--eager`, `--columns` reads only the listed columns of a CSV, Parquet, Arrow, or Avro file. In a lazy read, pick the columns with [`polars select`](/commands/docs/polars_select.md).

For example, this file has a comment line before the header and uses semicolons:

```nu
"# exported 2026-11-14
id;name;score
1;ann;7
2;bob;9" | save --force scores.csv

polars open scores.csv --skip-rows 1 --delimiter ";" --schema {id: u32, name: str, score: f64} | polars collect
# => ╭───┬────┬──────┬───────╮
# => │ # │ id │ name │ score │
# => ├───┼────┼──────┼───────┤
# => │ 0 │  1 │ ann  │  7.00 │
# => │ 1 │  2 │ bob  │  9.00 │
# => ╰───┴────┴──────┴───────╯
```

Parquet and Arrow data is often split across a Hive-partitioned directory, where each directory level is named `column=value`, as in `sales/year=2024/region=eu/part.parquet`. Open the directory, with `--type` because a directory has no extension, and Polars adds a column for each level:

```nu
polars open sales --type parquet | polars collect
# => ╭───┬──────┬────────┬──────┬────────╮
# => │ # │ item │ amount │ year │ region │
# => ├───┼──────┼────────┼──────┼────────┤
# => │ 0 │ pen  │      3 │ 2024 │ eu     │
# => │ 1 │ ink  │      5 │ 2024 │ eu     │
# => │ 2 │ cup  │      7 │ 2025 │ us     │
# => ╰───┴──────┴────────┴──────┴────────╯
```

The Hive flags apply to lazy reads only. With `--eager`, opening a directory fails with `Parquet reader error`.

- Hive partitioning is on when you open a directory, and off when you open a glob such as `"sales/**/*.parquet"`. Write `--hive-enabled=true` to turn it on for a glob, or `--hive-enabled=false` to turn it off for a directory.
- `--hive-schema` sets the types of the partition columns, as a record like `--schema`. It has to name every partition column, or collecting fails with `path contains column not present in the given Hive schema`.
- `--hive-try-parse-dates` turns partition values that look like dates, such as `day=2025-01-02`, into a `date` column instead of a string column.

### Saving dataframes

[`polars save`](/commands/docs/polars_save.md) writes a dataframe to a file and returns nothing. Like `polars open`, it picks the format from the file extension: `csv`, `parquet` (or `parq` and `pq`), `arrow` (or `ipc`), `jsonl` (or `ndjson`), and `avro`. `--type` (`-t`) takes one of those names and overrides the extension. Plain JSON and TSV can't be written. A `.json` or `.tsv` file fails with `Unsupported type`, so write tab-separated data with `--type csv --csv-delimiter "\t"`. An existing file is overwritten without asking, and the directory has to exist already.

Given a lazy dataframe, `polars save` runs the plan in streaming mode and writes rows as they come, so the whole result never has to fit in memory. That works for every format except Avro, which collects the dataframe first. This reads `test_small.csv` lazily, filters it, and writes the result with a semicolon delimiter:

```nu
polars open test_small.csv | polars filter ((polars col first) == a) | polars select int_1 word | polars save first_a.csv --csv-delimiter ";"
open --raw first_a.csv
# => int_1;word
# => 1;first
# => 2;second
# => 3;third
```

The other flags apply to one format each:

- `--csv-delimiter` sets the field separator. It has to be a single character.
- `--csv-no-header` leaves out the header line.
- `--avro-compression` compresses an Avro file with `deflate` or `snappy`. Any other value fails with `compression must be one of deflate or snappy`.

`polars save` can also write to cloud storage, as described in [Cloud Storage](#cloud-storage).

::: warning
Don't save a lazy dataframe over the file it reads from. `polars save` empties the file before the plan reads it, so the data is lost. To overwrite a source file, collect the dataframe first, as in `polars open data.csv | polars collect | polars save data.csv`, or save to a new file.
:::

### The object store

The plugin keeps every dataframe, lazy dataframe, expression, group-by, and other Polars object you create in an in-memory store, and a Nushell value such as `$df_1` holds only a key into that store. The Polars value types table under [Core Plugin Quickstart](./plugins.md#core-plugin-quickstart) lists these kinds of values and the commands that make them. [`polars store-ls`](/commands/docs/polars_store-ls.md) lists what's stored. Right after loading `$df_1`, it holds just that one dataframe:

```nu
polars store-ls | select type span_contents reference_count
# => ╭───┬───────────┬───────────────┬─────────────────╮
# => │ # │   type    │ span_contents │ reference_count │
# => ├───┼───────────┼───────────────┼─────────────────┤
# => │ 0 │ DataFrame │ polars open   │               1 │
# => ╰───┴───────────┴───────────────┴─────────────────╯
```

Each row has these columns:

- `key` is the ID that Nushell values use to find the object.
- `created` is when the object was stored. Group-by objects and the ones [`polars when`](/commands/docs/polars_when.md) makes have no `created` value.
- `type` is `DataFrame`, `LazyFrame`, `Expression`, `LazyGroupBy`, `When`, `DataType`, `Schema`, or `Selector`.
- `columns`, `rows`, and `estimated_size` are the width, height, and approximate memory use of a dataframe, and are empty for every other type. To fill them in for a lazy dataframe, `polars store-ls` runs its plan, so listing the store can take as long as collecting every stored lazy dataframe. A lazy dataframe whose plan fails makes `polars store-ls` fail too.
- `span_contents`, `span_start`, and `span_end` give the source text that created the object, such as `polars open` or `$df_5 * 3`, and where that text sits in Nushell's source buffer.
- `reference_count` counts the separate Nushell values that point to the object.

An object stays in the store while a Nushell value refers to it. When the last of those values goes away, for example when a variable goes out of scope at the end of a block, or when a pipeline's result has been printed, Nushell tells the plugin and the plugin deletes the object. Copying a variable with `let df_copy = $df_1` doesn't add a reference, because both variables hold the same Nushell value. Commands that return an object that's already stored do add one. [`polars collect`](/commands/docs/polars_collect.md) on an eager dataframe and [`polars store-get`](/commands/docs/polars_store-get.md) return the same key and raise `reference_count` by one. The object is deleted once all of those values are gone. [`polars store-rm`](/commands/docs/polars_store-rm.md) deletes an object right away, whatever its count.

Nushell's [plugin garbage collector](./plugins.md#plugin-garbage-collector) stops a plugin that has been idle for a while (10 seconds by default). The Polars plugin turns the garbage collector off for itself while anything is in its store, and back on once the store is empty. So as long as you hold a dataframe in a variable, the plugin keeps running however long it sits idle, and your `plugin_gc` settings don't stop it.

`plugin stop polars` ends the plugin and throws away everything in the store. Variables that held dataframes still exist afterward, but using one fails with an error such as `Dataframe 600680b3-3242-47a6-b41a-9b71691e08ae not found in cache`, and you have to load the data again.

`polars store-get` takes one key from `polars store-ls` and returns the stored object, whatever its type. A key that names nothing returns `null`, and a string that isn't a UUID fails with `Failed to convert key string to UUID`. `polars store-rm` takes any number of keys and returns one message per key, `Removed: <key>` or `No value found for key: <key>`. To free several objects at once, spread the keys from `polars store-ls`. This stores a lazy dataframe and an expression, then removes every stored object that isn't an eager dataframe:

```nu
let lf_tmp = $df_1 | polars into-lazy
let expr_tmp = polars col int_1
polars store-rm ...(polars store-ls | where type != DataFrame | get key) | length
# => 2
```

`$lf_tmp` and `$expr_tmp` now behave like variables after `plugin stop polars`, and using either one fails with `not found in cache`. Use `polars store-rm` to free the memory a large dataframe holds when the variable that refers to it stays in scope, as variables defined at the prompt do for the rest of the session.

## Basic Aggregations

Let's start with basic aggregations on the dataframe. Let's sum all the columns
that exist in `df` by using the [`polars sum`](/commands/docs/polars_sum.md) command

```nu
$df_1 | polars sum | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────┤
# => │ 0 │    40 │   145 │    4.50 │   46.00 │       │        │       │      │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────╯
```

As you can see, `polars sum` adds up the integer and float columns, skipping
null values. A boolean column sums to the number of `true` values, and text and
date columns have no sum, so they come back null. If you want to filter out the
text column, you can select the columns you want by using the [`polars select`](/commands/docs/polars_select.md) command

```nu
$df_1 | polars sum | polars select int_1 int_2 float_1 float_2 | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │
# => ├───┼───────┼───────┼─────────┼─────────┤
# => │ 0 │    40 │   145 │    4.50 │   46.00 │
# => ╰───┴───────┴───────┴─────────┴─────────╯
```

You can even store the result from this aggregation as you would store any
other Nushell variable

```nu
let res = $df_1 | polars sum | polars select int_1 int_2 float_1 float_2
```

::: tip
Type `let res = !!` and press enter. This will auto complete the previously
executed command. Note the space between `=` and `!!`.
:::

And now we have two dataframes stored in memory. `polars sum` returns a
lazy dataframe, so `$res` is listed as a `LazyFrame`. `polars store-ls` doesn't
list the stored objects in a fixed order, so we sort them by their `created` time

```nu
polars store-ls | sort-by created | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬───────────┬─────────┬──────┬────────────────╮
# => │ # │                 key                  │   type    │ columns │ rows │ estimated_size │
# => ├───┼──────────────────────────────────────┼───────────┼─────────┼──────┼────────────────┤
# => │ 0 │ e780af47-c106-49eb-b38d-d42d3946d66e │ DataFrame │       8 │   10 │          403 B │
# => │ 1 │ 3146f4c1-f2a0-475b-a623-7375c1fdb4a7 │ LazyFrame │       4 │    1 │           32 B │
# => ╰───┴──────────────────────────────────────┴───────────┴─────────┴──────┴────────────────╯
```

Pretty neat, isn't it?

`polars sum` also has an expression form that sums a single column. Piping
`polars col int_1` into `polars sum` doesn't add anything up yet. It builds an
expression, and the sum happens when a command such as `polars select`,
`polars with-column`, or `polars agg` runs it. [`polars as`](/commands/docs/polars_as.md)
names the result:

```nu
$df_1 | polars select (polars col int_1 | polars sum) (polars col float_1 | polars sum | polars as float_total) | polars collect
# => ╭───┬───────┬─────────────╮
# => │ # │ int_1 │ float_total │
# => ├───┼───────┼─────────────┤
# => │ 0 │    40 │        4.50 │
# => ╰───┴───────┴─────────────╯
```

The group-by examples below use this form, and `polars agg` then computes one sum
per group. Other aggregation commands, such as [`polars mean`](/commands/docs/polars_mean.md)
and [`polars max`](/commands/docs/polars_max.md), have the same two forms.

You can perform several aggregations on the dataframe in order to extract basic
information from the dataframe and do basic data analysis on your brand new
dataframe.

## Joining a DataFrame

It is also possible to join two dataframes using a column as reference. We are
going to join our mini dataframe with another mini dataframe. Copy these lines
in another file and create the corresponding dataframe (for these examples we
are going to call it `test_small_a.csv`)

```nu
"int_1,int_2,float_1,float_2,first
9,14,0.4,3.0,a
8,13,0.3,2.0,a
7,12,0.2,1.0,a
6,11,0.1,0.0,b"
| save --raw --force test_small_a.csv
```

We use the `polars open` command to create the new variable

```nu
let df_2 = polars open --eager test_small_a.csv
```

Now, with the second dataframe loaded in memory we can join them using the
column called `int_1` from the left dataframe and the column `int_1` from the
right dataframe

```nu
$df_1 | polars join $df_2 int_1 int_1
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────┬─────────┬───────────┬───────────┬─────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │ int_2_x │ float_1_x │ float_2_x │ first_x │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┼─────────┼───────────┼───────────┼─────────┤
# => │ 0 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │      11 │      0.10 │      0.00 │ b       │
# => │ 1 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │      12 │      0.20 │      1.00 │ a       │
# => │ 2 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │      13 │      0.30 │      2.00 │ a       │
# => │ 3 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │      14 │      0.40 │      3.00 │ a       │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────┴─────────┴───────────┴───────────┴─────────╯
```

::: tip
In `Nu` when a command has multiple arguments that are expecting
multiple values we use brackets `[]` to enclose those values. In the case of
[`polars join`](/commands/docs/polars_join.md) we can join on multiple columns
as long as they have the same type.
:::

For example:

```nu
$df_1 | polars join $df_2 [int_1 first] [int_1 first]
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────┬─────────┬───────────┬───────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │ int_2_x │ float_1_x │ float_2_x │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┼─────────┼───────────┼───────────┤
# => │ 0 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │      11 │      0.10 │      0.00 │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────┴─────────┴───────────┴───────────╯
```

By default, the join command does an inner join, meaning that it will keep the
rows where both dataframes share the same value. You can select a left join to
keep the missing rows from the left dataframe. You can also save this result
in order to use it for further operations.

The right dataframe's key columns are dropped from the result. Its other
columns keep their names unless the left dataframe already has a column by that
name, and then they get the suffix `_x`, as `int_2_x` and `first_x` show above.
Pass `--suffix` (`-s`) to use a different suffix.

`--left` (`-l`) keeps every row of the left dataframe and fills the right side's
columns with nulls where nothing matched:

```nu
$df_1 | polars join $df_2 int_1 int_1 --left | polars select int_1 word int_2_x first_x | polars collect
# => ╭───┬───────┬────────┬─────────┬─────────╮
# => │ # │ int_1 │  word  │ int_2_x │ first_x │
# => ├───┼───────┼────────┼─────────┼─────────┤
# => │ 0 │     1 │ first  │         │         │
# => │ 1 │     2 │ second │         │         │
# => │ 2 │     3 │ third  │         │         │
# => │ 3 │     4 │ second │         │         │
# => │ 4 │     0 │ third  │         │         │
# => │ 5 │     6 │ second │      11 │ b       │
# => │ 6 │     7 │ third  │      12 │ a       │
# => │ 7 │     8 │ eight  │      13 │ a       │
# => │ 8 │     9 │ ninth  │      14 │ a       │
# => │ 9 │     0 │ ninth  │         │         │
# => ╰───┴───────┴────────┴─────────┴─────────╯
```

`--full` (`-f`) keeps the unmatched rows from both sides. Here the right key
column isn't dropped. It stays as a separate column, `id_x` below, because a row
that exists only on the right has no value in the left key column:

```nu
[[id l]; [1 a] [2 b]] | polars into-df | polars join ([[id r]; [2 x] [3 y]] | polars into-df) id id --full | polars sort-by id
# => ╭───┬────┬───┬──────┬───╮
# => │ # │ id │ l │ id_x │ r │
# => ├───┼────┼───┼──────┼───┤
# => │ 0 │    │   │    3 │ y │
# => │ 1 │  1 │ a │      │   │
# => │ 2 │  2 │ b │    2 │ x │
# => ╰───┴────┴───┴──────┴───╯
```

Add `--coalesce-columns` to merge the two key columns into one that takes its
value from whichever side has it:

```nu
[[id l]; [1 a] [2 b]] | polars into-df | polars join ([[id r]; [2 x] [3 y]] | polars into-df) id id --full --coalesce-columns | polars sort-by id
# => ╭───┬────┬───┬───╮
# => │ # │ id │ l │ r │
# => ├───┼────┼───┼───┤
# => │ 0 │  1 │ a │   │
# => │ 1 │  2 │ b │ x │
# => │ 2 │  3 │   │ y │
# => ╰───┴────┴───┴───╯
```

The remaining flags:

- `--cross` (`-c`) pairs every left row with every right row, and you don't give it any key columns.
- `--nulls-equal` lets a null key match a null key on the other side. Without it, rows with a null key never match.
- `--inner` (`-i`) names the default inner join explicitly.

Pass only one join type. `--cross` together with `--left` or `--full` fails when
collected, with `expected join keys/predicates`.

### Joining on a condition

`polars join` pairs rows whose keys are equal.
[`polars join-where`](/commands/docs/polars_join-where.md) pairs rows for which an
expression is true, such as one column being less than another. Every left row is
paired with every right row that satisfies the condition, and a left row that
matches nothing is left out, as `t3` is here:

```nu
[[trip km]; [t1 120] [t2 450] [t3 1500]] | polars into-df
| polars join-where ([[car range_km]; [city 300] [hybrid 600] [diesel 1000]] | polars into-df) ((polars col km) <= (polars col range_km))
| polars sort-by trip car
# => ╭───┬──────┬─────┬────────┬──────────╮
# => │ # │ trip │ km  │  car   │ range_km │
# => ├───┼──────┼─────┼────────┼──────────┤
# => │ 0 │ t1   │ 120 │ city   │      300 │
# => │ 1 │ t1   │ 120 │ diesel │     1000 │
# => │ 2 │ t1   │ 120 │ hybrid │      600 │
# => │ 3 │ t2   │ 450 │ diesel │     1000 │
# => │ 4 │ t2   │ 450 │ hybrid │      600 │
# => ╰───┴──────┴─────┴────────┴──────────╯
```

The condition can compare columns from both sides, test a column from one side
against a value, and join several comparisons with `and`. A right column whose
name the left dataframe already uses gets the suffix `_right`, not the `_x` that
`polars join` adds, and the condition refers to it by that name, as in
`(polars col x) > (polars col x_right)`. A condition that isn't boolean fails with
`'join_where' predicates must resolve to boolean`. The command has no flags. The
result is eager or lazy to match the left input, and the right dataframe can be
either kind.

## DataFrame group-by

One of the most powerful operations that can be performed with a DataFrame is
the [`polars group-by`](/commands/docs/polars_group-by.md). This command will allow you to perform aggregation operations
based on a grouping criteria. In Nushell, a `GroupBy` is a type of object that
can be stored and reused for multiple aggregations. This is quite handy, since
the creation of the grouped pairs is the most expensive operation while doing
group-by and there is no need to repeat it if you are planning to do multiple
operations with the same group condition.

To create a `GroupBy` object you only need to use the [`polars group-by`](/commands/docs/polars_group-by.md) command

```nu
let group = $df_1 | polars group-by first
$group
# => ╭─────────────┬──────────────────────────────────────────────╮
# => │ LazyGroupBy │ apply aggregation to complete execution plan │
# => ╰─────────────┴──────────────────────────────────────────────╯
```

When printing the `GroupBy` object we can see that it is in the background a
lazy operation waiting to be completed by adding an aggregation. Using the
`GroupBy` we can create aggregations on a column

```nu
$group | polars agg (polars col int_1 | polars sum)
# => ╭────────────────┬───────────────────────────────────────────────────────────────────────────────────────────╮
# => │ plan           │ AGGREGATE[maintain_order: false]                                                          │
# => │                │   [col("int_1").sum()] BY [col("first")]                                                  │
# => │                │   FROM                                                                                    │
# => │                │   DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT */8 COLUMNS                   │
# => │ optimized_plan │ AGGREGATE[maintain_order: false]                                                          │
# => │                │   [col("int_1").sum()] BY [col("first")]                                                  │
# => │                │   FROM                                                                                    │
# => │                │   DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT["first", "int_1"] 2/8 COLUMNS │
# => ╰────────────────┴───────────────────────────────────────────────────────────────────────────────────────────╯
```

or we can define multiple aggregations on the same or different columns

```nu
$group
| polars agg [
    (polars col int_1 | polars n-unique)
    (polars col int_2 | polars min)
    (polars col float_1 | polars sum)
    (polars col float_2 | polars count)
] | polars sort-by first
# => ╭────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ plan           │ SORT BY [col("first")]                                                                                               │
# => │                │   AGGREGATE[maintain_order: false]                                                                                   │
# => │                │     [col("int_1").n_unique(), col("int_2").min(), col("float_1").sum(), col("float_2").count()] BY [col("first")]    │
# => │                │     FROM                                                                                                             │
# => │                │     DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT */8 COLUMNS                                            │
# => │ optimized_plan │ SORT BY [col("first")]                                                                                               │
# => │                │   AGGREGATE[maintain_order: false]                                                                                   │
# => │                │     [col("int_1").n_unique(), col("int_2").min(), col("float_1").sum(), col("float_2").count()] BY [col("first")]    │
# => │                │     FROM                                                                                                             │
# => │                │     DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT["first", "int_1", "int_2", "float_1", ...] 5/8 COLUMNS │
# => ╰────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

As you can see, the `GroupBy` object is a very powerful variable and it is
worth keeping in memory while you explore your dataset.

Both examples print a plan instead of data. [`polars agg`](/commands/docs/polars_agg.md)
returns a lazy dataframe even when the group-by came from an eager one, so end the
pipeline with `polars collect` to see the result.

### Grouping keys and aggregations

`polars group-by` takes any number of keys, and each one can be a column name or
an expression. Name an expression key with `polars as`. Grouping by an
aggregation, such as `(polars col int_1 | polars sum)`, fails with
`Cannot group by an aggregation or window expression`.

```nu
$df_1 | polars group-by first second | polars agg (polars col int_1 | polars sum) | polars sort-by first second | polars collect
# => ╭───┬───────┬────────┬───────╮
# => │ # │ first │ second │ int_1 │
# => ├───┼───────┼────────┼───────┤
# => │ 0 │ a     │ b      │     6 │
# => │ 1 │ b     │ a      │    10 │
# => │ 2 │ b     │ c      │     7 │
# => │ 3 │ c     │ c      │    17 │
# => ╰───┴───────┴────────┴───────╯
```

`polars agg` runs each of its expressions once per group. An expression that
reduces a column to one value, such as `polars sum`, `polars mean`, `polars min`,
`polars count`, `polars n-unique`, or `polars first`, gives one value per group.
An expression that doesn't reduce, such as a bare `polars col word`, gives a list
of that group's values. [`polars len`](/commands/docs/polars_len.md) counts the
rows in each group:

```nu
$df_1 | polars group-by ((polars col int_1) mod 2 | polars as parity) | polars agg (polars col word) (polars len) | polars sort-by parity | polars collect
# => ╭───┬────────┬────────────────┬─────╮
# => │ # │ parity │      word      │ len │
# => ├───┼────────┼────────────────┼─────┤
# => │ 0 │      0 │ [list 6 items] │   6 │
# => │ 1 │      1 │ [list 4 items] │   4 │
# => ╰───┴────────┴────────────────┴─────╯
```

A column with the generic `object` type can't be aggregated, and naming one in
`polars agg` fails with `Object type column not supported for aggregation`.

Polars builds the groups in parallel, so they come out in no particular order,
and the order can change from one run to the next. That's why the examples in
this chapter sort the result. If you want the groups in the order their keys
first appear in the data, pass `--maintain-order` (`-m`) to `polars group-by`.
It's slower than the default:

```nu
$df_1 | polars group-by third --maintain-order | polars agg (polars col int_1 | polars sum) | polars collect
# => ╭───┬───────┬───────╮
# => │ # │ third │ int_1 │
# => ├───┼───────┼───────┤
# => │ 0 │ c     │    10 │
# => │ 1 │ a     │    13 │
# => │ 2 │ b     │    17 │
# => ╰───┴───────┴───────╯
```

## Creating Dataframes

It is also possible to construct dataframes from basic Nushell primitives, such
as integers, decimals, or strings. Let's create a small dataframe using the
command `polars into-df`.

```nu
let df_3 = [[a b]; [1 2] [3 4] [5 6]] | polars into-df
$df_3
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 2 │
# => │ 1 │ 3 │ 4 │
# => │ 2 │ 5 │ 6 │
# => ╰───┴───┴───╯
```

::: tip
Not every Nushell value has a matching dataframe type. Values that can't be
converted, such as closures or lists that mix types, are stored in a column
with the generic `object` type.
:::

We can append columns to a dataframe in order to create a new variable. As an
example, let's append two columns to our mini dataframe `$df_3`

```nu
let df_4 = $df_3 | polars with-column $df_3.a --name a2 | polars with-column $df_3.a --name a3
$df_4
# => ╭───┬───┬───┬────┬────╮
# => │ # │ a │ b │ a2 │ a3 │
# => ├───┼───┼───┼────┼────┤
# => │ 0 │ 1 │ 2 │  1 │  1 │
# => │ 1 │ 3 │ 4 │  3 │  3 │
# => │ 2 │ 5 │ 6 │  5 │  5 │
# => ╰───┴───┴───┴────┴────╯
```

Nushell's powerful piping syntax allows us to create new dataframes by
taking data from other dataframes and appending it to them. Now, if you list your
stored objects you will see in total five dataframes and the `GroupBy` object.
The `GroupBy` object has no `created` time, so we sort by the optional
`created?` column, which lists it last

```nu
polars store-ls | sort-by created? | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬─────────────┬─────────┬──────┬────────────────╮
# => │ # │                 key                  │    type     │ columns │ rows │ estimated_size │
# => ├───┼──────────────────────────────────────┼─────────────┼─────────┼──────┼────────────────┤
# => │ 0 │ e780af47-c106-49eb-b38d-d42d3946d66e │ DataFrame   │       8 │   10 │          403 B │
# => │ 1 │ 3146f4c1-f2a0-475b-a623-7375c1fdb4a7 │ LazyFrame   │       4 │    1 │           32 B │
# => │ 2 │ 455a1483-e328-43e2-a354-35afa32803b9 │ DataFrame   │       5 │    4 │          132 B │
# => │ 3 │ 9504dfaf-4782-42d4-9110-9dae7c8fb95b │ DataFrame   │       2 │    3 │           48 B │
# => │ 4 │ 37ab1bdc-e1fb-426d-8006-c3f974764a3d │ DataFrame   │       4 │    3 │           96 B │
# => │ 5 │ 0d8532a5-083b-4f78-8f66-b5e6b59dc449 │ LazyGroupBy │         │      │                │
# => ╰───┴──────────────────────────────────────┴─────────────┴─────────┴──────┴────────────────╯
```

One thing that is important to mention is how the memory is being optimized
while working with dataframes, and this is thanks to **Apache Arrow** and
**Polars**. In a very simple representation, each column in a DataFrame is an
Arrow Array, which is using several memory specifications in order to maintain
the data as packed as possible (check [Arrow columnar
format](https://arrow.apache.org/docs/format/Columnar.html)). The other
optimization trick is the fact that whenever possible, the columns from the
dataframes are shared between dataframes, avoiding memory duplication for the
same data. This means that dataframes `$df_3` and `$df_4` are sharing the same two
columns we created using the `polars into-df` command. For this reason, it isn't
possible to change the value of a column in a dataframe. However, you can
create new columns based on data from other columns or dataframes.

### How values become columns

`polars into-df` accepts several shapes of input:

- A table, which is a list of records, gives one column per key. Every record needs the same keys, or the command fails with `Error creating dataframe`. Fill in missing keys first, for example with [`default`](/commands/docs/default.md).
- A list of plain values gives a single column named `0`.
- A list of lists treats each inner list as a row, and names the columns `0`, `1`, and so on.
- A single record gives a dataframe with one row.
- A record of lists also gives one row, with a list in each column. Add `--as-columns` to turn each list into a column instead.

```nu
[[1 x] [2 y]] | polars into-df
# => ╭───┬───┬───╮
# => │ # │ 0 │ 1 │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ x │
# => │ 1 │ 2 │ y │
# => ╰───┴───┴───╯
{a: [1 2 3], b: [x y z]} | polars into-df --as-columns
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ x │
# => │ 1 │ 2 │ y │
# => │ 2 │ 3 │ z │
# => ╰───┴───┴───╯
```

Each column's type comes from the Nushell values in it:

| Nushell value       | Column type                              |
| ------------------- | ---------------------------------------- |
| `int`               | `i64`                                    |
| `float`             | `f64`                                    |
| `string`            | `str`                                    |
| `bool`              | `bool`                                   |
| `datetime`          | `datetime<ns, UTC>`                      |
| `duration`          | `i64`, holding the number of nanoseconds |
| `filesize`          | `i64`, holding the number of bytes       |
| `binary`            | `binary`                                 |
| `list`              | `list` of the elements' type             |
| `record`, `range`, `closure`, and anything else | `object`     |

A `null` becomes a missing value in a column of the other values' type, but a
column that holds only nulls is `object`. When a column mixes types, its first
value decides the type, and the rest are converted to it where possible. A
column that starts with a string turns later numbers into strings, and one that
starts with a float turns later ints into floats. When a value can't be
converted, such as a float after an int, the whole column becomes `object`, and
the plugin prints `Falling back to object type` on stderr.

To pick the types yourself, pass `--schema` (`-s`) a record of column name to
type name. Values are converted to the type you give, and input columns the
schema doesn't name are left out:

```nu
[[a b]; [1 2] [3 4]] | polars into-df --schema {a: f32, b: str}
# => ╭───┬──────┬───╮
# => │ # │  a   │ b │
# => ├───┼──────┼───┤
# => │ 0 │ 1.00 │ 2 │
# => │ 1 │ 3.00 │ 4 │
# => ╰───┴──────┴───╯
```

A schema column that the input doesn't have is added and filled with nulls:

```nu
[[a b]; [1 2] [3 4]] | polars into-df --schema {a: i64, b: i64, c: str} | polars collect
# => ╭───┬───┬───┬───╮
# => │ # │ a │ b │ c │
# => ├───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │   │
# => │ 1 │ 3 │ 4 │   │
# => ╰───┴───┴───┴───╯
```

A value that can't be converted fails, for example `Can't convert to int.` for a
string in an `i64` column. [`polars into-lazy`](/commands/docs/polars_into-lazy.md)
takes the same `--schema` flag.

`polars schema --datatype-list` (`-l`) lists the type names you can use, with
notes on the `datetime` and `duration` forms, such as `datetime<ms, UTC>`.
Schemas also accept `decimal<precision, scale>`. To check the types of a
dataframe you've built,
[`polars schema`](/commands/docs/polars_schema.md) returns a record of column
name to type name, and [`polars shape`](/commands/docs/polars_shape.md) returns a
one-row dataframe with `rows` and `columns` columns. Both work on lazy dataframes
too.

## Working with Series

A `Series` is the building block of a `DataFrame`. Each Series represents a
column with the same data type, and we can create multiple Series of different
types, such as float, int or string.

Let's start our exploration with Series by creating one using the `polars into-df`
command:

```nu
let df_5 = [9 8 4] | polars into-df
$df_5
# => ╭───┬───╮
# => │ # │ 0 │
# => ├───┼───┤
# => │ 0 │ 9 │
# => │ 1 │ 8 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

We have created a new series from a list of integers (we could have done the
same using floats or strings)

Series have their own basic operations defined, and they can be used to create
other Series. Let's create a new Series by doing some arithmetic on the
previously created column.

```nu
let df_6 = $df_5 * 3 + 10
$df_6
# => ╭───┬────╮
# => │ # │ 0  │
# => ├───┼────┤
# => │ 0 │ 37 │
# => │ 1 │ 34 │
# => │ 2 │ 22 │
# => ╰───┴────╯
```

Now we have a new Series that was constructed by doing basic operations on the
previous variable.

::: tip
If you want to see how many variables you have stored in memory you can
use `scope variables`
:::

Let's rename our previous Series so it has a memorable name

```nu
let df_7 = $df_6 | polars rename "0" memorable
$df_7
# => ╭───┬───────────╮
# => │ # │ memorable │
# => ├───┼───────────┤
# => │ 0 │        37 │
# => │ 1 │        34 │
# => │ 2 │        22 │
# => ╰───┴───────────╯
```

To rename several columns at once, give [`polars rename`](/commands/docs/polars_rename.md)
a list of old names and a list of new names:

```nu
$df_3 | polars rename [a b] [x y]
# => ╭───┬───┬───╮
# => │ # │ x │ y │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 2 │
# => │ 1 │ 3 │ 4 │
# => │ 2 │ 5 │ 6 │
# => ╰───┴───┴───╯
```

The lists pair up by position. On an eager dataframe, extra names in the longer
list are ignored, and a column that doesn't exist fails right away with
`Error renaming`. On a lazy dataframe, lists of different lengths are an error,
and a missing column is only reported when you collect.

We can also do basic operations with two Series as long as they have the same
data type

```nu
$df_5 - $df_7
# => ╭───┬─────────────────╮
# => │ # │ sub_0_memorable │
# => ├───┼─────────────────┤
# => │ 0 │             -28 │
# => │ 1 │             -26 │
# => │ 2 │             -18 │
# => ╰───┴─────────────────╯
```

And we can add them to previously defined dataframes

```nu
let df_8 = $df_3 | polars with-column $df_5 --name new_col
$df_8
# => ╭───┬───┬───┬─────────╮
# => │ # │ a │ b │ new_col │
# => ├───┼───┼───┼─────────┤
# => │ 0 │ 1 │ 2 │       9 │
# => │ 1 │ 3 │ 4 │       8 │
# => │ 2 │ 5 │ 6 │       4 │
# => ╰───┴───┴───┴─────────╯
```

Without `--name`, the new column keeps the series' own name. If the dataframe
already has a column with that name, [`polars with-column`](/commands/docs/polars_with-column.md)
replaces it in place instead of adding one. Multiplying `$df_3.a` by 10 keeps the
name `a`, so this replaces column `a`:

```nu
$df_3 | polars with-column ($df_3.a * 10)
# => ╭───┬────┬───╮
# => │ # │ a  │ b │
# => ├───┼────┼───┤
# => │ 0 │ 10 │ 2 │
# => │ 1 │ 30 │ 4 │
# => │ 2 │ 50 │ 6 │
# => ╰───┴────┴───╯
```

`polars with-column` also takes expressions, as in the
[lazy dataframe examples](#lazy-dataframes). Name an expression's column with
`polars as`, because `--name` with an expression fails with
`Flag 'name' is unsupported when used with expressions`. A lazy dataframe takes
only expressions, not series.

The Series stored in a Dataframe can also be used directly, for example,
we can multiply columns `a` and `b` to create a new Series

```nu
$df_8.a * $df_8.b
# => ╭───┬─────────╮
# => │ # │ mul_a_b │
# => ├───┼─────────┤
# => │ 0 │       2 │
# => │ 1 │      12 │
# => │ 2 │      30 │
# => ╰───┴─────────╯
```

A cell path with a column name, such as `$df_8.a`, returns that column as a
one-column dataframe. An integer cell path returns the value in that row of a
one-column dataframe:

```nu
$df_5.1
# => 8
```

On a dataframe with more than one column, an integer cell path fails with
`Error using as series`, so name the column first, as in `$df_8.a.1`. A row
number past the end fails with `Cannot access empty content`. On a lazy
dataframe, a cell path builds an expression instead of reading data. For a lazy
dataframe in `$lf`, `$lf.a` is the same as `polars col a`, and `$lf.0` stands for
its first column.

and we can start piping things in order to create new columns and dataframes

```nu
let df_9 = $df_8 | polars with-column ($df_8.a * $df_8.b / $df_8.new_col) --name my_sum
$df_9
# => ╭───┬───┬───┬─────────┬────────╮
# => │ # │ a │ b │ new_col │ my_sum │
# => ├───┼───┼───┼─────────┼────────┤
# => │ 0 │ 1 │ 2 │       9 │      0 │
# => │ 1 │ 3 │ 4 │       8 │      1 │
# => │ 2 │ 5 │ 6 │       4 │      7 │
# => ╰───┴───┴───┴─────────┴────────╯
```

Nushell's piping system can help you create very interesting workflows.

### Series operators

These operators work between a series, meaning a one-column dataframe, and a
single value:

- `+`, `-`, `*`, and `/` with an int or a float. The value has to match the
  series. An `i64` series takes ints and an `f64` series takes floats, so
  `$df_5 - 2.5` fails with `Incorrect type`. `+` also appends a string to every
  value of a string series. Dividing by zero fails.
- `==`, `!=`, `<`, `<=`, `>`, and `>=` with an int or a float, under the same
  type rule. `==` also takes a string. To find the values that differ from a
  string, use an expression, as in
  `$df_1 | polars filter-with ((polars col first) != a)`.
- `=~` with a string, which is a regular expression that each value has to
  match somewhere.
- `starts-with` and `ends-with` with a string, which has to appear literally at
  the start or end of each value.

```nu
$df_5 >= 8
# => ╭───┬───────╮
# => │ # │   0   │
# => ├───┼───────┤
# => │ 0 │ true  │
# => │ 1 │ true  │
# => │ 2 │ false │
# => ╰───┴───────╯
[apple banana cherry] | polars into-df | $in ends-with y
# => ╭───┬───────╮
# => │ # │   0   │
# => ├───┼───────┤
# => │ 0 │ false │
# => │ 1 │ false │
# => │ 2 │ true  │
# => ╰───┴───────╯
```

Between two series of the same type and length, `+`, `-`, `*`, `/` and the six
comparison operators work row by row, and `and` and `or` combine two boolean
series. The result's column is named after the operator and both columns, as
in `sub_0_memorable` above, `lt_a_b` for `<`, or `neq_a_b` for `!=`.

When either side has more than one column, only `+` works. It places the right
dataframe's columns after the left one's, adding `_x` to names that clash, and
both sides need the same number of rows. Other operators fail with
`The '-' operator does not work on values of type 'polars_dataframe'` or the
matching message.

::: tip
When the left side of a comparison is a cell path, as in `$df_1.int_1 > 5`,
store the mask in a variable declared with the `any` type,
`let mask: any = $df_1.int_1 > 5`, and pass the variable to the next command.
:::

## Series and Masks

Series have another key use in when working with `DataFrames`, and it is the fact
that we can build boolean masks out of them. Let's start by creating a simple
mask using the equality operator

```nu
let mask_0 = $df_5 == 8
$mask_0
# => ╭───┬───────╮
# => │ # │   0   │
# => ├───┼───────┤
# => │ 0 │ false │
# => │ 1 │ true  │
# => │ 2 │ false │
# => ╰───┴───────╯
```

and with this mask we can now filter a dataframe, like this

```nu
$df_9 | polars filter-with $mask_0
# => ╭───┬───┬───┬─────────┬────────╮
# => │ # │ a │ b │ new_col │ my_sum │
# => ├───┼───┼───┼─────────┼────────┤
# => │ 0 │ 3 │ 4 │       8 │      1 │
# => ╰───┴───┴───┴─────────┴────────╯
```

Now we have a new dataframe with only the values where the mask was true.

The mask has to be a boolean series with one value per row. Any other type
fails with `Error casting to bool`, and a mask of a different length fails with
`Error filtering dataframe`. Series masks work only on eager dataframes. A lazy
dataframe accepts only an expression, such as `(polars col a) > 1`, and a series
mask there fails with `Can't convert to NuExpression.`

The masks can also be created from Nushell lists, for example:

```nu
let mask_1 = [true true false] | polars into-df
$df_9 | polars filter-with $mask_1
# => ╭───┬───┬───┬─────────┬────────╮
# => │ # │ a │ b │ new_col │ my_sum │
# => ├───┼───┼───┼─────────┼────────┤
# => │ 0 │ 1 │ 2 │       9 │      0 │
# => │ 1 │ 3 │ 4 │       8 │      1 │
# => ╰───┴───┴───┴─────────┴────────╯
```

To create complex masks, we have the `AND`

```nu
$mask_0 and $mask_1
# => ╭───┬─────────╮
# => │ # │ and_0_0 │
# => ├───┼─────────┤
# => │ 0 │ false   │
# => │ 1 │ true    │
# => │ 2 │ false   │
# => ╰───┴─────────╯
```

and `OR` operations

```nu
$mask_0 or $mask_1
# => ╭───┬────────╮
# => │ # │ or_0_0 │
# => ├───┼────────┤
# => │ 0 │ true   │
# => │ 1 │ true   │
# => │ 2 │ false  │
# => ╰───┴────────╯
```

We can also create a mask by checking if some values exist in other Series.
Using the first dataframe that we created we can do something like this

```nu
let mask_2 = $df_1 | polars col first | polars is-in ([b c] | polars into-df)
$mask_2 | describe
# => polars_expression
```

This time the mask is an expression instead of a Series of booleans, but it
can be used to filter the dataframe in the same way

```nu
$df_1 | polars filter-with $mask_2
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 1 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 2 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 3 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => │ 4 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => │ 5 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 6 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

[`polars is-in`](/commands/docs/polars_is-in.md) also takes a plain Nushell list,
so `polars col first | polars is-in [b c]` builds the same mask. Its
`--maintain-order` (`-o`) flag keeps the list's values in their original order
while the plugin builds it. Membership doesn't depend on that order, so the mask
comes out the same either way.

Another operation that can be done with masks is setting or replacing a value
from a series. For example, we can change the value in the column `first` where
the value is equal to `a`

```nu
$df_1 | polars get first | polars set new --mask ($df_1.first =~ a)
# => ╭───┬────────╮
# => │ # │ string │
# => ├───┼────────┤
# => │ 0 │ new    │
# => │ 1 │ new    │
# => │ 2 │ new    │
# => │ 3 │ b      │
# => │ 4 │ b      │
# => │ 5 │ b      │
# => │ 6 │ b      │
# => │ 7 │ c      │
# => │ 8 │ c      │
# => │ 9 │ c      │
# => ╰───┴────────╯
```

[`polars set`](/commands/docs/polars_set.md) works on one column at a time, so its
input has to be a one-column dataframe, and a wider one fails with
`Error using as series`. The `--mask` has to be a boolean series, and anything
else fails with `Incorrect type`. The new value can be an int, a float, or a
string, and it has to match the column, so an int goes in an `i64` column, a
float in an `f64` column, and a string in a `str` column. A mismatch fails with
an error such as `Error casting to i64`, and any other kind of value fails with
`Incorrect value type`. When you set a string, the result's column is named
`string`, as above.

## Series as Indices

Series can be also used as a way of filtering a dataframe by using them as a
list of indices. For example, let's say that we want to get rows 1, 4, and 6
from our original dataframe. With that in mind, we can use the next command to
extract that information

```nu
let indices_0 = [1 4 6] | polars into-df
$df_1 | polars take $indices_0
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 1 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 2 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

The indices have to be a series of integers of type `i32`, `i64`, `u32`, or
`u64`. Any other type, such as a float series or a `u8` series, fails with
`Incorrect type`. `polars take` also works on a lazy dataframe and returns a lazy
one.

The command [`polars take`](/commands/docs/polars_take.md) is very handy, especially if we mix it with other commands.
Let's say that we want to extract all rows for the first duplicated element for
column `first`. In order to do that, we can use the command `polars arg-unique` as
shown in the next example

```nu
let indices_1 = $df_1 | polars get first | polars arg-unique
$df_1 | polars take $indices_1
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
# => │ 1 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 2 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

[`polars arg-unique`](/commands/docs/polars_arg-unique.md) looks at a single
column, which is why the example picks one with `polars get` first. A dataframe
with more than one column fails with `Error using as series`.

Or what if we want to create a new sorted dataframe using a column in specific.
We can use the `arg-sort` to accomplish that. In the next example we
can sort the dataframe by the column `word`

::: tip
The same result could be accomplished using the command [`polars sort-by`](/commands/docs/polars_sort-by.md)
:::

```nu
let indices_2 = $df_1 | polars get word | polars arg-sort
$df_1 | polars take $indices_2
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => │ 1 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
# => │ 2 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 3 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => │ 4 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 5 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 6 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 7 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
# => │ 8 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 9 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

[`polars arg-sort`](/commands/docs/polars_arg-sort.md) also works on one column,
and returns its indices in a `u64` column named `arg_sort`. By default it sorts
in ascending order and puts null values first. `--reverse` (`-r`) sorts in
descending order, with nulls still first, and `--nulls-last` (`-n`) moves the
nulls to the end. `--maintain-order` (`-m`) keeps equal values in the order they
had in the input. `--limit` (`-l`) asks for only the first that many indices.
Polars treats it as an optimization hint that it may ignore, so take the first
rows yourself if you need an exact count.

And finally, we can create new Series by setting a new value in the marked
indices. Have a look at the next command

```nu
let indices_3 = [0 2] | polars into-df
$df_1 | polars get int_1 | polars set-with-idx 123 --indices $indices_3
# => ╭───┬───────╮
# => │ # │ int_1 │
# => ├───┼───────┤
# => │ 0 │   123 │
# => │ 1 │     2 │
# => │ 2 │   123 │
# => │ 3 │     4 │
# => │ 4 │     0 │
# => │ 5 │     6 │
# => │ 6 │     7 │
# => │ 7 │     8 │
# => │ 8 │     9 │
# => │ 9 │     0 │
# => ╰───┴───────╯
```

[`polars set-with-idx`](/commands/docs/polars_set-with-idx.md) follows the same
rules as `polars set`. The input has to be a one-column dataframe, and the value
has to be an int, a float, or a string that matches the column's type. Its
`--indices` follow the same integer rule as `polars take`.

## Unique Values

Another operation that can be done with `Series` is to search for unique values
in a list or column. Lets use again the first dataframe we created to test
these operations.

The first and most common operation that we have is `polars value-counts`. This
command calculates a count of the unique values that exist in a Series. For
example, we can use it to count how many occurrences we have in the column
`first`. The order of the rows returned by `polars value-counts` isn't
guaranteed, so we sort them with `polars sort-by`

```nu
$df_1 | polars get first | polars value-counts | polars sort-by first
# => ╭───┬───────┬───────╮
# => │ # │ first │ count │
# => ├───┼───────┼───────┤
# => │ 0 │ a     │     3 │
# => │ 1 │ b     │     4 │
# => │ 2 │ c     │     3 │
# => ╰───┴───────┴───────╯
```

As expected, the command returns a new dataframe that can be used to do more
queries.

[`polars value-counts`](/commands/docs/polars_value-counts.md) counts the values
of a single column, so its input has to be a one-column dataframe. A lazy input
is collected first, and the result is always an eager dataframe. `--sort` (`-s`)
orders the rows from the highest count to the lowest, and `--column` (`-c`)
renames the `count` column:

```nu
$df_1 | polars get first | polars value-counts --sort --column n
# => ╭───┬───────┬───╮
# => │ # │ first │ n │
# => ├───┼───────┼───┤
# => │ 0 │ b     │ 4 │
# => │ 1 │ a     │ 3 │
# => │ 2 │ c     │ 3 │
# => ╰───┴───────┴───╯
```

Values with the same count can come out in either order. `--parallel` (`-p`)
counts on several threads, which only changes the speed. `--normalize` (`-n`)
turns the counts into fractions of the total. Give it `true` from a variable
declared as `any`:

```nu
let yes: any = true
$df_1 | polars get first | polars value-counts --normalize $yes | polars sort-by first
# => ╭───┬───────┬───────╮
# => │ # │ first │ count │
# => ├───┼───────┼───────┤
# => │ 0 │ a     │  0.30 │
# => │ 1 │ b     │  0.40 │
# => │ 2 │ c     │  0.30 │
# => ╰───┴───────┴───────╯
```

Continuing with our exploration of `Series`, the next thing that we can do is
to only get the unique values from a series (sorted again, because the order
isn't guaranteed), like this

```nu
$df_1 | polars get first | polars unique | polars sort-by first
# => ╭───┬───────╮
# => │ # │ first │
# => ├───┼───────┤
# => │ 0 │ a     │
# => │ 1 │ b     │
# => │ 2 │ c     │
# => ╰───┴───────╯
```

On an eager dataframe, [`polars unique`](/commands/docs/polars_unique.md) works
on a single column and ignores its flags. On a lazy dataframe, it removes
duplicate rows instead, and keeps the first row of each set of duplicates.
`--subset` (`-s`) compares only the listed columns, and `--last` (`-l`) keeps the
last row of each set instead of the first:

```nu
$df_1 | polars into-lazy | polars unique --subset [first] | polars select first int_1 word | polars collect
# => ╭───┬───────┬───────┬────────╮
# => │ # │ first │ int_1 │  word  │
# => ├───┼───────┼───────┼────────┤
# => │ 0 │ a     │     1 │ first  │
# => │ 1 │ b     │     4 │ second │
# => │ 2 │ c     │     8 │ eight  │
# => ╰───┴───────┴───────┴────────╯
```

On a lazy dataframe, `polars unique` keeps the rows in their original order.

`polars unique` also works on an expression, which keeps the unique values of
one column. There `--maintain-order` (`-k`) keeps the values in the order they
first appear:

```nu
$df_1 | polars select (polars col first | polars unique --maintain-order) | polars collect
# => ╭───┬───────╮
# => │ # │ first │
# => ├───┼───────┤
# => │ 0 │ a     │
# => │ 1 │ b     │
# => │ 2 │ c     │
# => ╰───┴───────╯
```

Or we can get a mask that we can use to filter out the rows where data is
unique or duplicated. For example, we can select the rows for unique values
in column `word`

```nu
$df_1 | polars filter-with ($in.word | polars is-unique)
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────┤
# => │ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first │
# => │ 1 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────╯
```

Or all the duplicated ones

```nu
$df_1 | polars filter-with ($in.word | polars is-duplicated)
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 1 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
# => │ 2 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 3 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 4 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 5 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => │ 6 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 7 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

Given a dataframe with more than one column,
[`polars is-unique`](/commands/docs/polars_is-unique.md) and
[`polars is-duplicated`](/commands/docs/polars_is-duplicated.md) compare whole
rows. This keeps the rows whose combination of `first` and `second` appears only
once:

```nu
$df_1 | polars filter-with ($df_1 | polars get first second | polars is-unique)
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────┤
# => │ 0 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────╯
```

Both commands also take a lazy dataframe, which they collect first, and they
always return an eager mask, in a column named `is_unique` or `is_duplicated`.

## Lazy Dataframes

Lazy dataframes are a way to query data by creating a logical plan. The
advantage of this approach is that the plan never gets evaluated until you need
to extract data. This way you could chain together aggregations, joins and
selections and collect the data once you are happy with the selected
operations.

Let's create a small example of a lazy dataframe

```nu
let lf_0 = [[a b]; [1 a] [2 b] [3 c] [4 d]] | polars into-lazy
$lf_0
# => ╭────────────────┬────────────────────────────────────╮
# => │ plan           │ DF ["a", "b"]; PROJECT */2 COLUMNS │
# => │ optimized_plan │ DF ["a", "b"]; PROJECT */2 COLUMNS │
# => ╰────────────────┴────────────────────────────────────╯
```

As you can see, the resulting dataframe is not yet evaluated, it stays as a
set of instructions that can be done on the data. If you were to collect that
dataframe you would get the next result

```nu
$lf_0 | polars collect
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ a │
# => │ 1 │ 2 │ b │
# => │ 2 │ 3 │ c │
# => │ 3 │ 4 │ d │
# => ╰───┴───┴───╯
```

as you can see, the collect command executes the plan and gives you an eager
dataframe. It prints like a table, but it is still a dataframe held by the
plugin. When you want a plain Nushell table, pipe it to
[`polars into-nu`](/commands/docs/polars_into-nu.md):

```nu
$lf_0 | polars collect | polars into-nu | describe
# => table<a: int, b: string>
```

`polars into-nu` collects a lazy dataframe itself, so the `polars collect` above is
optional. Without flags it converts every row. `--rows` (`-n`) keeps that many
rows from the top, and `--tail` (`-t`) takes them from the bottom instead, five
unless you also pass `--rows`. `--index` (`-i`) adds an `index` column holding
each row's position in the dataframe. Nushell shows that column as the `#`
column, so after `--tail` the row numbers still match the dataframe:

```nu
$df_1 | polars select int_1 word | polars into-nu --tail --rows 3 --index
# => ╭───┬───────┬───────╮
# => │ # │ int_1 │ word  │
# => ├───┼───────┼───────┤
# => │ 7 │     8 │ eight │
# => │ 8 │     9 │ ninth │
# => │ 9 │     0 │ ninth │
# => ╰───┴───────┴───────╯
```

Columns come back as the matching Nushell types, except where `polars into-df`
already changed the type. A `duration` or `filesize` value became an `i64` column,
as [How values become columns](#how-values-become-columns) shows, so it comes back
as an `int`.

`polars into-nu` also converts an expression, a selector, a schema, or a data
type. An expression becomes a record that shows how it's built, which helps when
an expression doesn't do what you expected:

```nu
(polars col a) * 2 | polars as b | polars into-nu | table --expand
# => ╭───────┬────────────────────────────────────╮
# => │       │ ╭───────┬────────────────────────╮ │
# => │ expr  │ │       │ ╭───────┬────────────╮ │ │
# => │       │ │ left  │ │ expr  │ column     │ │ │
# => │       │ │       │ │ value │ a          │ │ │
# => │       │ │       │ ╰───────┴────────────╯ │ │
# => │       │ │ op    │ *                      │ │
# => │       │ │       │ ╭───────┬────────────╮ │ │
# => │       │ │ right │ │ expr  │ literal    │ │ │
# => │       │ │       │ │ value │ dyn int: 2 │ │ │
# => │       │ │       │ ╰───────┴────────────╯ │ │
# => │       │ ╰───────┴────────────────────────╯ │
# => │ alias │ b                                  │
# => ╰───────┴────────────────────────────────────╯
```

A schema becomes a record of column names and type names, and a data type
becomes its name as a string. A selector becomes a string in Polars' internal
notation, such as `Some(ByName { names: ["a", "b"], strict: false })`.

Given an eager dataframe, `polars collect` returns it unchanged, so you can end
a pipeline with it whichever kind of dataframe reaches it. Any other input, such
as an expression, is an error.

Most dataframe commands take either an eager or a lazy dataframe and convert
between the two in the background when they need to. Some return a lazy
dataframe even for eager input, and some collect a lazy input.
[When results are eager or lazy](#when-results-are-eager-or-lazy) lists which
commands do what. To take advantage of lazy operations, keep a pipeline lazy
until you collect it at the end.

To find all lazy dataframe operations you can use

```nu no-run
scope commands | where category =~ lazyframe | select name category description
```

With your lazy frame defined we can start chaining operations on it. For
example this

```nu
$lf_0
| polars reverse
| polars with-column [
     ((polars col a) * 2 | polars as double_a)
     ((polars col a) / 2 | polars as half_a)
]
| polars collect
# => ╭───┬───┬───┬──────────┬────────╮
# => │ # │ a │ b │ double_a │ half_a │
# => ├───┼───┼───┼──────────┼────────┤
# => │ 0 │ 4 │ d │        8 │      2 │
# => │ 1 │ 3 │ c │        6 │      1 │
# => │ 2 │ 2 │ b │        4 │      1 │
# => │ 3 │ 1 │ a │        2 │      0 │
# => ╰───┴───┴───┴──────────┴────────╯
```

:::tip
You can use the line buffer editor to format your queries (`ctrl + o`) easily
:::

This query uses the lazy reverse command to invert the dataframe and the
`polars with-column` command to create new two columns using `expressions`.
[`polars reverse`](/commands/docs/polars_reverse.md) also works on an eager
dataframe, and then returns an eager one, as `$df_3 | polars reverse` shows.
An `expression` is used to define an operation that is executed on the lazy
frame. When put together they create the whole set of instructions used by the
lazy commands to query the data. To list all the commands that generate an
expression you can use

```nu no-run
scope commands | where category =~ expression | select name category description
```

In our previous example, we use the `polars col` command to indicate that column `a`
will be multiplied by 2 and then it will be aliased to the name `double_a`.
In some cases the use of the `polars col` command can be inferred. For example,
using the `polars select` command we can use only a string

```nu
$lf_0 | polars select a | polars collect
# => ╭───┬───╮
# => │ # │ a │
# => ├───┼───┤
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

or the `polars col` command

```nu
$lf_0 | polars select (polars col a) | polars collect
# => ╭───┬───╮
# => │ # │ a │
# => ├───┼───┤
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

Let's try something more complicated and create aggregations from a lazy
dataframe

```nu
let lf_1 =  [[name value]; [one 1] [two 2] [one 1] [two 3]] | polars into-lazy

$lf_1
| polars group-by name
| polars agg [
     (polars col value | polars sum | polars as sum)
     (polars col value | polars mean | polars as mean)
]
| polars sort-by name
| polars collect
# => ╭───┬──────┬─────┬──────╮
# => │ # │ name │ sum │ mean │
# => ├───┼──────┼─────┼──────┤
# => │ 0 │ one  │   2 │ 1.00 │
# => │ 1 │ two  │   5 │ 2.50 │
# => ╰───┴──────┴─────┴──────╯
```

And we could join on a lazy dataframe that hasn't being collected. Let's join
the resulting group by to the original lazy frame

```nu
let lf_2 =  [[name value]; [one 1] [two 2] [one 1] [two 3]] | polars into-lazy
let group = $lf_2
    | polars group-by name
    | polars agg [
      (polars col value | polars sum | polars as sum)
      (polars col value | polars mean | polars as mean)
    ]

$lf_2 | polars join $group name name | polars collect
# => ╭───┬──────┬───────┬─────┬──────╮
# => │ # │ name │ value │ sum │ mean │
# => ├───┼──────┼───────┼─────┼──────┤
# => │ 0 │ one  │     1 │   2 │ 1.00 │
# => │ 1 │ two  │     2 │   5 │ 2.50 │
# => │ 2 │ one  │     1 │   2 │ 1.00 │
# => │ 3 │ two  │     3 │   5 │ 2.50 │
# => ╰───┴──────┴───────┴─────┴──────╯
```

As you can see lazy frames are a powerful construct that will let you query
data using a flexible syntax, resulting in blazing fast results.

### Expression operators

Expressions take more operators than series do. Polars applies them when the
plan runs, so they work the same on eager and lazy dataframes:

- `+`, `-`, `*`, `/`, `//` (floor division), `mod`, and `**` (power)
- `==`, `!=`, `<`, `<=`, `>`, and `>=`
- `and`, `or`, and `xor` between boolean expressions

The left side has to be an expression. The right side can be another expression
or a plain value, so `(polars col a) * 2` works, but `2 * (polars col a)` fails
with `Types 'int' and 'polars_expression' are not compatible`. Like Nushell's own
operators, `//` rounds down and the result of `mod` takes the sign of the
divisor:

```nu
[[a b]; [7 2] [-7 3] [5 5]] | polars into-df | polars select [
    ((polars col a) // (polars col b) | polars as floor_div)
    ((polars col a) mod (polars col b) | polars as mod)
    ((polars col a) ** 2 | polars as squared)
    (((polars col a) > 0) xor ((polars col b) > 2) | polars as one_true)
] | polars collect
# => ╭───┬───────────┬─────┬─────────┬──────────╮
# => │ # │ floor_div │ mod │ squared │ one_true │
# => ├───┼───────────┼─────┼─────────┼──────────┤
# => │ 0 │         3 │   1 │      49 │ true     │
# => │ 1 │        -3 │   2 │      49 │ true     │
# => │ 2 │         1 │   0 │      25 │ false    │
# => ╰───┴───────────┴─────┴─────────┴──────────╯
```

### When results are eager or lazy

A command doesn't always return the same kind of dataframe it was given. The
commands fall into three groups:

- Most commands that accept both kinds return the kind they were given. These
  include `polars filter`, `polars filter-with`, `polars sort-by`,
  `polars reverse`, `polars join`, `polars join-where`, `polars first`,
  `polars last`, `polars rename`, `polars drop`, `polars take`, `polars slice`,
  `polars shift`, `polars cast`, `polars fill-null`, `polars drop-nulls`,
  `polars drop-duplicates`, `polars unnest`, `polars cache`, `polars median`,
  `polars quantile`, `polars summary`, and `polars query`. Of these,
  `polars drop`, `polars drop-nulls`, `polars drop-duplicates`,
  `polars summary`, and `polars query` run a lazy input's plan right away and
  wrap the result in a new lazy dataframe.
- Some always return a lazy dataframe, even for eager input: `polars select`,
  `polars with-column` with expressions, `polars agg`, `polars sum`,
  `polars min`, `polars max`, `polars mean`, `polars std`, `polars var`,
  `polars concat`, `polars pivot`, `polars unpivot`, `polars explode`,
  `polars flatten`, and `polars into-lazy`.
- Commands that need the data itself, including the ones that work on a single
  column, collect a lazy input and return an eager dataframe: `polars get`,
  `polars append`, `polars shape`, `polars value-counts`, `polars is-unique`,
  `polars is-duplicated`, `polars arg-sort`, `polars cut`, `polars qcut`,
  `polars sample`, `polars dummies`, `polars map-batches`, `polars fill-nan`,
  and `polars collect`.

When you aren't sure, check with [`describe`](/commands/docs/describe.md):

```nu
$df_1 | polars sort-by int_1 | describe
# => polars_dataframe
$df_1 | polars select int_1 | describe
# => polars_lazyframe
```

If a pipeline prints a plan where you expected data, end it with
`polars collect`.

## Selecting rows and columns

[`polars first`](/commands/docs/polars_first.md) takes an optional number of
rows, which defaults to 1, so `polars first 5` returns the first five rows. Given
a group-by, it returns the first rows of each group, as a lazy dataframe:

```nu
$df_1 | polars select first int_1 word | polars group-by first | polars first | polars sort-by first | polars collect
# => ╭───┬───────┬───────┬────────╮
# => │ # │ first │ int_1 │  word  │
# => ├───┼───────┼───────┼────────┤
# => │ 0 │ a     │     1 │ first  │
# => │ 1 │ b     │     4 │ second │
# => │ 2 │ c     │     8 │ eight  │
# => ╰───┴───────┴───────┴────────╯
```

Given an expression, as in `polars col int_1 | polars first`, it builds an
expression for the first value of the column and ignores the row count. Inside
`polars agg` that gives the first value of each group.

[`polars last`](/commands/docs/polars_last.md) works the same way from the other
end. It takes an optional row count that defaults to 1, returns the last rows of
each group when given a group-by, and builds a last-value expression, ignoring the
count, when given an expression or a selector.

[`polars slice`](/commands/docs/polars_slice.md) takes rows from anywhere in the
dataframe. Its arguments are the offset of the first row and the number of rows:

```nu
$df_1 | polars slice 2 3 | polars get int_1 word
# => ╭───┬───────┬────────╮
# => │ # │ int_1 │  word  │
# => ├───┼───────┼────────┤
# => │ 0 │     3 │ third  │
# => │ 1 │     4 │ second │
# => │ 2 │     0 │ third  │
# => ╰───┴───────┴────────╯
```

A negative offset counts back from the end, so `polars slice -3 2` starts at the
third row from the end. The window doesn't wrap around. On the ten rows of
`$df_1`, `polars slice -12 4` covers two positions before the first row and
returns only rows 0 and 1. An offset past the end returns an empty dataframe, and
a negative size fails with `Negative value passed when positive one is required`.

[`polars get`](/commands/docs/polars_get.md) picks columns by name, like
`polars select`, but it takes only names, not expressions or selectors, and it
always returns an eager dataframe, collecting a lazy input first. A name that
doesn't exist fails with `Error selecting columns`. A list of names fails with
`Incorrect column format`, so spread it instead, as in `polars get ...$names`.
The examples in this chapter use `polars get` to pick out the single column that
commands such as `polars arg-sort` and `polars value-counts` work on.

[`polars drop`](/commands/docs/polars_drop.md) removes the columns you name and
keeps the rest:

```nu
$df_1 | polars drop int_2 float_1 float_2 second third | polars first 3
# => ╭───┬───────┬───────┬────────╮
# => │ # │ int_1 │ first │  word  │
# => ├───┼───────┼───────┼────────┤
# => │ 0 │     1 │ a     │ first  │
# => │ 1 │     2 │ a     │ second │
# => │ 2 │     3 │ a     │ third  │
# => ╰───┴───────┴───────┴────────╯
```

A column that doesn't exist fails with `Error dropping column`. Given a lazy
dataframe, `polars drop` runs the plan, drops the columns from the result, and
wraps that in a new lazy dataframe, so everything before it in the pipeline runs
right away. To keep a pipeline lazy, select everything except those columns
instead, as in `polars select (polars selector exclude int_2 float_1)`.

[`polars columns`](/commands/docs/polars_columns.md) returns the column names as a
Nushell list of strings:

```nu
$df_1 | polars columns | first 3
# => ╭───┬─────────╮
# => │ 0 │ int_1   │
# => │ 1 │ int_2   │
# => │ 2 │ float_1 │
# => ╰───┴─────────╯
```

Given a lazy dataframe, `polars columns` runs the whole plan to find the names,
and fails if the plan does, for example on a CSV value that doesn't parse.
`polars schema | columns` gives the same list from the plan without reading the
data.

To keep the rows that match a condition, pass an expression to
[`polars filter`](/commands/docs/polars_filter.md). It takes one argument, so
combine conditions with `and` and `or`:

```nu
$df_1 | polars filter ((polars col first) == b and (polars col int_1) > 4) | polars get first int_1 word
# => ╭───┬───────┬───────┬────────╮
# => │ # │ first │ int_1 │  word  │
# => ├───┼───────┼───────┼────────┤
# => │ 0 │ b     │     6 │ second │
# => │ 1 │ b     │     7 │ third  │
# => ╰───┴───────┴───────┴────────╯
```

`polars filter` takes only expressions. A series mask fails with
`Can't convert to NuExpression.`, so filter with a mask through
[`polars filter-with`](/commands/docs/polars_filter-with.md), as in
[Series and Masks](#series-and-masks). A condition that isn't boolean fails with
`` filter predicate must be of type `Boolean` ``. On an eager dataframe, that
error and a missing column show up right away, and on a lazy one when you
collect.

`polars filter` also works on an expression, where it keeps the values for which
the condition holds. Inside `polars agg`, that filters each group on its own:

```nu
$df_1 | polars group-by first | polars agg (polars col int_1 | polars filter ((polars col word) == second) | polars sum | polars as second_total) | polars sort-by first | polars collect
# => ╭───┬───────┬──────────────╮
# => │ # │ first │ second_total │
# => ├───┼───────┼──────────────┤
# => │ 0 │ a     │            2 │
# => │ 1 │ b     │           10 │
# => │ 2 │ c     │            0 │
# => ╰───┴───────┴──────────────╯
```

[`polars col`](/commands/docs/polars_col.md) can pick more than one column:

- `polars col int_1 int_2` names several columns, and the expression applies to
  each of them. `(polars col int_1 int_2) * 2` doubles both and keeps their
  names.
- `polars col "*"` stands for every column.
- A name that starts with `^` and ends with `$` is a regular expression. Without
  both anchors, the name is taken literally.
- `--type` (`-t`) reads the arguments as type names and picks every column of
  those types. `polars schema --datatype-list` lists the type names.

```nu
$df_1 | polars select (polars col "^float_.*$") | polars first 2 | polars collect
# => ╭───┬─────────┬─────────╮
# => │ # │ float_1 │ float_2 │
# => ├───┼─────────┼─────────┤
# => │ 0 │    0.10 │    1.00 │
# => │ 1 │    0.20 │    1.00 │
# => ╰───┴─────────┴─────────╯
$df_1 | polars select (polars col --type i64 str) | polars columns
# => ╭───┬────────╮
# => │ 0 │ int_1  │
# => │ 1 │ int_2  │
# => │ 2 │ first  │
# => │ 3 │ second │
# => │ 4 │ third  │
# => │ 5 │ word   │
# => ╰───┴────────╯
```

`polars select` also takes selectors, made by the
[`polars selector`](/commands/docs/polars_selector.md) commands, which pick
columns by name pattern, type, or position. Selectors, column names, and
expressions mix in one call:

```nu
$df_1 | polars select word (polars selector starts-with int_) | polars first 2 | polars collect
# => ╭───┬────────┬───────┬───────╮
# => │ # │  word  │ int_1 │ int_2 │
# => ├───┼────────┼───────┼───────┤
# => │ 0 │ first  │     1 │    11 │
# => │ 1 │ second │     2 │    12 │
# => ╰───┴────────┴───────┴───────╯
```

`polars as` takes a selector too, and renames the column it picks:

```nu
$df_1 | polars select (polars selector by-name word | polars as w) | polars first 2 | polars collect
# => ╭───┬────────╮
# => │ # │   w    │
# => ├───┼────────┤
# => │ 0 │ first  │
# => │ 1 │ second │
# => ╰───┴────────╯
```

If the selector matches more than one column, they all get the same name, and
collecting fails with `projections contained duplicate output name`.

## Sorting

[`polars sort-by`](/commands/docs/polars_sort-by.md) sorts by one or more
columns or expressions, in the order you list them. `--reverse` (`-r`) takes a
list of booleans with one entry per sort key, where `true` sorts that key in
descending order. A list of a different length fails with `Incorrect list size`.

```nu
$df_1 | polars select first int_1 word | polars sort-by first int_1 --reverse [false true] | polars collect
# => ╭───┬───────┬───────┬────────╮
# => │ # │ first │ int_1 │  word  │
# => ├───┼───────┼───────┼────────┤
# => │ 0 │ a     │     3 │ third  │
# => │ 1 │ a     │     2 │ second │
# => │ 2 │ a     │     1 │ first  │
# => │ 3 │ b     │     7 │ third  │
# => │ 4 │ b     │     6 │ second │
# => │ 5 │ b     │     4 │ second │
# => │ 6 │ b     │     0 │ third  │
# => │ 7 │ c     │     9 │ ninth  │
# => │ 8 │ c     │     8 │ eight  │
# => │ 9 │ c     │     0 │ ninth  │
# => ╰───┴───────┴───────┴────────╯
```

A sort key can be any expression, such as `((polars col int_2) mod 3)`. Null
values sort first unless you pass `--nulls-last` (`-n`). Rows with equal keys
can come out in any order, and `--maintain-order` (`-m`) keeps them in their
input order.

## Working with strings

[`polars str-lengths`](/commands/docs/polars_str-lengths.md) counts the
characters in each string. With `--bytes` (`-b`) it counts UTF-8 bytes instead,
which is larger for text with characters outside ASCII:

```nu
[[city]; [Zürich] [Köln] [Oslo]] | polars into-df | polars select (polars col city) (polars col city | polars str-lengths | polars as chars) (polars col city | polars str-lengths --bytes | polars as bytes) | polars collect
# => ╭───┬────────┬───────┬───────╮
# => │ # │  city  │ chars │ bytes │
# => ├───┼────────┼───────┼───────┤
# => │ 0 │ Zürich │     6 │     7 │
# => │ 1 │ Köln   │     4 │     5 │
# => │ 2 │ Oslo   │     4 │     4 │
# => ╰───┴────────┴───────┴───────╯
```

`polars str-lengths` also works directly on a one-column dataframe, where the
result keeps the column's name.

## More dataframe commands

These pages cover the dataframe commands this chapter doesn't:

- [Dataframe Operations](./dataframes/frames.md) combines, reshapes, and
  converts dataframes. It also covers nulls, duplicates, binning, sampling,
  summary statistics, query profiling, SQL queries, and running Nushell
  closures on columns.
- [Column Selectors](./dataframes/selectors.md) covers the `polars selector`
  commands, which pick columns by name, position, or type.
- [Math Expressions](./dataframes/math.md) covers the `polars math` functions,
  such as `polars math abs` and `polars math log`, and the bitwise commands.
- [String Expressions](./dataframes/strings.md) covers changing case, searching
  and replacing, splitting and joining strings, and parsing numbers from them.
- [Dates and Times in Dataframes](./dataframes/dates.md) covers parsing,
  formatting, and taking apart date and time columns, time zones, and date
  ranges.
- [Masks and Conditionals](./dataframes/conditionals.md) covers null tests,
  mask operations, finding the positions of values, building a column from
  conditions with `polars when`, and replacing values.
- [Aggregations and Window Functions](./dataframes/aggregation.md) covers the
  aggregation commands inside and outside `polars agg`, cumulative and rolling
  windows, and `polars over`.

## Dataframe Commands

So far we have seen quite a few operations that can be done using `DataFrame`s
commands. However, the commands we have used so far are not all the commands
available to work with data and be assured that there will be more as the
feature becomes more stable.

The next list shows the available dataframe commands with their descriptions, and
whenever possible, their analogous Nushell command. The **Applies To** column
lists the kinds of input each command accepts.

::: warning
This list may be outdated. To get the up-to-date command list, see [Dataframe](/commands/categories/dataframe.md), [Lazyframe](/commands/categories/lazyframe.md), [Dataframe Or Lazyframe](/commands/categories/dataframe_or_lazyframe.md), [Expressions](/commands/categories/expression.md) command categories.
:::

<!-- This table was updated using the script from ../tools/dataframes_md-update.nu -->

| Command Name                       | Applies To                                 | Description                                                                                       | Nushell Equivalent      |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------- |
| polars agg                         | dataframe, lazyframe, group_by             | Performs a series of aggregations from a group-by.                                                | math                    |
| polars agg-groups                  | expression, selector                       | Creates an agg_groups expression.                                                                 |                         |
| polars all-false                   | dataframe, lazyframe                       | Returns true if all values are false.                                                             |                         |
| polars all-true                    | dataframe, lazyframe                       | Returns true if all values are true.                                                              | all                     |
| polars append                      | dataframe, lazyframe                       | Appends a new dataframe.                                                                          |                         |
| polars arg-max                     | dataframe, lazyframe                       | Return index for max value in series.                                                             |                         |
| polars arg-min                     | dataframe, lazyframe                       | Return index for min value in series.                                                             |                         |
| polars arg-sort                    | dataframe, lazyframe                       | Returns indexes for a sorted series.                                                              |                         |
| polars arg-true                    | dataframe, lazyframe                       | Returns indexes where values are true.                                                            |                         |
| polars arg-unique                  | dataframe, lazyframe                       | Returns indexes for unique values.                                                                |                         |
| polars arg-where                   | any                                        | Creates an expression that returns the arguments where expression is true.                        |                         |
| polars as                          | expression, selector                       | Creates an alias expression.                                                                      |                         |
| polars as-date                     | dataframe, lazyframe, expression, selector | Converts string to date.                                                                          |                         |
| polars as-datetime                 | dataframe, lazyframe, expression, selector | Converts string to datetime.                                                                      |                         |
| polars cache                       | dataframe, lazyframe                       | Caches operations in a new LazyFrame.                                                             |                         |
| polars cast                        | dataframe, lazyframe, expression, selector | Cast a column to a different dtype.                                                               |                         |
| polars col                         | any                                        | Creates a named column expression.                                                                |                         |
| polars collect                     | dataframe, lazyframe                       | Collect lazy dataframe into eager dataframe.                                                      |                         |
| polars columns                     | dataframe, lazyframe                       | Show dataframe columns.                                                                           |                         |
| polars concat                      | any                                        | Concatenate two or more dataframes.                                                               |                         |
| polars concat-str                  | any                                        | Creates a concat string expression.                                                               |                         |
| polars contains                    | dataframe, lazyframe, expression, selector | Checks if a pattern is contained in a string.                                                     |                         |
| polars convert-time-zone           | expression, selector                       | Convert datetime to target timezone.                                                              |                         |
| polars count                       | expression, selector                       | Returns the number of non-null values in the column.                                              |                         |
| polars count-null                  | dataframe, lazyframe                       | Counts null values.                                                                               |                         |
| polars cumulative                  | dataframe, lazyframe, expression, selector | Cumulative calculation for a column or series.                                                    |                         |
| polars cut                         | dataframe, lazyframe                       | Bin continuous values into discrete categories for a series.                                      |                         |
| polars date-range                  | any                                        | Create a date range expression.                                                                   |                         |
| polars date-ranges                 | any                                        | Create a column of date ranges.                                                                   |                         |
| polars datepart                    | expression, selector                       | Creates an expression for capturing the specified datepart in a column.                           |                         |
| polars datetime-range              | any                                        | Create a datetime range expression.                                                               |                         |
| polars datetime-ranges             | any                                        | Create a column of datetime ranges.                                                               |                         |
| polars decimal                     | expression, selector                       | Converts a string column into a decimal column                                                    |                         |
| polars drop                        | dataframe, lazyframe                       | Creates a new dataframe by dropping the selected columns.                                         | reject                  |
| polars drop-duplicates             | dataframe, lazyframe                       | Drops duplicate values in dataframe.                                                              |                         |
| polars drop-nulls                  | dataframe, lazyframe                       | Drops null values in dataframe.                                                                   |                         |
| polars dummies                     | dataframe, lazyframe                       | Creates a new dataframe with dummy variables.                                                     |                         |
| polars entropy                     | expression, selector                       | Compute the entropy as `-sum(pk * log(pk))` where `pk` are discrete probabilities.                |                         |
| polars explode                     | dataframe, lazyframe, expression, selector | Explodes a dataframe or creates a explode expression.                                             |                         |
| polars expr-not                    | expression, selector                       | Creates a not expression.                                                                         |                         |
| polars fill-nan                    | dataframe, lazyframe, expression, selector | Replaces NaN values with the given expression.                                                    |                         |
| polars fill-null                   | dataframe, lazyframe, expression, selector | Replaces NULL values with the given expression.                                                   |                         |
| polars filter                      | dataframe, lazyframe, expression, selector | Filter dataframe based in expression.                                                             |                         |
| polars filter-with                 | dataframe, lazyframe                       | Filters dataframe using a mask or expression as reference.                                        |                         |
| polars first                       | dataframe, lazyframe, group_by, expression, selector | Show only the first number of rows or create a first expression                                   | first                   |
| polars flatten                     | dataframe, expression, selector            | An alias for polars explode.                                                                      |                         |
| polars get                         | dataframe, lazyframe                       | Creates dataframe with the selected columns.                                                      | get                     |
| polars get-day                     | dataframe, lazyframe, expression, selector | Gets day from date.                                                                               |                         |
| polars get-hour                    | dataframe, lazyframe, expression, selector | Gets hour from datetime.                                                                          |                         |
| polars get-minute                  | dataframe, lazyframe, expression, selector | Gets minute from date.                                                                            |                         |
| polars get-month                   | dataframe, lazyframe, expression, selector | Gets month from date.                                                                             |                         |
| polars get-nanosecond              | dataframe, lazyframe, expression, selector | Gets nanosecond from date.                                                                        |                         |
| polars get-ordinal                 | dataframe, lazyframe, expression, selector | Gets ordinal from date.                                                                           |                         |
| polars get-second                  | dataframe, lazyframe, expression, selector | Gets second from date.                                                                            |                         |
| polars get-week                    | dataframe, lazyframe, expression, selector | Gets week from date.                                                                              |                         |
| polars get-weekday                 | dataframe, lazyframe, expression, selector | Gets weekday from date.                                                                           |                         |
| polars get-year                    | dataframe, lazyframe, expression, selector | Gets year from date.                                                                              |                         |
| polars group-by                    | dataframe, lazyframe                       | Creates a group-by object that can be used for other aggregations.                                | group-by                |
| polars horizontal                  | any                                        | Horizontal calculation across multiple columns.                                                   |                         |
| polars implode                     | expression, selector                       | Aggregates values into a list.                                                                    |                         |
| polars integer                     | expression, selector                       | Converts a string column into a integer column                                                    |                         |
| polars into-df                     | any                                        | Converts a list, table or record into a dataframe.                                                |                         |
| polars into-dtype                  | string                                     | Convert a string to a specific datatype.                                                          |                         |
| polars into-lazy                   | any                                        | Converts a dataframe into a lazy dataframe.                                                       |                         |
| polars into-nu                     | dataframe, lazyframe, group_by, expression, selector, when, datatype, schema | Converts a dataframe or an expression into nushell value for access and exploration.              |                         |
| polars into-repr                   | dataframe, lazyframe                       | Display a dataframe in its repr format.                                                           |                         |
| polars into-schema                 | any                                        | Convert a value to a polars schema object                                                         |                         |
| polars is-duplicated               | dataframe, lazyframe                       | Creates mask indicating duplicated values.                                                        |                         |
| polars is-in                       | expression, selector                       | Creates an is-in expression or checks to see if the elements are contained in the right series    | in                      |
| polars is-not-null                 | dataframe, lazyframe, expression, selector | Creates mask where value is not null.                                                             |                         |
| polars is-null                     | dataframe, lazyframe, expression, selector | Creates mask where value is null.                                                                 | `<column_name> == null` |
| polars is-unique                   | dataframe, lazyframe                       | Creates mask indicating unique values.                                                            |                         |
| polars join                        | dataframe, lazyframe                       | Joins a lazy frame with other lazy frame.                                                         |                         |
| polars join-where                  | dataframe, lazyframe                       | Joins a lazy frame with other lazy frame based on conditions.                                     |                         |
| polars last                        | dataframe, lazyframe, group_by, expression, selector | Creates new dataframe with tail rows or creates a last expression.                                | last                    |
| polars len                         | any                                        | Return the number of rows in the context. This is similar to COUNT(*) in SQL.                     |                         |
| polars list-contains               | expression, selector                       | Checks if an element is contained in a list.                                                      |                         |
| polars lit                         | any                                        | Creates a literal expression.                                                                     |                         |
| polars lowercase                   | dataframe, lazyframe, expression, selector | Lowercase the strings in the column.                                                              |                         |
| polars map-batches                 | dataframe, lazyframe                       | Map a custom Nushell closure over one or more dataframe columns.                                  |                         |
| polars math                        |                                            | Collection of math functions to be applied on column expressions.                                 |                         |
| polars math abs                    | expression, selector                       | Compute the absolute values of a column expression.                                               |                         |
| polars math bitwise-and            | expression, selector                       | Perform an aggregation of bitwise ANDs over a column expression.                                  |                         |
| polars math bitwise-count-ones     | expression, selector                       | Compute the number of set bits for each element in an integer column expression.                  |                         |
| polars math bitwise-count-zeros    | expression, selector                       | Compute the number of unset bits for each element in an integer column expression.                |                         |
| polars math bitwise-leading-ones   | expression, selector                       | Compute the number of leading set bits for each element in an integer column expression.          |                         |
| polars math bitwise-leading-zeros  | expression, selector                       | Compute the number of leading unset bits for each element in an integer column expression.        |                         |
| polars math bitwise-or             | expression, selector                       | Perform an aggregation of bitwise ORs over a column expression.                                   |                         |
| polars math bitwise-trailing-ones  | expression, selector                       | Compute the number of trailing set bits for each element in an integer column expression.         |                         |
| polars math bitwise-trailing-zeros | expression, selector                       | Compute the number of trailing unset bits for each element in an integer column expression.       |                         |
| polars math bitwise-xor            | expression, selector                       | Perform an aggregation of bitwise XORs over a column expression.                                  |                         |
| polars math cos                    | expression, selector                       | Compute the element-wise cosine of a column expression.                                           |                         |
| polars math dot                    | expression, selector                       | Compute the dot product of two column expressions.                                                |                         |
| polars math exp                    | expression, selector                       | Compute element-wise e raised to the power of a column expression.                                |                         |
| polars math log                    | expression, selector                       | Compute the element-wise logarithm of a column expression.                                        |                         |
| polars math log1p                  | expression, selector                       | Compute the element-wise natural log of 1 + x for a column expression.                            |                         |
| polars math sign                   | expression, selector                       | Compute the element-wise sign of a column expression, returning -1, 0, or 1.                      |                         |
| polars math sin                    | expression, selector                       | Compute the element-wise sine of a column expression.                                             |                         |
| polars math sqrt                   | expression, selector                       | Compute the element-wise square root of a column expression.                                      |                         |
| polars max                         | dataframe, lazyframe, expression, selector | Creates a max expression or aggregates columns to their max value.                                |                         |
| polars mean                        | dataframe, lazyframe, expression, selector | Creates a mean expression for an aggregation or aggregates columns to their mean value.           |                         |
| polars median                      | dataframe, lazyframe, expression, selector | Median value from columns in a dataframe or creates expression for an aggregation                 |                         |
| polars min                         | dataframe, lazyframe, expression, selector | Creates a min expression or aggregates columns to their min value.                                |                         |
| polars n-unique                    | dataframe, lazyframe, expression, selector | Counts unique values.                                                                             |                         |
| polars not                         | dataframe, lazyframe                       | Inverts boolean mask.                                                                             |                         |
| polars open                        | any                                        | Opens CSV, JSON, NDJSON/JSON lines, arrow, avro, or parquet file to create dataframe. A lazy dataframe will be created by default, if supported. | open                    |
| polars otherwise                   | any                                        | Completes a when expression.                                                                      |                         |
| polars over                        | expression, selector                       | Compute expressions over a window group defined by partition expressions.                         |                         |
| polars pivot                       | dataframe, lazyframe                       | Pivot a DataFrame from long to wide format.                                                       |                         |
| polars profile                     | dataframe, lazyframe                       | Profile a lazy dataframe.                                                                         |                         |
| polars qcut                        | dataframe, lazyframe                       | Bin continuous values into discrete categories based on their quantiles for a series.             |                         |
| polars quantile                    | dataframe, lazyframe, expression, selector | Aggregates the columns to the selected quantile.                                                  |                         |
| polars query                       | dataframe, lazyframe                       | Query dataframe using SQL. Note: The dataframe is always named 'df' in your query's from clause.  |                         |
| polars rename                      | dataframe, lazyframe                       | Rename a dataframe column.                                                                        | rename                  |
| polars replace                     | expression, selector                       | Create an expression that replaces old values with new values                                     |                         |
| polars replace-time-zone           | expression, selector                       | Replace the timezone information in a datetime column.                                            |                         |
| polars reverse                     | dataframe, lazyframe                       | Reverses the LazyFrame                                                                            |                         |
| polars rolling                     | dataframe, lazyframe, expression           | Rolling calculation for a series or expression, or a rolling group-by for a lazyframe.            |                         |
| polars sample                      | dataframe, lazyframe                       | Create sample dataframe.                                                                          |                         |
| polars save                        | any                                        | Saves a dataframe to disk. For lazy dataframes a sink operation will be used if the file type supports it (parquet, ipc/arrow, csv, and ndjson). |                         |
| polars schema                      | any                                        | Show schema for a dataframe.                                                                      |                         |
| polars select                      | dataframe, lazyframe                       | Selects columns from lazyframe.                                                                   | select                  |
| polars selector                    |                                            | Create column selectors for use in polars commands.                                               |                         |
| polars selector all                | any                                        | Creates a selector that selects all columns.                                                      |                         |
| polars selector alpha              | any                                        | Select all columns with alphabetic names (eg: only letters). Matching column names cannot contain *any* non-alphabetic characters. Note that the definition of "alphabetic" consists of all valid Unicode alphabetic characters by default; this can be changed by setting `--ascii-only`. |                         |
| polars selector alphanumeric       | any                                        | Select all columns with alphanumeric names (eg: only letters). Matching column names cannot contain *any* non-alphanumeric characters. Note that the definition of "alphanumeric" consists of all valid Unicode alphanumeric characters by default; this can be changed by setting `ascii_only=true`. |                         |
| polars selector array              | any                                        | Select all array columns. Optionally filter by fixed width.                                       |                         |
| polars selector binary             | any                                        | Select all binary columns.                                                                        |                         |
| polars selector boolean            | any                                        | Select all boolean columns.                                                                       |                         |
| polars selector by-dtype           | any                                        | Creates a selector that selects columns by data type.                                             |                         |
| polars selector by-index           | any                                        | Select columns by their index position. Supports negative indices (e.g., -1 for the last column). |                         |
| polars selector by-name            | any                                        | Creates a selector that selects columns by name.                                                  |                         |
| polars selector categorical        | any                                        | Select all categorical columns.                                                                   |                         |
| polars selector contains           | any                                        | Select columns whose names contain the given literal substring(s).                                |                         |
| polars selector date               | any                                        | Select all date columns.                                                                          |                         |
| polars selector datetime           | any                                        | Select all datetime columns. Optionally filter by time unit (ns, us, ms) and/or timezone.         |                         |
| polars selector decimal            | any                                        | Select all decimal columns.                                                                       |                         |
| polars selector digit              | any                                        | Select columns whose names consist entirely of digit characters. By default uses Unicode decimal digits; use `--ascii-only` to restrict to ASCII 0-9. |                         |
| polars selector duration           | any                                        | Select all duration columns. Optionally filter by time unit (ns, us, ms).                         |                         |
| polars selector empty              | any                                        | Create an empty selector that matches no columns. Useful as a base for selector composition.      |                         |
| polars selector ends-with          | any                                        | Select columns that end with the given substring(s).                                              |                         |
| polars selector enum               | any                                        | Select all enum columns.                                                                          |                         |
| polars selector exclude            | any                                        | Select all columns except those with the given name(s). This is the inverse of `polars selector by-name`. |                         |
| polars selector first              | any                                        | Creates a selector that selects the first column(s) by index.                                     |                         |
| polars selector float              | any                                        | Select all float columns.                                                                         |                         |
| polars selector integer            | any                                        | Select all integer columns.                                                                       |                         |
| polars selector last               | any                                        | Creates a selector that selects the last column(s) by index.                                      |                         |
| polars selector list               | any                                        | Select all list columns.                                                                          |                         |
| polars selector matches            | any                                        | Select all columns that match the given regex pattern.                                            |                         |
| polars selector nested             | any                                        | Select all nested columns (list, array, or struct).                                               |                         |
| polars selector not                | selector                                   | Inverts selector.                                                                                 |                         |
| polars selector numeric            | any                                        | Select all numeric columns.                                                                       |                         |
| polars selector object             | any                                        | Select all object columns.                                                                        |                         |
| polars selector signed-integer     | any                                        | Select all signed integer columns.                                                                |                         |
| polars selector starts-with        | any                                        | Select columns that start with the given substring(s).                                            |                         |
| polars selector string             | any                                        | Select all string columns. Use `--include-categorical` to also select categorical columns.        |                         |
| polars selector struct             | any                                        | Select all struct columns.                                                                        |                         |
| polars selector temporal           | any                                        | Select all temporal columns (date, datetime, duration, and time).                                 |                         |
| polars selector unsigned-integer   | any                                        | Select all unsigned integer columns.                                                              |                         |
| polars set                         | dataframe, lazyframe                       | Sets value where given mask is true.                                                              |                         |
| polars set-with-idx                | dataframe, lazyframe                       | Sets value in the given index.                                                                    |                         |
| polars shape                       | dataframe, lazyframe                       | Shows column and row size for a dataframe.                                                        |                         |
| polars shift                       | dataframe, lazyframe, expression, selector | Shifts the values by a given period.                                                              |                         |
| polars slice                       | dataframe, lazyframe                       | Creates new dataframe from a slice of rows.                                                       |                         |
| polars sort-by                     | dataframe, lazyframe                       | Sorts a lazy dataframe based on expression(s).                                                    | sort                    |
| polars std                         | dataframe, lazyframe, expression, selector | Creates a std expression for an aggregation of std value from columns in a dataframe.             |                         |
| polars store-get                   | any                                        | Gets a Dataframe or other object from the plugin cache.                                           |                         |
| polars store-ls                    |                                            | Lists stored polars objects.                                                                      |                         |
| polars store-rm                    | any                                        | Removes a stored Dataframe or other object from the plugin cache.                                 |                         |
| polars str-join                    | dataframe, lazyframe, expression, selector | Concatenates strings within a column or dataframes                                                |                         |
| polars str-lengths                 | dataframe, lazyframe, expression, selector | Get lengths of all strings.                                                                       |                         |
| polars str-replace                 | dataframe, lazyframe, expression, selector | Replace the leftmost (sub)string by a regex pattern.                                              |                         |
| polars str-replace-all             | dataframe, lazyframe, expression, selector | Replace all (sub)strings by a regex pattern.                                                      |                         |
| polars str-slice                   | dataframe, lazyframe, expression, selector | Slices the string from the start position until the selected length.                              |                         |
| polars str-split                   | expression, selector                       | Split the string by a substring. The resulting dtype is `list<str>`.                                |                         |
| polars str-strip-chars             | expression, selector                       | Strips specified characters from strings in a column                                              |                         |
| polars strftime                    | dataframe, lazyframe, expression, selector | Formats date based on string rule.                                                                |                         |
| polars struct-json-encode          | expression                                 | Convert this struct to a string column with json values.                                          |                         |
| polars sum                         | dataframe, lazyframe, expression, selector | Creates a sum expression for an aggregation or aggregates columns to their sum value.             |                         |
| polars summary                     | dataframe, lazyframe                       | For a dataframe, produces descriptive statistics (summary statistics) for its numeric columns.    |                         |
| polars take                        | dataframe, lazyframe                       | Creates new dataframe using the given indices.                                                    |                         |
| polars truncate                    | expression, selector                       | Divide the date/datetime range into buckets.                                                      |                         |
| polars unique                      | dataframe, lazyframe, expression, selector | Returns unique values from a dataframe.                                                           | uniq                    |
| polars unnest                      | dataframe, lazyframe                       | Decompose struct columns into separate columns for each of their fields. The new columns will be inserted into the dataframe at the location of the struct column. |                         |
| polars unpivot                     | dataframe, lazyframe                       | Unpivot a DataFrame from wide to long format.                                                     |                         |
| polars uppercase                   | dataframe, lazyframe, expression, selector | Uppercase the strings in the column.                                                              |                         |
| polars value-counts                | dataframe, lazyframe                       | Returns a dataframe with the counts for unique values in series.                                  |                         |
| polars var                         | dataframe, lazyframe, expression, selector | Create a var expression for an aggregation.                                                       |                         |
| polars when                        | expression, selector                       | Creates and modifies a when expression.                                                           |                         |
| polars with-column                 | dataframe, lazyframe                       | Adds a series to the dataframe.                                                                   | `insert <column_name> <value> \| upsert <column_name> { <new_value> }` |

## Future of Dataframes

We hope that by the end of this page you have a solid grasp of how to use the
dataframe commands. As you can see they offer powerful operations that can
help you process data faster and natively.

However, the dataframe commands are still evolving, and commands are sometimes
renamed or removed as Polars itself changes. New commands and tools that take
advantage of these commands will be added as they mature.

Check this chapter, as well as our [Blog](/blog/), regularly to learn about new
dataframes features and how they can help you process data faster and efficiently.
