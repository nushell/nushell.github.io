---
title: 解析 Git 日志
---

# 解析 Git 日志

# 让我们来解析 git log

这个 `git log` 命令很有趣，但像这样你无法做太多事情。

```nu
git log
```

让我们让它更易于解析

```nu
git log --pretty="%h|%s|%aN|%aE|%aD" -n 25
```

这能用，但是，当提交信息中有 管道符 `|` 的时候会出问题，过去我曾经被这个问题困扰过。

所以，让我们尝试使用一些不太可能在提交中出现的字符，`»¦«`。另外，由于我们现在不使用管道符，我们不需要在 pretty 格式字符串周围使用引号。注意输出只是一堆字符串。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5
# => 42f1874a»¦«Update some examples and docs (#4682)»¦«Justin Ma»¦«hustcer@outlook.com»¦«Tue, 1 Mar 2022 21:05:29 +0800
# => 2a89936b»¦«Move to latest stable crossterm, with fix (#4684)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Tue, 1 Mar 2022 07:05:46 -0500
# => ece5e7db»¦«dataframe list command (#4681)»¦«Fernando Herrera»¦«fernando.j.herrera@gmail.com»¦«Tue, 1 Mar 2022 11:41:13 +0000
# => a6a96b29»¦«Add binary literals (#4680)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Mon, 28 Feb 2022 18:31:53 -0500
# => e3100e6a»¦«Fix alias in `docs/sample_config/config.toml` (#4669)»¦«Luca Trevisani»¦«lucatrv@hotmail.com»¦«Mon, 28 Feb 2022 22:47:14 +0100
```

啊，好多了。现在我们有了原始数据，让我们尝试用 nu 来解析它。

首先我们需要将它分成行或行。注意输出现在是以表格格式显示的。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines
# => ───┬─────────────────────────────────────────────────────────────────────────────────────────────────
# =>  0 │ 42f1874a»¦«Update some examples and docs (#4682)»¦«Justin Ma»¦«hustcer@outlook.com»¦«Tue, 1 Mar
# =>    │ 2022 21:05:29 +0800
# =>  1 │ 2a89936b»¦«Move to latest stable crossterm, with fix
# =>    │ (#4684)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Tue, 1 Mar 2022 07:05:46 -0500
# =>  2 │ ece5e7db»¦«dataframe list command (#4681)»¦«Fernando
# =>    │ Herrera»¦«fernando.j.herrera@gmail.com»¦«Tue, 1 Mar 2022 11:41:13 +0000
# =>  3 │ a6a96b29»¦«Add binary literals (#4680)»¦«Sophia»¦«547158+sophiajt@users.noreply.github.com»¦«Mon, 28
# =>    │ Feb 2022 18:31:53 -0500
# =>  4 │ e3100e6a»¦«Fix alias in `docs/sample_config/config.toml` (#4669)»¦«Luca
# =>    │ Trevisani»¦«lucatrv@hotmail.com»¦«Mon, 28 Feb 2022 22:47:14 +0100
# => ───┴─────────────────────────────────────────────────────────────────────────────────────────────────
```

这更像是 nushell 的风格，但如果有一些列会更好。

