---
title: Parsing Git Log
---

# Parsing Git Log

# Let's parse git log

This `git log` command is interesting but you can't do a lot with it like this.

```nu
git log -n 3
# => commit fb864ccad82bc834581b2f52edfca9b841bdedcc (HEAD -> main)
# => Author: Justin Ma <hustcer@outlook.com>
# => Date:   Mon Sep 28 16:00:00 2026 +0800
# =>
# =>     Update some examples and docs (#4682)
# =>
# => commit 5782ec2c355eb8c669a61127adf3479a939c50a2
# => Author: Sophia <547158+sophiajt@users.noreply.github.com>
# => Date:   Mon Sep 28 02:00:17 2026 -0500
# =>
# =>     Move to latest stable crossterm, with fix (#4684)
# =>
# => commit c8b46d09cd05b5447ff44e90ac95b2e612876578
# => Author: Fernando Herrera <fernando.j.herrera@gmail.com>
# => Date:   Mon Sep 28 06:35:44 2026 +0000
# =>
# =>     dataframe list command (#4681)
```

Let's make it more parsable

```nu
git log --pretty="%h|%s|%aN|%aE|%aD" -n 25
```

This will work but I've been burnt by this in the past when a pipe `|` gets injected in the commits.

So, let's try again with something that most likely won't show up in commits, `»¦«`. Also, since we're not using a pipe now we don't have to use quotes around the pretty format string. Notice that the output is just a bunch of strings.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5
# => fb864cca»¦«Update some examples and docs (#4682)»¦«Justin Ma»¦«hustcer@outlook.com»¦«Mon, 28 Sep 2026 16:00:00 +0800
# => 5782ec2c»¦«Move to latest stable crossterm, with fix (#4684)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Mon, 28 Sep 2026 02:00:17 -0500
# => c8b46d09»¦«dataframe list command (#4681)»¦«Fernando Herrera»¦«fernando.j.herrera@gmail.com»¦«Mon, 28 Sep 2026 06:35:44 +0000
# => 4b36ea29»¦«Add binary literals (#4680)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Sun, 27 Sep 2026 13:26:24 -0500
# => c43e60c6»¦«Fix alias in `docs/sample_config/config.toml` (#4669)»¦«Luca Trevisani»¦«lucatrv@hotmail.com»¦«Sun, 27 Sep 2026 17:41:45 +0100
```

Ahh, much better. Now that we have the raw data, let's try to parse it with nu.

First we need to get it in lines or rows. Notice that the output is now in a table format.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines
# => ╭───┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ 0 │ fb864cca»¦«Update some examples and docs (#4682)»¦«Justin Ma»¦«hustcer@outlook.com»¦«Mon, 28 Sep 2026 16:00:00 +0800                               │
# => │ 1 │ 5782ec2c»¦«Move to latest stable crossterm, with fix (#4684)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Mon, 28 Sep 2026 02:00:17 -0500 │
# => │ 2 │ c8b46d09»¦«dataframe list command (#4681)»¦«Fernando Herrera»¦«fernando.j.herrera@gmail.com»¦«Mon, 28 Sep 2026 06:35:44 +0000                      │
# => │ 3 │ 4b36ea29»¦«Add binary literals (#4680)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Sun, 27 Sep 2026 13:26:24 -0500                       │
# => │ 4 │ c43e60c6»¦«Fix alias in `docs/sample_config/config.toml` (#4669)»¦«Luca Trevisani»¦«lucatrv@hotmail.com»¦«Sun, 27 Sep 2026 17:41:45 +0100          │
# => ╰───┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

That's more like nushell, but it would be nice to have some columns.

We used the delimiter `»¦«` specifically so we can create columns so let's use it like this.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«"
# => ╭─────────┬────────────────┬────────────────────────────────────────────────────────────┬───────────────────────┬───────────────────────────────────────────────┬──────────────────────────────────────╮
# => │       # │    column0     │                          column1                           │        column2        │                    column3                    │               column4                │
# => ├─────────┼────────────────┼────────────────────────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────┤
# => │       0 │ fb864cca       │ Update some examples and docs (#4682)                      │ Justin Ma             │ hustcer@outlook.com                           │ Mon, 28 Sep 2026 16:00:00 +0800      │
# => │       1 │ 5782ec2c       │ Move to latest stable crossterm, with fix (#4684)          │ Sophia                │ 547158+sophiajt@users.noreply.github.com      │ Mon, 28 Sep 2026 02:00:17 -0500      │
# => │       2 │ c8b46d09       │ dataframe list command (#4681)                             │ Fernando Herrera      │ fernando.j.herrera@gmail.com                  │ Mon, 28 Sep 2026 06:35:44 +0000      │
# => │       3 │ 4b36ea29       │ Add binary literals (#4680)                                │ Sophia                │ 547158+sophiajt@users.noreply.github.com      │ Sun, 27 Sep 2026 13:26:24 -0500      │
# => │       4 │ c43e60c6       │ Fix alias in `docs/sample_config/config.toml` (#4669)      │ Luca Trevisani        │ lucatrv@hotmail.com                           │ Sun, 27 Sep 2026 17:41:45 +0100      │
# => ╰─────────┴────────────────┴────────────────────────────────────────────────────────────┴───────────────────────┴───────────────────────────────────────────────┴──────────────────────────────────────╯
```

