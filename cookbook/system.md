---
title: System
---

# System

Nu offers many commands that help interface with the filesystem and control your operating system.

### View all files in the current directory

```nu
ls | where type == file
# => ╭────┬─────────────────────────────────┬──────┬──────────┬────────────────╮
# => │  # │              name               │ type │   size   │    modified    │
# => ├────┼─────────────────────────────────┼──────┼──────────┼────────────────┤
# => │  0 │ CODE_OF_CONDUCT.md              │ file │   3.4 kB │ 9 months ago   │
# => │  1 │ CONTRIBUTING.md                 │ file │   1.7 kB │ 9 months ago   │
# => │  2 │ Cargo.lock                      │ file │ 118.4 kB │ 2 hours ago    │
# => │  3 │ Cargo.toml                      │ file │   4.1 kB │ 2 hours ago    │
# => │  4 │ Cargo.toml.old                  │ file │   7.2 kB │ 2 weeks ago    │
# => │  5 │ LICENSE                         │ file │   1.0 kB │ 4 months ago   │
# => │  6 │ Makefile.toml                   │ file │    473 B │ 9 months ago   │
# => │  7 │ README.build.txt                │ file │    193 B │ 9 months ago   │
# => │  8 │ README.md                       │ file │  15.8 kB │ 3 days ago     │
# => │  9 │ bands.txt                       │ file │    156 B │ 2 hours ago    │
# => │ 10 │ extra_features_cargo_install.sh │ file │     54 B │ 4 months ago   │
# => │ 11 │ files                           │ file │      3 B │ an hour ago    │
# => │ 12 │ payload.json                    │ file │     88 B │ 21 minutes ago │
# => │ 13 │ rustfmt.toml                    │ file │     16 B │ 9 months ago   │
# => │ 14 │ urls.json                       │ file │    182 B │ 25 minutes ago │
# => ╰────┴─────────────────────────────────┴──────┴──────────┴────────────────╯
```

---

### View all directories in the current directory

```nu
ls | where type == dir
# => ╭───┬──────────┬──────┬──────┬──────────────╮
# => │ # │   name   │ type │ size │   modified   │
# => ├───┼──────────┼──────┼──────┼──────────────┤
# => │ 0 │ crates   │ dir  │ 64 B │ 3 weeks ago  │
# => │ 1 │ docs     │ dir  │ 64 B │ a day ago    │
# => │ 2 │ images   │ dir  │ 64 B │ 2 weeks ago  │
# => │ 3 │ pkg_mgrs │ dir  │ 64 B │ 9 months ago │
# => │ 4 │ samples  │ dir  │ 64 B │ 9 months ago │
# => │ 5 │ src      │ dir  │ 64 B │ 3 hours ago  │
# => │ 6 │ target   │ dir  │ 64 B │ 2 weeks ago  │
# => │ 7 │ tests    │ dir  │ 64 B │ 4 months ago │
# => │ 8 │ wix      │ dir  │ 64 B │ 2 weeks ago  │
# => ╰───┴──────────┴──────┴──────┴──────────────╯
```

---

### View system information

The [`sys`](/commands/docs/sys.md) subcommands report on the host, CPUs, memory, disks, network interfaces, temperatures and users. For example:

```nu
sys host
# => ╭─────────────────┬───────────────────────────╮
# => │ name            │ Darwin                    │
# => │ os_version      │ 27.0                      │
# => │ long_os_version │ macOS 27.0                │
# => │ kernel_version  │ 27.0.0                    │
# => │ hostname        │ my-mac.local              │
# => │ uptime          │ 1wk 5day 22hr 50min 19sec │
# => │ boot_time       │ 2 weeks ago               │
# => ╰─────────────────┴───────────────────────────╯
```

Run `sys` by itself to list all of its subcommands.

---

### Find processes sorted by greatest cpu utilization.

```nu
ps | where cpu > 0 | sort-by cpu | reverse
# => ╭───┬───────┬───────┬────────────────────┬───────┬─────────┬─────────╮
# => │ # │  pid  │ ppid  │        name        │  cpu  │   mem   │ virtual │
# => ├───┼───────┼───────┼────────────────────┼───────┼─────────┼─────────┤
# => │ 0 │ 11928 │ 10224 │ nu.exe             │ 32.12 │ 47.7 MB │ 20.9 MB │
# => │ 1 │ 11728 │  6380 │ Teams.exe          │ 10.71 │ 53.8 MB │ 50.8 MB │
# => │ 2 │ 21460 │ 14776 │ msedgewebview2.exe │  8.43 │ 54.0 MB │ 36.8 MB │
# => ╰───┴───────┴───────┴────────────────────┴───────┴─────────┴─────────╯
```

---

### Find and kill a hanging process

Sometimes a process doesn't shut down correctly. Using `ps` it's fairly easy to find the pid of this process:

```nu
ps | where name == Notepad2.exe
# => ╭───┬──────┬──────┬──────────────┬──────┬─────────┬─────────╮
# => │ # │ pid  │ ppid │     name     │ cpu  │   mem   │ virtual │
# => ├───┼──────┼──────┼──────────────┼──────┼─────────┼─────────┤
# => │ 0 │ 9268 │ 7040 │ Notepad2.exe │ 0.00 │ 32.0 MB │  9.8 MB │
# => ╰───┴──────┴──────┴──────────────┴──────┴─────────┴─────────╯
```

This process can be sent the kill signal in a one-liner:

```nu
ps | where name == Notepad2.exe | get pid.0 | kill $in
# => SUCCESS: Sent termination signal to the process with PID 9268.
```

Notes:

- `kill` is a built-in Nu command that works on all platforms. If you wish to use the classic Unix `kill` command, you can do so with `^kill`.
- Filtering with the `where` command as shown above is case-sensitive.
- The `ps` output above is from Windows. On Linux and macOS, `ps` also has a `status` column.