我们特意使用了分隔符 `»¦«`，这样我们就可以创建列，所以让我们像这样使用它。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«"
# => ───┬──────────┬──────────────────────┬──────────────────┬────────────────────────┬──────────────────
# =>  # │ column1  │       column2        │     column3      │       column4          │     column5
# => ───┼──────────┼──────────────────────┼──────────────────┼────────────────────────┼──────────────────
# =>  0 │ 42f1874a │ Update some examples │ Justin Ma        │ hustcer@outlook.com    │ Tue, 1 Mar 2022
# =>    │          │ and docs (#4682)     │                  │                        │ 21:05:29 +0800
# =>  1 │ 2a89936b │ Move to latest       │ Sophia           │ 547158+sophiajt@users. │ Tue, 1 Mar 2022
# =>    │          │ stable crossterm,    │                  │ noreply.github.com     │ 07:05:46 -0500
# =>    │          │ with fix (#4684)     │                  │                        │
# =>  2 │ ece5e7db │ dataframe list       │ Fernando Herrera │ fernando.j.herrera@g   │ Tue, 1 Mar 2022
# =>    │          │ command (#4681)      │                  │ mail.com               │ 11:41:13 +0000
# =>  3 │ a6a96b29 │ Add binary literals  │ Sophia           │ 547158+sophiajt@users. │ Mon, 28 Feb 2022
# =>    │          │ (#4680)              │                  │ noreply.github.com     │ 18:31:53 -0500
# =>  4 │ e3100e6a │ Fix alias in         │ Luca Trevisani   │ lucatrv@hotmail.com    │ Mon, 28 Feb 2022
# =>    │          │ `docs/sample_config/ │                  │                        │ 22:47:14 +0100
# =>    │          │ config.toml`         │                  │                        │
# =>    │          │ (#4669)              │                  │                        │
# => ───┴──────────┴──────────────────────┴──────────────────┴────────────────────────┴──────────────────
```

耶，有列了！但是等等，如果这些列有除了通用列名之外的其他名称，那会更好。

让我们尝试像这样向 `split column` 添加列名。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date
# => ───┬──────────┬──────────────────────┬──────────────────┬────────────────────────┬──────────────────
# =>  # │  commit  │       subject        │       name       │        email           │       date
# => ───┼──────────┼──────────────────────┼──────────────────┼────────────────────────┼──────────────────
# =>  0 │ 42f1874a │ Update some examples │ Justin Ma        │ hustcer@outlook.com    │ Tue, 1 Mar 2022
# =>    │          │ and docs (#4682)     │                  │                        │ 21:05:29 +0800
# =>  1 │ 2a89936b │ Move to latest       │ Sophia           │ 547158+sophiajt@users. │ Tue, 1 Mar 2022
# =>    │          │ stable crossterm,    │                  │ noreply.github.com     │ 07:05:46 -0500
# =>    │          │ with fix (#4684)     │                  │                        │
# =>  2 │ ece5e7db │ dataframe list       │ Fernando Herrera │ fernando.j.herrera@g   │ Tue, 1 Mar 2022
# =>    │          │ command (#4681)      │                  │ mail.com               │ 11:41:13 +0000
# =>  3 │ a6a96b29 │ Add binary literals  │ Sophia           │ 547158+sophiajt@users. │ Mon, 28 Feb 2022
# =>    │          │ (#4680)              │                  │ noreply.github.com     │ 18:31:53 -0500
# =>  4 │ e3100e6a │ Fix alias in         │ Luca Trevisani   │ lucatrv@hotmail.com    │ Mon, 28 Feb 2022
# =>    │          │ `docs/sample_config/ │                  │                        │ 22:47:14 +0100
# =>    │          │ config.toml`         │                  │                        │
# =>    │          │ (#4669)              │                  │                        │
# => ───┴──────────┴──────────────────────┴──────────────────┴────────────────────────┴──────────────────
```

啊，看起来好多了。

嗯，那个日期字符串是一个字符串。如果它是一个日期而不是字符串，它可以用于按日期排序。我们这样做的方式是必须将 datetime 转换为真正的 datetime 并更新列。试试这个。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime}
# => ───┬──────────┬──────────────────────────┬──────────────────┬────────────────────────────┬──────────────
# =>  # │  commit  │         subject          │       name       │          email             │     date
# => ───┼──────────┼──────────────────────────┼──────────────────┼────────────────────────────┼──────────────
# =>  0 │ 42f1874a │ Update some examples and │ Justin Ma        │ hustcer@outlook.com        │ 7 hours ago
# =>    │          │ docs (#4682)             │                  │                            │
# =>  1 │ 2a89936b │ Move to latest stable    │ Sophia           │ 547158+sophiajt@users.nore │ 8 hours ago
# =>    │          │ crossterm, with fix      │                  │ ply.github.com             │
# =>    │          │ (#4684)                  │                  │                            │
# =>  2 │ ece5e7db │ dataframe list command   │ Fernando Herrera │ fernando.j.herrera@gmail   │ 8 hours ago
# =>    │          │ (#4681)                  │                  │ .com                       │
# =>  3 │ a6a96b29 │ Add binary literals      │ Sophia           │ 547158+sophiajt@users.nore │ 20 hours ago
# =>    │          │ (#4680)                  │                  │ ply.github.com             │
# =>  4 │ e3100e6a │ Fix alias in             │ Luca Trevisani   │ lucatrv@hotmail.com        │ a day ago
# =>    │          │ `docs/sample_config/conf │                  │                            │
# =>    │          │ ig.toml`                 │                  │                            │
# =>    │          │ (#4669)                  │                  │                            │
# => ───┴──────────┴──────────────────────────┴──────────────────┴────────────────────────────┴──────────────
```

现在这看起来更像 nu 的风格

如果我们想恢复为日期字符串，我们可以使用 `nth` 命令和 `get` 命令来做类似这样的事情。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 5 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | select 3 | get date | format date | get 0
# => Mon, 28 Feb 2022 18:31:53 -0500
```