Yay, for columns! But wait, it would really be nice if those columns had something other than generically named column names.

Let's try adding the columns names to `split column` like this.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date
# => ╭─────────┬────────────────┬────────────────────────────────────────────────────────────┬───────────────────────┬───────────────────────────────────────────────┬──────────────────────────────────────╮
# => │       # │     commit     │                          subject                           │         name          │                     email                     │                 date                 │
# => ├─────────┼────────────────┼────────────────────────────────────────────────────────────┼───────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────┤
# => │       0 │ fb864cca       │ Update some examples and docs (#4682)                      │ Justin Ma             │ hustcer@outlook.com                           │ Mon, 28 Sep 2026 16:00:00 +0800      │
# => │       1 │ 5782ec2c       │ Move to latest stable crossterm, with fix (#4684)          │ Sophia                │ 547158+sophiajt@users.noreply.github.com      │ Mon, 28 Sep 2026 02:00:17 -0500      │
# => │       2 │ c8b46d09       │ dataframe list command (#4681)                             │ Fernando Herrera      │ fernando.j.herrera@gmail.com                  │ Mon, 28 Sep 2026 06:35:44 +0000      │
# => │       3 │ 4b36ea29       │ Add binary literals (#4680)                                │ Sophia                │ 547158+sophiajt@users.noreply.github.com      │ Sun, 27 Sep 2026 13:26:24 -0500      │
# => │       4 │ c43e60c6       │ Fix alias in `docs/sample_config/config.toml` (#4669)      │ Luca Trevisani        │ lucatrv@hotmail.com                           │ Sun, 27 Sep 2026 17:41:45 +0100      │
# => ╰─────────┴────────────────┴────────────────────────────────────────────────────────────┴───────────────────────┴───────────────────────────────────────────────┴──────────────────────────────────────╯
```

Ahhh, that looks much better.

Hmmm, that date string is a string. If it were a date vs a string it could be used for sorting by date. The way we do that is we have to convert the datetime to a real datetime and update the column. Try this.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime}
# => ╭───┬──────────┬───────────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬──────────────╮
# => │ # │  commit  │                        subject                        │       name       │                  email                   │     date     │
# => ├───┼──────────┼───────────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼──────────────┤
# => │ 0 │ fb864cca │ Update some examples and docs (#4682)                 │ Justin Ma        │ hustcer@outlook.com                      │ 7 hours ago  │
# => │ 1 │ 5782ec2c │ Move to latest stable crossterm, with fix (#4684)     │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 8 hours ago  │
# => │ 2 │ c8b46d09 │ dataframe list command (#4681)                        │ Fernando Herrera │ fernando.j.herrera@gmail.com             │ 8 hours ago  │
# => │ 3 │ 4b36ea29 │ Add binary literals (#4680)                           │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 20 hours ago │
# => │ 4 │ c43e60c6 │ Fix alias in `docs/sample_config/config.toml` (#4669) │ Luca Trevisani   │ lucatrv@hotmail.com                      │ a day ago    │
# => ╰───┴──────────┴───────────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴──────────────╯
```

Now this looks more nu-ish

