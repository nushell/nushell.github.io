---
title: config
layout: command
nu_version: 0.14
---

Configuration management.

Syntax: `config {flags}`

### Flags

{{< flag "" "load" >}}
Load the config from the path given
{{< /flag >}}
{{< flag "" "set" >}}
Set a value in the config
{{< /flag >}}
{{< flag "" "set_into" >}}
Sets a variable from values in the pipeline
{{< /flag >}}
{{< flag "" "get" >}}
Get a value from the config
{{< /flag >}}
{{< flag "" "remove" >}}
Remove a value from the config
{{< /flag >}}
{{< flag "" "clear" >}}
Clear the config
{{< /flag >}}
{{< flag "" "path" >}}
Return the path to the config file
{{< /flag >}}

### Variables

| Variable        | Type                   | Description                                                    |
| --------------- | ---------------------- | -------------------------------------------------------------- |
| path            | table of strings       | PATH to use to find binaries                                   |
| env             | row                    | the environment variables to pass to external commands         |
| ctrlc_exit      | boolean                | whether or not to exit Nu after multiple ctrl-c presses        |
| table_mode      | "light" or other       | enable lightweight or normal tables                            |
| edit_mode       | "vi" or "emacs"        | changes line editing to "vi" or "emacs" mode                   |
| key_timeout     | integer (milliseconds) | vi: the delay to wait for a longer key sequence after ESC      |
| completion_mode | "circular" or "list"   | changes completion type to "circular" (default) or "list" mode |

## Examples

```shell
> config --set [table_mode "light"]
```

A more detailed description on how to use this command to configure Nu shell can be found in the configuration chapter of [Nu Book](https://www.nushell.sh/book/en/configuration.html).