酷！现在我们有了一个真正的 datetime，我们可以用它做一些有趣的事情，比如 `group-by` 或 `sort-by` 或 `where`。
让我们先尝试 `sort-by`

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | sort-by date
# => ────┬──────────┬──────────────────────────┬───────────────────┬───────────────────────────┬──────────────
# =>  #  │  commit  │         subject          │       name        │          email            │     date
# => ────┼──────────┼──────────────────────────┼───────────────────┼───────────────────────────┼──────────────
# =>   0 │ 0c3ea636 │ Add support for stderr   │ Sophia            │ 547158+sophiajt@users.nor │ 4 days ago
# =>     │          │ and exit code (#4647)    │                   │ eply.github.com           │
# =>   1 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user   │ 3 days ago
# =>     │          │ metadata for `ls_colors` │                   │ s.noreply.github.com      │
# =>     │          │ (#4603)                  │                   │                           │
# =>   2 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 3 days ago
# =>     │          │ (#4650)                  │                   │ l.com                     │
# =>   3 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 3 days ago
# =>     │          │ (#4649)                  │                   │ l.com                     │
# =>   4 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de              │ 3 days ago
# =>     │          │ variable (#4655)         │                   │                           │
# =>   5 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep   │ 3 days ago
# =>     │          │ crossterm (#4657)        │                   │ ly.github.com             │
# =>   6 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 2 days ago
# =>     │          │                          │                   │ l.com                     │
# =>   7 │ 446c2aab │ Lets internals also      │ Sophia            │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ have exit codes (#4664)  │                   │ eply.github.com           │
# =>   8 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 2 days ago
# =>     │          │ default file (#4651)     │                   │ l.com                     │
# =>   9 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 2 days ago
# =>     │          │                          │                   │ l.com                     │
# =>  10 │ 78192100 │ Add shortcircuiting      │ Sophia            │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ boolean operators        │                   │ eply.github.com           │
# =>     │          │ (#4668)                  │                   │                           │
# =>  11 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no   │ 2 days ago
# =>     │          │ (#4667)                  │                   │ reply.github.com          │
# =>  12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no   │ 2 days ago
# =>     │          │ starship parameters      │                   │ reply.github.com          │
# =>     │          │ (#4670)                  │                   │                           │
# =>  13 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu    │ 2 days ago
# =>     │          │ (#4661)                  │                   │                           │
# =>  14 │ 10364c4f │ don't use table          │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ compaction in to nuon if │                   │ eply.github.com           │
# =>     │          │ not a table (#4671)      │                   │                           │
# =>  15 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep   │ a day ago
# =>     │          │ profile and symbol strip │                   │ ly.github.com             │
# =>     │          │ (#4630)                  │                   │                           │
# =>  16 │ d6a6c4b0 │ Add back in default      │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ keybindings (#4673)      │                   │ eply.github.com           │
# =>  17 │ 0924975b │ Use default_config.nu    │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ by default (#4675)       │                   │ eply.github.com           │
# =>  18 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com       │ a day ago
# =>     │          │ message for some math    │                   │                           │
# =>     │          │ related commands (#4672) │                   │                           │
# =>  19 │ cb5c61d2 │ Fix open ended ranges    │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ (#4677)                  │                   │ eply.github.com           │
# =>  20 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com       │ a day ago
# =>     │          │ `docs/sample_config/con  │                   │                           │
# =>     │          │ fig.toml`                │                   │                           │
# =>     │          │ (#4669)                  │                   │                           │
# =>  21 │ a6a96b29 │ Add binary literals      │ Sophia            │ 547158+sophiajt@users.nor │ 20 hours ago
# =>     │          │ (#4680)                  │                   │ eply.github.com           │
# =>  22 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 8 hours ago
# =>     │          │ (#4681)                  │                   │ l.com                     │
# =>  23 │ 2a89936b │ Move to latest stable    │ Sophia            │ 547158+sophiajt@users.nor │ 8 hours ago
# =>     │          │ crossterm, with fix      │                   │ eply.github.com           │
# =>     │          │ (#4684)                  │                   │                           │
# =>  24 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com       │ 7 hours ago
# =>     │          │ and docs (#4682)         │                   │                           │
# => ────┴──────────┴──────────────────────────┴───────────────────┴───────────────────────────┴──────────────
```

这很整洁，但如果我想按相反的顺序排序呢？试试 `reverse` 命令，注意最新的提交现在在顶部。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | sort-by date | reverse
# => ────┬──────────┬──────────────────────────┬───────────────────┬───────────────────────────┬──────────────
# =>  #  │  commit  │         subject          │       name        │          email            │     date
# => ────┼──────────┼──────────────────────────┼───────────────────┼───────────────────────────┼──────────────
# =>   0 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com       │ 7 hours ago
# =>     │          │ and docs (#4682)         │                   │                           │
# =>   1 │ 2a89936b │ Move to latest stable    │ Sophia            │ 547158+sophiajt@users.nor │ 8 hours ago
# =>     │          │ crossterm, with fix      │                   │ eply.github.com           │
# =>     │          │ (#4684)                  │                   │                           │
# =>   2 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 8 hours ago
# =>     │          │ (#4681)                  │                   │ l.com                     │
# =>   3 │ a6a96b29 │ Add binary literals      │ Sophia            │ 547158+sophiajt@users.nor │ 20 hours ago
# =>     │          │ (#4680)                  │                   │ eply.github.com           │
# =>   4 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com       │ a day ago
# =>     │          │ `docs/sample_config/con  │                   │                           │
# =>     │          │ fig.toml`                │                   │                           │
# =>     │          │ (#4669)                  │                   │                           │
# =>   5 │ cb5c61d2 │ Fix open ended ranges    │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ (#4677)                  │                   │ eply.github.com           │
# =>   6 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com       │ a day ago
# =>     │          │ message for some math    │                   │                           │
# =>     │          │ related commands (#4672) │                   │                           │
# =>   7 │ 0924975b │ Use default_config.nu    │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ by default (#4675)       │                   │ eply.github.com         │
# =>   8 │ d6a6c4b0 │ Add back in default      │ Sophia                │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ keybindings (#4673)      │                   │ eply.github.com         │
# =>   9 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep │ a day ago
# =>     │          │ profile and symbol strip │                   │ ly.github.com           │
# =>     │          │ (#4630)                  │                   │                         │
# =>  10 │ 10364c4f │ don't use table          │ Sophia                │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ compaction in to nuon if │                   │ eply.github.com         │
# =>     │          │ not a table (#4671)      │                   │                         │
# =>  11 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu  │ 2 days ago
# =>     │          │ (#4661)                  │                   │                         │
# =>  12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
# =>     │          │ starship parameters      │                   │ reply.github.com        │
# =>     │          │ (#4670)                  │                   │                         │
# =>  13 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
# =>     │          │ (#4667)                  │                   │ reply.github.com        │
# =>  14 │ 78192100 │ Add shortcircuiting      │ Sophia                │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ boolean operators        │                   │ eply.github.com         │
# =>     │          │ (#4668)                  │                   │                         │
# =>  15 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
# =>     │          │                          │                   │ l.com                   │
# =>  16 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
# =>     │          │ default file (#4651)     │                   │ l.com                   │
# =>  17 │ 446c2aab │ Lets internals also      │ Sophia                │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ have exit codes (#4664)  │                   │ eply.github.com         │
# =>  18 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
# =>     │          │                          │                   │ l.com                   │
# =>  19 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep │ 3 days ago
# =>     │          │ crossterm (#4657)        │                   │ ly.github.com           │
# =>  20 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de            │ 3 days ago
# =>     │          │ variable (#4655)         │                   │                         │
# =>  21 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
# =>     │          │ (#4649)                  │                   │ l.com                   │
# =>  22 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
# =>     │          │ (#4650)                  │                   │ l.com                   │
# =>  23 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user │ 3 days ago
# =>     │          │ metadata for `ls_colors` │                   │ s.noreply.github.com    │
# =>     │          │ (#4603)                  │                   │                         │
# =>  24 │ 0c3ea636 │ Add support for stderr   │ Sophia                │ 547158+sophiajt@users.nor │ 4 days ago
# =>     │          │ and exit code (#4647)    │                   │ eply.github.com         │
# => ────┴──────────┴──────────────────────────┴───────────────────┴─────────────────────────┴──────────────
```

现在让我们尝试 `group-by`，看看会发生什么。这有点棘手，因为日期很棘手。当你对日期使用 `group-by` 时，你必须记住使用 `group-by date` 子命令，所以是 `group-by date date_column_name`。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime | format date '%Y-%m-%d'} | group-by date
# => ────────────┬────────────────
# =>  2022-03-01 │ [table 3 rows]
# =>  2022-02-28 │ [table 8 rows]
# =>  2022-02-27 │ [table 8 rows]
# =>  2022-02-26 │ [table 5 rows]
# =>  2022-02-25 │ [table 1 row]
# => ────────────┴────────────────
```