If we want to revert back to a date string we can do something like this with the `select` command and the `get` command.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | select 3 | get date | format date | get 0
# => Sun, 27 Sep 2026 13:26:24 -0500
```

Cool! Now that we have a real datetime we can do some interesting things with it like `group-by` or `sort-by` or `where`.
Let's try `sort-by` first

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | sort-by date | first 5
# => ╭───┬──────────┬───────────────────────────────────────────────────┬──────────────────┬─────────────────────────────────────────────┬────────────╮
# => │ # │  commit  │                      subject                      │       name       │                    email                    │    date    │
# => ├───┼──────────┼───────────────────────────────────────────────────┼──────────────────┼─────────────────────────────────────────────┼────────────┤
# => │ 0 │ eeb98ac6 │ Add support for stderr and exit code (#4647)      │ Sophia           │ 547158+sophiajt@users.noreply.github.com    │ 4 days ago │
# => │ 1 │ 9ff10b33 │ fix: add missing metadata for `ls_colors` (#4603) │ Jae-Heon Ji      │ 32578710+jaeheonji@users.noreply.github.com │ 3 days ago │
# => │ 2 │ 8ff6e158 │ Plugins without file (#4650)                      │ Fernando Herrera │ fernando.j.herrera@gmail.com                │ 3 days ago │
# => │ 3 │ c5f46130 │ Find with regex flag (#4649)                      │ Fernando Herrera │ fernando.j.herrera@gmail.com                │ 3 days ago │
# => │ 4 │ f161b4bf │ add LAST_EXIT_CODE variable (#4655)               │ LordMZTE         │ lord@mzte.de                                │ 3 days ago │
# => ╰───┴──────────┴───────────────────────────────────────────────────┴──────────────────┴─────────────────────────────────────────────┴────────────╯
```

That's neat but what if I want it sorted in the opposite order? Try the `reverse` command and notice the newest commits are at the top.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | sort-by date | reverse | first 5
# => ╭───┬──────────┬───────────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬──────────────╮
# => │ # │  commit  │                        subject                        │       name       │                  email                   │     date     │
# => ├───┼──────────┼───────────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼──────────────┤
# => │ 0 │ fb864cca │ Update some examples and docs (#4682)                 │ Justin Ma        │ hustcer@outlook.com                      │ 7 hours ago  │
# => │ 1 │ 5782ec2c │ Move to latest stable crossterm, with fix (#4684)     │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 8 hours ago  │
# => │ 2 │ c8b46d09 │ dataframe list command (#4681)                        │ Fernando Herrera │ fernando.j.herrera@gmail.com             │ 8 hours ago  │
# => │ 3 │ 4b36ea29 │ Add binary literals (#4680)                           │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 20 hours ago │
# => │ 4 │ c43e60c6 │ Fix alias in `docs/sample_config/config.toml` (#4669) │ Luca Trevisani   │ lucatrv@hotmail.com                      │ a day ago    │
# => ╰───┴──────────┴───────────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴──────────────╯
```

Now let's try `group-by` and see what happens. This is a tiny bit tricky because dates are tricky. To group the commits by day rather than by the exact time, we first turn each date into a day string with `format date '%Y-%m-%d'` and then `group-by` the `date` column.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime | format date '%Y-%m-%d'} | group-by date | table
# => ╭────────────┬────────────────╮
# => │ 2026-09-28 │ [table 3 rows] │
# => │ 2026-09-27 │ [table 8 rows] │
# => │ 2026-09-26 │ [table 8 rows] │
# => │ 2026-09-25 │ [table 5 rows] │
# => │ 2026-09-24 │ [table 1 row]  │
# => ╰────────────┴────────────────╯
```

Each value in this record is a nested table holding that day's commits. Ending the pipeline with `table` shows them in compact form, like `[table 3 rows]`. Without it, a terminal that is at least 100 columns wide expands every nested table, which gets long quickly.

This would look better if we transpose the data and name the columns

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime | format date '%Y-%m-%d'} | group-by date | transpose date count | table
# => ╭───┬────────────┬────────────────╮
# => │ # │    date    │     count      │
# => ├───┼────────────┼────────────────┤
# => │ 0 │ 2026-09-28 │ [table 3 rows] │
# => │ 1 │ 2026-09-27 │ [table 8 rows] │
# => │ 2 │ 2026-09-26 │ [table 8 rows] │
# => │ 3 │ 2026-09-25 │ [table 5 rows] │
# => │ 4 │ 2026-09-24 │ [table 1 row]  │
# => ╰───┴────────────┴────────────────╯
```

How about `where` now? Show only the records that are less than a year old.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | first 5
# => ╭───┬──────────┬───────────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬──────────────╮
# => │ # │  commit  │                        subject                        │       name       │                  email                   │     date     │
# => ├───┼──────────┼───────────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼──────────────┤
# => │ 0 │ fb864cca │ Update some examples and docs (#4682)                 │ Justin Ma        │ hustcer@outlook.com                      │ 7 hours ago  │
# => │ 1 │ 5782ec2c │ Move to latest stable crossterm, with fix (#4684)     │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 8 hours ago  │
# => │ 2 │ c8b46d09 │ dataframe list command (#4681)                        │ Fernando Herrera │ fernando.j.herrera@gmail.com             │ 8 hours ago  │
# => │ 3 │ 4b36ea29 │ Add binary literals (#4680)                           │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 20 hours ago │
# => │ 4 │ c43e60c6 │ Fix alias in `docs/sample_config/config.toml` (#4669) │ Luca Trevisani   │ lucatrv@hotmail.com                      │ a day ago    │
# => ╰───┴──────────┴───────────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴──────────────╯
```

