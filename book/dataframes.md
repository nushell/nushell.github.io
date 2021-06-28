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
4,14,0.4,3.0,b,a,c,second
0,15,0.5,4.0,b,a,a,third
6,16,0.6,5.0,b,a,a,second
7,17,0.7,6.0,b,c,a,third
8,18,0.8,7.0,c,c,b,eight
9,19,0.9,8.0,c,c,b,ninth
0,10,0.0,9.0,c,c,b,ninth
```

Save the file and name it however you want to, for the sake of these examples
the file will be called `test_small.csv`.

Now, to read that file as a dataframe use the `dataframe load` command like
this:

```shell
> let df = (dataframe load test_small.csv)
```

This should create the value `df` in memory which holds the data we just
created.

> Note: The command `dataframes load` allows to read either **csv** or
> **parquet** files.

To see all the dataframes that are stored in memory you can use

```shell
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

```shell
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

```shell
$df | dataframe aggregate sum | dataframe select [int_1 int_2 float_1 float_2]

───┬───────┬───────┬─────────┬─────────
 # │ int_1 │ int_2 │ float_1 │ float_2
───┼───────┼───────┼─────────┼─────────
 0 │    40 │   145 │  4.5000 │ 46.0000
───┴───────┴───────┴─────────┴─────────
```

you can even store the result from this aggregation as you would store any
other nushell variable

```shell
> let res = ($df | dataframe aggregate sum | dataframe select [int_1 int_2 float_1 float_2])
```

and now we have two dataframes stored in memory

```shell
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

```shell
> $df | dataframe join $df_a [int_1] [int_1]

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬─────────┬─────────────┬───────────────┬───────────────┬─────────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word   │ int_2_right │ float_1_right │ float_2_right │ first_right
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼─────────┼─────────────┼───────────────┼───────────────┼─────────────
 0 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second  │          11 │        0.1000 │        0.0000 │ b
 1 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third   │          12 │        0.2000 │        1.0000 │ a
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

```shell
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

```shell
$group | dataframe aggregate sum

───┬───────┬───────────┬───────────┬─────────────┬─────────────
 # │ first │ int_1     │ int_2     │ float_1     │ float_2
───┼───────┼───────────┼───────────┼─────────────┼─────────────
 0 │ a     │         6 │        36 │      0.6000 │      4.0000
 1 │ b     │        17 │        62 │      2.2000 │     18.0000
 2 │ c     │        17 │        47 │      1.7000 │     24.0000
───┴───────┴───────────┴───────────┴─────────────┴─────────────
```

and using the same `GroupBy` you can perform now another operation on the
whole dataframe, like `min` in this case

```shell
$group | aggregate min

───┬───────┬───────────┬───────────┬─────────────┬─────────────
 # │ first │ int_1     │ int_2     │ float_1     │ float_2
───┼───────┼───────────┼───────────┼─────────────┼─────────────
 0 │ a     │         1 │        11 │      0.1000 │      1.0000
 1 │ b     │         0 │        14 │      0.4000 │      3.0000
 2 │ c     │         0 │        10 │      0.0000 │      7.0000
───┴───────┴───────────┴───────────┴─────────────┴─────────────
```

by the way, you have the option to select columns when doing the `aggregate`
command, instead of using the `dataframe select` command

```shell
> $group | dataframe aggregate mean [int_1 int_2]

───┬───────┬────────────┬────────────
 # │ first │ int_1      │ int_2
───┼───────┼────────────┼────────────
 0 │ a     │     2.0000 │    12.0000
 1 │ b     │     4.2500 │    15.5000
 2 │ c     │     5.6666 │    15.6666
───┴───────┴────────────┴────────────
```

the created `GroupBy` object is so handy that it can even used as base for
pivoting a table. As an example, Lets use the column called `second` as the
pivot column and the column `float_1` as the value column


```shell
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

```shell
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

