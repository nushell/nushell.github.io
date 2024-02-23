---
title: Introducing nushell
author: Jonathan Turner
author_site: https://twitter.com/jntrnr
author_image: https://www.nushell.sh/blog/images/jonathandturner.jpg
description: Today, we're introducing a new shell, written in Rust. It draws inspiration from the classic Unix philosophy of pipelines, the structured data approach of PowerShell, functional programming, systems programming, and more.
---

Today, we're introducing a new shell, written in Rust. It draws inspiration from the classic Unix philosophy of pipelines, the structured data approach of PowerShell, functional programming, systems programming, and more.

It's called Nushell, or just Nu for short. We have a [book](https://book.nushell.sh/en) (¡también se habla [Español](https://book.nushell.sh/es)!). We have a [repo](https://github.com/nushell/nushell).

This release was made by Jonathan Turner (me), Yehuda Katz, and Andrés Robalino, with contributions from Odin Dutton.

![Nu in action](/assets/images/nushell-autocomplete4.gif)

## But why?

Many of us have gotten used to bash (or zsh/fish/etc), and don't understand why you would need another kind of shell. That was me, too, a few months ago before I started working on this. My friend Yehuda had discovered PowerShell and was going on and on about how amazing it was to do more with the shell, but until he actually gave me a demo, I didn't really believe him.

Then he talked me into joining him on an idea he had. What if we could take the ideas of a structured shell and make it more functional (as opposed to object-oriented)? What if, like PowerShell, it worked on Windows, Linux, and macOS? What if it had great error messages? I fell in love with the project ideas, made a few new friends, and many nights and weekends later I'd like to show you what we've made.

In this post, I'll talk about how a few simple ideas drive how Nu works, what Nu can do with them, and where we hope to go in the future.

## Simple ideas

To Nu, everything is data. When you type `ls`, you're given a table of information about the directory you're listing:

![ls command](/assets/images/nu_ls.png)

Rather than having to remember different flags to `ls`, we can just work with the data it gives back. We can find the files greater than a certain size:

![ls with filtering](/assets/images/nu_ls_filter.png)

Or we could choose to sort it by a column, or only show directories, or more. That by itself is fun but perhaps not compelling enough.

![ps with filtering](/assets/images/nu_ps_filter.png)

Where this simple concept - that everything in Nu is data - starts to shine when we try other commands and realize that we're using the same commands to filter, to sort, etc. Rather than having the need to remember all the parameters to all the commands, we can just use the same verbs to act over our data, regardless of where the data came from. Nu pushes this idea even further.

![opening toml file](/assets/images/open_cargo.png)

Nu also understands structured text files like JSON, TOML, YAML, and more. Opening these files gives us the same tables we saw with `ls` and `ps`. Again, this lets us use the same commands to filter our data, explore it, and use it.

## Working with the outside world

The above approach could be fun, but if we're not careful, it could become a walled garden. What happens outside of the commands Nu comes with?

First, let's take a look at working with a file that Nu doesn't understand.

```nu
> open people.psv
Octavia | Butler | Writer
Bob | Ross | Painter
Antonio | Vivaldi | Composer
```

To work with this in Nu, we need to do two steps: figure out where the rows are, and then figure out what the columns are. The rows are pretty easy, we just have one record per row:

```nu
> open people.psv | lines
---+------------------------------
 # | value
---+------------------------------
 0 | Octavia | Butler | Writer
 1 | Bob | Ross | Painter
 2 | Antonio | Vivaldi | Composer
---+------------------------------
```

Next, we can create our columns by splitting each row at the pipe (`|`) symbol:

```nu
> open people.psv | lines | split-column "|"
---+----------+-----------+-----------
 # | Column1  | Column2   | Column3
---+----------+-----------+-----------
 0 | Octavia  |  Butler   |  Writer
 1 | Bob      |  Ross     |  Painter
 2 | Antonio  |  Vivaldi  |  Composer
---+----------+-----------+-----------
```

That's already good enough that we can work with the data. We can go a step further and name the columns if we want:

```nu
> open people.psv | lines | split-column " | " firstname lastname job
---+-----------+----------+----------
 # | firstname | lastname | job
---+-----------+----------+----------
 0 | Octavia   | Butler   | Writer
 1 | Bob       | Ross     | Painter
 2 | Antonio   | Vivaldi  | Composer
---+-----------+----------+----------
```

But what about working with commands outside of Nu? Let's first call the native version of `ls` instead of the Nu version:

```nu
> ^ls
assets	     Cargo.lock  docs	images	 Makefile.toml	README.md     rustfmt2.toml  src     tests
Cargo2.toml  Cargo.toml  extra	LICENSE  open		readonly.txt  rustfmt.toml   target
```

