# String Expressions

The [Working with strings](../dataframes.md#working-with-strings) section of the [Dataframes](../dataframes.md) chapter covers `polars str-lengths`. This page covers the other Polars commands for string columns. They change case, search and replace with regular expressions, cut strings apart, join them together, and parse numbers out of them.

[[toc]]

## Expressions and one-column dataframes

Each command on this page builds an expression. Most of them take a column expression as input, as in `polars col name | polars uppercase`. You use the expression in `polars select`, `polars with-column`, `polars filter`, or `polars agg`, as the chapter's [Lazy Dataframes](../dataframes.md#lazy-dataframes) section explains. Some of the commands also work on a dataframe with a single string column and return a dataframe:

| Command                                                                                                                            | Also takes a one-column dataframe  |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`polars uppercase`](/commands/docs/polars_uppercase.md), [`polars lowercase`](/commands/docs/polars_lowercase.md)                 | yes                                |
| [`polars contains`](/commands/docs/polars_contains.md)                                                                             | yes                                |
| [`polars str-replace`](/commands/docs/polars_str-replace.md), [`polars str-replace-all`](/commands/docs/polars_str-replace-all.md) | yes                                |
| [`polars str-slice`](/commands/docs/polars_str-slice.md)                                                                           | yes                                |
| [`polars str-join`](/commands/docs/polars_str-join.md)                                                                             | yes, joined with another dataframe |
| [`polars str-split`](/commands/docs/polars_str-split.md), [`polars str-strip-chars`](/commands/docs/polars_str-strip-chars.md)     | no                                 |
| [`polars concat-str`](/commands/docs/polars_concat-str.md)                                                                         | no, it ignores its input           |
| [`polars integer`](/commands/docs/polars_integer.md), [`polars decimal`](/commands/docs/polars_decimal.md)                         | no                                 |

On a dataframe with more than one column, these commands fail with `Error using as series`, so take one column first with `polars get`. They also take a lazy dataframe, but they collect it and return an eager dataframe. The result keeps the column's name.

Only `polars str-split` and `polars str-strip-chars` take a [selector](./selectors.md) as input. The other commands reject one with an error such as `Can't convert to NuDataFrame, NuLazyFrame, NuExpression, NuSelector`, so pick several string columns with `polars col --type str` instead.

A string command used on a column of another type fails when you collect the result, with an error such as `` invalid series dtype: expected `String`, got `i64` ``. On a one-column dataframe it fails straight away. Null values stay null.

The examples use this dataframe:

```nu
let people = [[name city]; ["Ada Lovelace" London] ["Grace Hopper" "New York"] ["Émile Zola" Paris]] | polars into-df
```

## Changing case

`polars uppercase` and `polars lowercase` follow Unicode's case rules, so `É` and `é` convert into each other and `ß` becomes `SS`:

```nu
$people | polars select (polars col name | polars uppercase) (polars col city | polars lowercase) | polars collect
# => ╭───┬──────────────┬──────────╮
# => │ # │     name     │   city   │
# => ├───┼──────────────┼──────────┤
# => │ 0 │ ADA LOVELACE │ london   │
# => │ 1 │ GRACE HOPPER │ new york │
# => │ 2 │ ÉMILE ZOLA   │ paris    │
# => ╰───┴──────────────┴──────────╯
```

When their dataframe input isn't a string column, the error's help text says `The str-slice command can only be used with string columns`, even though the command was `polars uppercase` or `polars lowercase`.

## Searching with regular expressions

`polars contains` returns `true` for each string that a regular expression matches somewhere. The pattern isn't anchored, so add `^` or `$` to match at the start or end, and `(?i)` makes it ignore case. Use it with `polars filter` to keep the matching rows:

```nu
$people | polars filter (polars col city | polars contains '(?i)york|paris') | polars collect
# => ╭───┬──────────────┬──────────╮
# => │ # │     name     │   city   │
# => ├───┼──────────────┼──────────┤
# => │ 0 │ Grace Hopper │ New York │
# => │ 1 │ Émile Zola   │ Paris    │
# => ╰───┴──────────────┴──────────╯
```