Or even show me all the commits in the last 7 days.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 7day)) | first 5
# => ╭───┬──────────┬───────────────────────────────────────────────────────┬──────────────────┬──────────────────────────────────────────┬──────────────╮
# => │ # │  commit  │                        subject                        │       name       │                  email                   │     date     │
# => ├───┼──────────┼───────────────────────────────────────────────────────┼──────────────────┼──────────────────────────────────────────┼──────────────┤
# => │ 0 │ fb864cca │ Update some examples and docs (#4682)                 │ Justin Ma        │ hustcer@outlook.com                      │ 7 hours ago  │
# => │ 1 │ 5782ec2c │ Move to latest stable crossterm, with fix (#4684)     │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 8 hours ago  │
# => │ 2 │ c8b46d09 │ dataframe list command (#4681)                        │ Fernando Herrera │ fernando.j.herrera@gmail.com             │ 8 hours ago  │
# => │ 3 │ 4b36ea29 │ Add binary literals (#4680)                           │ Sophia           │ 547158+sophiajt@users.noreply.github.com │ 20 hours ago │
# => │ 4 │ c43e60c6 │ Fix alias in `docs/sample_config/config.toml` (#4669) │ Luca Trevisani   │ lucatrv@hotmail.com                      │ a day ago    │
# => ╰───┴──────────┴───────────────────────────────────────────────────────┴──────────────────┴──────────────────────────────────────────┴──────────────╯
```

Now, with the 365 day slice of data, let's `group-by` name where the commits are less than a year old. On its own, `group-by` returns a record with one entry per author, which is hard to work with. However, if we `group-by` name and `transpose` the result, things will look much cleaner. `transpose` takes rows and turns them into columns or turns columns into rows.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose | table
# => ╭────┬──────────────────────┬──────────────────╮
# => │  # │       column0        │     column1      │
# => ├────┼──────────────────────┼──────────────────┤
# => │  0 │ Justin Ma            │ [table 21 rows]  │
# => │  1 │ Sophia               │ [table 851 rows] │
# => │  2 │ Fernando Herrera     │ [table 176 rows] │
# => │  3 │ Luca Trevisani       │ [table 1 row]    │
# => │  4 │ Stefan Holderbach    │ [table 19 rows]  │
# => │  5 │ Jonathan Moore       │ [table 2 rows]   │
# => │  6 │ Darren Schroeder     │ [table 242 rows] │
# => │  7 │ LordMZTE             │ [table 1 row]    │
# => │  8 │ Jae-Heon Ji          │ [table 10 rows]  │
# => │  9 │ zkldi                │ [table 1 row]    │
# => │ 10 │ Michael Angerman     │ [table 61 rows]  │
# => │ 11 │ Jakub Žádník         │ [table 136 rows] │
# => │ 12 │ Andrés N. Robalino   │ [table 29 rows]  │
# => │ 13 │ Stefan Stanciulescu  │ [table 27 rows]  │
# => │ 14 │ Luccas Mateus        │ [table 27 rows]  │
# => │ 15 │ Sophia Turner        │ [table 23 rows]  │
# => │ 16 │ Tanishq Kancharla    │ [table 21 rows]  │
# => │ 17 │ onthebridgetonowhere │ [table 20 rows]  │
# => │ 18 │ xiuxiu62             │ [table 19 rows]  │
# => ╰────┴──────────────────────┴──────────────────╯
```

Side note: If you happen to get errors, pay attention to the error message. For instance, this error means that the data being returned from `git log` is somehow incomplete. Specifically, there is a missing date column. I've seen git commands work perfectly on Windows and not work at all on Linux or Mac. I'm not sure why. If you run into this issue, one easy way to temporarily avoid it is to limit `git log` results to a certain number like `git log -n 100`.

```
Error: nu::shell::column_not_found

  × Cannot find column 'date'
   ╭─[repl_entry #1:1:138]
 1 │ git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day))
   ·                                                                                                                           ─┬ ──┬─
   ·                                                                                                                            │   ╰── column 'date' is missing in one or more values
   ·                                                                                                                            ╰── value originates here
   ╰────
  help: If some rows have this column, try using 'date?' for optional access, or pre-fill using
        the `default` command
```