如果我们转置数据并命名列，这会看起来更好

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime | format date '%Y-%m-%d'} | group-by date | transpose date count
# => ───┬────────────┬────────────────
# =>  # │    date    │     count
# => ───┼────────────┼────────────────
# =>  0 │ 2022-03-01 │ [table 3 rows]
# =>  1 │ 2022-02-28 │ [table 8 rows]
# =>  2 │ 2022-02-27 │ [table 8 rows]
# =>  3 │ 2022-02-26 │ [table 5 rows]
# =>  4 │ 2022-02-25 │ [table 1 row]
# => ───┴────────────┴────────────────
```

现在试试 `where` 怎么样？只显示不到一年前的记录。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day))
# => ────┬──────────┬──────────────────────────┬───────────────────┬─────────────────────────┬──────────────
# =>  #  │  commit  │         subject          │       name        │          email          │     date
# => ────┼──────────┼──────────────────────────┼───────────────────┼─────────────────────────┼──────────────
# =>   0 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com     │ 7 hours ago
# =>     │          │ and docs (#4682)         │                   │                         │
# =>   1 │ 2a89936b │ Move to latest stable    │ Sophia                │ 547158+sophiajt@users.nor │ 8 hours ago
# =>     │          │ crossterm, with fix      │                   │ eply.github.com         │
# =>     │          │ (#4684)                  │                   │                         │
# =>   2 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 8 hours ago
# =>     │          │ (#4681)                  │                   │ l.com                   │
# =>   3 │ a6a96b29 │ Add binary literals      │ Sophia                │ 547158+sophiajt@users.nor │ 21 hours ago
# =>     │          │ (#4680)                  │                   │ eply.github.com         │
# =>   4 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com     │ a day ago
# =>     │          │ `docs/sample_config/con  │                   │                         │
# =>     │          │ fig.toml`                │                   │                         │
# =>     │          │ (#4669)                  │                   │                         │
# =>   5 │ cb5c61d2 │ Fix open ended ranges    │ Sophia                │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ (#4677)                  │                   │ eply.github.com         │
# =>   6 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com     │ a day ago
# =>     │          │ message for some math    │                   │                         │
# =>     │          │ related commands (#4672) │                   │                         │
# =>   7 │ 0924975b │ Use default_config.nu    │ Sophia                │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ by default (#4675)       │                   │ eply.github.com         │
# =>   8 │ d6a6c4b0 │ Add back in default      │ Sophia                │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ keybindings (#4673)      │                   │ eply.github.com         │
# =>   9 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep │ a day ago
# =>     │          │ profile and symbol strip │                   │ ly.github.com           │
# =>     │          │ (#4630)                  │                   │                         │
# =>  10 │ 10364c4f │ don't use table          │ Sophia                │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ compaction in to nuon if │                   │ eply.github.com         │
# =>     │          │ not a table (#4671)      │                   │                         │
# =>  11 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu  │ 2 days ago
# =>     │          │ (#4661)                  │                   │                         │
# =>  12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
# =>     │          │ starship parameters      │                   │ reply.github.com        │
# =>     │          │ (#4670)                  │                   │                         │
# =>  13 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no │ 2 days ago
# =>     │          │ (#4667)                  │                   │ reply.github.com        │
# =>  14 │ 78192100 │ Add shortcircuiting      │ Sophia                │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ boolean operators        │                   │ eply.github.com         │
# =>     │          │ (#4668)                  │                   │                         │
# =>  15 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
# =>     │          │                          │                   │ l.com                   │
# =>  16 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
# =>     │          │ default file (#4651)     │                   │ l.com                   │
# =>  17 │ 446c2aab │ Lets internals also      │ Sophia                │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ have exit codes (#4664)  │                   │ eply.github.com         │
# =>  18 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai │ 2 days ago
# =>     │          │                          │                   │ l.com                   │
# =>  19 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep │ 3 days ago
# =>     │          │ crossterm (#4657)        │                   │ ly.github.com           │
# =>  20 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de            │ 3 days ago
# =>     │          │ variable (#4655)         │                   │                         │
# =>  21 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
# =>     │          │ (#4649)                  │                   │ l.com                   │
# =>  22 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai │ 3 days ago
# =>     │          │ (#4650)                  │                   │ l.com                   │
# =>  23 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user │ 3 days ago
# =>     │          │ metadata for `ls_colors` │                   │ s.noreply.github.com    │
# =>     │          │ (#4603)                  │                   │                         │
# =>  24 │ 0c3ea636 │ Add support for stderr   │ Sophia                │ 547158+sophiajt@users.nor │ 4 days ago
# =>     │          │ and exit code (#4647)    │                   │ eply.github.com         │
# => ────┴──────────┴──────────────────────────┴───────────────────┴─────────────────────────┴──────────────
# => ...
```

或者甚至显示我在过去 7 天内的所有提交。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD -n 25 | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 7day))
# => ────┬──────────┬──────────────────────────┬───────────────────┬───────────────────────────┬──────────────
# =>  #  │  commit  │         subject          │       name        │          email            │     date
# => ────┼──────────┼──────────────────────────┼───────────────────┼───────────────────────────┼──────────────
# =>   0 │ 42f1874a │ Update some examples     │ Justin Ma         │ hustcer@outlook.com       │ 7 hours ago
# =>     │          │ and docs (#4682)         │                   │                           │
# =>   1 │ 2a89936b │ Move to latest stable    │ Sophia            │ 547158+sophiajt@users.nor │ 8 hours ago
# =>     │          │ crossterm, with fix      │                   │ eply.github.com           │
# =>     │          │ (#4684)                  │                   │                           │
# =>   2 │ ece5e7db │ dataframe list command   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 8 hours ago
# =>     │          │ (#4681)                  │                   │ l.com                     │
# =>   3 │ a6a96b29 │ Add binary literals      │ Sophia            │ 547158+sophiajt@users.nor │ 21 hours ago
# =>     │          │ (#4680)                  │                   │ eply.github.com           │
# =>   4 │ e3100e6a │ Fix alias in             │ Luca Trevisani    │ lucatrv@hotmail.com       │ a day ago
# =>     │          │ `docs/sample_config/con  │                   │                           │
# =>     │          │ fig.toml`                │                   │                           │
# =>     │          │ (#4669)                  │                   │                           │
# =>   5 │ cb5c61d2 │ Fix open ended ranges    │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ (#4677)                  │                   │ eply.github.com           │
# =>   6 │ b09acdb7 │ Fix unsupported type     │ Justin Ma         │ hustcer@outlook.com       │ a day ago
# =>     │          │ message for some math    │                   │                           │
# =>     │          │ related commands (#4672) │                   │                           │
# =>   7 │ 0924975b │ Use default_config.nu    │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ by default (#4675)       │                   │ eply.github.com           │
# =>   8 │ d6a6c4b0 │ Add back in default      │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ keybindings (#4673)      │                   │ eply.github.com           │
# =>   9 │ eec17304 │ Add profiling build      │ Stefan Holderbach │ sholderbach@users.norep   │ a day ago
# =>     │          │ profile and symbol strip │                   │ ly.github.com             │
# =>     │          │ (#4630)                  │                   │                           │
# =>  10 │ 10364c4f │ don't use table          │ Sophia            │ 547158+sophiajt@users.nor │ a day ago
# =>     │          │ compaction in to nuon if │                   │ eply.github.com           │
# =>     │          │ not a table (#4671)      │                   │                           │
# =>  11 │ ef70c8db │ Date parse refactor      │ Jonathan Moore    │ jtm170330@utdallas.edu    │ 2 days ago
# =>     │          │ (#4661)                  │                   │                           │
# =>  12 │ 0f437589 │ add last exit code to    │ Darren Schroeder  │ 343840+fdncred@users.no   │ 2 days ago
# =>     │          │ starship parameters      │                   │ reply.github.com          │
# =>     │          │ (#4670)                  │                   │                           │
# =>  13 │ 796d4920 │ add char separators      │ Darren Schroeder  │ 343840+fdncred@users.no   │ 2 days ago
# =>     │          │ (#4667)                  │                   │ reply.github.com          │
# =>  14 │ 78192100 │ Add shortcircuiting      │ Sophia            │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ boolean operators        │                   │ eply.github.com           │
# =>     │          │ (#4668)                  │                   │                           │
# =>  15 │ 4ebbe07d │ Polars upgrade (#4665)   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 2 days ago
# =>     │          │                          │                   │ l.com                     │
# =>  16 │ 10ceac99 │ menu keybindings in      │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 2 days ago
# =>     │          │ default file (#4651)     │                   │ l.com                     │
# =>  17 │ 446c2aab │ Lets internals also      │ Sophia            │ 547158+sophiajt@users.nor │ 2 days ago
# =>     │          │ have exit codes (#4664)  │                   │ eply.github.com           │
# =>  18 │ 995757c0 │ flags for find (#4663)   │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 2 days ago
# =>     │          │                          │                   │ l.com                     │
# =>  19 │ 799fa984 │ Update reedline, revert  │ Stefan Holderbach │ sholderbach@users.norep   │ 3 days ago
# =>     │          │ crossterm (#4657)        │                   │ ly.github.com             │
# =>  20 │ d2bd71d2 │ add LAST_EXIT_CODE       │ LordMZTE          │ lord@mzte.de              │ 3 days ago
# =>     │          │ variable (#4655)         │                   │                           │
# =>  21 │ 11bc0565 │ Find with regex flag     │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 3 days ago
# =>     │          │ (#4649)                  │                   │ l.com                     │
# =>  22 │ 3eca43c0 │ Plugins without file     │ Fernando Herrera  │ fernando.j.herrera@gmai   │ 3 days ago
# =>     │          │ (#4650)                  │                   │ l.com                     │
# =>  23 │ ed46f0ea │ fix: add missing         │ Jae-Heon Ji       │ 32578710+jaeheonji@user   │ 3 days ago
# =>     │          │ metadata for `ls_colors` │                   │ s.noreply.github.com      │
# =>     │          │ (#4603)                  │                   │                           │
# =>  24 │ 0c3ea636 │ Add support for stderr   │ Sophia            │ 547158+sophiajt@users.nor │ 4 days ago
# =>     │          │ and exit code (#4647)    │                   │ eply.github.com           │
# => ────┴──────────┴──────────────────────────┴───────────────────┴───────────────────────────┴──────────────
```

现在，有了 365 天的数据切片，让我们 `group-by` 名称，其中提交不到一年。这个表有很多列，所以不可读。然而，如果我们 `group-by` 名称并 `transpose` 表，事情会看起来更清晰。`Pivot` 将行转换为列或将列转换为行。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose
# => ─────┬─────────────────────────────────┬──────────────────
# =>   #  │             column0             │     column1
# => ─────┼─────────────────────────────────┼──────────────────
# =>    0 │ Justin Ma                       │ [table 21 rows]
# =>    1 │ Sophia                          │ [table 851 rows]
# =>    2 │ Fernando Herrera                │ [table 176 rows]
# =>    3 │ Luca Trevisani                  │ [table 1 row]
# =>    4 │ Stefan Holderbach               │ [table 19 rows]
# =>    5 │ Jonathan Moore                  │ [table 2 rows]
# =>    6 │ Darren Schroeder                │ [table 242 rows]
# =>    7 │ LordMZTE                        │ [table 1 row]
# =>    8 │ Jae-Heon Ji                     │ [table 10 rows]
# =>    9 │ zkldi                           │ [table 1 row]
# =>   10 │ Michael Angerman                │ [table 61 rows]
# => ...
```

