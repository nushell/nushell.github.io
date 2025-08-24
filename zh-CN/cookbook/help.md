---
title: 帮助
---

# 帮助

`help` 命令是熟悉 Nu 所有功能的好方法。

### 如何查看所有支持的命令：

```nu
help commands
```

---

### 关于命令的具体信息

要查找有关命令的更具体信息，请使用 `help <COMMAND>`。这适用于常规命令（即 `http`）和子命令（即 `http get`）：

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

### 自定义帮助命令

如果您想更改 `help` 输出，可以亲自创建名为 `help` 的自定义命令，它也将用于所有 `--help` 调用。标准库中有一个这样的例子。

```nu
use std/help
```
