# `std/bench`

The `std/bench` module has one command, `bench`, which runs one or more closures many times and reports how long they took. Import it without a glob:

```nu
use std/bench
```

## Timing one closure

`bench` runs the closure 50 times with [`timeit`](/commands/docs/timeit.md) and returns a record with the `mean`, `min`, `max` and standard deviation (`std`) of the times. `--rounds` (`-n`) changes the number of runs:

```nu
bench { ls | length } --rounds 20 | describe
# => record<mean: duration, min: duration, max: duration, std: duration>
```

`--verbose` (`-v`) adds a `times` column with the duration of every run. `--pretty` (`-p`) returns the mean and standard deviation as a string such as `3µs 125ns +/- 2µs 408ns` instead of a record, and ignores `--verbose`.

The closure's output is discarded. An error in the closure stops `bench`, unless you pass `--ignore-errors` (`-i`), in which case the failed runs are timed like the others.

## Comparing closures

Give `bench` several closures to compare them. Each one gets the same number of rounds, one closure after the other, and the result is a table with one row per closure. The `code` column holds the closure's source, and `ratio` is its mean divided by the fastest mean, so the fastest closure has a ratio of `1`:

```nu
bench { 2 + 4 } { sleep 1ms } --rounds 10 | columns
# => ╭───┬───────╮
# => │ 0 │ code  │
# => │ 1 │ mean  │
# => │ 2 │ min   │
# => │ 3 │ max   │
# => │ 4 │ std   │
# => │ 5 │ ratio │
# => ╰───┴───────╯
```

The `code` text is syntax-highlighted, so it contains ANSI color codes. Remove them with [`ansi strip`](/commands/docs/ansi_strip.md) before you save the table to a file.

With `--pretty`, `bench` prints a report instead of returning the table. The report lists each closure's mean and standard deviation and then how many times faster the fastest closure was than each of the others.

## Setup and teardown

- `--setup` (`-s`) takes a closure that runs once, before any timing, and `--cleanup` (`-c`) one that runs once at the end.
- `--prepare` (`-S`) takes a closure that runs before each round, and `--conclude` (`-C`) one that runs after each round. Neither is included in the time. With several closures to compare, both receive the position of the closure being timed, starting at `0`, as their parameter and as their input, so they can prepare differently for each one.
- `--warmup` (`-w`) runs each closure that many times before the timed rounds, without timing them. Use it to fill disk caches for a command that reads files. `--prepare` and `--conclude` run around the warm-up rounds too.

This example, adapted from the command's help, times five clean builds of a Rust project. `--prepare` removes the old build before each round:

```nu
bench { cargo build --release } --prepare { cargo clean } --rounds 5
```

## Progress

`--progress` (`-P`) prints the round being run, such as `Benchmark: 7 / 50`, and overwrites the line as it goes.

Independently of that flag, `bench` writes an OSC 9;4 escape sequence to standard output every 10 rounds and one more when it finishes. Terminals that support the sequence, such as Windows Terminal, show it as a progress bar, for example in the tab or the taskbar. Most terminals that don't support it ignore it. When standard output is redirected, the sequences end up in the redirected output.
