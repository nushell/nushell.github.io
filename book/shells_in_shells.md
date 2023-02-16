# Shells in shells

## Working in multiple directories

While it's common to work in one directory, it can be handy to work in multiple places at the same time. For this, Nu offers the concept of "shells". As the name implies, they're a way of running multiple shells in one, allowing you to quickly jump between working directories and more.

To get started, let's enter a directory:

```
/home/jonathant/Source/nushell(main)> enter ../book
/home/jonathant/Source/book(main)> ls
────┬────────────────────┬──────┬────────┬─────────────
 #  │ name               │ type │ size   │ modified
────┼────────────────────┼──────┼────────┼─────────────
  0 │ 404.html           │ File │  429 B │ 2 hours ago
  1 │ CONTRIBUTING.md    │ File │  955 B │ 2 hours ago
  2 │ Gemfile            │ File │ 1.1 KB │ 2 hours ago
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 2 hours ago
```

Entering is similar to changing directories (as we saw with the `cd` command). This allows you to jump into a directory to work in it. Instead of changing the directory, we now are in two directories. To see this more clearly, we can use the [`shells`](/commands/commands/shells.md) command to list the current directories we have active:

```
/home/jonathan/Source/book(main)> shells
───┬────────┬────────────┬─────────────────────────
 # │ active │    name    │          path
───┼────────┼────────────┼─────────────────────────
 0 │ false  │ filesystem │ /home/jt/Source/nushell
 1 │ true   │ filesystem │ /home/jt/Source/book
 2 │ false  │ filesystem │ /home/jt/Source/music
───┴────────┴────────────┴─────────────────────────

```

The [`shells`](/commands/commands/shells.md) command shows us there are three shells currently active: our original "nushell" source directory and now this new "book" directory.

We can jump between these shells with the `n`, `p` and `g` shortcuts, short for "next", "previous" and "goto":

```
/home/jonathant/Source/book(main)> n
/home/jonathant/Source/nushell(main)> p
/home/jonathant/Source/book(main)> g 2
/home/jonathant/Source/music(main)>
```

We can see the directory changing, but we're always able to get back to a previous directory we were working on. This allows us to work in multiple directories in the same session.

## Exiting the shell

You can leave a shell you have `enter`ed using the `exit` command. If this is the last open shell, Nu will quit.

You can always quit Nu, even if multiple shells are active by passing the `--now` flag to the exit command. Like so: `exit --now`
