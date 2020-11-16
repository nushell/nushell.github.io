---
title: Git
---

# Git

Nu can help with common `Git` tasks like removing all local branches which have been merged into master.

### Delete git merged branches
Warning: This command will hard delete the merged branches from your machine.
You may want to check the branches selected for deletion by omitting the last git command.

`git branch --merged | lines | where $it != "* master" | git branch -D $it`

Output

```
Deleted branch post-argument-positions (was 9d34ec9).
```

Parse formatted commit messages (more details in the parsing git log section)

`git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc merged_at | first 10`


Output

```
━━━┯━━━━━━━━━┯━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 # │ hash    │ author          │ time        │ message
───┼─────────┼─────────────────┼─────────────┼──────────────────────────────────────────────────────────────────
 0 │ 9d34ec9 │ Jonathan Turner │ 13 days ago │ Merge pull request #891 from nushell/jonathandturner-patch-1
 1 │ fd92271 │ Jonathan Turner │ 13 days ago │ Move rustyline dep back to crates
 2 │ 2d44b7d │ Jonathan Turner │ 2 weeks ago │ Update README.md
 3 │ faccb06 │ Jonathan Turner │ 2 weeks ago │ Merge pull request #890 from jonathandturner/append_prepend
 4 │ a9cd6b4 │ Jonathan Turner │ 2 weeks ago │ Format files
 5 │ 81691e0 │ Jonathan Turner │ 2 weeks ago │ Add prepend and append commands
 6 │ 26f40dc │ Jonathan Turner │ 2 weeks ago │ Merge pull request #889 from jonathandturner/read_plugin
 7 │ 3820fef │ Jonathan Turner │ 2 weeks ago │ Add a simple read/parse plugin to better handle text data
 8 │ b6824d8 │ Jonathan Turner │ 2 weeks ago │ Merge pull request #886 from notryanb/fetch-from-variable
 9 │ e09160e │ Ryan Blecher    │ 2 weeks ago │ add ability to create PathBuf from string to avoid type mismatch
━━━┷━━━━━━━━━┷━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### View git comitter activity as a `histogram`

`git log --pretty=%h»¦«%aN»¦«%s»¦«%aD | lines | split column "»¦«" sha1 committer desc  merged_at | histogram committer merger | sort-by merger | reverse`

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