Here's one tip for dealing with this error. The [`compact`](/commands/docs/compact.md) command drops the rows where the `date` column is missing (or empty) before we try to convert it. This is how you'd use it in the above example, if it were giving errors.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | compact date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose | table
```

Now, back to parsing.
What if we throw in the `sort-by` and `reverse` commands for good measure? Also, while we're in there, let's get rid of the `[table 21 rows]` thing too. We do that by using the `length` command on each row of column1.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | reverse
# => ╭────┬──────────────────────┬─────────╮
# => │  # │       column0        │ column1 │
# => ├────┼──────────────────────┼─────────┤
# => │  0 │ Sophia               │     851 │
# => │  1 │ Darren Schroeder     │     242 │
# => │  2 │ Fernando Herrera     │     176 │
# => │  3 │ Jakub Žádník         │     136 │
# => │  4 │ Michael Angerman     │      61 │
# => │  5 │ Andrés N. Robalino   │      29 │
# => │  6 │ Luccas Mateus        │      27 │
# => │  7 │ Stefan Stanciulescu  │      27 │
# => │  8 │ Sophia Turner        │      23 │
# => │  9 │ Tanishq Kancharla    │      21 │
# => │ 10 │ Justin Ma            │      21 │
# => │ 11 │ onthebridgetonowhere │      20 │
# => │ 12 │ xiuxiu62             │      19 │
# => │ 13 │ Stefan Holderbach    │      19 │
# => │ 14 │ Jae-Heon Ji          │      10 │
# => │ 15 │ Jonathan Moore       │       2 │
# => │ 16 │ zkldi                │       1 │
# => │ 17 │ LordMZTE             │       1 │
# => │ 18 │ Luca Trevisani       │       1 │
# => ╰────┴──────────────────────┴─────────╯
```

This is still a lot of data so let's just look at the top 10 and use the `rename` command to name the columns. We could've also provided the column names with the `transpose` command.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | rename name commits | reverse | first 10
# => ╭───┬────────────────────┬─────────╮
# => │ # │        name        │ commits │
# => ├───┼────────────────────┼─────────┤
# => │ 0 │ Sophia Turner      │    1420 │
# => │ 1 │ Sophia             │     851 │
# => │ 2 │ Andrés N. Robalino │     383 │
# => │ 3 │ Darren Schroeder   │     380 │
# => │ 4 │ Fernando Herrera   │     176 │
# => │ 5 │ Yehuda Katz        │     165 │
# => │ 6 │ Jakub Žádník       │     140 │
# => │ 7 │ Joseph T. Lyons    │      87 │
# => │ 8 │ Michael Angerman   │      71 │
# => │ 9 │ Jason Gedge        │      67 │
# => ╰───┴────────────────────┴─────────╯
```

And there you have it. The top 10 committers and we learned a little bit of parsing along the way.

Here's one last little known command. Perhaps you don't want your table numbered starting with 0. Here's a way to change that with the `table` command.

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | rename name commits | reverse | first 10 | table -i 1
# => ╭────┬────────────────────┬─────────╮
# => │  # │        name        │ commits │
# => ├────┼────────────────────┼─────────┤
# => │  1 │ Sophia Turner      │    1420 │
# => │  2 │ Sophia             │     851 │
# => │  3 │ Andrés N. Robalino │     383 │
# => │  4 │ Darren Schroeder   │     380 │
# => │  5 │ Fernando Herrera   │     176 │
# => │  6 │ Yehuda Katz        │     165 │
# => │  7 │ Jakub Žádník       │     140 │
# => │  8 │ Joseph T. Lyons    │      87 │
# => │  9 │ Michael Angerman   │      71 │
# => │ 10 │ Jason Gedge        │      67 │
# => ╰────┴────────────────────┴─────────╯
```

Created on 11/9/2020 with Nushell on Windows 10.
Updated on 3/1/2022 with Nushell on Windows 10.
Updated on 9/28/2026 with Nushell 0.116.0 on macOS.

| key                | value                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| version            | 0.116.0                                                                    |
| branch             | main                                                                       |
| commit_hash        | 2459fdd134ea4fdbae42efd6924e2b41201cf363                                   |
| build_os           | macos-aarch64                                                              |
| rust_version       | rustc 1.96.1 (31fca3adb 2026-06-26)                                        |
| rust_channel       | 1.96.1-aarch64-apple-darwin                                                |
| cargo_version      | cargo 1.96.1 (356927216 2026-06-26)                                        |
| build_time         | 2026-09-26 18:38:58 -05:00                                                 |
| build_rust_channel | release                                                                    |
| features           | dap, default, lsp, mcp, network, plugin, rustls-tls, sqlite, trash-support |
