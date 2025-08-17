---
home: true
heroImage: null
heroText: Nushell
tagline: 一种新的 Shell
actionText: 点此了解更多 →
actionLink: /zh-CN/book/
features:
  - title: 利用管道控制任意系统
    details: Nu 可以在 Linux、macOS、BSD 和 Windows 上运行。一次学习，处处可用。
  - title: 一切皆数据
    details: Nu 管道使用结构化数据，你可以用同样的方式安全地选择，过滤和排序。停止解析字符串，开始解决问题。
  - title: 强大的插件系统
    details: 具备强大的插件系统，Nu 可以轻松扩展。
---

<img src="https://www.nushell.sh/frontpage/ls-example.png" alt="Screenshot showing using the ls command" class="hero"/>

### Nu 可以与现有数据一起工作

Nu 开箱即用支持 [JSON、YAML、SQLite、Excel 等](/zh-CN/book/loading_data.md)。无论是文件、数据库还是网络 API 中的数据，都可以很容易地引入 Nu 管道：

<img src="https://www.nushell.sh/frontpage/fetch-example.png" alt="Screenshot showing fetch with a web API" class="hero"/>

### Nu 有很棒的错误反馈

Nu 在类型化的数据上操作，所以它能捕捉到其他 Shell 无法捕捉到的 Bug。当意外发生时，Nu 会告诉你确切的位置和原因：

<img src="https://www.nushell.sh/frontpage/miette-example.png" alt="Screenshot showing Nu catching a type error" class="hero"/>

## 获取 Nu

Nushell 可以通过 [你喜欢的软件包管理器](https://repology.org/project/nushell/versions) 来安装，可以下载 [二进制文件](https://github.com/nushell/nushell/releases)，可以在 [GitHub Action](https://github.com/marketplace/actions/setup-nu) 中使用，此外也可以以 [源码](https://github.com/nushell/nushell)方式获得。在此阅读 [详细的安装说明](/zh-CN/book/installation.md) 或直接开始：

#### macOS / Linux:

##### Homebrew

```shell
$ brew install nushell
```

##### Nix profile

```shell
$ nix profile install nixpkgs#nushell
```

#### Windows:

```powershell
# 安装到用户范围（默认）。
winget install nushell
# 系统范围安装（以管理员身份运行）。
winget install nushell --scope machine
```

完成安装后，输入 `nu` 来启动 Nu。

## 文档

- [入门](/zh-CN/book/getting_started.html) 指引您熟悉 Nushell
- [Nu 之异同](/zh-CN/book/coming_to_nu.html) 描述了 Nu 与其他语言和 Shell 的异同之处
- [Nu 基础](/zh-CN/book/nu_fundamentals.html) 是对 Nu 基础知识更详尽、更有条理的描述
- [Nu 编程](/zh-CN/book/programming_in_nu.html) 将 Nu 作为一门编程语言进行描述
- [作为 Shell 的 Nu](/zh-CN/book/nu_as_a_shell.html) 让你深入了解 Shell 环境中的交互功能和可配置性

## 社区

如果你有任何问题可以在 [Discord](https://discord.gg/NtAbbGn) 上找到我们。

您可以通过 [意见反馈](https://github.com/nushell/nushell.github.io/issues) 或者 [贡献 PR](https://github.com/nushell/nushell.github.io/pulls) 来帮助我们完善此网站。
