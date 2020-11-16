---
title: System
---

# System

Nu offers many commands and plugins that help navigate a command-line interface, interface with the filesystem, and monitor your system.

### View all files in the current directory

`ls | where type == File`

Output 

```
━━━━┯━━━━━━━━━━━━━━━━━━━━┯━━━━━━┯━━━━━━━━━━┯━━━━━━━━━━┯━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━
 #  │ name               │ type │ readonly │ size     │ created      │ accessed     │ modified
────┼────────────────────┼──────┼──────────┼──────────┼──────────────┼──────────────┼──────────────
  0 │ .editorconfig      │ File │          │   236 B  │ 2 months ago │ 2 months ago │ 2 months ago
  1 │ .gitignore         │ File │          │   189 B  │ 2 months ago │ 2 months ago │ 2 months ago
  2 │ .gitpod.Dockerfile │ File │          │   164 B  │ a month ago  │ a month ago  │ a month ago
  3 │ .gitpod.yml        │ File │          │   803 B  │ a month ago  │ a month ago  │ a month ago
  4 │ build.rs           │ File │          │   1.2 KB │ 3 weeks ago  │ 3 weeks ago  │ 3 weeks ago
  5 │ Cargo.lock         │ File │          │ 153.7 KB │ a week ago   │ a week ago   │ a week ago
  6 │ Cargo.toml         │ File │          │   4.7 KB │ a week ago   │ a week ago   │ a week ago
  7 │ CODE_OF_CONDUCT.md │ File │          │   3.4 KB │ 2 months ago │ 2 months ago │ 2 months ago
  8 │ features.toml      │ File │          │   443 B  │ 3 weeks ago  │ 3 weeks ago  │ 3 weeks ago
  9 │ LICENSE            │ File │          │   1.1 KB │ 2 months ago │ 2 months ago │ 2 months ago
 10 │ Makefile.toml      │ File │          │   647 B  │ 2 months ago │ 2 months ago │ 2 months ago
 11 │ README.md          │ File │          │  18.3 KB │ a week ago   │ a week ago   │ a week ago
 12 │ rust-toolchain     │ File │          │    17 B  │ a month ago  │ a month ago  │ a month ago
 13 │ rustfmt.toml       │ File │          │    16 B  │ 2 months ago │ 2 months ago │ 2 months ago
━━━━┷━━━━━━━━━━━━━━━━━━━━┷━━━━━━┷━━━━━━━━━━┷━━━━━━━━━━┷━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━
```

---

### View all directories in the current directory

`ls | where type == Dir`

Output

```
────┬───────────┬──────┬──────┬──────────────
 #  │ name      │ type │ size │ modified
────┼───────────┼──────┼──────┼──────────────
  0 │ .azure    │ Dir  │  —   │ 1 week ago
  1 │ .cargo    │ Dir  │  —   │ 2 months ago
  2 │ .circleci │ Dir  │  —   │ 5 months ago
  3 │ .git      │ Dir  │  —   │ 19 mins ago
  4 │ .github   │ Dir  │  —   │ 3 months ago
  5 │ assets    │ Dir  │  —   │ 5 months ago
  6 │ crates    │ Dir  │  —   │ 1 month ago
  7 │ debian    │ Dir  │  —   │ 4 months ago
  8 │ docker    │ Dir  │  —   │ 3 months ago
  9 │ docs      │ Dir  │  —   │ 4 months ago
 10 │ images    │ Dir  │  —   │ 5 months ago
 11 │ src       │ Dir  │  —   │ 1 week ago
 12 │ target    │ Dir  │  —   │ 2 months ago
 13 │ tests     │ Dir  │  —   │ 3 weeks ago
────┴───────────┴──────┴──────┴──────────────
```

---

### Find processes sorted by greatest cpu utilization.

`ps | where cpu > 0 | sort-by cpu | reverse`

Output

```
━━━┯━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━
 # │ pid   │ name                  │ status  │ cpu
───┼───────┼───────────────────────┼─────────┼───────────────────
 0 │  8564 │ nu_plugin_ps.exe      │ Running │ 70.86496000000001
 1 │ 13324 │ EpicGamesLauncher.exe │ Running │ 6.141082000000000
 2 │ 21084 │ firefox.exe           │ Running │ 6.006489999999999
 3 │ 19792 │ Code.exe              │ Running │ 5.207409999999999
━━━┷━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━
```

---

### Find and kill a hanging process

Sometimes a process doesn't shut down correctly. Using `ps` it's fairly easy to find the pid of this process:

`ps | where name == node`

Output

```
━━━━━━━┯━━━━━━┯━━━━━━━━━┯━━━━━━━━┯━━━━━━━━━┯━━━━━━━━━
 pid   │ name │ status  │ cpu    │ mem     │ virtual 
───────┼──────┼─────────┼────────┼─────────┼─────────
 15447 │ node │ Running │ 0.0000 │ 18.5 MB │  4.7 GB 
━━━━━━━┷━━━━━━┷━━━━━━━━━┷━━━━━━━━┷━━━━━━━━━┷━━━━━━━━━
```

This process can be sent the kill signal in a one-liner:

`ps | where name == node | format "{pid}" | kill -9 $it`

Notes: 
- `format "{pid}"` is necessary for now since a value of type Int (pid) can not be converted to a string yet, which is necessary for $it. This has been fixed with 0.8.1. With version 0.8.1 you can simplify this by simply using `get pid`.
- `kill` is Linux/Unix specific command, it is not built-in to nu.

---

### Pipeline content to clipboard

Add the output of a pipeline to your clipboard.
Note, this currently needs to be string output.

`sys | get mem | to-json | clip`

Output pasted from `clip` :)

```
{"total":17125339136,"free":8653758464,"swap total":34305208320,"swap free":19703889920}
```
