---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Nushell
---

Hello, and welcome to the Nushell project. The goal of this project is to take the Unix philosophy of shells, where pipes connect simple commands together, and bring it to the modern style of development.

# Philosophy

Nu draws inspiration from projects like PowerShell, functional programming languages, and modern CLI tools. Rather than thinking of files and services as raw streams of text, Nu looks at each input as something with structure. For example, when you list the contents of a directory, what you get back is a table of rows, where each row represents an item in that directory. These values can be piped through a series of steps, in a series of commands called a 'pipeline'.

![Example of nushell](https://www.nushell.sh/images/nushell-autocomplete.gif "Example of nushell")

## Pipelines

In Unix, it's common to pipe between commands to split up a sophisticated command over multiple steps. Nu takes this a step further and builds heavily on the idea of _pipelines_. Just as the Unix philosophy, Nu allows commands to output from stdout and read from stdin. Additionally, commands can output structured data (you can think of this as a third kind of stream). Commands that work in the pipeline fit into one of three categories:

* Commands that produce a stream (eg, `ls`)
* Commands that filter a stream (eg, `where type == "Directory"`)
* Commands that consume the output of the pipeline (eg, `autoview`)

Commands are separated by the pipe symbol (`|`) to denote a pipeline flowing left to right.

```shell
/home/jonathan/Source/nushell(master)> ls | where type == "Directory" | autoview
────┬───────────────┬───────────┬────────┬──────────────┬───────────────┬───────────────
 #  │ name          │ type      │ size   │ created      │ accessed      │ modified
────┼───────────────┼───────────┼────────┼──────────────┼───────────────┼───────────────
  0 │ .azure        │ Directory │   —    │ 6 months ago │ 3 days ago    │ 3 days ago
  1 │ .cargo        │ Directory │   —    │ 7 months ago │ a month ago   │ a month ago
  2 │ .circleci     │ Directory │   —    │ 4 months ago │ 3 months ago  │ 3 months ago
  3 │ .git          │ Directory │ 4.1 KB │ 7 months ago │ 7 minutes ago │ 7 minutes ago
  4 │ .github       │ Directory │   —    │ 3 months ago │ 2 months ago  │ 2 months ago
  5 │ .vscode       │ Directory │   —    │ 2 months ago │ 2 months ago  │ 2 months ago
  6 │ assets        │ Directory │   —    │ 5 months ago │ 5 months ago  │ 5 months ago
  7 │ crates        │ Directory │ 8.2 KB │ a month ago  │ a week ago    │ a week ago
────┴───────────────┴───────────┴────────┴──────────────┴───────────────┴───────────────
```

Because most of the time you'll want to see the output of a pipeline, `autoview` is assumed. We could have also written the above:

```
/home/jonathan/Source/nushell(master)> ls | where type == Directory
```

Being able to use the same commands and compose them differently is an important philosophy in Nu. For example, we could use the built-in `ps` command as well to get a list of the running processes, using the same `where` as above.

```shell
/home/jonathan/Source/nushell(master)> ps | where cpu > 0
───┬───────┬─────────────────┬──────────┬──────────
 # │ pid   │ name            │ status   │ cpu
───┼───────┼─────────────────┼──────────┼──────────
 0 │   992 │ chrome          │ Sleeping │ 6.988768
 1 │  4240 │ chrome          │ Sleeping │ 5.645982
 2 │ 13973 │ qemu-system-x86 │ Sleeping │ 4.996551
 3 │ 15746 │ nu              │ Sleeping │ 84.59905
───┴───────┴─────────────────┴──────────┴───────────

```

## Opening files

Nu can load file and URL contents as raw text or as structured data (if it recognizes the format). For example, you can load a .toml file as structured data and explore it:

```shell
/home/jonathan/Source/nushell(master)> open Cargo.toml
──────────────────┬────────────────┬──────────────────
 bin              │ dependencies   │ dev-dependencies
──────────────────┼────────────────┼──────────────────
 [table: 12 rows] │ [table: 1 row] │ [table: 1 row]
──────────────────┴────────────────┴──────────────────
```

We can pipeline this into a command that gets the contents of one of the columns:

```shell
/home/jonathan/Source/nushell(master)> open Cargo.toml | get package
─────────────────┬────────────────────────────┬─────────┬─────────┬──────┬─────────
 authors         │ description                │ edition │ license │ name │ version
─────────────────┼────────────────────────────┼─────────┼─────────┼──────┼─────────
 [table: 3 rows] │ A shell for the GitHub era │ 2018    │ MIT     │ nu   │ 0.5.0
─────────────────┴────────────────────────────┴─────────┴─────────┴──────┴─────────
```

Finally, we can use commands outside of Nu once we have the data we want:

```
/home/jonathan/Source/nushell(master)> open Cargo.toml | get package.version | echo $it
0.5.0
```

Here we use the variable `$it` to refer to the value being piped to the external command.

## Shells

Nu will work inside of a single directory and allow you to navigate around your filesystem by default. Nu also offers a way of adding additional working directories that you can jump between, allowing you to work in multiple directories at the same time.

To do so, use the `enter` command, which will allow you create a new "shell" and enter it at the specified path. You can toggle between this new shell and the original shell with the `p` (for previous) and `n` (for next), allowing you to navigate around a ring buffer of shells. Once you're done with a shell, you can `exit` it and remove it from the ring buffer.

Finally, to get a list of all the current shells, you can use the `shells` command.

## Plugins

Nu supports plugins that offer additional functionality to the shell and follow the same structured data model that built-in commands use. This allows you to extend nu for your needs.

There are a few examples in the `plugins` directory.

Plugins are binaries that are available in your path and follow a `nu_plugin_*` naming convention. These binaries interact with nu via a simple JSON-RPC protocol where the command identifies itself and passes along its configuration, which then makes it available for use. If the plugin is a filter, data streams to it one element at a time, and it can stream data back in return via stdin/stdout. If the plugin is a sink, it is given the full vector of final data and is given free reign over stdin/stdout to use as it pleases.

# Goals

Nu adheres closely to a set of goals that make up its design philosophy. As features are added, they are checked against these goals.

* First and foremost, Nu is cross-platform. Commands and techniques should carry between platforms and offer first-class consistent support for Windows, macOS, and Linux.

* Nu ensures direct compatibility with existing platform-specific executables that make up people's workflows.

* Nu's workflow and tools should have the usability in day-to-day experience of using a shell in 2019 (and beyond).

* Nu views data as both structured and unstructured. It is a structured shell like PowerShell.

* Finally, Nu views data functionally. Rather than using mutation, pipelines act as a means to load, change, and save data without mutable state.
