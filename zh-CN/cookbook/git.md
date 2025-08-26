---
title: Git
---

# Git

Nu 可以帮助处理常见的 `Git` 任务，例如删除所有已合并到 master 的本地分支。

### 删除已合并的 git 分支

**警告**：此命令将从你的计算机中硬删除已合并的分支。你可能希望通过省略最后一个 git 命令来检查选择删除的分支。

```nu
git branch --merged | lines | where ($it != "* master" and $it != "* main") | each {|br| git branch -D ($br | str trim) } | str trim
# => ───┬───────────────────────────────────────────
# =>  0 │ Deleted branch start_urls (was fc01bb45).
# => ───┴───────────────────────────────────────────
```

### 解析格式化的提交消息（更多详细信息请参见解析 git 日志部分）

```nu
git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | first 10
# => ───┬──────────┬───────────────────┬───────────────────────────────────────────────────────┬─────────────────────────────────
# =>  # │   sha1   │     committer     │                         desc                          │            merged_at
# => ───┼──────────┼───────────────────┼───────────────────────────────────────────────────────┼─────────────────────────────────
# =>  0 │ 42f1874a │ Justin Ma         │ Update some examples and docs (#4682)                 │ Tue, 1 Mar 2022 21:05:29 +0800
# =>  1 │ 2a89936b │ Sophia            │ Move to latest stable crossterm, with fix (#4684)     │ Tue, 1 Mar 2022 07:05:46 -0500
# =>  2 │ ece5e7db │ Fernando Herrera  │ dataframe list command (#4681)                        │ Tue, 1 Mar 2022 11:41:13 +0000
# =>  3 │ a6a96b29 │ Sophia            │ Add binary literals (#4680)                           │ Mon, 28 Feb 2022 18:31:53 -0500
# =>  4 │ e3100e6a │ Luca Trevisani    │ Fix alias in `docs/sample_config/config.toml` (#4669) │ Mon, 28 Feb 2022 22:47:14 +0100
# =>  5 │ cb5c61d2 │ Sophia            │ Fix open ended ranges (#4677)                         │ Mon, 28 Feb 2022 11:15:31 -0500
# =>  6 │ b09acdb7 │ Justin Ma         │ Fix unsupported type message for some math related    │ Mon, 28 Feb 2022 23:14:33 +0800
# =>    │          │                   │ commands (#4672)                                      │
# =>  7 │ 0924975b │ Sophia            │ Use default_config.nu by default (#4675)              │ Mon, 28 Feb 2022 10:12:08 -0500
# =>  8 │ d6a6c4b0 │ Sophia            │ Add back in default keybindings (#4673)               │ Mon, 28 Feb 2022 08:54:40 -0500
# =>  9 │ eec17304 │ Stefan Holderbach │ Add profiling build profile and symbol strip (#4630)  │ Mon, 28 Feb 2022 13:13:24 +0100
# => ───┴──────────┴───────────────────┴───────────────────────────────────────────────────────┴─────────────────────────────────
```

---

### 将 git 提交者活动视为 `histogram`

_注意：`histogram` 命令尚未移植到最新版本_

```nu
git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | histogram committer merger | sort-by merger | reverse
# => ━━━━┯━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# =>  #  │ committer           │ merger
# => ────┼─────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────
# =>   0 │ Sophia Turner       │ ****************************************************************************************************
# =>   1 │ Andrés N. Robalino  │ ***********************
# =>   2 │ Yehuda Katz         │ **************
# =>   3 │ est31               │ *****
# =>   4 │ Thomas Hartmann     │ ****
# =>   5 │ Sean Hellum         │ **
# =>   6 │ Patrick Meredith    │ **
# =>   7 │ Fahmi Akbar Wildana │ **
# =>   8 │ Vanessa Sochat      │ *
# =>   9 │ Shaurya Shubham     │ *
# =>  10 │ Pirmin Kalberer     │ *
# =>  11 │ Odin Dutton         │ *
# =>  12 │ Jonathan Rothberg   │ *
# =>  ━━━┷━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
