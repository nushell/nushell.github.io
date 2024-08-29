# Shells in Shells

## Working in Multiple Directories

While it's common to work in one directory, it can be handy to work in multiple places at the same time. For this, Nu offers the concept of "shells". As the name implies, they're a way of running multiple shells in one, allowing you to quickly jump between working directories and more.

To get started, let's enter a directory:

```nu
/home/sophia/Source/nushell(main)> enter ../book
/home/sophia/Source/book(main)> ls
────┬────────────────────┬──────┬────────┬─────────────
 #  │ name               │ type │ size   │ modified
────┼────────────────────┼──────┼────────┼─────────────
  0 │ 404.html           │ File │  429 B │ 2 hours ago
  1 │ CONTRIBUTING.md    │ File │  955 B │ 2 hours ago
  2 │ Gemfile            │ File │ 1.1 KB │ 2 hours ago
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 2 hours ago
```

Entering is similar to changing directories (as we saw with the [`cd`](/commands/docs/cd.md) command). This allows you to jump into a directory to work in it. Instead of changing the directory, we now are in two directories. To see this more clearly, we can use the [`shells`](/commands/docs/shells.md) command to list the current directories we have active:

```nu
/home/sophia/Source/book(main)> enter ../music
/home/sophia/Source/music(main)> shells
───┬────────┬─────────────────────────────
 # │ active │             path
───┼────────┼─────────────────────────────
 0 │ false  │ /home/sophia/Source/nushell
 1 │ false  │ /home/sophia/Source/book
 2 │ true   │ /home/sophia/Source/music
───┴────────┴─────────────────────────────
```

The [`shells`](/commands/docs/shells.md) command shows us there are three shells: our original "nushell" source directory, "book" directory and "music" directory which is currently active.

We can jump between these shells with the [`n`](/commands/docs/n.md), [`p`](/commands/docs/p.md) and [`g`](/commands/docs/g.md) shortcuts, short for "next", "previous" and "goto":

```nu
/home/sophia/Source/music(main)> p
/home/sophia/Source/book(main)> n
/home/sophia/Source/music(main)> g 0
/home/sophia/Source/nushell(main)>
```

We can see the directory changing, but we're always able to get back to a previous directory we were working on. This allows us to work in multiple directories in the same session.

## Exiting the Shell

You can leave a shell you have [`enter`](/commands/docs/enter.md)ed using the `dexit` command.

You can always quit Nu, even if multiple shells are active, using `exit`.