```shell
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

```shell
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
specification](https://arrow.apache.org/docs/format/Columnar.html). The other
optimization trick is the fact that whenever possible, the columns from the
dataframes are shared between dataframes, avoiding memory duplication for the
same data. This means that dataframes `$a` and `$a2` are sharing the same two
columns we created using the `to-df` command. For this reason, it isn't
possible to change the value of a column in a dataframe. However, you can
create new columns based on data from other columns or dataframes.

## Working with Series

A `Series` is the building block of a `DataFrame`. Each Series represents a
column and they can have multiple types, for example float, int or string.
Let's start working with Series by creating one using the `to-series` command:

```shell
> let new = ([9 8 4] | dataframe to-series new_col)
> $new

───┬───────────────
 # │ new_col (i64)
───┼───────────────
 0 │             9
 1 │             8
 2 │             4
───┴───────────────
```

We have created a new series from a list of integers. We can do the same by
using floats or strings.

Series have their own basic operations defined, and it can be used to create
other Series. Let's create a new Series by doing some arithmetic on the
previously created column.

```shell
> let new_2 = ($new * 3 + 10)
> $new_2

───┬───────────────
 # │ new_col (i64)
───┼───────────────
 0 │            37
 1 │            34
 2 │            22
───┴───────────────
```

Now we have a new Series that was constructed by doing basic operations on the
previous variable.

> Note: If you want to see how many variables you have stored in memory you can
> use `$scope.variables`

Lets rename that series so it has a memorable name.

```shell
> let new_2 = ($new_2 | dataframe rename memorable)
> $new_2

───┬─────────────────
 # │ memorable (i64)
───┼─────────────────
 0 │              37
 1 │              34
 2 │              22
───┴─────────────────
```

We can also do basic operations with both Series as well, as long as they have
the same data type.

```shell
> $new_2 - $new

───┬─────────────────────────────
 # │ sub_memorable_new_col (i64)
───┼─────────────────────────────
 0 │                          28
 1 │                          26
 2 │                          18
───┴─────────────────────────────
```

And we can add them to previously defined dataframes

```shell
> let new_df = ($a | dataframe with-column $new --name new_col)
> $new_df

───┬───┬───┬─────────
 # │ b │ a │ new_col
───┼───┼───┼─────────
 0 │ 2 │ 1 │       9
 1 │ 4 │ 3 │       8
 2 │ 6 │ 5 │       4
───┴───┴───┴─────────
```

The Series stored in a Dataframe can also be used directly, for example,
we can multiply columns `a` and `b` to create a new Series

```shell
> $new_df.a * $new_df.b

───┬───────────────
 # │ mul_a_b (i64)
───┼───────────────
 0 │             2
 1 │            12
 2 │            30
───┴───────────────
```

and we can start piping things in order to create new columns and dataframes

```shell
> let $new_df = ($new_df | dataframe with-column ($new_df.a * $new_df.b / $new_df.new_col) --name my_sum)
> let $new_df

───┬───┬───┬─────────┬────────
 # │ b │ a │ new_col │ my_sum
───┼───┼───┼─────────┼────────
 0 │ 2 │ 1 │       9 │      0
 1 │ 4 │ 3 │       8 │      1
 2 │ 6 │ 5 │       4 │      7
───┴───┴───┴─────────┴────────
```

Nushell piping system can help you create very interesting workflows

## Series and masks

Series have another key use in when working with DataFrames, and it is the fact
that we can build boolean masks out of them. Lets start by creating a simple
mask using the equality operator

```shell
> let mask = ($new == 8)
> $mask

───┬────────────────
 # │ new_col (bool)
───┼────────────────
 0 │ false
 1 │ true
 2 │ false
───┴────────────────
```

and with this mask we can now filter a dataframe, like this

```shell
> $new_df | dataframe filter-with $mask

───┬───┬───┬─────────┬────────
 # │ a │ b │ new_col │ my_sum
───┼───┼───┼─────────┼────────
 0 │ 3 │ 4 │       8 │      1
───┴───┴───┴─────────┴────────
```

Now we have a new dataframe with only the values where the mask was true.

The masks can also be created from Nushell lists as well, for example:

```shell
> let mask1 = ([$true $true $false] | dataframe to-series mask)
> $new_df | dataframe filter-with $mask1

───┬───┬───┬─────────┬────────
 # │ a │ b │ new_col │ my_sum
───┼───┼───┼─────────┼────────
 0 │ 1 │ 2 │       9 │      0
 1 │ 3 │ 4 │       8 │      1
───┴───┴───┴─────────┴────────
```

To create complex masks, we have the `AND`

```shell
> $mask && $mask1

───┬─────────────────────────
 # │ and_new_col_mask (bool)
───┼─────────────────────────
 0 │ false
 1 │ true
 2 │ false
───┴─────────────────────────
```

and `OR` operations

```shell
> $mask || $mask1

───┬────────────────────────
 # │ or_new_col_mask (bool)
───┼────────────────────────
 0 │ true
 1 │ true
 2 │ false
───┴────────────────────────
```

We can also create a mask by checking if some values exist in other Series.
Using the first dataframe that we created we can do something like this

```shell
> let mask3 = ($df.first | dataframe is-in ([b c] | dataframe to-series))

───┬──────────────
 # │ first (bool)
───┼──────────────
 0 │ false
 1 │ false
 2 │ false
 3 │ true
 4 │ true
 5 │ true
 6 │ true
 7 │ true
 8 │ true
 9 │ true
───┴──────────────
```

and this new mask can be used to filter the dataframe


```shell
> $df | dataframe filter-with $mask3

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬─────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼─────────
 0 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 1 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 2 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second
 3 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
 4 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
 5 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth
 6 │     0 │    10 │  0.0000 │  9.0000 │ c     │ c      │ b     │ ninth
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴─────────
```

So, to conclude this section, masks are our main way to create new versions of
dataframes.

> Note. You can also use `dataframe slice` or `dataframe sample` to create new
> dataframes from bigger dataframes

Another important operation that can be done with masks is setting or replacing
a value from a series. For example, we can change the value in the column
`first` where the value is equal to `a`

```shell
test > $df.first | dataframe set new --mask ($df.first =~ a)

───┬──────────────
 # │ string (str)
───┼──────────────
 0 │ new
 1 │ new
 2 │ new
 3 │ b
 4 │ b
 5 │ b
 6 │ b
 7 │ c
 8 │ c
 9 │ c
───┴──────────────
```

## Unique values

Another important operation that can be done with `Series` is to search for
unique values in a list or column. Lets use again the first dataframe we
created to test these operations.

The first and most common operation that we have is `value_counts`. This
command calculates a count of the unique values that exist in a Series. For
example, we can use it to count how many occurrences we have in the column
`first`

```shell
> $df.first | dataframe value-counts

───┬───────┬────────
 # │ first │ counts
───┼───────┼────────
 0 │ b     │      4
 1 │ c     │      3
 2 │ a     │      3
───┴───────┴────────
```

As expected, the command returns a new dataframe that can be used to do more
queries.

Continuing with our exploration of `Series`, the next thing that we can do is
to only get the unique unique values from a series, like this

```shell
> $df.first | dataframe unique

───┬─────────────
 # │ first (str)
───┼─────────────
 0 │ c
 1 │ b
 2 │ a
───┴─────────────
```

Or we can get a mask that we can use to filter out the rows where data is
unique or duplicated. For example, we can select the rows for unique values
in column `word`


```shell
> $df | dataframe filter-with ($df.word | dataframe is-unique)

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────
 0 │     1 │    11 │  0.1000 │  1.0000 │ a     │ b      │ c     │ first
 1 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────
```

Or all the duplicated ones

```shell
> $df | dataframe filter-with ($df.word | dataframe is-duplicated)

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────
 0 │     2 │    12 │  0.2000 │  1.0000 │ a     │ b      │ c     │ second
 1 │     3 │    13 │  0.3000 │  2.0000 │ a     │ b      │ c     │ third
 2 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 3 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 4 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second
 5 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
 6 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth
 7 │     0 │    10 │  0.0000 │  9.0000 │ c     │ c      │ b     │ ninth
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────
```


## Dataframes commands

So far we have seen quite a few operations that can be done using `DataFrame`s
commands. However, the commands we have used so far, are not all the commands
available to work with data and be assured that there will be more as the
feature becomes more stable.

The next list show the available dataframe commands with its description, and
whenever possible, its analogous nushell command.

| Command Name | Applies To | Description | Nushell Equivalent |
| ------------ | ---------- | ----------- | ------------------ |
| aggregate | DataFrame, GroupBy, Series | Performs an aggregation operation on a dataframe, groupby or series object| math |
| all-false | Series | Returns true if all values are false| |
| all-true | Series | Returns true if all values are true| |
| arg-max | Series | Return index for max value in series| |
| arg-min | Series | Return index for min value in series| |
| arg-sort | Series | Returns indexes for a sorted series| |
| arg-true | Series | Returns indexes where values are true| |
| arg-unique | Series | Returns indexes for unique values| |
| column | DataFrame | Returns the selected column as Series| |
| count-null | Series | Counts null values| |
| count-unique | Series | Counts unique value| |
| drop | DataFrame | Creates a new dataframe by dropping the selected columns| drop |
| drop-duplicates | DataFrame | Drops duplicate values in dataframe| |
| drop-nulls | DataFrame, Series | Drops null values in dataframe| |
| dtypes | DataFrame | Show dataframe data types| |
| filter|with | DataFrame | Filters dataframe using a mask as reference| |
| get | DataFrame | Creates dataframe with the selected columns| get |
| group-by | DataFrame | Creates a groupby object that can be used for other aggregations| group-by |
| head | DataFrame | Creates new dataframe with head rows| |
| is-duplicated | Series | Creates mask indicating duplicated values| |
| is-in | Series | Checks if elements from a series are contained in right series| |
| is-not-null | Series | Creates mask where value is not null| |
| is-null | Series | Creates mask where value is null| |
| is-unique | Series | Creates mask indicating unique values| |
| join | DataFrame | Joins a dataframe using columns as reference| |
| list | | Lists stored dataframes| |
| load | | Loads dataframe form csv file| load |
| melt | DataFrame | Unpivot a DataFrame from wide to long format| |
| pivot | GroupBy | Performs a pivot operation on a groupby object| pivot |
| rename | Series | Renames a series| rename |
| sample | DataFrame | Create sample dataframe| |
| select | DataFrame | Creates a new dataframe with the selected columns| select |
| set | Series | Sets value where given mask is true| |
| shift | Series | Shifts the values by a given period| |
| show | DataFrame | Converts a section of the dataframe to a Table or List value| |
| slice | DataFrame | Creates new dataframe from a slice of rows| |
| sort | DataFrame, Series | Creates new sorted dataframe or series| sort |
| tail | DataFrame | Creates new dataframe with tail rows| |
| to-csv | DataFrame | Saves dataframe to csv file| to csv |
| to-df | | Converts a pipelined Table or List into a polars dataframe| |
| to-dummies | DataFrame | Creates a new dataframe with dummy variables| |
| to-parquet | DataFrame | Saves dataframe to parquet file| |
| to-series | | Converts a pipelined List into a polars series| |
| unique | Series | Returns unique values from a series| |
| value-counts | Series | Returns a dataframe with the counts for unique values in series| |
| where | DataFrame | Filter dataframe to match the condition| where |
| with-column | DataFrame | Adds a series to the dataframe| |


## Operation comparison


## Future of Dataframes
