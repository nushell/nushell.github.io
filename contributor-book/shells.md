---
title: Shells
---

# Shells

Perhaps a bit unique to Nu is the concept of `shells`, though the idea of working in multiple places at the same time in a shell is fairly common (via pushd/popd, screen, and more). What perhaps makes Nu a little different is that its `shells` concept is both multiple platform, and that it works both on the filesystem and inside of values.

**Note:** The concept of a Value Shell is one of the many open design points of Nu and is subject to change in the future.

A **Shell** is a filesystem-like interface that describes a set of common file operations and how to perform them, including: `cd`, `ls`, `mkdir`, `rm`, `cp`, and `mv`. Not all shell types support all file operations, but the file operations attempt to describe much of what a shell would want to perform.

The two types of Shells currently supported are FilesystemShell and ValueShell, though other shells have been discussed.

## Filesystem Shell

The filesystem shell is the shell that works directly with a filesystem and a corresponding paths. By default, Nu opens with a single filesystem shell in the current working directory.

```
> shells
━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━
   │ name       │ path
───┼────────────┼────────────────
 X │ filesystem │ /home/jonathan
━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━
```

We can add a new filesystem shell to this list by using the `enter` command. This will add a new shell+path combination to our ring buffer of shells.

```
> enter Source
/home/jonathan/Source> shells
━━━┯━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━
 # │   │ name       │ path
───┼───┼────────────┼───────────────────────
 0 │   │ filesystem │ /home/jonathan
 1 │ X │ filesystem │ /home/jonathan/Source
━━━┷━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━
```

In this way, you can support jumping between working directories. Note that currently Nu doesn't support jumping between running applications, only working directories.

**Limitations**

There are some limitations of the filesystem shell in its current state of development. One such limitation is that you can not easily add multiple new paths to the ring buffer at a time (for example: `enter $it`), as each new addition to the ring buffer will change the current directory. This limitation is not inherent in the design of the ring buffer and a future design may wish to separate `enter` from the changing of the current working directory.

## Value Shell

The Value Shell gives you the ability to explore the inside of a structured value by loading a file and treating its contents as if it were a filesystem. This allows you to explore this data through one of the shells in the ring buffer.

The current implementation of the Value Shell is limited to the read-only subset of file operations, namely: `cd` and `ls`. Future designs may wish to explore this further, but there are open design questions around mutating an `enter`ed file and how the rest of the environment observes these changes (e.g. what happens if you enter the file being used by `config`?)

In a Value Shell, the `cd` command changes the path that is being observed as the "current working directory" in the object, but in actuality is the field path. This means that the path "/abc/def" is the path "abc.def" outside of the Value Shell.
