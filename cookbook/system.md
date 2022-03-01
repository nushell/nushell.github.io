---
title: System
---

# System

Nu offers many commands and plugins that help navigate a command-line interface, interface with the filesystem, and monitor your system.

### View all files in the current directory

```shell
> ls | where type == file
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

```shell
> ls | where type == dir
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

```shell
> ps | where cpu > 0 | sort-by cpu | reverse
```

Output

```
───┬───────┬────────────────────┬───────┬─────────┬─────────
 # │  pid  │        name        │  cpu  │   mem   │ virtual
───┼───────┼────────────────────┼───────┼─────────┼─────────
 0 │ 11928 │ nu.exe             │ 32.12 │ 47.7 MB │ 20.9 MB
 1 │ 11728 │ Teams.exe          │ 10.71 │ 53.8 MB │ 50.8 MB
 2 │ 21460 │ msedgewebview2.exe │  8.43 │ 54.0 MB │ 36.8 MB
───┴───────┴────────────────────┴───────┴─────────┴─────────
```

---

### Find and kill a hanging process

Sometimes a process doesn't shut down correctly. Using `ps` it's fairly easy to find the pid of this process.

```shell
> ps | where name == Notepad2.exe
```

Output

```
───┬──────┬──────────────┬──────┬─────────┬─────────
 # │ pid  │     name     │ cpu  │   mem   │ virtual
───┼──────┼──────────────┼──────┼─────────┼─────────
 0 │ 9268 │ Notepad2.exe │ 0.00 │ 32.0 MB │  9.8 MB
───┴──────┴──────────────┴──────┴─────────┴─────────
```

This process can be sent the kill signal in a one-liner:

```shell
> ps | where name == Notepad2.exe | get pid.0 | kill -9 $in
```

Output

```
───┬────────────────────────────────────────────────────────────────
 0 │ SUCCESS: Sent termination signal to the process with PID 9268.
───┴────────────────────────────────────────────────────────────────
```

Notes:

- `kill` is Linux/Unix specific command, it is not built-in to nu.
- filtering with the `where` command, as shown above, is case-sensitive.

---

### Pipeline content to clipboard

_Note: clip/clipboard-cli is has not been ported yet in the new version_

Add the output of a pipeline to your clipboard.
Note, this currently needs to be string output.

Note that `clip` is not yet enabled by default. If the output of `version | get features` contains `clipboard-cli` then your copy of NuShell contains
`clip`. If `clip` is not available, then your operating system may provide a
command that performs a similar function e.g. `clip` on Windows or `pbcopy`
on macOS.

```shell
sys | get mem | to json | clip
```

Output pasted from `clip` :)

```json
{
  "total": 34047156000,
  "free": 19571089000,
  "swap total": 7516192000,
  "swap free": 7516192000
}
```
