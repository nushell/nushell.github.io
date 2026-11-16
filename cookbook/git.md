---
title: Git
---

# Git

Nu can help with common `Git` tasks like removing all local branches which have been merged into master.

### Delete git merged branches

**Warning**: This command will hard delete the merged branches from your machine. You may want to check the branches selected for deletion by omitting the last git command.

```nu
git branch --merged | lines | where ($it != "* master" and $it != "* main") | each {|br| git branch -D ($br | str trim) } | str trim
# => ╭───┬──────────────────────────────────────────╮
# => │ 0 │ Deleted branch start_urls (was 320762a). │
# => ╰───┴──────────────────────────────────────────╯
```

### Parse formatted commit messages (more details in the parsing git log section)

```nu
git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | first 10
# => ╭───┬─────────┬───────────────────┬─────────────────────────────────────────────────────────────────────┬─────────────────────────────────╮
# => │ # │  sha1   │     committer     │                                desc                                 │            merged_at            │
# => ├───┼─────────┼───────────────────┼─────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
# => │ 0 │ 06c559b │ Justin Ma         │ Update some examples and docs (#4682)                               │ Tue, 1 Mar 2022 21:05:29 +0800  │
# => │ 1 │ 2702db4 │ Sophia            │ Move to latest stable crossterm, with fix (#4684)                   │ Tue, 1 Mar 2022 07:05:46 -0500  │
# => │ 2 │ 320762a │ Fernando Herrera  │ dataframe list command (#4681)                                      │ Tue, 1 Mar 2022 11:41:13 +0000  │
# => │ 3 │ c06a93a │ Sophia            │ Add binary literals (#4680)                                         │ Mon, 28 Feb 2022 18:31:53 -0500 │
# => │ 4 │ 1aa81c2 │ Luca Trevisani    │ Fix alias in `docs/sample_config/config.toml` (#4669)               │ Mon, 28 Feb 2022 22:47:14 +0100 │
# => │ 5 │ 6029335 │ Sophia            │ Fix open ended ranges (#4677)                                       │ Mon, 28 Feb 2022 11:15:31 -0500 │
# => │ 6 │ 82e6a98 │ Justin Ma         │ Fix unsupported type message for some math related commands (#4672) │ Mon, 28 Feb 2022 23:14:33 +0800 │
# => │ 7 │ 1c8ba1d │ Sophia            │ Use default_config.nu by default (#4675)                            │ Mon, 28 Feb 2022 10:12:08 -0500 │
# => │ 8 │ f8a1030 │ Sophia            │ Add back in default keybindings (#4673)                             │ Mon, 28 Feb 2022 08:54:40 -0500 │
# => │ 9 │ f21711c │ Stefan Holderbach │ Add profiling build profile and symbol strip (#4630)                │ Mon, 28 Feb 2022 13:13:24 +0100 │
# => ╰───┴─────────┴───────────────────┴─────────────────────────────────────────────────────────────────────┴─────────────────────────────────╯
```

---

### View git committer activity as a `histogram`

`histogram` counts the commits per committer and sorts the result by that count, largest first.

```nu
git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | histogram committer merger | first 10
# => ╭───┬───────────────────┬───────┬──────────┬────────────┬────────────────────────────────────────────────────╮
# => │ # │     committer     │ count │ quantile │ percentage │                       merger                       │
# => ├───┼───────────────────┼───────┼──────────┼────────────┼────────────────────────────────────────────────────┤
# => │ 0 │ Sophia            │     5 │     0.50 │ 50.00%     │ ************************************************** │
# => │ 1 │ Justin Ma         │     2 │     0.20 │ 20.00%     │ ********************                               │
# => │ 2 │ Fernando Herrera  │     1 │     0.10 │ 10.00%     │ **********                                         │
# => │ 3 │ Luca Trevisani    │     1 │     0.10 │ 10.00%     │ **********                                         │
# => │ 4 │ Stefan Holderbach │     1 │     0.10 │ 10.00%     │ **********                                         │
# => ╰───┴───────────────────┴───────┴──────────┴────────────┴────────────────────────────────────────────────────╯
```

The first argument names the column to count. The second, optional argument names the column that holds the bar, here `merger`; without it, that column is called `frequency`. It can't be `value`, `count`, `quantile`, or `percentage`, which are taken by the other columns:

- `count` is how many times the value appears.
- `quantile` is `count` as a fraction, and `percentage` is the same fraction as a string such as `50.00%`.
- The bar has one `*` for each whole percent, so 50% draws 50 stars.

Rows with the same count are sorted by value. For a plain list, leave out the column name, and the values go in a `value` column:

```nu
[Sophia Justin Sophia Luca Justin] | histogram
# => ╭───┬────────┬───────┬──────────┬────────────┬──────────────────────────────────────────╮
# => │ # │ value  │ count │ quantile │ percentage │                frequency                 │
# => ├───┼────────┼───────┼──────────┼────────────┼──────────────────────────────────────────┤
# => │ 0 │ Justin │     2 │     0.40 │ 40.00%     │ **************************************** │
# => │ 1 │ Sophia │     2 │     0.40 │ 40.00%     │ **************************************** │
# => │ 2 │ Luca   │     1 │     0.20 │ 20.00%     │ ********************                     │
# => ╰───┴────────┴───────┴──────────┴────────────┴──────────────────────────────────────────╯
```

By default, or with `--percentage-type normalize`, the fraction is `count` divided by the number of values, so the percentages add up to 100%. With `--percentage-type relative` (`-t relative`) it's `count` divided by the largest count instead. The most common value then gets 100% and a full bar of 100 stars, and the others are measured against it:

```nu
[Sophia Justin Sophia Luca Justin] | histogram --percentage-type relative | select value count quantile percentage
# => ╭───┬────────┬───────┬──────────┬────────────╮
# => │ # │ value  │ count │ quantile │ percentage │
# => ├───┼────────┼───────┼──────────┼────────────┤
# => │ 0 │ Justin │     2 │     1.00 │ 100.00%    │
# => │ 1 │ Sophia │     2 │     1.00 │ 100.00%    │
# => │ 2 │ Luca   │     1 │     0.50 │ 50.00%     │
# => ╰───┴────────┴───────┴──────────┴────────────╯
```