旁注：如果你碰巧遇到错误，请注意错误消息。例如，这个错误意味着从 `git log` 返回的数据在某种程度上是不完整的。具体来说，缺少日期列。我见过 git 命令在 Windows 上完美工作，但在 Linux 或 Mac 上根本不工作。我不确定为什么。如果你遇到这个问题，一个简单的临时避免方法是限制 `git log` 结果为一定数量，比如 `git log -n 100`。

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

这里有一个处理这个错误的技巧。我们有一个 `do` 命令，它有一个 `--ignore_errors` 参数。如果上面的例子出现错误，你可以这样使用它。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | do -i { split column "»¦«" commit subject name email date } | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose
```

现在，回到解析。
如果我们加入 `sort-by` 和 `reverse` 命令作为额外的措施呢？另外，我们在那里的时候，让我们摆脱 `[table 21 rows]` 这个东西。我们通过对 column1 的每一行使用 `length` 命令来做到这一点。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | where ($it.date > ((date now) - 365day)) | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | reverse
# => ─────┬─────────────────────────────────┬─────────
# =>   #  │             column0             │ column1
# => ─────┼─────────────────────────────────┼─────────
# =>    0 │ Sophia                          │     851
# =>    1 │ Darren Schroeder                │     242
# =>    2 │ Fernando Herrera                │     176
# =>    3 │ Jakub Žádník                    │     136
# =>    4 │ Michael Angerman                │      61
# =>    5 │ Andrés N. Robalino              │      29
# =>    6 │ Luccas Mateus                   │      27
# =>    7 │ Stefan Stanciulescu             │      27
# =>    8 │ Sophia Turner                   │      23
# =>    9 │ Tanishq Kancharla               │      21
# =>   10 │ Justin Ma                       │      21
# =>   11 │ onthebridgetonowhere            │      20
# =>   12 │ xiuxiu62                        │      19
# => ...
```

