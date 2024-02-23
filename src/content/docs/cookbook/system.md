---
title: System
---

Nu offers many commands that help interface with the filesystem and control your operating system.

### View all files in the current directory

```nu
ls | where type == file
```

Output

```
────┬─────────────────────────────────┬──────┬──────────┬────────────────
 #  │              name               │ type │   size   │    modified
────┼─────────────────────────────────┼──────┼──────────┼────────────────
  0 │ CODE_OF_CONDUCT.md              │ file │   3.5 KB │ 10 months ago
  1 │ CONTRIBUTING.md                 │ file │   1.8 KB │ 10 months ago
  2 │ Cargo.lock                      │ file │ 118.4 KB │ 2 hours ago
  3 │ Cargo.toml                      │ file │   4.1 KB │ 2 hours ago
  4 │ Cargo.toml.old                  │ file │   7.2 KB │ 2 weeks ago
  5 │ LICENSE                         │ file │   1.1 KB │ 4 months ago
  6 │ Makefile.toml                   │ file │    473 B │ 10 months ago
  7 │ README.build.txt                │ file │    193 B │ 10 months ago
  8 │ README.md                       │ file │  15.8 KB │ 3 days ago
  9 │ bands.txt                       │ file │    156 B │ 2 hours ago
 10 │ extra_features_cargo_install.sh │ file │     54 B │ 4 months ago
 11 │ files                           │ file │      3 B │ an hour ago
 12 │ payload.json                    │ file │     88 B │ 21 minutes ago
 13 │ rustfmt.toml                    │ file │     16 B │ 10 months ago
 14 │ urls.json                       │ file │    182 B │ 25 minutes ago
────┴─────────────────────────────────┴──────┴──────────┴────────────────
```

---

### View all directories in the current directory

```nu
ls | where type == dir
```

Output

```
────┬───────────┬──────┬─────────┬───────────────
 #  │   name    │ type │  size   │   modified
────┼───────────┼──────┼─────────┼───────────────
  0 │ .azureold │ dir  │     0 B │ 3 weeks ago
  1 │ .cargo    │ dir  │     0 B │ 10 months ago
  2 │ .vscode   │ dir  │     0 B │ 10 months ago
  3 │ crates    │ dir  │ 12.3 KB │ 3 weeks ago
  4 │ docs      │ dir  │  4.1 KB │ a day ago
  5 │ images    │ dir  │  4.1 KB │ 2 weeks ago
  6 │ pkg_mgrs  │ dir  │     0 B │ 10 months ago
  7 │ samples   │ dir  │     0 B │ 10 months ago
  8 │ src       │ dir  │  4.1 KB │ 3 hours ago
  9 │ target    │ dir  │     0 B │ 2 weeks ago
 10 │ tests     │ dir  │     0 B │ 4 months ago
 11 │ wix       │ dir  │     0 B │ 2 weeks ago
────┴───────────┴──────┴─────────┴───────────────
```

---

### Find processes sorted by greatest cpu utilization.

```nu
ps | where cpu > 0 | sort-by cpu | reverse
```

Output

```nu frame="terminal"
╭────┬──────┬──────┬─────────────────────────────────┬─────────┬──────┬───────────┬───────────╮
│  # │ pid  │ ppid │              name               │ status  │ cpu  │    mem    │  virtual  │
├────┼──────┼──────┼─────────────────────────────────┼─────────┼──────┼───────────┼───────────┤
│  0 │ 4677 │ 4675 │ nu                              │ Running │ 9.17 │  31.0 MiB │ 391.4 GiB │
│  1 │ 4674 │    1 │ Terminal                        │ Sleep   │ 8.34 │  87.5 MiB │ 391.0 GiB │
│  2 │ 5783 │ 1811 │ Arc Helper (Renderer)           │ Sleep   │ 2.55 │ 231.1 MiB │   1.5 TiB │

```

---

### Find and kill a hanging process

Sometimes a process doesn't shut down correctly. Using `ps` it's fairly easy to find the pid of this process:

```nu
ps | where name == Notes
```

Output

```nu
╭───┬──────┬──────┬───────┬────────┬──────┬───────────┬───────────╮
│ # │ pid  │ ppid │ name  │ status │ cpu  │    mem    │  virtual  │
├───┼──────┼──────┼───────┼────────┼──────┼───────────┼───────────┤
│ 0 │ 1306 │    1 │ Notes │ Sleep  │ 0.00 │ 108.4 MiB │ 395.3 GiB │
╰───┴──────┴──────┴───────┴────────┴──────┴───────────┴───────────╯
```

This process can be sent the kill signal in a one-liner:

```nu
ps | where name == Notes | get pid.0 | kill $in
```

Notes:

- `kill` is a built-in Nu command that works on all platforms. If you wish to use the classic Unix `kill` command, you can do so with `^kill`.
- Filtering with the `where` command as shown above is case-sensitive.
