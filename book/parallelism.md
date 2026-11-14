# Parallelism

Nushell can run code in parallel. This allows you to process elements of a stream using more hardware resources of your computer.

You will notice these commands with their characteristic `par-` naming. Each corresponds to a non-parallel version, allowing you to easily write code in a serial style first, and then go back and easily convert serial scripts into parallel scripts with a few extra characters.

## par-each

The most common parallel command is [`par-each`](/commands/docs/par-each.md), a companion to the [`each`](/commands/docs/each.md) command.

Like [`each`](/commands/docs/each.md), [`par-each`](/commands/docs/par-each.md) works on each element in the pipeline as it comes in, running a block on each. Unlike [`each`](/commands/docs/each.md), [`par-each`](/commands/docs/par-each.md) will do these operations in parallel.

Let's say you wanted to count the number of files in each sub-directory of the current directory. Using [`each`](/commands/docs/each.md), you could write this as:

```nu
ls | where type == dir | each { |row|
    { name: $row.name, len: (ls $row.name | length) }
}
```

We create a record for each entry, and fill it with the name of the directory and the count of entries in that sub-directory.

On your machine, the times may vary. For this machine, it took 21 milliseconds for the current directory.

Now, since this operation can be run in parallel, let's convert the above to parallel by changing [`each`](/commands/docs/each.md) to [`par-each`](/commands/docs/par-each.md):

```nu
ls | where type == dir | par-each { |row|
    { name: $row.name, len: (ls $row.name | length) }
}
```

On this machine, it now runs in 6ms. That's quite a difference!

As a side note: Because [environment variables are scoped](environment.md#scoping), you can use [`par-each`](/commands/docs/par-each.md) to work in multiple directories in parallel (notice the [`cd`](/commands/docs/cd.md) command):

```nu
ls | where type == dir | par-each { |row|
    { name: $row.name, len: (cd $row.name; ls | length) }
}
```

You'll notice, if you look at the results, that they come back in different orders each run (depending on the number of hardware threads on your system). As tasks finish, and we get the correct result, we may need to add additional steps if we want our results in a particular order. For example, for the above, we may want to sort the results by the "name" field. This allows both [`each`](/commands/docs/each.md) and [`par-each`](/commands/docs/par-each.md) versions of our script to give the same result.

Alternatively, `par-each --keep-order` (`-k`) returns the results in the same order as the input:

```nu
1..5 | par-each --keep-order {|x| $x * 2 }
# => ╭───┬────╮
# => │ 0 │  2 │
# => │ 1 │  4 │
# => │ 2 │  6 │
# => │ 3 │  8 │
# => │ 4 │ 10 │
# => ╰───┴────╯
```

Without `--keep-order`, each result streams out as soon as it is ready. With it, `par-each` holds every result until the last item is done and then returns them in order, so nothing comes out until the whole input has been processed. Avoid it on long or endless streams.

As with `each`, a closure that returns `null` produces no output for that item:

```nu
1..6 | par-each --keep-order {|x| if $x mod 2 == 0 { $x } }
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 4 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

By default, `par-each` uses as many threads as your machine has logical CPUs. `--threads` (`-t`) sets a different number. Each `par-each` call runs on its own pool of threads, separate from the ones other commands use. Nushell keeps the pool after the call finishes, and the next `par-each` that asks for the same number of threads reuses it instead of starting new ones. A `par-each` inside another `par-each`, or one that starts while another is still running, gets a new pool.

To run commands in the background while you continue to use the shell, see [Background Jobs](background_jobs.md).