We'll use the same commands we used on data to bring it into Nu:

```nu
^ls | split-row " " file
----+---------------
 #  | value
----+---------------
 0  | assets
 1  | Cargo2.toml
 2  | Cargo.lock
 3  | Cargo.toml
 4  | docs
 5  | extra
 6  | images
 7  | LICENSE
 8  | Makefile.toml
 9  | open
 10 | README.md
 11 | readonly.txt
 12 | rustfmt2.toml
 13 | rustfmt.toml
 14 | src
 15 | target
 16 | tests
----+---------------
```

Or maybe we want to work with the native `ls -la`:

```nu
^ls -la | lines | split-column " "
----+------------+---------+----------+----------+---------+---------+---------+---------+---------------
 #  | Column1    | Column2 | Column3  | Column4  | Column5 | Column6 | Column7 | Column8 | Column9
----+------------+---------+----------+----------+---------+---------+---------+---------+---------------
 0  | total      | 296     |          |          |         |         |         |         |
 1  | drwxr-xr-x | 13      | jonathan | jonathan | 4096    | Aug     | 24      | 03:24   | .
 2  | drwxr-xr-x | 21      | jonathan | jonathan | 4096    | Aug     | 22      | 17:00   | ..
 3  | drwxr-xr-x | 2       | jonathan | jonathan | 4096    | Aug     | 3       | 05:39   | assets
 4  | drwxr-xr-x | 2       | jonathan | jonathan | 4096    | Aug     | 21      | 19:29   | .azure
 5  | drwxr-xr-x | 2       | jonathan | jonathan | 4096    | Jun     | 23      | 05:09   | .cargo
 6  | -rw-r--r-- | 1       | jonathan | jonathan | 2963    | Aug     | 22      | 20:17   | Cargo2.toml
 7  | -rw-r--r-- | 1       | jonathan | jonathan | 201255  | Aug     | 24      | 03:24   | Cargo.lock
 8  | -rw-r--r-- | 1       | jonathan | jonathan | 3127    | Aug     | 24      | 03:24   | Cargo.toml
 9  | drwxr-xr-x | 2       | jonathan | jonathan | 4096    | Jun     | 17      | 15:32   | docs
 10 | -rw-r--r-- | 1       | jonathan | jonathan | 148     | Jun     | 17      | 15:32   | .editorconfig
 11 | drwxr-xr-x | 4       | jonathan | jonathan | 4096    | Aug     | 22      | 19:29   | extra
 12 | drwxr-xr-x | 8       | jonathan | jonathan | 4096    | Aug     | 24      | 03:24   | .git
 13 | -rw-r--r-- | 1       | jonathan | jonathan | 58      | Aug     | 10      | 11:08   | .gitignore
 14 | drwxr-xr-x | 2       | jonathan | jonathan | 4096    | Aug     | 24      | 03:24   | images
 15 | -rw-r--r-- | 1       | jonathan | jonathan | 1085    | Jun     | 17      | 15:32   | LICENSE
 16 | -rw-r--r-- | 1       | jonathan | jonathan | 614     | Jun     | 17      | 15:32   | Makefile.toml
 17 | -rw-r--r-- | 1       | jonathan | jonathan | 0       | Aug     | 23      | 04:58   | open
 18 | -rw-r--r-- | 1       | jonathan | jonathan | 11375   | Aug     | 24      | 03:24   | README.md
 19 | -r--r--r-- | 1       | jonathan | jonathan | 0       | Jul     | 4       | 03:51   | readonly.txt
 20 | -rw-r--r-- | 1       | jonathan | jonathan | 37      | Aug     | 23      | 04:54   | rustfmt2.toml
 21 | -rw-r--r-- | 1       | jonathan | jonathan | 16      | Aug     | 1       | 19:45   | rustfmt.toml
 22 | drwxr-xr-x | 10      | jonathan | jonathan | 4096    | Aug     | 24      | 03:24   | src
 23 | drwxr-xr-x | 4       | jonathan | jonathan | 4096    | Aug     | 22      | 19:22   | target
 24 | drwxr-xr-x | 4       | jonathan | jonathan | 4096    | Aug     | 22      | 04:15   | tests
 25 | drwxrwxr-x | 2       | jonathan | jonathan | 4096    | Jul     | 19      | 15:18   | .vscode
----+------------+---------+----------+----------+---------+---------+---------+---------+---------------
```

After a bit of experimenting, we might come up with a command like this:

