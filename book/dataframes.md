# Dataframes

::: warning Important!
This feature requires the Polars plugin.  See the
[Plugins Chapter](plugins.md) to learn how to install it.

To test that this plugin is properly installed, run `help polars`.
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

As you can see, `polars sum` computes the sum for those columns where
a sum makes sense. If you want to filter out the text column, you can select
the columns you want by using the [`polars select`](/commands/docs/polars_select.md) command

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

as you can see, the collect command executes the plan and creates a nushell
table for you.

All dataframes operations should work with eager or lazy dataframes. They are
converted in the background for compatibility. However, to take advantage of
lazy operations if is recommended to only use lazy operations with lazy
dataframes.

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
| polars str-split                   | expression, selector                       | Split the string by a substring. The resulting dtype is list<str>.                                |                         |
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
