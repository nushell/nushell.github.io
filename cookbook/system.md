---
title: System
---

# System

Nu offers many commands that help interface with the filesystem and control your operating system. Commands that measure, query, or clear the terminal are in [Working with the Terminal](/book/terminal.md).

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

`uptime` and `boot_time` are always in the record. The other fields are left out when the operating system doesn't report them, so read them with `?`, as in `sys host | get hostname?`. `boot_time` is `null` when the reported boot time can't be turned into a date, which happens on some broken systems.

[`uname`](/commands/docs/uname.md) returns the fields of the Unix `uname -a` command as a record, always with all six:

```nu
uname
# => ╭──────────────────┬───────────────────────────────────────────────────────────╮
# => │ kernel-name      │ Darwin                                                    │
# => │ nodename         │ my-mac.local                                              │
# => │ kernel-release   │ 27.2.0                                                    │
# => │ kernel-version   │ Darwin Kernel Version 27.2.0: Thu Oct 15 00:02:46 PDT     │
# => │                  │ 2026; root:xnu-13432.41.4~25/RELEASE_ARM64_T6000          │
# => │ machine          │ arm64                                                     │
# => │ operating-system │ Darwin                                                    │
# => ╰──────────────────┴───────────────────────────────────────────────────────────╯
```

The first five fields come from the running kernel. `operating-system` depends on how Nushell was built: `GNU/Linux` for a glibc build, `Linux` for a musl build, `Darwin`, `FreeBSD`, `Android`, and so on, and on Windows `MS/Windows` followed by the Windows release in parentheses. Unlike `sys host`, `uname` also works in a `const`, so you can use its fields where Nushell needs a value at parse time. To branch on the platform in a script, `$nu.os-info.name` (`linux`, `macos`, `windows`, ...) is simpler to compare.

---

### CPU load and usage

[`sys cpu`](/commands/docs/sys_cpu.md) returns one row per logical CPU, meaning each core, or each hardware thread on CPUs that run two threads per core. `name` is what the operating system calls the CPU, such as `cpu0` on Linux, `CPU 1` on Windows, or `1` on macOS. `brand` and `vendor_id` identify the processor, and `freq` is its clock speed in MHz, as an int.

`load_average` is the system's 1, 5 and 15 minute load averages, as a single string that is the same on every row. Split it to get numbers:

```nu
sys cpu | first | get load_average | split row ", " | into float
# => ╭───┬──────╮
# => │ 0 │ 5.39 │
# => │ 1 │ 3.86 │
# => │ 2 │ 3.59 │
# => ╰───┴──────╯
```

Windows has no load average. There, the sysinfo library that Nushell uses estimates one by sampling the processor queue every 5 seconds. Sampling starts the first time a Nushell session asks, so the first `sys cpu` of a session shows `0.00, 0.00, 0.00`.

`--long` (`-l`) adds `cpu_usage`, the percentage of time each CPU was busy, rounded to one decimal place. Usage can only be measured over an interval, so `sys cpu --long` reads the counters twice, 0.4 seconds apart, or 0.2 seconds on the BSDs. Plain `sys cpu` returns right away.

```nu
sys cpu --long | select name brand freq cpu_usage | first 2
# => ╭───┬──────┬──────────────┬──────┬───────────╮
# => │ # │ name │    brand     │ freq │ cpu_usage │
# => ├───┼──────┼──────────────┼──────┼───────────┤
# => │ 0 │ 1    │ Apple M1 Max │ 3228 │     41.50 │
# => │ 1 │ 2    │ Apple M1 Max │ 3228 │     30.80 │
# => ╰───┴──────┴──────────────┴──────┴───────────╯
```

