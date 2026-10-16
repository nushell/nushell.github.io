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
# => ╭───┬───────┬──────┬─────────────────┬──────┬──────────┬──────┬───────────────────────────────┬──────────╮
# => │ # │  pid  │ ppid │      name       │ user │  status  │ cpu  │           cpu_time            │   mem    │
# => ├───┼───────┼──────┼─────────────────┼──────┼──────────┼──────┼───────────────────────────────┼──────────┤
# => │ 0 │ 48401 │    1 │ ghostty         │ me   │ Sleeping │ 5.20 │  4min 23sec 480ms 196µs 125ns │ 181.5 MB │
# => │ 1 │   768 │    1 │ WindowManager   │ me   │ Sleeping │ 5.08 │ 12min 59sec 751ms 746µs 208ns │  32.6 MB │
# => │ 2 │ 19095 │    1 │ mdworker_shared │ me   │ Sleeping │ 3.25 │        1sec 987ms 245µs 916ns │  26.1 MB │
# => ╰───┴───────┴──────┴─────────────────┴──────┴──────────┴──────┴───────────────────────────────┴──────────╯
```

`cpu` is the percentage of one core that the process used during a short sample, like `top` shows. It is `null` when the operating system doesn't report it for a process; on macOS, that's the case for other users' processes unless you run Nushell as root. `where cpu > 0` leaves those rows out. If you sort without filtering, drop them first with `compact`, because `null` sorts after every number and would come first in a reversed sort:

```nu
ps | compact cpu | sort-by cpu --reverse | first 5
```

---

### Find and kill a hanging process

Sometimes a process doesn't shut down correctly. Using `ps` it's fairly easy to find the pid of this process. Here, a `sleep` process stands in for the one that hangs:

```nu
ps | where name == sleep
# => ╭───┬───────┬───────┬───────┬──────┬──────────┬──────┬─────────────────┬────────╮
# => │ # │  pid  │ ppid  │ name  │ user │  status  │ cpu  │    cpu_time     │  mem   │
# => ├───┼───────┼───────┼───────┼──────┼──────────┼──────┼─────────────────┼────────┤
# => │ 0 │ 56866 │ 56857 │ sleep │ me   │ Sleeping │ 0.00 │ 1ms 585µs 875ns │ 1.0 MB │
# => ╰───┴───────┴───────┴───────┴──────┴──────────┴──────┴─────────────────┴────────╯
```

This process can be sent the kill signal in a one-liner:

```nu
ps | where name == sleep | get pid.0 | kill $in
```

Notes:

- `kill` is a built-in Nu command that works on all platforms. If you wish to use the classic Unix `kill` command, you can do so with `^kill`.
- Filtering with the `where` command as shown above is case-sensitive.
- `ps` returns the same columns on Linux, macOS, Windows, and the BSDs. Use `ps --long` for more columns, such as `command`, `exe`, `start_time`, and `cwd`.
