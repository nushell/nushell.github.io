# Parallelism

Nushell now has early support for running code in parallel. This allows you to process elements of a stream using more hardware resources of your computer.

You will notice these commands with their characteristic `par-` naming. Each corresponds to a non-parallel version, allowing you to easily write code in a serial style first, and then go back and easily convert serial scripts into parallel scripts with a few extra characters.

## par-each

The most common parallel command is `par-each`, a companion to the `each` command.

Like `each`, `par-each` works on each element in the pipeline as it comes in, running a block on each. Unlike `each`, `par-each` will do these operations in parallel.

Let's say you wanted to count the number of files in each sub-directory of the current directory. Using `each`, you could write this as:

```
> ls | where type == dir | each { |it| {name: $it.name, len: (ls $it.name | length) } }
```

We create a record for each entry, and fill it with the name of the directory and the count of entries in that sub-directory.

On your machine, the times may vary. For this machine, it took 21 milliseconds for the current directory.

Now, since this operation can be run in parallel, let's convert the above to paralle by changing `each` to `par-each`:

```
> ls | where type == dir | par-each { |it| {name: $it.name, len: (ls $it.name | length) } }
```

On this machine, it now runs in 6ms. That's quite a difference!

You'll notice, if you look at the results, that they come back in different orders each run (depending on the number of hardware threads on your system). As tasks finish, and we get the correct result, we may need to additional steps if we want our results in a particular order. For example, for the above, we may want to sort the results by the "name" field. This allows both `each` and `par-each` versions of our script to give the same result.
