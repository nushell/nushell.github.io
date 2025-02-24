# 插件

Nu 可以通过插件进行扩展。插件的行为与 Nu 的内置命令很相似，另外的好处是它们可以与 Nu 本身分开添加。

Nu 的插件是可执行的；Nu 在需要时启动它们，并通过 [stdin, stdout 和 stderr](https://en.wikipedia.org/wiki/Standard_streams) 与它们进行通信。Nu 的插件可以使用 JSON 或 [Cap'n Proto](https://capnproto.org/) 作为它们的通信编码方式。

## 添加一个插件

要添加一个插件，请调用[`plugin add`](/commands/docs/plugin_add.md)命令来告诉 Nu 在哪里可以找到它，与此同时，你还需要告诉 Nushell 这个插件使用什么方式进行编码。

Linux+macOS:

```nu
plugin add --encoding=capnp ./my_plugins/my-cool-plugin
```

Windows:

```nu
plugin add --encoding=capnp .\my_plugins\my-cool-plugin.exe
```

当 [`plugin add`](/commands/docs/plugin_add.md) 被调用时：

1. Nu 启动该插件并通过 stdin 向其发送 "签名" 信息；
2. 插件通过 stdout 响应，包含其签名（名称、描述、参数、标志等）的消息；
3. Nu 将插件的签名保存在`$nu.plugin-path`位置的文件中，因此在注册之后的多次启动中都是有效的；

一旦注册，该插件就可以作为你的命令集的一部分被使用：

```nu
help commands | where is_plugin == true
```

## 示例

Nu 的主版本中包含了一些插件的例子，这些例子对学习插件协议的工作方式很有帮助：

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)

## 调试

调试插件的最简单方法是打印到 stderr；插件的标准错误流会通过 Nu 重定向并显示给用户。

## 帮助

Nu 的插件文档尚在撰写中，如果你对某件事情不确定 [Nu Discord](https://discord.gg/NtAbbGn)上的 #plugins 频道是一个提问的好地方!
