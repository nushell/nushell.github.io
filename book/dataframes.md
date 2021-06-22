# Dataframes

As you have seen so far, nushell makes working with data its main priority.
`Lists` and `Tables` are there to help you cycle through values in order to
perform multiple operations or find data in a a breeze. However, there are
certain operations where a row based data layout is not the most efficient way
to process data, specially when working with extremely large files. Operations
like groupby or join using large datasets can be costly memory wise, and may
lead to large computational times if they are not done using the appropriate
data format.

For this reason, the `DataFrame` structure was introduced to nushell. A
`DataFrame` stores its data in a columnar format using as its base the [Apache
Arrow](https://arrow.apache.org/) specification and uses
[Polars](https://github.com/pola-rs/polars) as the motor for performing
extremely [fast columnar operations](https://h2oai.github.io/db-benchmark/).

We could talk for ages about the advantages of columnar vs row based layout, but
the best thing would be to start using the dataframes commands and after that
have a little comparison to see why in some cases is better to use a columnar
layout.

## Working with Dataframes

To start testing the `DataFrame` let's create a sample CSV file that will be
used along with the examples. In your favorite file editor paste the next
lines to create out sample csv file.

```csv
int_1,int_2,float_1,float_2,first,second,third,word
1,11,0.1,1.0,a,b,c,first
2,12,0.2,1.0,a,b,c,second
3,13,0.3,2.0,a,b,c,third
4,14,0.4,3.0,b,a,c,fourth
0,15,0.5,4.0,b,a,a,fifth
6,16,0.6,5.0,b,a,a,sixth
7,17,0.7,6.0,b,c,a,seventh
8,18,0.8,7.0,c,c,b,eight
9,19,0.9,8.0,c,c,b,ninth
0,10,0.0,9.0,c,c,b,zero
```

Save the file and name it however you want to, for the sake of these examples
the file will be called `test_small.csv`.

Now, to read that file as a dataframe use the `dataframe load` command like
this:

```
> let df = (dataframe load test_small.csv)
```

This should create the value `df` in memory which holds the data we just
created.

> Note: The command `dataframes load` allows to read either **csv** or
> **parquet** files.

To see all the dataframes that are stored in memory you can use

```
> dataframe list

───┬──────┬──────┬─────────┬────────────────────────
 # │ name │ rows │ columns │        location
───┼──────┼──────┼─────────┼────────────────────────
 0 │ $df  │ 10   │ 8       │ ..\test_small.csv
───┴──────┴──────┴─────────┴────────────────────────
```

As you can see, the command lists the created dataframes together with basic
information about them.

> Note: If you want to see all the dataframe commands that are available you
> can use `help dataframe`

With the dataframe in memory we can start doing column operations with the
`DataFrame`

## Basic aggregations

Let's start with basic aggregations on the dataframe. Let's sum all the columns
that exist in `df` by using the `aggregate` command

```
> $df | dataframe aggregate sum

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────
 0 │    40 │   145 │  4.5000 │ 46.0000 │       │        │       │
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────
```

As you can see, the aggregate function computes the sum for those columns where
a sum makes sense. If you want to filter out the text column, you can select
the columns you want by using the `select` command

```
$df | dataframe aggregate sum | dataframe select [int_1 int_2 float_1 float_2]

───┬───────┬───────┬─────────┬─────────
 # │ int_1 │ int_2 │ float_1 │ float_2
───┼───────┼───────┼─────────┼─────────
 0 │    40 │   145 │  4.5000 │ 46.0000
───┴───────┴───────┴─────────┴─────────
```

you can even store the result from this aggregation as you would store any
other nushell variable

```
> let res = ($df | dataframe aggregate sum | dataframe select [int_1 int_2 float_1 float_2])
```

and now we have two dataframes stored in memory

```
> dataframe list

───┬──────┬──────┬─────────┬────────────────────────
 # │ name │ rows │ columns │        location
───┼──────┼──────┼─────────┼────────────────────────
 0 │ $df  │ 10   │ 8       │ ..\test_small.csv
 1 │ $res │ 1    │ 4       │ stream
───┴──────┴──────┴─────────┴────────────────────────
```

pretty neat isn't it?

You can perform several aggregations on the dataframe in order to extract basic
information from the dataframe and do basic data analysis on your brand new
dataframe.

## Joining a DataFrame

It is also possible to join two dataframes using a column as reference. We are
going to join our mini dataframe with another mini dataframe. Copy these lines
in another file and create the corresponding dataframe (for these examples we
are going to call it test_small_a.csv)

```
int_1,int_2,float_1,float_2,first
9,14,0.4,3.0,a
8,13,0.3,2.0,a
7,12,0.2,1.0,a
6,11,0.1,0.0,b
```

> Note: Use the `dataframe load` command to create the new variable

Now, with the second dataframe loaded in memory we can join them using the
column called `int_1`

```
> $df | dataframe join $df_a [int_1] [int_1]

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬─────────┬─────────────┬───────────────┬───────────────┬─────────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word   │ int_2_right │ float_1_right │ float_2_right │ first_right
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼─────────┼─────────────┼───────────────┼───────────────┼─────────────
 0 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ sixth   │          11 │        0.1000 │        0.0000 │ b
 1 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ seventh │          12 │        0.2000 │        1.0000 │ a
 2 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight   │          13 │        0.3000 │        2.0000 │ a
 3 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth   │          14 │        0.4000 │        3.0000 │ a
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴─────────┴─────────────┴───────────────┴───────────────┴─────────────
```

By default, the join command does an inner join, meaning that it will keep the
rows where both dataframes share the same value. You can select a left join to
keep the missing rows from the left dataframe. You can also save this result
in order to use for further operations.

## DataFrame groupby

One of the most powerful operations that can be performed with a DataFrame is
the `group-by`. This command will allow you to perform aggregation operations
based on a grouping criteria. In nushell, a `GroupBy` is a type of object that
can be stored and reused for multiple aggregations. This is quite handy, since
the creation of the grouped pairs is the most expensive operation while doing
groupby and there is no need to repeat it if you are planning to do multiple
operations with the same group condition.

To create a `GroupBy` object you only need to use the `group-by` command

```
> let group = ($df | dataframe group-by [first])
> $group

───┬──────────┬───────
 # │ property │ value
───┼──────────┼───────
 0 │ group by │ first
───┴──────────┴───────
```

When printing the `GroupBy` object we can see the columns that are used as
criteria to group the dataframe. Using the `GroupBy` we can aggregate the
dataframe using multiple operations

```
$group | dataframe aggregate sum

───┬───────┬───────────┬───────────┬─────────────┬─────────────
 # │ first │ int_1_sum │ int_2_sum │ float_1_sum │ float_2_sum
───┼───────┼───────────┼───────────┼─────────────┼─────────────
 0 │ a     │         6 │        36 │      0.6000 │      4.0000
 1 │ b     │        17 │        62 │      2.2000 │     18.0000
 2 │ c     │        17 │        47 │      1.7000 │     24.0000
───┴───────┴───────────┴───────────┴─────────────┴─────────────
```

and using the same `GroupBy` you can perform now another operation on the
whole dataframe, like `min` in this case

```
$group | aggregate min

───┬───────┬───────────┬───────────┬─────────────┬─────────────
 # │ first │ int_1_min │ int_2_min │ float_1_min │ float_2_min
───┼───────┼───────────┼───────────┼─────────────┼─────────────
 0 │ a     │         1 │        11 │      0.1000 │      1.0000
 1 │ b     │         0 │        14 │      0.4000 │      3.0000
 2 │ c     │         0 │        10 │      0.0000 │      7.0000
───┴───────┴───────────┴───────────┴─────────────┴─────────────
```

by the way, you have the option to select columns when doing the `aggregate`
command, instead of using the `dataframe select` command

```
> $group | dataframe aggregate mean [int_1 int_2]

───┬───────┬────────────┬────────────
 # │ first │ int_1_mean │ int_2_mean
───┼───────┼────────────┼────────────
 0 │ a     │     2.0000 │    12.0000
 1 │ b     │     4.2500 │    15.5000
 2 │ c     │     5.6666 │    15.6666
───┴───────┴────────────┴────────────
```

the created `GroupBy` object is so handy that it can even used as base for
pivoting a table. As an example, Lets use the column called `second` as the
pivot column and the column `float_1` as the value column


```
> $group | dataframe pivot second float_1 sum

───┬───────┬────────┬────────┬────────
 # │ first │   b    │   a    │   c
───┼───────┼────────┼────────┼────────
 0 │ a     │ 0.6000 │        │
 1 │ c     │        │        │ 1.7000
 2 │ b     │        │ 1.5000 │ 0.7000
───┴───────┴────────┴────────┴────────
```

As you can see, the `GroupBy` object is a very powerful variable and it is
worthy it to keep in memory to keep exploring your dataset.

## Creating Dataframes

It is also possible to construct dataframes from basic nushell primitives, such
as integers, decimals, or strings. Let's create a small dataframe using the
command `to-df`.

```
> let a = ([[a b]; [1 2] [3 4] [5 6]] | dataframe to-df)
> $a

───┬───┬───
 # │ b │ a
───┼───┼───
 0 │ 2 │ 1
 1 │ 4 │ 3
 2 │ 6 │ 5
───┴───┴───
```

> Note: For the time being, not all of Nushell primitives can be converted into
> a dataframe. This will change in the future, as the dataframe feature matures

We can append columns to a dataframe in order to create a new variable. As an
example, let's append two columns to our mini dataframe `$a`

```
> let a2 = ($a | dataframe with-column $a.a --name a2 | dataframe with-column $a.a --name a3)

───┬───┬───┬────┬────
 # │ b │ a │ a2 │ a3
───┼───┼───┼────┼────
 0 │ 2 │ 1 │  1 │  1
 1 │ 4 │ 3 │  3 │  3
 2 │ 6 │ 5 │  5 │  5
───┴───┴───┴────┴────
```

the powerful Nushell's piping syntax allows us to create new dataframes by
taking data from other dataframes and append it to them. Now, if you list your
dataframes you will see in total four dataframes

```
> dataframe list

───┬───────┬──────┬─────────┬────────────────────────
 # │  name │ rows │ columns │        location
───┼───────┼──────┼─────────┼────────────────────────
 0 │ $a    │ 3    │ 2       │ stream
 1 │ $a2   │ 3    │ 4       │ stream
 2 │ $df_a │ 4    │ 5       │ ..\test_small.csv
 3 │ $df   │ 10   │ 8       │ ..\test_small.csv
───┴───────┴──────┴─────────┴────────────────────────
```

One thing that is important to mention is how the memory is being optimized
while working with dataframes, and this is thanks to Apache Arrow and Polars.
In a very simple representation, each column in a DataFrame is an Arrow Array,
which is using several memory specifications in order to maintain the data as
packed as possible ([columnar
specification](https://arrow.apache.org/docs/format/Columnar.html)). The other
optimization trick is the fact that whenever possible, the columns from the
dataframes are shared between dataframes, avoiding memory duplication for the
same data. This means that dataframes `$a` and `$a2` are sharing the same two
columns we created using the `to-df` command. For this reason, it isn't
possible to change the value of a column in a dataframe. However, you can
create new columns based on data from other columns or dataframes.

## Working with Series
