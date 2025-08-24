# 介绍

你好！欢迎来到 Nushell 项目。
这个项目的目标是继承 Unix Shell 中用管道把简单的命令连接在一起的理念，并将其带到更具现代风格的开发中。
因此，Nushell 不是一个纯粹的 shell 或编程语言，而是通过将一种丰富的编程语言和功能齐全的 shell 结合到一个软件包中，实现了二者的连接。

Nu 汲取了很多常见领域的灵感：传统 Shell 比如 Bash、基于对象的 Shell 比如 PowerShell、逐步类型化的语言比如 TypeScript、函数式编程、系统编程，等等。
但是，Nu 并不试图成为万金油，而是把精力集中在做好这几件事上：

- 作为一个具有现代感的灵活的跨平台 Shell
- 作为一种现代的编程语言，解决与数据有关的问题
- 给予清晰的错误信息和干净的 IDE 支持

## 本书内容

本书分为章节，每个章节又分为多个小节。
你可以点击章节标题获取更多信息。

- [安装](installation.md)，帮助你把 Nushell 安装到系统中。
- [入门指南](getting_started.md) 向你展示基本用法。它还解释了一些 Nushell 与典型 Shell（如 Bash）不同的设计原则。
- [Nu 基础](nu_fundamentals.md) 解释了 Nushell 语言的基本概念。
- [Nu 编程](programming_in_nu.md) 更深入地探讨语言特性，并展示几种组织和构建代码的方法。
- [Nu 作为 Shell](nu_as_a_shell.md) 专注于 Shell 功能，特别是配置和环境。
- [从其他环境迁移到 Nu](coming_to_nu.md) 旨在为来自其他 Shell 或语言的用户提供快速入门。
- [设计说明](design_notes.md) 深入解释了 Nushell 的一些设计选择。
- [（不那么）高级](advanced.md) 包括一些更高级的主题（它们并不是那么高级，一定要去看看！）。

## Nushell 的多个组成部分

Nushell 项目由多个不同的仓库和子项目组成。
你可以在 [GitHub 上的组织](https://github.com/nushell) 中找到它们。

- 主要的 Nushell 仓库可以在[这里](https://github.com/nushell/nushell)找到。它被分成多个 crate，如果你愿意，可以在你自己的项目中作为独立库使用。
- 我们的 [nushell.sh](https://www.nushell.sh) 页面（包括本书）的仓库可以在[这里](https://github.com/nushell/nushell.github.io)找到。
- Nushell 有自己的行编辑器，[它有自己的仓库](https://github.com/nushell/reedline)
- [`nu_scripts`](https://github.com/nushell/nu_scripts) 是一个与其他用户分享脚本和模块的地方，直到我们有某种包管理器。
- [Nana](https://github.com/nushell/nana) 是一个实验性的努力，探索 Nushell 的图形用户界面。
- [Awesome Nu](https://github.com/nushell/awesome-nu) 包含与 Nushell 生态系统配合使用的工具列表：插件、脚本、编辑器扩展、第三方集成等。
- [Nu 展示](https://github.com/nushell/showcase) 是一个分享关于 Nushell 的作品的地方，无论是博客、艺术作品还是其他东西。
- [请求评论 (RFC)](https://github.com/nushell/rfcs) 作为提出和讨论主要设计变更的地方。虽然目前利用不足，但我们预计在接近和超过 1.0 版本时会更多地使用它。

## 贡献

我们欢迎贡献！
[正如你所见](#nushell-的多个组成部分)，有很多地方可以贡献。
大多数仓库都包含 `CONTRIBUTING.md` 文件，其中包含提示和细节，应该能帮助你入门（如果没有，考虑贡献一个修复！）。

Nushell 本身是用 [Rust](https://www.rust-lang.org) 编写的。
然而，你不必是 Rust 程序员也能提供帮助。
如果你了解一些 web 开发，你可以为改进这个网站或 Nana 项目做出贡献。
[数据框](dataframes.md) 可以利用你的数据处理专业知识。

如果你写了一个很酷的脚本、插件或将 Nushell 集成到某处，我们欢迎你为 `nu_scripts` 或 Awesome Nu 做出贡献。
发现带有重现步骤的 bug 并为它们提交 GitHub issue 也是一种有价值的帮助！
仅仅通过使用 Nushell，你就可以为 Nushell 做出贡献！

由于 Nushell 发展迅速，本书不断需要更新。
为本书做出贡献不需要任何特殊技能，只需要对 Markdown 有基本的熟悉。
此外，你可以考虑将其部分翻译成你的语言。

## 社区

讨论任何 Nushell 的主要地方是我们的 [Discord](https://discord.com/invite/NtAbbGn)。
你也可以关注我们的 [博客](https://www.nushell.sh/blog) 获取新闻和更新。
最后，你可以使用 GitHub 讨论或提交 GitHub issue。