On a one-column dataframe it returns a boolean column, which works as a mask for `polars filter-with`:

```nu
$people | polars get name | polars contains '^[A-G]'
# => ╭───┬───────╮
# => │ # │ name  │
# => ├───┼───────┤
# => │ 0 │ true  │
# => │ 1 │ true  │
# => │ 2 │ false │
# => ╰───┴───────╯
```

A pattern that isn't a valid regular expression doesn't cause an error. Every result is null instead, so `polars contains '('` matches nothing. To match a character that has a meaning in regular expressions, escape it with a backslash, as in `'\('`, or put it in brackets, as in `'[(]'`. Single quotes keep Nushell from reading the backslash itself.

## Replacing text

`polars str-replace` replaces the first match of a regular expression in each string, and `polars str-replace-all` replaces every match. Both need `--pattern` (`-p`) and `--replace` (`-r`). Leaving either one out fails with `Missing required flag`:

```nu
let phones = [[phone]; ["555-123-4567"] ["555.987.6543"] ["(555) 000 1111"]] | polars into-df
$phones | polars select [
    (polars col phone)
    (polars col phone | polars str-replace -p '\D' -r '' | polars as first)
    (polars col phone | polars str-replace-all -p '\D' -r '' | polars as all)
] | polars collect
# => ╭───┬────────────────┬───────────────┬────────────╮
# => │ # │     phone      │     first     │    all     │
# => ├───┼────────────────┼───────────────┼────────────┤
# => │ 0 │ 555-123-4567   │ 555123-4567   │ 5551234567 │
# => │ 1 │ 555.987.6543   │ 555987.6543   │ 5559876543 │
# => │ 2 │ (555) 000 1111 │ 555) 000 1111 │ 5550001111 │
# => ╰───┴────────────────┴───────────────┴────────────╯
```

The replacement can use the pattern's groups. `$1` stands for the text the first group matched, and `$$` for a literal `$`. Write `${1}` when letters, digits, or an underscore come right after the group number. A string in double quotes doesn't treat `$` specially in Nushell, so `"$1"` reaches Polars unchanged:

```nu
$phones | polars select (polars col phone | polars str-replace -p '(\d{3})-(\d{3})' -r '$2-$1') | polars collect
# => ╭───┬────────────────╮
# => │ # │     phone      │
# => ├───┼────────────────┤
# => │ 0 │ 123-555-4567   │
# => │ 1 │ 555.987.6543   │
# => │ 2 │ (555) 000 1111 │
# => ╰───┴────────────────╯
```

Unlike `polars contains`, both commands fail on an invalid pattern, with `regex parse error`.

## Slicing

`polars str-slice` takes a start position and an optional `--length` (`-l`), and counts both in characters, not bytes. A negative start counts back from the end of each string. Without `--length` the slice runs to the end of the string:

```nu
let codes = [[code]; ["GB-001"] ["US-042"] ["Zürich-7"]] | polars into-df
$codes | polars select [
    (polars col code)
    (polars col code | polars str-slice 0 --length 2 | polars as first2)
    (polars col code | polars str-slice -3 | polars as last3)
] | polars collect
# => ╭───┬──────────┬────────┬───────╮
# => │ # │   code   │ first2 │ last3 │
# => ├───┼──────────┼────────┼───────┤
# => │ 0 │ GB-001   │ GB     │ 001   │
# => │ 1 │ US-042   │ US     │ 042   │
# => │ 2 │ Zürich-7 │ Zü     │ h-7   │
# => ╰───┴──────────┴────────┴───────╯
```

A start past the end of a string gives an empty string. A slice that begins before the start of the string keeps only the part inside it, so `polars str-slice -8 --length 3` gives `G` for `GB-001`. In an expression, a negative `--length` fails on collect with ``conversion from `i32` to `u64` failed``. On a one-column dataframe it gives the rest of the string instead.

## Splitting

