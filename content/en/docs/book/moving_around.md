---
title: Navigation
description: Moving around your system with Nu
---

Early shells allow you to move around your filesystem and run commands, and modern shells like Nu allow you to do the same. Let's take a look at some of the common commands you might use when interacting with your system.

## Viewing directory contents

```
> ls
```

As we've seen in other chapters, `ls` is a command for viewing the contents of a path. Nu will return the contents as a table that we can use.

The `ls` command also takes an optional argument, to change what you'd like to view.  For example, we can list the files that end in ".txt"

```
> ls *.md
───┬────────────────────┬──────┬─────────┬────────────
 # │ name               │ type │ size    │ modified 
───┼────────────────────┼──────┼─────────┼────────────
 0 │ CODE_OF_CONDUCT.md │ File │  3.4 KB │ 5 days ago 
 1 │ CONTRIBUTING.md    │ File │   886 B │ 5 days ago 
 2 │ README.md          │ File │ 15.0 KB │ 5 days ago 
 3 │ TODO.md            │ File │  1.6 KB │ 5 days ago 
───┴────────────────────┴──────┴─────────┴────────────
```

The asterisk (\*) in the above optional argument "\*.md" is sometimes called a wildcard or a glob. It lets us match anything. You could read the glob "\*.md" as "match any filename, so long as it ends with '.md' "

Nu also uses modern globs as well, which allow you access to deeper directories.

```
 ls **/*.md
────┬───────────────────────────────────────────┬──────┬─────────┬────────────
 #  │ name                                      │ type │ size    │ modified 
────┼───────────────────────────────────────────┼──────┼─────────┼────────────
  0 │ .github/ISSUE_TEMPLATE/bug_report.md      │ File │   592 B │ 5 days ago 
  1 │ .github/ISSUE_TEMPLATE/feature_request.md │ File │   595 B │ 5 days ago 
  2 │ CODE_OF_CONDUCT.md                        │ File │  3.4 KB │ 5 days ago 
  3 │ CONTRIBUTING.md                           │ File │   886 B │ 5 days ago 
  4 │ README.md                                 │ File │ 15.0 KB │ 5 days ago 
  5 │ TODO.md                                   │ File │  1.6 KB │ 5 days ago 
  6 │ crates/nu-source/README.md                │ File │  1.7 KB │ 5 days ago 
  7 │ docker/packaging/README.md                │ File │  1.5 KB │ 5 days ago 
  8 │ docs/commands/README.md                   │ File │   929 B │ 5 days ago 
  9 │ docs/commands/alias.md                    │ File │  1.7 KB │ 5 days ago 
 10 │ docs/commands/append.md                   │ File │  1.4 KB │ 5 days ago
```
 
 Here we're looking for any file that ends with ".md", and the two asterisks further say "in any directory starting from here".

## Changing the current directory

```
> cd new_directory
```

To change from the current directory to a new one, we use the `cd` command. Just as in other shells, we can use either the name of the directory, or if we want to go up a directory we can use the `..` shortcut.

## Filesystem commands

Nu also provides some basic filesystem commands that works cross-platform. 

We can move an item from one place to another using the `mv` command:

```
> mv item location
```

We can copy an item from one location to another:

```
> cp item location
```

We can remove an item:

```
> rm item
```

The three commands also can use the glob capabilities we saw earlier with `ls`.

Finally, we can create a new directory using the `mkdir` command:

```
> mkdir new_directory
```

