# Shell 中的 Shell

## 在多个目录下工作

虽然在一个目录下工作很常见，但同时在多个路径工作也很方便。为此，Nu 提供了 "Shells" 的概念。顾名思义，它们是一种在一个 Shell 中运行多个 Shell 的方法，允许你在多个工作目录之间快速跳转。

作为开始，让我们进入一个目录：

```bash
/home/jonathant/Source/nushell(main)> enter ../book
/home/jonathant/Source/book(main)> ls
────┬────────────────────┬──────┬────────┬─────────────
 #  │ name               │ type │ size   │ modified
────┼────────────────────┼──────┼────────┼─────────────
  0 │ 404.html           │ File │  429 B │ 2 hours ago
  1 │ CONTRIBUTING.md    │ File │  955 B │ 2 hours ago
  2 │ Gemfile            │ File │ 1.1 KB │ 2 hours ago
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 2 hours ago
```

进入(`enter`)类似于改变目录（正如我们在`cd`命令中看到的那样）。这允许你跳入一个目录，在其中工作。我们现在是在两个目录中，而不是改变目录。为了更清楚地看到这一点，我们可以使用[`shells`](/commands/docs/shells.md)命令来列出我们当前的活动目录：

```bash
/home/jonathan/Source/book(main)> shells
───┬────────┬────────────┬─────────────────────────
 # │ active │    name    │          path
───┼────────┼────────────┼─────────────────────────
 0 │ false  │ filesystem │ /home/jt/Source/nushell
 1 │ true   │ filesystem │ /home/jt/Source/book
 2 │ false  │ filesystem │ /home/jt/Source/music
───┴────────┴────────────┴─────────────────────────

```

[`shells`](/commands/docs/shells.md)命令显示目前有三个 Shells 处于活动状态：我们最初的 "nushell" 源目录和现在的新 "book" 目录。

我们可以用 `n`, `p` 和 `g` 的快捷命令在这些 Shell 之间跳转，这是 "next"、"previous" 和 "go" 的缩写：

```
/home/jonathant/Source/book(main)> n
/home/jonathant/Source/nushell(main)> p
/home/jonathant/Source/book(main)> g 2
/home/jonathant/Source/music(main)>
```

我们可以看到目录在变化，但我们总是能够回到我们正在工作的前一个目录。这使我们能够在同一个会话的多个目录中工作。

## 退出 Shell

你可以使用 `exit` 命令离开一个你已经 "进入(`enter`)" 的 Shell。如果这是最后一个打开的 Shell，Nu 将退出。

你可以随时退出 Nu，即使有多个 Shell 处于活动状态，只需要在`exit`命令中传递`--now`标志。像这样：`exit --now`
