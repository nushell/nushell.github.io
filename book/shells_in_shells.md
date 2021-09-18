# Shells in shells

## Working in multiple directories

While it's common to work in one directory, it can be handy to work in multiple places at the same time. For this, Nu offers the concept of "shells". As the name implies, they're a way of running multiple shells in one, allowing you to quickly jump between working directories and more.

To get started, let's enter a directory:

```
/home/jonathant/Source/nushell(master)> enter ../book
/home/jonathant/Source/book(master)> ls
────┬────────────────────┬──────┬────────┬─────────────
 #  │ name               │ type │ size   │ modified 
────┼────────────────────┼──────┼────────┼─────────────
  0 │ 404.html           │ File │  429 B │ 2 hours ago 
  1 │ CONTRIBUTING.md    │ File │  955 B │ 2 hours ago 
  2 │ Gemfile            │ File │ 1.1 KB │ 2 hours ago 
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 2 hours ago 
```

Entering is similar to changing directories (as we saw with the `cd` command). This allows you to jump into a directory to work in it. Instead of changing the directory, we now are in two directories. To see this more clearly, we can use the `shells` command to list the current directories we have active:

```
/home/jonathan/Source/book(master)> shells
───┬────────┬────────────┬─────────────────────────────────
 # │ active │ name       │ path
───┼────────┼────────────┼─────────────────────────────────
 0 │        │ filesystem │ /home/jonathant/Source/nushell/
 1 │ X      │ filesystem │ /home/jonathant/Source/book
 2 │        │ filesystem │ /home/jonathant/Source/music/
───┴────────┴────────────┴─────────────────────────────────
```

The `shells` command shows us there are three shells currently active: our original "nushell" source directory and now this new "book" directory.

We can jump between these shells with the `n`, `p` and `g` shortcuts, short for "next", "previous" and "goto":

```
/home/jonathant/Source/book(master)> n
/home/jonathant/Source/nushell(master)> p
/home/jonathant/Source/book(master)> g 2
/home/jonathant/Source/music(master)>
```

We can see the directory changing, but we're always able to get back to a previous directory we were working on. This allows us to work in multiple directories in the same session.

## Exiting the shell

You can leave a shell you have `enter`ed using the `exit` command. If this is the last open shell, Nu will quit.

You can always quit Nu, even if multiple shells are active by passing the `--now` flag to the exit command. Like so: `exit --now`

## Going beyond directories

Nu can also create shells from other things aside from paths in a filesystem. Let's say, for example, you're working with a large data set and don't want to lose your place inside of it.

To see how this works, let's do the following exercise. Currently, we list the [Nu plugins](plugins.md) we have developed in the "Cargo.toml" file. Let's say we just created a new plugin in the src/plugins directory called "doc.rs", and we're interested to know if it's listed in the "Cargo.toml" as well so that it can be compiled and installed correctly for Nu.

Let's `enter` the file "Cargo.toml" from Nu's source code:

```
/home/jonathant/Source/nushell(master)> enter Cargo.toml
/> ls
────────────────────┬───────────────────────────
 bin                │ [table 18 rows] 
 build-dependencies │ [row nu-build serde toml] 
 dependencies       │ [row 29 columns] 
 dev-dependencies   │ [row nu-test-support] 
 features           │ [row 19 columns] 
 package            │ [row 12 columns] 
 workspace          │ [row members] 
────────────────────┴───────────────────────────
```

For the moment we've only `enter`ed the file and we can see what's in it from the table `ls` gives back. If you pay close attention, this time we've entered a file format that Nu understands (.toml). Nu also projects the contents of the file in a filesystem-like so we can explore it as if it were a regular filesystem.

Before we continue, let's check the active shells:

```
> shells
───┬────────┬─────────────────────────────────────────────┬─────────────────────────────────
 # │ active │ name                                        │ path 
───┼────────┼─────────────────────────────────────────────┼─────────────────────────────────
 0 │        │ filesystem                                  │ /home/jonathant/Source/nushell/ 
 1 │ X      │ {/home/jonathant/Source/nushell/Cargo.toml} │ / 
───┴────────┴─────────────────────────────────────────────┴─────────────────────────────────
```

We can observe that we have two active shells and telling us we are currently inside of "Cargo.toml" with a default root path "/". Let's view the contents again:

```
/> ls
────────────────────┬───────────────────────────
 bin                │ [table 18 rows] 
 build-dependencies │ [row nu-build serde toml] 
 dependencies       │ [row 29 columns] 
 dev-dependencies   │ [row nu-test-support] 
 features           │ [row 19 columns] 
 package            │ [row 12 columns] 
 workspace          │ [row members] 
────────────────────┴───────────────────────────
```

What we're looking for might be inside of the "bin" column. So let's go into there:

```
> cd bin
/bin> ls
────┬─────────────────────────────┬────────────────────────────────────────────┬───────────────────
 #  │ name                        │ path                                       │ required-features 
────┼─────────────────────────────┼────────────────────────────────────────────┼───────────────────
  0 │ fail                        │ crates/nu-test-support/src/bins/fail.rs    │ [table 1 rows] 
  1 │ chop                        │ crates/nu-test-support/src/bins/chop.rs    │ [table 1 rows] 
  2 │ cococo                      │ crates/nu-test-support/src/bins/cococo.rs  │ [table 1 rows] 
  3 │ nonu                        │ crates/nu-test-support/src/bins/nonu.rs    │ [table 1 rows] 
  4 │ iecho                       │ crates/nu-test-support/src/bins/iecho.rs   │ [table 1 rows] 
  5 │ nu_plugin_core_textview     │ src/plugins/nu_plugin_core_textview.rs     │ [table 1 rows] 
```

From here, we can always jump back to the directory we were working in before using p (for previous).

```
/bin> p
```

Let's verify the shells again:

```
/home/jonathant/Source/nushell/(simple_list_view)> shells
───┬────────┬─────────────────────────────────────────────┬─────────────────────────────────
 # │ active │ name                                        │ path 
───┼────────┼─────────────────────────────────────────────┼─────────────────────────────────
 0 │ X      │ filesystem                                  │ /home/jonathant/Source/nushell/ 
 1 │        │ {/home/jonathant/Source/nushell/Cargo.toml} │ /bin 
───┴────────┴─────────────────────────────────────────────┴─────────────────────────────────


```

We are back at the directory we were working in before entering the file "Cargo.toml".
