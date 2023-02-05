---
title: Help
---

# Help

A good way to become familiar with all that nu has to offer is by utilizing the `help` command.

### How to see all supported commands:

```shell
> help commands | where command_type != builtin | first 10 | drop column 2
```

Output

```
───┬─────────────────────┬──────────┬──────────────┬───────────────────────────────────────────────────────────────────────
 # │        name         │ category │ command_type │                                 usage                                 
───┼─────────────────────┼──────────┼──────────────┼───────────────────────────────────────────────────────────────────────
 0 │ alias               │ core     │ keyword      │ Alias a command (with optional flags) to a new name                   
 1 │ break               │ core     │ keyword      │ Break a loop                                                          
 2 │ continue            │ core     │ keyword      │ Continue a loop from the next iteration                               
 3 │ create_left_prompt  │ default  │ custom       │                                                                       
 4 │ create_right_prompt │ default  │ custom       │                                                                       
 5 │ def                 │ core     │ keyword      │ Define a custom command                                               
 6 │ def-env             │ core     │ keyword      │ Define a custom command, which participates in the caller environment 
 7 │ export              │ core     │ keyword      │ Export definitions or environment variables from a module.            
 8 │ export alias        │ core     │ keyword      │ Define an alias and export it from a module                           
 9 │ export def          │ core     │ keyword      │ Define a custom command and export it from a module                   
───┴─────────────────────┴──────────┴──────────────┴───────────────────────────────────────────────────────────────────────
```

---

### Specific information on a command

To find more specific information on a command, use `help <COMMAND>`.

```shell
> help http get
```

Output

```
Fetch the contents from a URL.

Performs HTTP GET operation.

Search terms: network, fetch, pull, request, download, curl, wget

Usage:
  > http get {flags} <URL>

Flags:
  -h, --help - Display the help message for this command
  -u, --user <Any> - the username when authenticating
  -p, --password <Any> - the password when authenticating
  -t, --timeout <Int> - timeout period in seconds
  -H, --headers <Any> - custom headers you want to add
  -r, --raw - fetch contents as text rather than a table

Signatures:
  <nothing> | http get <string> -> <any>

Parameters:
  URL <string>: the URL to fetch the contents from

Examples:
  http get content from example.com
  > http get https://www.example.com

  http get content from example.com, with username and password
  > http get -u myuser -p mypass https://www.example.com

  http get content from example.com, with custom header
  > http get -H [my-header-key my-header-value] https://www.example.com
```

---

### Specific information on a command subcommand

To find more specific information on a command subcommand, use `help <COMMAND> <SUBCOMMAND>`.

```shell
> help str reverse
```

Output

```
outputs the reversals of the strings in the pipeline

Usage:
  > str reverse ...(rest)

Flags:
  -h, --help
      Display this help message

Parameters:
  ...rest: optionally reverse text by column paths

Examples:
  Return the reversals of multiple strings
  > 'Nushell' | str reverse
```
