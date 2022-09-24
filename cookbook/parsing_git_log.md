---
title: Parsing Git Log
---

# Parsing Git Log

# Let's parse git log

This `git log` command is interesting but you can't do a lot with it like this.

```shell
> git log
```

Let's make it more parsable

```shell
> git log --pretty="%h|%s|%aN|%aE|%aD" -n 25
```

This will work but I've been burnt by this in the past when a pipe `|` gets injected in the commits.

So, let's try again with something that most likely won't show up in commits, `»¦«`. Also, since we're not using a pipe now we don't have to use quotes around the pretty format string. Notice that the output is just a bunch of strings.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5
```

```
42f1874a»¦«Update some examples and docs (#4682)»¦«Justin Ma»¦«hustcer@outlook.com»¦«Tue, 1 Mar 2022 21:05:29 +0800
2a89936b»¦«Move to latest stable crossterm, with fix (#4684)»¦«JT»¦«547158+jntrnr@users.noreply.github.com»¦«Tue, 1 Mar 2022 07:05:46 -0500
ece5e7db»¦«dataframe list command (#4681)»¦«Fernando Herrera»¦«fernando.j.herrera@gmail.com»¦«Tue, 1 Mar 2022 11:41:13 +0000
a6a96b29»¦«Add binary literals (#4680)»¦«JT»¦«547158+jntrnr@users.noreply.github.com»¦«Mon, 28 Feb 2022 18:31:53 -0500
e3100e6a»¦«Fix alias in `docs/sample_config/config.toml` (#4669)»¦«Luca Trevisani»¦«lucatrv@hotmail.com»¦«Mon, 28 Feb 2022 22:47:14 +0100
```

Ahh, much better. Now that we have the raw data, let's try to parse it with nu.

First we need to get it in lines or rows. Notice that the output is now in a table format.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines
```

```
───┬─────────────────────────────────────────────────────────────────────────────────────────────────
 0 │ 42f1874a»¦«Update some examples and docs (#4682)»¦«Justin Ma»¦«hustcer@outlook.com»¦«Tue, 1 Mar
   │ 2022 21:05:29 +0800
 1 │ 2a89936b»¦«Move to latest stable crossterm, with fix
   │ (#4684)»¦«JT»¦«547158+jntrnr@users.noreply.github.com»¦«Tue, 1 Mar 2022 07:05:46 -0500
 2 │ ece5e7db»¦«dataframe list command (#4681)»¦«Fernando
   │ Herrera»¦«fernando.j.herrera@gmail.com»¦«Tue, 1 Mar 2022 11:41:13 +0000
 3 │ a6a96b29»¦«Add binary literals (#4680)»¦«JT»¦«547158+jntrnr@users.noreply.github.com»¦«Mon, 28
   │ Feb 2022 18:31:53 -0500
 4 │ e3100e6a»¦«Fix alias in `docs/sample_config/config.toml` (#4669)»¦«Luca
   │ Trevisani»¦«lucatrv@hotmail.com»¦«Mon, 28 Feb 2022 22:47:14 +0100
───┴─────────────────────────────────────────────────────────────────────────────────────────────────
```

That's more like nushell, but it would be nice to have some columns.

We used the delimiter `»¦«` specifically so we can create columns so let's use it like this.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«"
```

```
───┬──────────┬──────────────────────┬──────────────────┬──────────────────────┬──────────────────
 # │ column1  │       column2        │     column3      │       column4        │     column5
───┼──────────┼──────────────────────┼──────────────────┼──────────────────────┼──────────────────
 0 │ 42f1874a │ Update some examples │ Justin Ma        │ hustcer@outlook.com  │ Tue, 1 Mar 2022
   │          │ and docs (#4682)     │                  │                      │ 21:05:29 +0800
 1 │ 2a89936b │ Move to latest       │ JT               │ 547158+jntrnr@users. │ Tue, 1 Mar 2022
   │          │ stable crossterm,    │                  │ noreply.github.com   │ 07:05:46 -0500
   │          │ with fix (#4684)     │                  │                      │
 2 │ ece5e7db │ dataframe list       │ Fernando Herrera │ fernando.j.herrera@g │ Tue, 1 Mar 2022
   │          │ command (#4681)      │                  │ mail.com             │ 11:41:13 +0000
 3 │ a6a96b29 │ Add binary literals  │ JT               │ 547158+jntrnr@users. │ Mon, 28 Feb 2022
   │          │ (#4680)              │                  │ noreply.github.com   │ 18:31:53 -0500
 4 │ e3100e6a │ Fix alias in         │ Luca Trevisani   │ lucatrv@hotmail.com  │ Mon, 28 Feb 2022
   │          │ `docs/sample_config/ │                  │                      │ 22:47:14 +0100
   │          │ config.toml`         │                  │                      │
   │          │ (#4669)              │                  │                      │
───┴──────────┴──────────────────────┴──────────────────┴──────────────────────┴──────────────────
```

Yay, for columns! But wait, it would really be nice if those columns had something other than generically named column names.

Let's try adding the columns names to `split column` like this.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date
```

Ahhh, that looks much better.

```
───┬──────────┬──────────────────────┬──────────────────┬──────────────────────┬──────────────────
 # │  commit  │       subject        │       name       │        email         │       date
───┼──────────┼──────────────────────┼──────────────────┼──────────────────────┼──────────────────
 0 │ 42f1874a │ Update some examples │ Justin Ma        │ hustcer@outlook.com  │ Tue, 1 Mar 2022
   │          │ and docs (#4682)     │                  │                      │ 21:05:29 +0800
 1 │ 2a89936b │ Move to latest       │ JT               │ 547158+jntrnr@users. │ Tue, 1 Mar 2022
   │          │ stable crossterm,    │                  │ noreply.github.com   │ 07:05:46 -0500
   │          │ with fix (#4684)     │                  │                      │
 2 │ ece5e7db │ dataframe list       │ Fernando Herrera │ fernando.j.herrera@g │ Tue, 1 Mar 2022
   │          │ command (#4681)      │                  │ mail.com             │ 11:41:13 +0000
 3 │ a6a96b29 │ Add binary literals  │ JT               │ 547158+jntrnr@users. │ Mon, 28 Feb 2022
   │          │ (#4680)              │                  │ noreply.github.com   │ 18:31:53 -0500
 4 │ e3100e6a │ Fix alias in         │ Luca Trevisani   │ lucatrv@hotmail.com  │ Mon, 28 Feb 2022
   │          │ `docs/sample_config/ │                  │                      │ 22:47:14 +0100
   │          │ config.toml`         │                  │                      │
   │          │ (#4669)              │                  │                      │
───┴──────────┴──────────────────────┴──────────────────┴──────────────────────┴──────────────────
```

Hmmm, that date string is a string. If it were a date vs a string it could be used for sorting by date. The way we do that is we have to convert the datetime to a real datetime and update the column. Try this.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime}
```

Now this looks more nu-ish

```
───┬──────────┬──────────────────────────┬──────────────────┬──────────────────────────┬──────────────
 # │  commit  │         subject          │       name       │          email           │     date
───┼──────────┼──────────────────────────┼──────────────────┼──────────────────────────┼──────────────
 0 │ 42f1874a │ Update some examples and │ Justin Ma        │ hustcer@outlook.com      │ 7 hours ago
   │          │ docs (#4682)             │                  │                          │
 1 │ 2a89936b │ Move to latest stable    │ JT               │ 547158+jntrnr@users.nore │ 8 hours ago
   │          │ crossterm, with fix      │                  │ ply.github.com           │
   │          │ (#4684)                  │                  │                          │
 2 │ ece5e7db │ dataframe list command   │ Fernando Herrera │ fernando.j.herrera@gmail │ 8 hours ago
   │          │ (#4681)                  │                  │ .com                     │
 3 │ a6a96b29 │ Add binary literals      │ JT               │ 547158+jntrnr@users.nore │ 20 hours ago
   │          │ (#4680)                  │                  │ ply.github.com           │
 4 │ e3100e6a │ Fix alias in             │ Luca Trevisani   │ lucatrv@hotmail.com      │ a day ago
   │          │ `docs/sample_config/conf │                  │                          │
   │          │ ig.toml`                 │                  │                          │
   │          │ (#4669)                  │                  │                          │
───┴──────────┴──────────────────────────┴──────────────────┴──────────────────────────┴──────────────
```

If we want to revert back to a date string we can do something like this with the `nth` command and the `get` command.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | select 3 | get date | date format | get 0
```

```
Mon, 28 Feb 2022 18:31:53 -0500
```

Cool! Now that we have a real datetime we can do some interesting things with it like `group-by` or `sort-by` or `where`.
Let's try `sort-by` first

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | sort-by date
```

```
────┬──────────┬──────────────────────────┬───────────────────┬─────────────────────────┬──────────────
 #  │  commit  │         subject          │       name        │          email          │     date
────┼──────────┼──────────────────────────┼───────────────────┼─────────────────────────┼──────────────
  0 │ 0c3ea636 │ Add support for stderr   │ JT                │ 547158+jntrnr@users.nor │ 4 days ago
    │          │ and exit code (#4647)    │                   │ eply.github.com         │
  1 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user │ 3 days ago
    │          │ metadata for `ls_colors` │                   │ s.noreply.github.com    │
    │          │ (#4603)                  │                   │                         │
  2 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4650)                  │                   │ l.com                   │
  3 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4649)                  │                   │ l.com                   │
  4 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de            │ 3 days ago
    │          │ variable (#4655)         │                   │                         │
  5 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep │ 3 days ago
    │          │ crossterm (#4657)        │                   │ ly.github.com           │
  6 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
  7 │ 446c2aab │ Lets internals also      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ have exit codes (#4664)  │                   │ eply.github.com         │
  8 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │ default file (#4651)     │                   │ l.com                   │
  9 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 10 │ 78192100 │ Add shortcircuiting      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ boolean operators        │                   │ eply.github.com         │
    │          │ (#4668)                  │                   │                         │
 11 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ (#4667)                  │                   │ reply.github.com        │
 12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ starship parameters      │                   │ reply.github.com        │
    │          │ (#4670)                  │                   │                         │
 13 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu  │ 2 days ago
    │          │ (#4661)                  │                   │                         │
 14 │ 10364c4f │ don't use table          │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ compaction in to nuon if │                   │ eply.github.com         │
    │          │ not a table (#4671)      │                   │                         │
 15 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep │ a day ago
    │          │ profile and symbol strip │                   │ ly.github.com           │
    │          │ (#4630)                  │                   │                         │
 16 │ d6a6c4b0 │ Add back in default      │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ keybindings (#4673)      │                   │ eply.github.com         │
 17 │ 0924975b │ Use default_config.nu    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ by default (#4675)       │                   │ eply.github.com         │
 18 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com     │ a day ago
    │          │ message for some math    │                   │                         │
    │          │ related commands (#4672) │                   │                         │
 19 │ cb5c61d2 │ Fix open ended ranges    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ (#4677)                  │                   │ eply.github.com         │
 20 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com     │ a day ago
    │          │ `docs/sample_config/con  │                   │                         │
    │          │ fig.toml`                │                   │                         │
    │          │ (#4669)                  │                   │                         │
 21 │ a6a96b29 │ Add binary literals      │ JT                │ 547158+jntrnr@users.nor │ 20 hours ago
    │          │ (#4680)                  │                   │ eply.github.com         │
 22 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 8 hours ago
    │          │ (#4681)                  │                   │ l.com                   │
 23 │ 2a89936b │ Move to latest stable    │ JT                │ 547158+jntrnr@users.nor │ 8 hours ago
    │          │ crossterm, with fix      │                   │ eply.github.com         │
    │          │ (#4684)                  │                   │                         │
 24 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com     │ 7 hours ago
    │          │ and docs (#4682)         │                   │                         │
────┴──────────┴──────────────────────────┴───────────────────┴─────────────────────────┴──────────────
```

That's neat but what if I want it sorted in the opposite order? Try the `reverse` command and notice the newest commits are at the top.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | sort-by date | reverse
```

```
────┬──────────┬──────────────────────────┬───────────────────┬─────────────────────────┬──────────────
 #  │  commit  │         subject          │       name        │          email          │     date
────┼──────────┼──────────────────────────┼───────────────────┼─────────────────────────┼──────────────
  0 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com     │ 7 hours ago
    │          │ and docs (#4682)         │                   │                         │
  1 │ 2a89936b │ Move to latest stable    │ JT                │ 547158+jntrnr@users.nor │ 8 hours ago
    │          │ crossterm, with fix      │                   │ eply.github.com         │
    │          │ (#4684)                  │                   │                         │
  2 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 8 hours ago
    │          │ (#4681)                  │                   │ l.com                   │
  3 │ a6a96b29 │ Add binary literals      │ JT                │ 547158+jntrnr@users.nor │ 20 hours ago
    │          │ (#4680)                  │                   │ eply.github.com         │
  4 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com     │ a day ago
    │          │ `docs/sample_config/con  │                   │                         │
    │          │ fig.toml`                │                   │                         │
    │          │ (#4669)                  │                   │                         │
  5 │ cb5c61d2 │ Fix open ended ranges    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ (#4677)                  │                   │ eply.github.com         │
  6 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com     │ a day ago
    │          │ message for some math    │                   │                         │
    │          │ related commands (#4672) │                   │                         │
  7 │ 0924975b │ Use default_config.nu    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ by default (#4675)       │                   │ eply.github.com         │
  8 │ d6a6c4b0 │ Add back in default      │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ keybindings (#4673)      │                   │ eply.github.com         │
  9 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep │ a day ago
    │          │ profile and symbol strip │                   │ ly.github.com           │
    │          │ (#4630)                  │                   │                         │
 10 │ 10364c4f │ don't use table          │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ compaction in to nuon if │                   │ eply.github.com         │
    │          │ not a table (#4671)      │                   │                         │
 11 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu  │ 2 days ago
    │          │ (#4661)                  │                   │                         │
 12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ starship parameters      │                   │ reply.github.com        │
    │          │ (#4670)                  │                   │                         │
 13 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ (#4667)                  │                   │ reply.github.com        │
 14 │ 78192100 │ Add shortcircuiting      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ boolean operators        │                   │ eply.github.com         │
    │          │ (#4668)                  │                   │                         │
 15 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 16 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │ default file (#4651)     │                   │ l.com                   │
 17 │ 446c2aab │ Lets internals also      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ have exit codes (#4664)  │                   │ eply.github.com         │
 18 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 19 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep │ 3 days ago
    │          │ crossterm (#4657)        │                   │ ly.github.com           │
 20 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de            │ 3 days ago
    │          │ variable (#4655)         │                   │                         │
 21 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4649)                  │                   │ l.com                   │
 22 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4650)                  │                   │ l.com                   │
 23 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user │ 3 days ago
    │          │ metadata for `ls_colors` │                   │ s.noreply.github.com    │
    │          │ (#4603)                  │                   │                         │
 24 │ 0c3ea636 │ Add support for stderr   │ JT                │ 547158+jntrnr@users.nor │ 4 days ago
    │          │ and exit code (#4647)    │                   │ eply.github.com         │
────┴──────────┴──────────────────────────┴───────────────────┴─────────────────────────┴──────────────
```

Now let's try `group-by` and see what happens. This is a tiny bit tricky because dates are tricky. When you use `group-by` on dates you have to remember to use the `group-by date` subcommand so it's `group-by date date_column_name`.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime | date format '%Y-%m-%d'} | group-by date
```

```
────────────┬────────────────
 2022-03-01 │ [table 3 rows]
 2022-02-28 │ [table 8 rows]
 2022-02-27 │ [table 8 rows]
 2022-02-26 │ [table 5 rows]
 2022-02-25 │ [table 1 row]
────────────┴────────────────
```

This would look better if we transpose the data and name the columns

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime | date format '%Y-%m-%d'} | group-by date | transpose date count
```

```
───┬────────────┬────────────────
 # │    date    │     count
───┼────────────┼────────────────
 0 │ 2022-03-01 │ [table 3 rows]
 1 │ 2022-02-28 │ [table 8 rows]
 2 │ 2022-02-27 │ [table 8 rows]
 3 │ 2022-02-26 │ [table 5 rows]
 4 │ 2022-02-25 │ [table 1 row]
───┴────────────┴────────────────
```

How about `where` now? Show only the records that are less than a year old.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day))
```

```
────┬──────────┬──────────────────────────┬───────────────────┬─────────────────────────┬──────────────
 #  │  commit  │         subject          │       name        │          email          │     date
────┼──────────┼──────────────────────────┼───────────────────┼─────────────────────────┼──────────────
  0 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com     │ 7 hours ago
    │          │ and docs (#4682)         │                   │                         │
  1 │ 2a89936b │ Move to latest stable    │ JT                │ 547158+jntrnr@users.nor │ 8 hours ago
    │          │ crossterm, with fix      │                   │ eply.github.com         │
    │          │ (#4684)                  │                   │                         │
  2 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 8 hours ago
    │          │ (#4681)                  │                   │ l.com                   │
  3 │ a6a96b29 │ Add binary literals      │ JT                │ 547158+jntrnr@users.nor │ 21 hours ago
    │          │ (#4680)                  │                   │ eply.github.com         │
  4 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com     │ a day ago
    │          │ `docs/sample_config/con  │                   │                         │
    │          │ fig.toml`                │                   │                         │
    │          │ (#4669)                  │                   │                         │
  5 │ cb5c61d2 │ Fix open ended ranges    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ (#4677)                  │                   │ eply.github.com         │
  6 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com     │ a day ago
    │          │ message for some math    │                   │                         │
    │          │ related commands (#4672) │                   │                         │
  7 │ 0924975b │ Use default_config.nu    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ by default (#4675)       │                   │ eply.github.com         │
  8 │ d6a6c4b0 │ Add back in default      │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ keybindings (#4673)      │                   │ eply.github.com         │
  9 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep │ a day ago
    │          │ profile and symbol strip │                   │ ly.github.com           │
    │          │ (#4630)                  │                   │                         │
 10 │ 10364c4f │ don't use table          │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ compaction in to nuon if │                   │ eply.github.com         │
    │          │ not a table (#4671)      │                   │                         │
 11 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu  │ 2 days ago
    │          │ (#4661)                  │                   │                         │
 12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ starship parameters      │                   │ reply.github.com        │
    │          │ (#4670)                  │                   │                         │
 13 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ (#4667)                  │                   │ reply.github.com        │
 14 │ 78192100 │ Add shortcircuiting      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ boolean operators        │                   │ eply.github.com         │
    │          │ (#4668)                  │                   │                         │
 15 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 16 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │ default file (#4651)     │                   │ l.com                   │
 17 │ 446c2aab │ Lets internals also      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ have exit codes (#4664)  │                   │ eply.github.com         │
 18 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 19 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep │ 3 days ago
    │          │ crossterm (#4657)        │                   │ ly.github.com           │
 20 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de            │ 3 days ago
    │          │ variable (#4655)         │                   │                         │
 21 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4649)                  │                   │ l.com                   │
 22 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4650)                  │                   │ l.com                   │
 23 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user │ 3 days ago
    │          │ metadata for `ls_colors` │                   │ s.noreply.github.com    │
    │          │ (#4603)                  │                   │                         │
 24 │ 0c3ea636 │ Add support for stderr   │ JT                │ 547158+jntrnr@users.nor │ 4 days ago
    │          │ and exit code (#4647)    │                   │ eply.github.com         │
────┴──────────┴──────────────────────────┴───────────────────┴─────────────────────────┴──────────────
...
```

Or even show me all the commits in the last 7 days.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 7day))
```

```
────┬──────────┬──────────────────────────┬───────────────────┬─────────────────────────┬──────────────
 #  │  commit  │         subject          │       name        │          email          │     date
────┼──────────┼──────────────────────────┼───────────────────┼─────────────────────────┼──────────────
  0 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com     │ 7 hours ago
    │          │ and docs (#4682)         │                   │                         │
  1 │ 2a89936b │ Move to latest stable    │ JT                │ 547158+jntrnr@users.nor │ 8 hours ago
    │          │ crossterm, with fix      │                   │ eply.github.com         │
    │          │ (#4684)                  │                   │                         │
  2 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 8 hours ago
    │          │ (#4681)                  │                   │ l.com                   │
  3 │ a6a96b29 │ Add binary literals      │ JT                │ 547158+jntrnr@users.nor │ 21 hours ago
    │          │ (#4680)                  │                   │ eply.github.com         │
  4 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com     │ a day ago
    │          │ `docs/sample_config/con  │                   │                         │
    │          │ fig.toml`                │                   │                         │
    │          │ (#4669)                  │                   │                         │
  5 │ cb5c61d2 │ Fix open ended ranges    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ (#4677)                  │                   │ eply.github.com         │
  6 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com     │ a day ago
    │          │ message for some math    │                   │                         │
    │          │ related commands (#4672) │                   │                         │
  7 │ 0924975b │ Use default_config.nu    │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ by default (#4675)       │                   │ eply.github.com         │
  8 │ d6a6c4b0 │ Add back in default      │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ keybindings (#4673)      │                   │ eply.github.com         │
  9 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep │ a day ago
    │          │ profile and symbol strip │                   │ ly.github.com           │
    │          │ (#4630)                  │                   │                         │
 10 │ 10364c4f │ don't use table          │ JT                │ 547158+jntrnr@users.nor │ a day ago
    │          │ compaction in to nuon if │                   │ eply.github.com         │
    │          │ not a table (#4671)      │                   │                         │
 11 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu  │ 2 days ago
    │          │ (#4661)                  │                   │                         │
 12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ starship parameters      │                   │ reply.github.com        │
    │          │ (#4670)                  │                   │                         │
 13 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
    │          │ (#4667)                  │                   │ reply.github.com        │
 14 │ 78192100 │ Add shortcircuiting      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ boolean operators        │                   │ eply.github.com         │
    │          │ (#4668)                  │                   │                         │
 15 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 16 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │ default file (#4651)     │                   │ l.com                   │
 17 │ 446c2aab │ Lets internals also      │ JT                │ 547158+jntrnr@users.nor │ 2 days ago
    │          │ have exit codes (#4664)  │                   │ eply.github.com         │
 18 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
    │          │                          │                   │ l.com                   │
 19 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep │ 3 days ago
    │          │ crossterm (#4657)        │                   │ ly.github.com           │
 20 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de            │ 3 days ago
    │          │ variable (#4655)         │                   │                         │
 21 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4649)                  │                   │ l.com                   │
 22 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
    │          │ (#4650)                  │                   │ l.com                   │
 23 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user │ 3 days ago
    │          │ metadata for `ls_colors` │                   │ s.noreply.github.com    │
    │          │ (#4603)                  │                   │                         │
 24 │ 0c3ea636 │ Add support for stderr   │ JT                │ 547158+jntrnr@users.nor │ 4 days ago
    │          │ and exit code (#4647)    │                   │ eply.github.com         │
────┴──────────┴──────────────────────────┴───────────────────┴─────────────────────────┴──────────────
```

Now, with the 365 day slice of data, let's `group-by` name where the commits are less than a year old. This table has a lot of columns so it's unreadable. However, if we `group-by` name and `transpose` the table things will look much cleaner. `Pivot` takes rows and turns them into columns or turns columns into rows.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose
```

```
─────┬─────────────────────────────────┬──────────────────
  #  │             column0             │     column1
─────┼─────────────────────────────────┼──────────────────
   0 │ Justin Ma                       │ [table 21 rows]
   1 │ JT                              │ [table 851 rows]
   2 │ Fernando Herrera                │ [table 176 rows]
   3 │ Luca Trevisani                  │ [table 1 row]
   4 │ Stefan Holderbach               │ [table 19 rows]
   5 │ Jonathan Moore                  │ [table 2 rows]
   6 │ Darren Schroeder                │ [table 242 rows]
   7 │ LordMZTE                        │ [table 1 row]
   8 │ Jae-Heon Ji                     │ [table 10 rows]
   9 │ zkldi                           │ [table 1 row]
  10 │ Michael Angerman                │ [table 61 rows]
...
```

Side note: If you happen to get errors, pay attention to the error message. For instance, this error means that the data being returned from `git log` is somehow incomplete. Specifically, there is a missing date column. I've seen git commands work perfectly on Windows and not work at all on Linux or Mac. I'm not sure why. If you run into this issue, one easy way to temporarily avoid it is to limit `git log` results to a certain number like `git log -n 100`.

```
error: Unknown column
  ┌─ shell:1:124
  │
1 │ git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day))
  │                                                                                                                              ^^^^
  │                                                                                                                              │
  │                                                                                                                              There isn't a column named 'date'
  │                                                                                                                              Perhaps you meant 'commit'? Columns available: commit, subject
```

Here's one tip for dealing with this error. We have a `do` command that has an `--ignore_errors` parameter. This is how you'd use it in the above example, if it were giving errors.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | do -i { split column "»¦«" commit subject name email date } | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose
```

Now, back to parsing.
What if we throw in the `sort-by` and `reverse` commands for good measure? Also, while we're in there, let's get rid of the `[table 21 rows]` thing too. We do that by using the `length` command on each row of column1.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | reverse
```

```
─────┬─────────────────────────────────┬─────────
  #  │             column0             │ column1
─────┼─────────────────────────────────┼─────────
   0 │ JT                              │     851
   1 │ Darren Schroeder                │     242
   2 │ Fernando Herrera                │     176
   3 │ Jakub Žádník                    │     136
   4 │ Michael Angerman                │      61
   5 │ Andrés N. Robalino              │      29
   6 │ Luccas Mateus                   │      27
   7 │ Stefan Stanciulescu             │      27
   8 │ Jonathan Turner                 │      23
   9 │ Tanishq Kancharla               │      21
  10 │ Justin Ma                       │      21
  11 │ onthebridgetonowhere            │      20
  12 │ xiuxiu62                        │      19
...
```

This is still a lot of data so let's just look at the top 10 and use the `rename` command to name the columns. We could've also provided the column names with the `transpose` command.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | rename name commits | reverse | first 10
```

```
───┬────────────────────┬─────────
 # │        name        │ commits
───┼────────────────────┼─────────
 0 │ Jonathan Turner    │    1420
 1 │ JT                 │     851
 2 │ Andrés N. Robalino │     383
 3 │ Darren Schroeder   │     380
 4 │ Fernando Herrera   │     176
 5 │ Yehuda Katz        │     165
 6 │ Jakub Žádník       │     140
 7 │ Joseph T. Lyons    │      87
 8 │ Michael Angerman   │      71
 9 │ Jason Gedge        │      67
───┴────────────────────┴─────────
```

And there you have it. The top 10 committers and we learned a little bit of parsing along the way.

Here's one last little known command. Perhaps you don't want your table numbered starting with 0. Here's a way to change that with the `table` command.

```shell
> git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | rename name commits | reverse | first 10 | table -n 1
```

```
────┬────────────────────┬─────────
 #  │        name        │ commits
────┼────────────────────┼─────────
  1 │ Jonathan Turner    │    1420
  2 │ JT                 │     851
  3 │ Andrés N. Robalino │     383
  4 │ Darren Schroeder   │     380
  5 │ Fernando Herrera   │     176
  6 │ Yehuda Katz        │     165
  7 │ Jakub Žádník       │     140
  8 │ Joseph T. Lyons    │      87
  9 │ Michael Angerman   │      71
 10 │ Jason Gedge        │      67
```

Created on 11/9/2020 with Nushell on Windows 10.
Updated on 3/1/2022 with Nushell on Windows 10.

| key                | value                                    |
| ------------------ | ---------------------------------------- |
| version            | 0.59.0                                   |
| branch             | main                                     |
| short_commit       | b09acdb7                                 |
| commit_hash        | b09acdb7f98ec9694cfb223222577bc02ebba4a4 |
| commit_date        | 2022-02-28 15:14:33 +00:00               |
| build_os           | windows-x86_64                           |
| rust_version       | rustc 1.59.0 (9d1b2106e 2022-02-23)      |
| rust_channel       | stable-x86_64-pc-windows-msvc            |
| cargo_version      | cargo 1.59.0 (49d8809dc 2022-02-10)      |
| pkg_version        | 0.59.0                                   |
| build_time         | 2022-02-28 16:16:00 -06:00               |
| build_rust_channel | debug                                    |
| features           | dataframe, default, trash, which, zip    |
| installed_plugins  | gstat                                    |
