---
title: Help
---

# Help

A good way to become familiar with all that nu has to offer is by utilizing the `help` command.

### How to see all supported commands:

`help commands`

Output

```
━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 #  │ name        │ description
────┼─────────────┼──────────────────────────────────────────────────────────────────────────────
  0 │ append      │ Append the given row to the table
  1 │ autoview    │ View the contents of the pipeline as a table or list.
  2 │ average     │ Compute the average of a column of numerical values.
  3 │ binaryview  │ Autoview of binary data.
  4 │ cd          │ Change to a new path.
  5 │ clip        │ Copy the contents of the pipeline to the copy/paste buffer
  6 │ config      │ Configuration management.
  7 │ count       │ Show the total number of rows.
  8 │ cp          │ Copy files.
  9 │ date        │ Get the current datetime.
 10 │ debug       │ Debug input fed.
━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
### Specific information on a command

To find more specific information on a command, use `help <COMMAND>`.

`help fetch`

Output

```
Load from a URL into a cell, convert to table if possible (avoid by appending '--raw')

Usage:
  > fetch <path> {flags}

parameters:
  <path> the URL to fetch the contents from

flags:
  --raw: fetch contents as text rather than a table
  ```
