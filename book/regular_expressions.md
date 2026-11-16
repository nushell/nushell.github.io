# Regular Expressions

Regular expressions in Nushell's commands and operators (such as `=~`, `str replace --regex`, `parse --regex`, and `split row --regex`) are handled by the [`fancy-regex`](https://docs.rs/fancy-regex) crate. It supports the syntax of Rust's [`regex`](https://docs.rs/regex/latest/regex/#syntax) crate, and adds features such as look-around and backreferences. If you want to know more, check the crate documentation.

Write patterns in single quotes or raw strings. In a double-quoted string, Nushell reads each backslash as one of its own escapes first, so `"\d"` is a parse error.

## Flags in the pattern

A pattern can turn on flags at its start: `(?i)` ignores case, `(?m)` makes `^` and `$` match at the start and end of every line instead of the whole text, and `(?s)` lets `.` match a newline. They can be combined, as in `(?im)`.

```nu
'Nushell' =~ '(?i)^nu'
# => true
'NUSHELL' =~ '^nu'
# => false
```

## Matching text literally

When part of a pattern comes from a variable, characters such as `.` and `+` in it still act as regex syntax. Here `.txt` matches any character followed by `txt`, so `atxt` gets through:

```nu
let ext = '.txt'
['a.txt' 'atxt' 'b.txt.bak'] | where $it =~ $'($ext)$'
# => ╭───┬───────╮
# => │ 0 │ a.txt │
# => │ 1 │ atxt  │
# => ╰───┴───────╯
```

[`str escape-regex`](/commands/docs/str_escape-regex.md) puts a backslash in front of each character that has a meaning in a pattern: `\ . + * ? ( ) [ ] { } | ^ $ #`. The escaped text matches only itself, and the rest of the pattern keeps working:

```nu
['a.txt' 'atxt' 'b.txt.bak'] | where $it =~ $'($ext | str escape-regex)$'
# => ╭───┬───────╮
# => │ 0 │ a.txt │
# => ╰───┴───────╯
'1+1=2' | str escape-regex
# => 1\+1=2
```

You need it only where Nushell reads a regex, such as the `=~` and `!~` operators and the `--regex` forms of `str replace`, `parse`, `split row`, `split column`, `split list` and [`find`](/commands/docs/find.md). Without `--regex`, those commands already match plain text, and so does [`str contains`](/commands/docs/str_contains.md). Given a list of strings, `str escape-regex` escapes each one. For a table or record, name the columns to escape, as described in [Lists, records and tables](working_with_strings.md#lists-records-and-tables).

## Replacing with `str replace`

With `--regex`, [`str replace`](/commands/docs/str_replace.md) treats the text to find as a regular expression, and the replacement can refer to capture groups. `$1`, `$2` and so on insert numbered groups, and `$name` inserts a group named with `(?<name>...)`:

```nu
'2024-01-15' | str replace --regex '(\d+)-(\d+)-(\d+)' '$3/$2/$1'
# => 15/01/2024
'2024-01-15' | str replace --regex '(?<y>\d+)-(?<m>\d+)-(?<d>\d+)' '${d}th of $m'
# => 15th of 01
```

A group reference takes every letter, digit and underscore that follows the `$`. In the second example, `$dth` would mean a group named `dth`. No group has that name, so it would insert nothing. Use braces, as in `${d}` or `${1}`, when more text follows the reference. Write `$$` for a literal `$`. `--no-expand` (`-n`) turns all of this off and inserts the replacement as written:

```nu
'cost: 5' | str replace --regex '(\d+)' '$$$1'
# => cost: $5
'cost: 5' | str replace --regex --no-expand '(\d+)' '$1'
# => cost: $1
```

`--multiline` (`-m`) implies `--regex` and adds the `(?m)` flag, so `^` and `$` match at every line. Without it, `^` matches only at the start of the text:

```nu
"a\nb" | str replace --all --regex '^' '> '
# => > a
# => b
"a\nb" | str replace --all --multiline '^' '> '
# => > a
# => > b
```

When the replacement is a closure, it runs once for each match. The whole match is its input, `$in`, and the capture groups are passed as its parameters, in order. A group that didn't take part in the match is `null`. The closure has to return a string:

```nu
'2024-01-15' | str replace --regex '(\d+)-(\d+)-(\d+)' {|y, m, d| $'($d).($m).($y)' }
# => 15.01.2024
```

The closure can declare fewer parameters than there are groups, but not more. A parameter with no group to fill it is a "Missing parameter" error.

## Capture groups in `parse`

[`parse --regex`](/commands/docs/parse.md) makes a column for each capture group. A named group gives its name to the column. An unnamed group is named `capture` followed by its position among all the groups, counting from 0:

```nu
'ab12' | parse --regex '([a-z]+)(\d+)'
# => ╭───┬──────────┬──────────╮
# => │ # │ capture0 │ capture1 │
# => ├───┼──────────┼──────────┤
# => │ 0 │ ab       │ 12       │
# => ╰───┴──────────┴──────────╯
'ab12' | parse --regex '(?<letters>[a-z]+)(\d+)'
# => ╭───┬─────────┬──────────╮
# => │ # │ letters │ capture1 │
# => ├───┼─────────┼──────────┤
# => │ 0 │ ab      │ 12       │
# => ╰───┴─────────┴──────────╯
```

Each match in the string becomes a row, and a group that didn't take part in a match is `null` in that row. Use a non-capturing group, `(?:...)`, for grouping that shouldn't become a column.

Look-around and backreferences make the regex engine backtrack, and a badly written pattern can then take a very long time on some inputs. The engine stops after a set number of backtracking steps, 1,000,000 by default, and `parse` fails with "Max limit for backtracking count exceeded". `--backtrack` sets a different limit. A higher one lets a slow pattern finish, and a lower one makes it fail sooner.

## Splitting on a pattern

[`split row --regex`](/commands/docs/split_row.md) and [`split column --regex`](/commands/docs/split_column.md) split wherever the pattern matches. See [Splitting Strings](working_with_strings.md#splitting-strings).