For the CPU use of single processes, see [`ps`](#find-processes-sorted-by-greatest-cpu-utilization) below.

---

### Memory and disk space

[`sys mem`](/commands/docs/sys_mem.md) returns a record of filesizes for RAM and swap:

```nu
sys mem
# => ╭────────────┬─────────╮
# => │ total      │ 34.3 GB │
# => │ free       │ 6.6 GB  │
# => │ used       │ 16.8 GB │
# => │ available  │ 25.2 GB │
# => │ swap total │ 0 B     │
# => │ swap free  │ 0 B     │
# => │ swap used  │ 0 B     │
# => ╰────────────┴─────────╯
```

`free` is memory that nothing is using. `available` adds memory the system can take back when a program asks for it, such as file caches, so it's the better answer to "how much memory is left". Windows and FreeBSD report only one of the two, so there `free` and `available` are equal. Quote the names of the swap fields, which contain a space: `(sys mem)."swap used"` or `sys mem | get "swap used"`.

[`sys disks`](/commands/docs/sys_disks.md) has a row for each mounted filesystem. `device` is the device or volume name, `type` the filesystem (`apfs`, `ext4`, `NTFS`, ...), and `mount` where it's mounted. `total` and `free` are filesizes, where `free` is the space the operating system says is available for new files. `removable` is a bool, and `kind` is `SSD`, `HDD`, or `Unknown`:

```nu
sys disks | select mount type total free kind
# => ╭───┬──────────────────────┬──────┬──────────┬──────────┬──────╮
# => │ # │        mount         │ type │  total   │   free   │ kind │
# => ├───┼──────────────────────┼──────┼──────────┼──────────┼──────┤
# => │ 0 │ /                    │ apfs │ 994.6 GB │ 222.7 GB │ SSD  │
# => │ 1 │ /System/Volumes/Data │ apfs │ 994.6 GB │ 222.7 GB │ SSD  │
# => ╰───┴──────────────────────┴──────┴──────────┴──────────┴──────╯
```

On macOS, the APFS volumes of one disk share its space, so they all show the same `total` and `free`.

---

### Network interfaces

[`sys net`](/commands/docs/sys_net.md) has a row per network interface, in no particular order. `mac` is the hardware address, all zeros for an interface without one, such as the loopback. `sent` and `recv` are filesizes that count all traffic since the interface's counters started, usually at boot. `ip` is a table of the interface's addresses, with `address`, `protocol` (`ipv4` or `ipv6`), and two bools, `loop` for a loopback address and `multicast`. [`flatten --all`](/commands/docs/flatten.md) turns that into one row per address:

```nu
sys net | select name ip | flatten --all | where protocol == ipv4 and not loop
# => ╭───┬──────┬───────────┬──────────┬───────┬───────────╮
# => │ # │ name │  address  │ protocol │ loop  │ multicast │
# => ├───┼──────┼───────────┼──────────┼───────┼───────────┤
# => │ 0 │ en0  │ 10.0.0.20 │ ipv4     │ false │ false     │
# => ╰───┴──────┴───────────┴──────────┴───────┴───────────╯
```

---

### Temperatures

[`sys temp`](/commands/docs/sys_temp.md) lists the temperature sensors the system exposes, in degrees Celsius. `unit` is the sensor's label and `temp` its current reading. `high` is the highest reading known for the sensor. On Linux that's the chip's own record when it keeps one. Otherwise only the readings of the current call count, so `high` stays close to `temp`. A sensor that reports the temperature at which the hardware shuts down also has a `critical` column, which is empty in the other rows.

What you get depends on the platform:

- Linux reads the sensors in `/sys/class/hwmon` and `/sys/class/thermal`. A Docker container or WSL usually has neither, and gets an empty table.
- macOS reports the sensors its hardware drivers expose. On Apple silicon that's a few dozen; an Intel Mac has a handful, such as the CPU, GPU, and battery.
- FreeBSD has one sensor per CPU core, named `CPU 1`, `CPU 2`, and so on.
- Windows reports at most one sensor, named `Computer`, read from the ACPI thermal zone through WMI. Many PCs don't provide it.
- On other systems, OpenBSD among them, the table is always empty.

An empty table isn't an error. A sensor that can't be read has `NaN` in `temp`. `NaN` sorts above every number, so filter those rows out before you sort. A comparison such as `temp > 0` is false for `NaN`:

```nu
sys temp | where temp > 0 | sort-by temp --reverse | first 3
# => ╭───┬───────────┬───────┬───────╮
# => │ # │   unit    │ temp  │ high  │
# => ├───┼───────────┼───────┼───────┤
# => │ 0 │ PMU tcal  │ 51.85 │ 51.85 │
# => │ 1 │ PMU tdev7 │ 43.54 │ 43.66 │
# => │ 2 │ PMU TP2g  │ 42.72 │ 42.72 │
# => ╰───┴───────────┴───────┴───────╯
```

---

### Users

[`whoami`](/commands/docs/whoami.md) returns the name of the user that Nushell runs as. It asks the operating system instead of reading `$env.USER` or `$env.USERNAME`, which any program can set. On Unix it looks up the name of the effective user id, so a user id that has no entry in the user database, as happens in some containers, is an error. On Windows it returns the name that `GetUserName` reports.

```nu
whoami
# => me
```

[`sys users`](/commands/docs/sys_users.md) lists every account on the system, including the ones that system services run as. Each row has the account's `id`, `name`, and `groups`, a list of group names. On Unix `id` is the numeric user id, and on Windows it's the account's SID as a string, such as `S-1-5-18`. To see the groups of the current user:

```nu
sys users | where name == (whoami) | get groups.0 | first 3
# => ╭───┬───────────────╮
# => │ 0 │ staff         │
# => │ 1 │ everyone      │
# => │ 2 │ localaccounts │
# => ╰───┴───────────────╯
```

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

[`kill`](/commands/docs/kill.md) takes any number of pids, as in `kill 56866 56870`. On Linux, macOS, and the BSDs it runs the system `kill` command, which sends signal 15 (`TERM`) by default. That asks the process to exit, and a process can catch it or ignore it:

- `--signal <n>` (`-s`) sends signal number `n` instead, such as `kill -s 1 56866` for `HUP`. Windows has no signals, so `kill` has no `--signal` flag there.
- `--force` (`-f`) sends signal 9 (`KILL`), which can't be caught. On Windows, `kill` runs `taskkill`, and `--force` adds its `/F` flag. `--force` and `--signal` can't be used together.
- On Unix, `kill -9 56866`, as you'd write it in Bash, is an error. Nushell reads `-9` as a negative pid, and the error suggests `kill -s 9 <pid>`.
- When the system command fails, for example because there's no such process or you may not signal it, `kill` raises a `process didn't terminate successfully` error with the system's message. `--quiet` (`-q`) hides that error and anything the command prints.

---

### More process details with `ps --long`

The default `ps` columns include `mem`, the process's resident memory, meaning how much of its memory is in RAM right now. `ps --long` adds these columns:

- `virtual` is the size of the process's virtual address space, which is usually much larger than the memory it uses.
- `private` is the memory only this process uses. Activity Monitor and Task Manager show this number as "Memory".
- `command` is the full command line and `exe` the path of the executable. `start_time` is when the process started, and `cwd` its working directory.
- `user_id` is the numeric user id on Unix, and the SID string (for example `S-1-5-18`) on Windows.
- `process_group_id` and `session_id` are the Unix process group and session. On Windows, `process_group_id` is the console process group.
- `priority` is the scheduling priority as the operating system reports it, so its scale differs between platforms. On Windows it's the base priority, 8 for a normal process.
- `nice` is the Unix nice value, from -20 (most favored) to 19. Windows has priority classes instead, and `nice` maps them onto the same scale: realtime is -20, high -14, above normal -7, normal 0, below normal 10, and idle 19.
- `threads` is the number of threads.
- `read` and `written` count the bytes of storage I/O since the process started. On Windows they count all I/O, including pipes and network traffic. The BSDs count blocks rather than bytes.
- `environment` is the process's environment, as a list of `NAME=value` strings.

```nu
ps --long | where pid == $nu.pid | select name mem virtual private threads priority nice
# => ╭───┬──────┬─────────┬──────────┬─────────┬─────────┬──────────┬──────╮
# => │ # │ name │   mem   │ virtual  │ private │ threads │ priority │ nice │
# => ├───┼──────┼─────────┼──────────┼─────────┼─────────┼──────────┼──────┤
# => │ 0 │ nu   │ 24.0 MB │ 500.5 GB │  8.6 MB │       2 │       31 │    0 │
# => ╰───┴──────┴─────────┴──────────┴─────────┴─────────┴──────────┴──────╯
```

As with `cpu`, a column is `null` when the operating system doesn't share the value. macOS shows the CPU, memory, threads, environment, and working directory of other users' processes only to root, and for those processes `command` is just the executable's path.

---

### Resource limits with `ulimit`

[`ulimit`](/commands/docs/ulimit.md) reads and sets the resource limits of the Nushell process, like the `ulimit` built-in of Bash and Zsh. It exists on Linux, macOS, the BSDs, and Android, but not on Windows.

Each resource has its own flag, such as `-n` for open files or `-s` for the stack size. With no resource flag, `ulimit` works on the file size limit (`-f`), and `-a` (`--all`) lists every resource. The result is a table with a `description`, which ends with the unit and the flag, and the `soft` and `hard` limits. `-S` (`--soft`) or `-H` (`--hard`) keeps only one of the two columns.

```nu
ulimit -s
# => ╭───┬─────────────────────────────┬──────┬───────╮
# => │ # │         description         │ soft │ hard  │
# => ├───┼─────────────────────────────┼──────┼───────┤
# => │ 0 │ Maximum stack size (kB, -s) │ 8176 │ 65520 │
# => ╰───┴─────────────────────────────┴──────┴───────╯
```

The system enforces the soft limit. A process may move its soft limit anywhere up to the hard limit, and it may lower its hard limit, but only root can raise a hard limit. Sizes are in kB of 1024 bytes, `-t` (`--cpu-time`) is in seconds, and the other limits are counts. A resource without a limit shows the string `unlimited`, so a column can hold both ints and strings.

To set a limit, put the value after the flags. Without `-S` or `-H`, both limits change. To change only one of them, add `-S` or `-H` to the resource flag, as in `ulimit -f -S 2000` for the soft file size limit. With several resource flags, each of them gets the value.

```nu
ulimit -n 256
ulimit -n | reject description
# => ╭───┬──────┬──────╮
# => │ # │ soft │ hard │
# => ├───┼──────┼──────┤
# => │ 0 │  256 │  256 │
# => ╰───┴──────┴──────╯
```

The value can be:

- an int, in the unit of the resource
- a filesize, for a resource measured in kB. `ulimit -f 1MiB` sets 1024 kB. A filesize for a count, as in `ulimit -n 1kB`, is a type mismatch error.
- `unlimited`
- `hard`, the current hard limit
- `soft`, the current soft limit, when you set only the hard limit with `-H`. When the soft limit is being set, `soft` means the hard limit, the same as `hard`.

Any other string is an error, and so is a negative int. When you set only the soft limit, `ulimit` lowers a value above the hard limit, or `unlimited`, to the hard limit without a message. A value the system refuses is an error, such as `EPERM: Operation not permitted` when you try to raise a hard limit, or `EINVAL: Invalid argument` for a hard limit below the current soft limit.

The limits belong to the whole Nushell process. A `ulimit` inside a closure or a custom command stays in effect after it returns, unlike a change to `$env`, and every external command started afterwards inherits the limits. To limit a single job, set the limit in a child Nushell:

```nu
nu -c 'ulimit -t 10; ^sh -c "ulimit -t"'
# => 10
ulimit -t | get soft.0
# => unlimited
```

The generated page lists the resource flags of the macOS build: `-c` (core files), `-d` (data segment), `-f`, `-n`, `-s`, `-t`, and `-v` (virtual memory). Every Unix build has the first six, and all but FreeBSD, NetBSD, and OpenBSD have `-v`. Other systems have more:

| Flag                        | Limits                              | Unit         | Platforms            |
| --------------------------- | ----------------------------------- | ------------ | -------------------- |
| `-l`, `--lock-size`         | memory locked into RAM              | kB           | Linux, Android, BSDs |
| `-m`, `--resident-set-size` | resident set size                   | kB           | Linux, Android, BSDs |
| `-u`, `--process-count`     | processes of the current user       | count        | Linux, Android, BSDs |
| `-e`, `--nice`              | the nice priority a process can get | number       | Linux, Android       |
| `-i`, `--pending-signals`   | pending signals                     | count        | Linux, Android       |
| `-q`, `--queue-size`        | bytes in POSIX message queues       | kB           | Linux, Android       |
| `-r`, `--realtime-priority` | realtime scheduling priority        | number       | Linux, Android       |
| `-x`, `--file-locks`        | file locks                          | count        | Linux, Android       |
| `-y`, `--realtime-maxtime`  | contiguous realtime CPU time        | microseconds | Linux                |
| `-b`, `--socket-buffers`    | socket buffer size                  | kB           | FreeBSD              |
| `-w`, `--swap-size`         | swap space                          | kB           | FreeBSD              |
| `-K`, `--kernel-queues`     | kqueues                             | count        | FreeBSD              |
| `-P`, `--ptys`              | pseudo-terminals                    | count        | FreeBSD              |

---

### Default permissions for new files

[`umask`](/commands/docs/umask.md) shows or sets the permissions that new files and directories get. Like `ulimit`, it exists on Linux, macOS, the BSDs, and Android, but not on Windows.

Nushell's `umask` takes the permissions to keep, written the way the `mode` column of `ls --long` shows them. Other shells take the bits to remove, as an octal number. Bash's `umask 022` is `umask rwxr-xr-x` in Nushell, and `umask 027` is `umask rwxr-x---`. Setting a mask returns the previous one:

```nu
umask
# => rwxr-xr-x
umask rwxr-x---
# => rwxr-xr-x
"x" | save notes.txt
mkdir drafts
ls --long | select name mode
# => ╭───┬───────────┬───────────╮
# => │ # │   name    │   mode    │
# => ├───┼───────────┼───────────┤
# => │ 0 │ drafts    │ rwxr-x--- │
# => │ 1 │ notes.txt │ rw-r----- │
# => ╰───┴───────────┴───────────╯
```

The new file has no `x` even though the mask allows it, because programs create ordinary files without execute permission and the mask can only take permissions away. Since `umask` returns the old mask, you can tighten it for a few commands and put it back:

```nu
let old = umask rwx------
"secret" | save key.txt
umask $old
```

The argument must be exactly nine characters, each the letter for its position or `-`. The `x` positions also take the special-bit letters that `ls` can show. `s` and `t` count as `x`, and `S` and `T` count as `-`. An octal mask is an error:

```nu
umask 022
# => Error: nu::shell::incorrect_value
# =>
# =>   × Incorrect value.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ umask 022
# =>    · ──┬── ─┬─
# =>    ·   │    ╰── Invalid mode: invalid character '0' at position 0.
# =>    ·   ╰── encountered here
# =>    ╰────
```

As with `ulimit`, the mask belongs to the Nushell process. A change made inside a closure or custom command stays after it returns, and external commands inherit the mask.

---

### Reading the Windows registry

On Windows, [`registry query`](/commands/docs/registry_query.md) reads values from the registry. The parent command, [`registry`](/commands/docs/registry.md), only prints help. Neither command exists on other platforms, and Nushell has no command that writes to the registry.

Pass the path of a key. It's read from `HKEY_CURRENT_USER` unless a flag such as `--hklm` names another hive, and naming two hives is an error. Key paths use backslashes, so write them in single quotes or a raw string. In a double-quoted string, `\` starts an escape sequence.

Without a value name, `registry query` returns a table with a row for each value in the key, with `name`, `value`, and `type` columns. Subkeys aren't listed, and the key's default value is the row whose `name` is empty. With a value name, it returns one record with the same three fields:

```nu
registry query --hkcu Environment
registry query --hkcu Environment Path | get value
registry query --hklm 'SOFTWARE\Microsoft\Windows NT\CurrentVersion' CurrentBuild
```

`type` is the registry type, such as `REG_SZ`. The `value` column converts it:

| Registry type                                                                                       | Nushell value                             |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `REG_SZ`, `REG_LINK`                                                                                | string                                    |
| `REG_EXPAND_SZ`                                                                                     | string, with `%NAME%` references expanded |
| `REG_MULTI_SZ`                                                                                      | list of strings                           |
| `REG_DWORD`, `REG_DWORD_BIG_ENDIAN`, `REG_QWORD`                                                    | int                                       |
| `REG_BINARY`, `REG_RESOURCE_LIST`, `REG_FULL_RESOURCE_DESCRIPTOR`, `REG_RESOURCE_REQUIREMENTS_LIST` | binary                                    |
| `REG_NONE`                                                                                          | `null`                                    |

The `type` column keeps the original name, so a `REG_RESOURCE_LIST` value arrives as binary with `type` set to `REG_RESOURCE_LIST`.

Windows stores some paths, such as the user `Path`, as `REG_EXPAND_SZ` with references like `%USERPROFILE%`. `registry query` expands them with the Windows function `ExpandEnvironmentStrings`, as PowerShell does, so you can use the result as a path right away. `--no-expand` (`-u`) returns the text as it's stored, with the `%NAME%` references left in.

A key that doesn't exist is a `nu::shell::io::not_found` error that points at the key, and a key you aren't allowed to read gives a permission error. A value name that the key doesn't have is the error "Unable to find registry key/value", labeled "Registry value: `<name>` was not found".

---

### Checking for a newer Nushell release

[`version check`](/commands/docs/version_check.md) asks the GitHub API for the latest Nushell release and compares it with the version you're running. A nightly build is compared with the latest nightly build instead. The result is a record:

- `channel` is `release`, or `nightly` for a nightly build.
- `current` is `true` unless GitHub has a newer version. A development build that's ahead of the last release counts as current.
- `latest` is the newer version's tag, such as `v0.118.0`, when there is one. Otherwise it's the version you're running, without the `v`.

```nu
if not (version check).current { print "A newer Nushell is available" }
```

GitHub limits how often a client without a token can call its API. When `GH_TOKEN` or `GITHUB_TOKEN` is set, `version check` sends it, and `GH_TOKEN` wins when both are set, as with the `gh` CLI. If GitHub rejects the token, `version check` repeats the check without it. When the check fails, the error is "failed to check for the latest version", and its help says whether GitHub rejected the token, is rate limiting you, or had a problem of its own. Without a network connection, you get the same errors as from [`http get`](/commands/docs/http_get.md).

---

### Generating completions for an external command

[`generate completions`](/commands/docs/generate_completions.md) writes [`extern`](/book/externs.md) definitions for an external command, with its flags, their descriptions, and values to complete, from what other tools already know about it: a [carapace](https://carapace.sh) spec, fish or zsh completion scripts, a man page, or the command's own `--help` output. The result is the text of a module. Save it to a file and load it:

```nu
generate completions rg | save --force rg-completions.nu
use rg-completions.nu *
```

Don't name the file after the command. `use rg.nu` would make a module named `rg`, and a module can't export an extern with its own name. To load the externs at every startup, save the file in one of `$nu.user-autoload-dirs` instead. There the name doesn't matter, because autoload files are sourced, not imported as modules.

Without `--source` (`-s`), `generate completions` tries the sources in the order carapace, fish, zsh, man, help, and the first one that knows any flags or subcommands wins. The help source can still add to it. A man page never lists subcommands, and a source may list a subcommand without any of its flags. In either case, when the command's `--help` lists subcommands, what the help source finds is merged in. `--source` with one name reads only that source, and any other name is an error that lists the valid ones.

`--source all` reads every source that knows the command and merges what they found. Where they disagree, the earlier source in that order wins, with one exception. When the sources disagree about whether a flag takes a value, `generate completions` declares it as a switch, and a comment above it names the sources on each side. The header lists every source that was used. This output depends on the versions of the tools you have installed:

```nu
generate completions rg --source all | lines | where $it starts-with '# Sources disagree' | first
# => # Sources disagree on whether --field-context-separator takes a value, so it's a switch: yes in `carapace rg export`, `man rg` and `rg --help`, no in the zsh completions of `rg`
```

carapace, fish and zsh know a command's whole tree of subcommands, and a man page gives the flags of the named command only. The help source runs the command with `--help`, then each subcommand that output lists, and theirs in turn. A program that doesn't check for `--help` first would do the real work instead. On macOS, `rm notes.txt --help` removes `notes.txt`. So the help source runs a subcommand's `--help` only when another source knows the subcommand, when the `--help` of the command above lists it along with a `--help` option, or when it has a man page, as git's subcommands do (`man git-commit`). When none of these holds for a subcommand you ask for, the error says why. On macOS:

```nu
generate completions 'launchctl reboot'
# => Error: nu::shell::error
# =>
# =>   × couldn't generate completions for `launchctl reboot`
# =>    ╭─[repl_entry #1:1:22]
# =>  1 │ generate completions 'launchctl reboot'
# =>    ·                      ─────────┬────────
# =>    ·                               ╰── no flags or subcommands found in carapace, fish, zsh, man, help
# =>    ╰────
# =>   help: `launchctl --help` lists `reboot` but no --help option, and there's no
# =>         `man launchctl-reboot`, so `launchctl reboot --help` wasn't run. Pipe
# =>         its help text in with --source help
```

When you already have the help text, pipe it in and say which source it is. That also works for a command that isn't installed:

```nu
"  -l, --loud          Shout the greeting
  -c, --color <WHEN>  When to use color [possible values: always, never, auto]" | generate completions greet --source help
# => # Generated by `generate completions` from help text piped in.
# => # Flags that are not declared here still reach `greet`. Arguments without a completer
# => # here are completed by the external completer in $env.config.completions.external.
# =>
# => @complete external
# => export extern "greet" [
# =>     --loud(-l)                     # Shout the greeting
# =>     --color(-c): string@[always never auto] # When to use color [possible values: always, never, auto]
# => ]
```

The `[possible values: ...]` list became the completions of `--color`. Values that fish or zsh compute with a command instead become completer commands in the module, named `nu-complete <command> ...`, when they translate to Nushell. `generate completions git --source fish` defines `nu-complete git local branches`, for example, which runs `git for-each-ref`. Shared helpers cover users, groups, hosts, processes, commands, network interfaces, and make targets. A tool built with the [cobra](https://cobra.dev) library, such as `gh`, `docker`, or `kubectl`, completes its own arguments. Each of its externs gets `@complete "nu-complete gh"`, a completer that asks the tool through its hidden `__complete` command. Every other extern gets `@complete external`, so an argument that nothing else covers is completed by the [external completer](/cookbook/external_completers.md) in `$env.config.completions.external`, if you've set one.

Two kinds of flags can't be declared in an extern's signature: flags whose value is optional, such as `--color[=WHEN]`, and long options written with one dash, such as `-name`. They're listed in a comment above the extern, which becomes its description, and they still reach the command when you type them:

```nu
"      --color[=WHEN]  Colorize the output
  -name PATTERN       Match files by name" | generate completions seek --source help
# => # Generated by `generate completions` from help text piped in.
# => # Flags that are not declared here still reach `seek`. Arguments without a completer
# => # here are completed by the external completer in $env.config.completions.external.
# =>
# => # Not declared (optional value or unsupported name): --color, -name
# => @complete external
# => export extern "seek" []
```

Piped text without `--source` is an error. Piped text read with `--source carapace` has to be the JSON of a carapace export, or it fails with "piped text is not a carapace export". The command name can't belong to a Nushell built-in, such as `ls`, since the extern would replace the built-in, or to a keyword, such as `if`, which an extern can't be named after. Each word of the name has to start with a letter or a digit and hold only letters, digits, `-`, `_`, `.`, `+`, and `:`, and it can't be a number. For example, `generate completions 'git --x'` fails with "`--x` can't be part of an extern's name". When no source knows anything about the command, the error suggests installing carapace or fish, or piping its help text in.