```nu
> ^ls -la | lines | skip 1 | split-column " " perms files group user size month day time name
----+------------+-------+----------+----------+--------+-------+-----+-------+---------------
 #  | perms      | files | group    | user     | size   | month | day | time  | name
----+------------+-------+----------+----------+--------+-------+-----+-------+---------------
 0  | drwxr-xr-x | 13    | jonathan | jonathan | 4096   | Aug   | 24  | 03:24 | .
 1  | drwxr-xr-x | 21    | jonathan | jonathan | 4096   | Aug   | 22  | 17:00 | ..
 2  | drwxr-xr-x | 2     | jonathan | jonathan | 4096   | Aug   | 3   | 05:39 | assets
 3  | drwxr-xr-x | 2     | jonathan | jonathan | 4096   | Aug   | 21  | 19:29 | .azure
 4  | drwxr-xr-x | 2     | jonathan | jonathan | 4096   | Jun   | 23  | 05:09 | .cargo
 5  | -rw-r--r-- | 1     | jonathan | jonathan | 2963   | Aug   | 22  | 20:17 | Cargo2.toml
 6  | -rw-r--r-- | 1     | jonathan | jonathan | 201255 | Aug   | 24  | 03:24 | Cargo.lock
 7  | -rw-r--r-- | 1     | jonathan | jonathan | 3127   | Aug   | 24  | 03:24 | Cargo.toml
 8  | drwxr-xr-x | 2     | jonathan | jonathan | 4096   | Jun   | 17  | 15:32 | docs
 9  | -rw-r--r-- | 1     | jonathan | jonathan | 148    | Jun   | 17  | 15:32 | .editorconfig
 10 | drwxr-xr-x | 4     | jonathan | jonathan | 4096   | Aug   | 22  | 19:29 | extra
 11 | drwxr-xr-x | 8     | jonathan | jonathan | 4096   | Aug   | 24  | 03:24 | .git
 12 | -rw-r--r-- | 1     | jonathan | jonathan | 58     | Aug   | 10  | 11:08 | .gitignore
 13 | drwxr-xr-x | 2     | jonathan | jonathan | 4096   | Aug   | 24  | 03:24 | images
 14 | -rw-r--r-- | 1     | jonathan | jonathan | 1085   | Jun   | 17  | 15:32 | LICENSE
 15 | -rw-r--r-- | 1     | jonathan | jonathan | 614    | Jun   | 17  | 15:32 | Makefile.toml
 16 | -rw-r--r-- | 1     | jonathan | jonathan | 0      | Aug   | 23  | 04:58 | open
 17 | -rw-r--r-- | 1     | jonathan | jonathan | 11375  | Aug   | 24  | 03:24 | README.md
 18 | -r--r--r-- | 1     | jonathan | jonathan | 0      | Jul   | 4   | 03:51 | readonly.txt
 19 | -rw-r--r-- | 1     | jonathan | jonathan | 37     | Aug   | 23  | 04:54 | rustfmt2.toml
 20 | -rw-r--r-- | 1     | jonathan | jonathan | 16     | Aug   | 1   | 19:45 | rustfmt.toml
 21 | drwxr-xr-x | 10    | jonathan | jonathan | 4096   | Aug   | 24  | 03:24 | src
 22 | drwxr-xr-x | 4     | jonathan | jonathan | 4096   | Aug   | 22  | 19:22 | target
 23 | drwxr-xr-x | 4     | jonathan | jonathan | 4096   | Aug   | 22  | 04:15 | tests
 24 | drwxrwxr-x | 2     | jonathan | jonathan | 4096   | Jul   | 19  | 15:18 | .vscode
----+------------+-------+----------+----------+--------+-------+-----+-------+---------------
```

Because Nu let's you manipulate your data until it's how you want it, there's a feeling of playing with your data. You get used to using the verbs, and then you can use them on anything. When you're ready, you can write it back to disk.

Oh, before I forget - I wanted to quickly show how to get data from Nu back out into the outside world. Here's an example of calling `echo` on each filename in a directory:

```nu
> ls | get name | echo $it
```

You can see that we can mix-and-match commands that are inside of Nu with those that are outside, and data will still flow between them as expected. But Nu is more than just a pipeline.

## More than a pipeline

As we built Nu, we realized we could experiment with other parts of how a shell works. The first of these experiments lead us to an observation: if everything is data in Nu, we should be able to view this data.

![viewing source file](/assets/images/view_source.png)

We've seen the tables. Nu also supports opening and looking at text and binary data. If we open a source file, we can scroll around in a syntax-highlighted file. If we open an xml, we can look at its data. We can even open a binary file and look at what's inside (hint: there's even a fun easter egg if you open certain kinds binary files, especially if you've installed Nu with the optional `rawkey` feature).

