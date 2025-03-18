---
title: Help
---

# Help

The `help` command is a good way to become familiar with all that Nu has to offer.

### How to see all supported commands:

```nu
help commands
```

---

### Specific information on a command

To find more specific information on a command, use `help <COMMAND>`. This works for regular commands (i.e. `http`) and subcommands (i.e. `http get`):

```nu
help http get
# => Fetch the contents from a URL.
# => 
# => Performs HTTP GET operation.
# => 
# => Search terms: network, fetch, pull, request, download, curl, wget
# => 
# => Usage:
# =>   > http get {flags} <URL>
# => 
# => Flags:
# =>   -h, --help - Display the help message for this command
# =>   -u, --user <Any> - the username when authenticating
# =>   -p, --password <Any> - the password when authenticating
# =>   -t, --timeout <Int> - timeout period in seconds
# =>   -H, --headers <Any> - custom headers you want to add
# =>   -r, --raw - fetch contents as text rather than a table
# => 
# => Signatures:
# =>   <nothing> | http get <string> -> <any>
# => 
# => Parameters:
# =>   URL <string>: the URL to fetch the contents from
# => 
# => Examples:
# =>   http get content from example.com
# =>   > http get https://www.example.com
# => 
# =>   http get content from example.com, with username and password
# =>   > http get -u myuser -p mypass https://www.example.com
# => 
# =>   http get content from example.com, with custom header
# =>   > http get -H [my-header-key my-header-value] https://www.example.com
```