这仍然是很多数据，所以让我们只看前 10 名，并使用 `rename` 命令来命名列。我们也可以使用 `transpose` 命令提供列名。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | rename name commits | reverse | first 10
# => ───┬────────────────────┬─────────
# =>  # │        name        │ commits
# => ───┼────────────────────┼─────────
# =>  0 │ Sophia Turner      │    1420
# =>  1 │ Sophia             │     851
# =>  2 │ Andrés N. Robalino │     383
# =>  3 │ Darren Schroeder   │     380
# =>  4 │ Fernando Herrera   │     176
# =>  5 │ Yehuda Katz        │     165
# =>  6 │ Jakub Žádník       │     140
# =>  7 │ Joseph T. Lyons    │      87
# =>  8 │ Michael Angerman   │      71
# =>  9 │ Jason Gedge        │      67
# => ───┴────────────────────┴─────────
```

这就是了。前 10 名提交者，我们在解析过程中学到了一点东西。

这里有一个鲜为人知的命令。也许你不想让你的表从 0 开始编号。这里有一个用 `table` 命令改变它的方法。

```nu
git log --pretty=%h»¦«%s»¦«%aN»¦«%aE»¦«%aD | lines | split column "»¦«" commit subject name email date | upsert date {|d| $d.date | into datetime} | group-by name | transpose | upsert column1 {|c| $c.column1 | length} | sort-by column1 | rename name commits | reverse | first 10 | table -i 1
# => ────┬────────────────────┬─────────
# =>  #  │        name        │ commits
# => ────┼────────────────────┼─────────
# =>   1 │ Sophia Turner      │    1420
# =>   2 │ Sophia             │     851
# =>   3 │ Andrés N. Robalino │     383
# =>   4 │ Darren Schroeder   │     380
# =>   5 │ Fernando Herrera   │     176
# =>   6 │ Yehuda Katz        │     165
# =>   7 │ Jakub Žádník       │     140
# =>   8 │ Joseph T. Lyons    │      87
# =>   9 │ Michael Angerman   │      71
# =>  10 │ Jason Gedge        │      67
```

创建于 2020 年 11 月 9 日，使用 Windows 10 上的 Nushell。
更新于 2022 年 3 月 1 日，使用 Windows 10 上的 Nushell。

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