`polars str-split` splits each string at a separator and returns a column of type `list<str>`. The separator is literal text, not a regular expression, so `polars str-split "."` splits at dots. An empty separator splits a string into its characters. To get one row per piece, follow it with `polars explode`, which [Exploding list columns](./frames.md#exploding-list-columns) describes:

```nu
let posts = [[id tags]; [1 "nu,shell"] [2 "polars"] [3 "nu,data,polars"]] | polars into-df
$posts | polars with-column (polars col tags | polars str-split ",") | polars explode tags | polars collect
# => ╭───┬────┬────────╮
# => │ # │ id │  tags  │
# => ├───┼────┼────────┤
# => │ 0 │  1 │ nu     │
# => │ 1 │  1 │ shell  │
# => │ 2 │  2 │ polars │
# => │ 3 │  3 │ nu     │
# => │ 4 │  3 │ data   │
# => │ 5 │  3 │ polars │
# => ╰───┴────┴────────╯
```

The separator can also be an expression, which gives each row its own separator:

```nu
[[text sep]; ["a,b" ","] ["x|y|z" "|"]] | polars into-df | polars select (polars col text | polars str-split (polars col sep)) | polars explode text | polars collect
# => ╭───┬──────╮
# => │ # │ text │
# => ├───┼──────┤
# => │ 0 │ a    │
# => │ 1 │ b    │
# => │ 2 │ x    │
# => │ 3 │ y    │
# => │ 4 │ z    │
# => ╰───┴──────╯
```

## Stripping characters

`polars str-strip-chars` removes characters from both ends of each string. Its argument is a set of characters, not a word. Every character in the set is stripped, in any order, until a character outside the set comes up. `--start` (`-s`) strips only the start and `--end` (`-e`) only the end. If you pass both, it strips only the start. There is no default set, so to strip whitespace, list the whitespace characters, as in `polars str-strip-chars " \t\n"`. A string made only of characters in the set becomes empty:

```nu
[[raw]; ["--ab-c-ba--"] ["b-a-bab"]] | polars into-df | polars select [
    (polars col raw)
    (polars col raw | polars str-strip-chars "-ab" | polars as both)
    (polars col raw | polars str-strip-chars --start "-ab" | polars as start)
    (polars col raw | polars str-strip-chars --end "-ab" | polars as end)
] | polars collect
# => ╭───┬─────────────┬──────┬────────┬────────╮
# => │ # │     raw     │ both │ start  │  end   │
# => ├───┼─────────────┼──────┼────────┼────────┤
# => │ 0 │ --ab-c-ba-- │ c    │ c-ba-- │ --ab-c │
# => │ 1 │ b-a-bab     │      │        │        │
# => ╰───┴─────────────┴──────┴────────┴────────╯
```

The argument can also be an expression, such as a column holding a different set for each row. A number fails on collect, because it's an integer and not a string, so write `"1"` rather than `1`.

## Joining strings

`polars concat-str` joins values across columns, one result per row. It takes a separator and a list of columns. A string in the list is a column name, so to add fixed text, wrap it in `polars lit`. Numbers in the list have to be wrapped the same way, because a plain `3` fails with `can't convert int to expression`. Columns of other types are converted to text. The command ignores its input, so it only makes sense inside `polars select` or `polars with-column`:

```nu
let born = [[first last year]; [Ada Lovelace 1815] [Grace Hopper 1906] [Linus null 1969]] | polars into-df
$born | polars select (polars concat-str "" [(polars col last | polars uppercase) (polars lit ", b. ") year] | polars as label) | polars collect
# => ╭───┬───────────────────╮
# => │ # │       label       │
# => ├───┼───────────────────┤
# => │ 0 │ LOVELACE, b. 1815 │
# => │ 1 │ HOPPER, b. 1906   │
# => │ 2 │                   │
# => ╰───┴───────────────────╯
```

If any value in a row is null, the result for that row is null, as the third row shows. The result is named after the first column in the list, so name it with `polars as`.

`polars str-join` works down a column. As an expression, it joins all the strings in the column into one, with `--delimiter` (`-d`) between them. The delimiter defaults to nothing. A null value makes the whole result null, unless you pass `--ignore-nulls` (`-n`), which skips nulls. In `polars agg` it joins each group:

```nu
let teams = [[team name]; [a Ada] [b Grace] [a Linus] [b null]] | polars into-df
$teams | polars group-by team | polars agg (polars col name | polars str-join -d ", " --ignore-nulls) | polars sort-by team | polars collect
# => ╭───┬──────┬────────────╮
# => │ # │ team │    name    │
# => ├───┼──────┼────────────┤
# => │ 0 │ a    │ Ada, Linus │
# => │ 1 │ b    │ Grace      │
# => ╰───┴──────┴────────────╯
```

Given a one-column dataframe, `polars str-join` does something else. It takes another one-column string dataframe as its argument and joins the two row by row, with nothing in between:

```nu
let first = [Ada Grace Linus] | polars into-df | polars rename "0" first
let last = [" Lovelace" " Hopper" " Torvalds"] | polars into-df
$first | polars str-join $last
# => ╭───┬────────────────╮
# => │ # │     first      │
# => ├───┼────────────────┤
# => │ 0 │ Ada Lovelace   │
# => │ 1 │ Grace Hopper   │
# => │ 2 │ Linus Torvalds │
# => ╰───┴────────────────╯
```

In this form `--delimiter` and `--ignore-nulls` have no effect, and a null on either side gives null. A one-row argument is joined to every row. Otherwise, when the lengths differ, the result has as many rows as the shorter dataframe. Without the argument the command fails with `Missing parameter: other`, and a column that isn't a string fails with `The str-join command only works with string columns`.

## Parsing numbers

`polars integer` parses strings as integers. A string it can't parse becomes null. That includes decimals, strings with spaces, and prefixes such as `0x`. `--strict` (`-s`) makes collecting fail instead, with a message that lists the bad values, such as `strict integer parsing failed for 1 value(s): ["x"]`.

The first optional argument is the base, from 2 to 36, which defaults to 10. It can be an expression, which gives each row its own base. The second optional argument is the result type, such as `u8` or `i32`, and it defaults to `i64`. A type goes after the base, so `polars integer u8` reads `u8` as the base and fails, while `polars integer 10 u8` works. A value that doesn't fit the type becomes null, or fails with `--strict`:

```nu
[[s base]; ["42" 10] ["ff" 16] ["101" 2] ["300" 10] ["x" 10]] | polars into-df | polars select [
    (polars col s)
    (polars col s | polars integer | polars as base10)
    (polars col s | polars integer (polars col base) | polars as per_row)
    (polars col s | polars integer 10 u8 | polars as as_u8)
] | polars collect
# => ╭───┬─────┬────────┬─────────┬───────╮
# => │ # │  s  │ base10 │ per_row │ as_u8 │
# => ├───┼─────┼────────┼─────────┼───────┤
# => │ 0 │ 42  │     42 │      42 │    42 │
# => │ 1 │ ff  │        │     255 │       │
# => │ 2 │ 101 │    101 │       5 │   101 │
# => │ 3 │ 300 │    300 │     300 │       │
# => │ 4 │ x   │        │         │       │
# => ╰───┴─────┴────────┴─────────┴───────╯
```

`polars decimal` parses strings as decimal numbers. Its argument, which the command's help calls `infer_length`, sets how many digits to keep after the decimal point. Extra digits are rounded to the nearest value, and a value exactly halfway rounds to an even last digit. The result is then converted to `f64`, so the column's type is `f64`, not a decimal type. Strings it can't parse, including ones with spaces or a comma as the decimal mark, become null. Scientific notation such as `1e3` works:

```nu
[[s]; ["2.456"] ["2.45"] ["2.55"] ["1e3"] ["1,5"]] | polars into-df | polars select [
    (polars col s)
    (polars col s | polars decimal 1 | polars as one_digit)
] | polars collect
# => ╭───┬───────┬───────────╮
# => │ # │   s   │ one_digit │
# => ├───┼───────┼───────────┤
# => │ 0 │ 2.456 │      2.50 │
# => │ 1 │ 2.45  │      2.40 │
# => │ 2 │ 2.55  │      2.60 │
# => │ 3 │ 1e3   │   1000.00 │
# => │ 4 │ 1,5   │           │
# => ╰───┴───────┴───────────╯
```

A negative argument fails with `Negative value passed when positive one is required`.
