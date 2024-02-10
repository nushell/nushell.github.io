---
title: Git
---

# Git

Nu can help with common `Git` tasks like removing all local branches which have been merged into master.

### Delete git merged branches

**Warning**: This command will hard delete the merged branches from your machine. You may want to check the branches selected for deletion by omitting the last git command.

```nushell
git branch --merged | lines | where ($it != "* master" and $it != "* main") | each {|br| git branch -D ($br | str trim) } | str trim
```

Output

```
───┬───────────────────────────────────────────
 0 │ Deleted branch start_urls (was fc01bb45).
───┴───────────────────────────────────────────
```

Parse formatted commit messages (more details in the parsing git log section)

```nushell
git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | first 10
```

Output

```
───┬──────────┬───────────────────┬───────────────────────────────────────────────────────┬─────────────────────────────────
 # │   sha1   │     committer     │                         desc                          │            merged_at
───┼──────────┼───────────────────┼───────────────────────────────────────────────────────┼─────────────────────────────────
 0 │ 42f1874a │ Justin Ma         │ Update some examples and docs (#4682)                 │ Tue, 1 Mar 2022 21:05:29 +0800
 1 │ 2a89936b │ JT                │ Move to latest stable crossterm, with fix (#4684)     │ Tue, 1 Mar 2022 07:05:46 -0500
 2 │ ece5e7db │ Fernando Herrera  │ dataframe list command (#4681)                        │ Tue, 1 Mar 2022 11:41:13 +0000
 3 │ a6a96b29 │ JT                │ Add binary literals (#4680)                           │ Mon, 28 Feb 2022 18:31:53 -0500
 4 │ e3100e6a │ Luca Trevisani    │ Fix alias in `docs/sample_config/config.toml` (#4669) │ Mon, 28 Feb 2022 22:47:14 +0100
 5 │ cb5c61d2 │ JT                │ Fix open ended ranges (#4677)                         │ Mon, 28 Feb 2022 11:15:31 -0500
 6 │ b09acdb7 │ Justin Ma         │ Fix unsupported type message for some math related    │ Mon, 28 Feb 2022 23:14:33 +0800
   │          │                   │ commands (#4672)                                      │
 7 │ 0924975b │ JT                │ Use default_config.nu by default (#4675)              │ Mon, 28 Feb 2022 10:12:08 -0500
 8 │ d6a6c4b0 │ JT                │ Add back in default keybindings (#4673)               │ Mon, 28 Feb 2022 08:54:40 -0500
 9 │ eec17304 │ Stefan Holderbach │ Add profiling build profile and symbol strip (#4630)  │ Mon, 28 Feb 2022 13:13:24 +0100
───┴──────────┴───────────────────┴───────────────────────────────────────────────────────┴─────────────────────────────────
```

---

### View git committer activity as a `histogram`

_Note: the `histogram` command is not yet ported to the latest version_

```nushell
git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | histogram committer merger | sort-by merger | reverse
```

```
━━━━┯━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 #  │ committer           │ merger
────┼─────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────
  0 │ Jonathan Turner     │ ****************************************************************************************************
  1 │ Andrés N. Robalino  │ ***********************
  2 │ Yehuda Katz         │ **************
  3 │ est31               │ *****
  4 │ Thomas Hartmann     │ ****
  5 │ Sean Hellum         │ **
  6 │ Patrick Meredith    │ **
  7 │ Fahmi Akbar Wildana │ **
  8 │ Vanessa Sochat      │ *
  9 │ Shaurya Shubham     │ *
 10 │ Pirmin Kalberer     │ *
 11 │ Odin Dutton         │ *
 12 │ Jonathan Rothberg   │ *
 ━━━┷━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