Being able to view data is helpful, and this kind of polish extends to other aspects, like error messages:

![simple error](/assets/images/nu_error2.png)

Nu takes heavy inspiration from the [error messages in Rust](https://blog.rust-lang.org/2016/08/10/Shape-of-errors-to-come). As much as possible, draw your eyes to the problem.

Combined with the pipeline, some pretty interesting errors are possible:

![error with metadata](/assets/images/nu_error_metadata.png)

You might wonder how does that even work. Nu has a metadata system (still early!) that you can read about in the [Metadata chapter](https://book.nushell.sh/en/metadata) of the [Nu book](https://book.nushell.sh). Let's just take a quick peek at it:

```nu
> open Cargo.toml
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object]
------------+--------------+------------------+----------+----------
> open Cargo.toml | tags
----------+------------------------------------------
 span     | origin
----------+------------------------------------------
 [object] | /home/jonathan/Source/nushell/Cargo.toml
----------+------------------------------------------
```

Data that flows through the pipeline gets a set of additional metadata tagged to it. We can use this later to figure out how to display the contents, show a better error message, and more.

## Shells, plural

Let's say you're in a directory, but you'd really like to flip back and forth between it and one or two others. You could open up multiple tabs, multiple terminals, if you're on a Unix system you could use "screen", and probably even more than that. What if the shells were just built in?

In Nu, we can `enter` a directory, which adds it to a ring of shells we can bounce between:

```nu
> enter ../rhai/
/home/jonathan/Source/rhai(master)> shells
---+---+------------+-------------------------------
 # |   | name       | path
---+---+------------+-------------------------------
 0 |   | filesystem | /home/jonathan/Source/nushell
 1 | X | filesystem | /home/jonathan/Source/rhai
---+---+------------+-------------------------------
```

Using `n` and `p` we can jump back and forth between the shells. `exit` gets us out of a shell.

You might noticed that `name` column in the `shells` table. Why's that there? Oh no... oh yes.

```nu
> enter Cargo.toml
/> shells
---+---+--------------------------------------------+-------------------------------
 # |   | name                                       | path
---+---+--------------------------------------------+-------------------------------
 0 |   | filesystem                                 | /home/jonathan/Source/nushell
 1 |   | filesystem                                 | /home/jonathan/Source/rhai
 2 | X | {/home/jonathan/Source/nushell/Cargo.toml} | /
---+---+--------------------------------------------+-------------------------------
```

That's right, we're in the file. Can we `cd`? Oh yes, we can:

```nu
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object]
------------+--------------+------------------+----------+----------
/> cd bin
/bin> ls
----+----------------------+---------------------------
 #  | name                 | path
----+----------------------+---------------------------
 0  | nu_plugin_inc        | src/plugins/inc.rs
 1  | nu_plugin_sum        | src/plugins/sum.rs
 2  | nu_plugin_add        | src/plugins/add.rs
 3  | nu_plugin_edit       | src/plugins/edit.rs
 4  | nu_plugin_str        | src/plugins/str.rs
 5  | nu_plugin_skip       | src/plugins/skip.rs
 6  | nu_plugin_sys        | src/plugins/sys.rs
 7  | nu_plugin_tree       | src/plugins/tree.rs
 8  | nu_plugin_binaryview | src/plugins/binaryview.rs
 9  | nu_plugin_textview   | src/plugins/textview.rs
 10 | nu                   | src/main.rs
----+----------------------+---------------------------
```

## Plugins

Nu can't come with everything you might want to do with it, so we're releasing Nu with the ability to extend it with plugins. There's more information in the [plugins chapters](https://www.nushell.sh/book/plugins). Nu will look for these plugins in your path, and load them up on startup.

## All because of Rust

Nu would not have been possible without Rust. Internally, it uses async/await, async streams, and liberal use of "serde" to manage serializing and deserializing into the common data format and to communicate with plugins.

We also heavily leveraged [crates.io](https://crates.io). The ability to load numerous file formats, display messages, draw tables, and more all came from the hundreds (thousands?) of generous developers who wrote the crates we use in Nu. A **huge** thank you to everyone who contributed to Nu without ever knowing it.

## What's next?

Nu is just getting started. In this release, we have a foundation to build on. Next, we'll work towards stability, the ability to use Nu as your main shell, the ability to write functions and scripts in Nu, and much more.

If you want to give it a spin, the [installation instructions](https://book.nushell.sh/en/installation) will help you get started. If you want to chat come by our [discord](https://discord.gg/NtAbbGn) and [github](https://github.com/nushell/nushell)
