# 安装 Nu

目前最佳的获取 Nu 的方法是从 [crates.io](https://crates.io) 安装，到我们的 [发布页](https://github.com/nushell/nushell/releases) 下载预编译二进制包，从源代码构建，或者拉取一个预构建的 Docker 容器。

## 预编译二进制包

你可以从 [发布页](https://github.com/nushell/nushell/releases) 下载预编译的二进制包。作为替代，如果你在 macOS 上使用 [Homebrew](https://brew.sh/) ，你可以通过运行 `brew install nushell` 来下载此二进制文件。

### Windows

**请注意：** Nu 只在 Windows 10 上工作，目前不提供 Windows 7/8.1 的支持。

从 [发布页](https://github.com/nushell/nushell/releases) 下载当前发行版的 `.zip` 文件，然后将它解压到一个地方，例如：

```
C:\Program Files
```

然后，将 `nu` 所在的这个文件夹添加到 PATH 环境变量中。一旦你完成了这些步骤，就可以通过 `nu` 命令来运行 Nu 了。

```
> nu
C:\Users\user>
```

如果你在使用 PowerShell 上的 [scoop](https://scoop.sh) 作为软件包管理器，那么我们在 main 仓库中就提供了 Nu 的显彰，可以直接运行命令 `scoop install nu` 来安装。

如果你在使用新的 [Windows Terminal](https://github.com/microsoft/terminal) 你可以将 `nu` 设为默认 Shell 程序，将

```json
{
  "guid": "{2b372ca1-1ee2-403d-a839-6d63077ad871}",
  "hidden": false,
  "name": "Nu Shell",
  "commandline": "nu.exe"
}
```

添加到 Terminal 的 `"profiles"` 配置文件（JSON 文件）中。最后一步是更改 `"defaultProfile"` 为:

```json
"defaultProfile": "{2b372ca1-1ee2-403d-a839-6d63077ad871}",
```

现在， `nu` 将在 Windows Terminal 的启动时加载。

## 预构建 Docker 容器

如果你想要拉取一个预构建的容器，你可以在 Quay.io 上浏览 [nushell organization](https://quay.io/organization/nushell)
标签。拉取容器可以通过：

```bash
$ docker pull quay.io/nushell/nu
$ docker pull quay.io/nushell/nu-base
```

"nu-base" 和 "nu" 都提供了 `nu` 二进制文件，但是 nu-base 还包含了容器和所有依赖在 `/code` 目录下的源代码。

可选地，你可以使用 [dockerfiles provided](https://github.com/nushell/nushell/tree/master/docker) 来自行构建容器。
构建基本容器：

```bash
$ docker build -f docker/Dockerfile.nu-base -t nushell/nu-base .
```

构建一个更小的容器（使用多阶段构建）：

```bash
$ docker build -f docker/Dockerfile -t nushell/nu .
```

你可以用以下命令运行其中一个容器：

```bash
$ docker run -it nushell/nu-base
$ docker run -it nushell/nu
/> exit
```

如果尺寸对你很重要的话，第二个容器要小得多。

## 准备就绪

在我们开始安装 Nu 之前，我们需要确认我们的系统拥有必要的依赖。目前，这意味着我们需要确保安装了 Rust 工具链和本地依赖项。

### 安装编译套装

为了使 Rust 正常工作，你需要在系统上安装兼容的编译器套件。 这些是推荐的编译器套件：

- Linux: GCC or Clang
- macOS: Clang (install Xcode)
- Windows: [Visual Studio 社区版](https://visualstudio.microsoft.com/vs/community/)

对于 Linux 和 macOS，一旦你安装了这些编译器，你就可以准备通过 `rustup` （见后文） 来安装 Rust 了。

对于 Windows，当你安装了 Visual Studio 社区版，确保安装了可选的 "C++ build tools" 工作负载为我们提供所需的 `link.exe`。然后我们才可以进入下一步。

### 安装 Rust

如果我们还没有在系统上安装 Rust，则最佳方法是通过 [rustup](https://rustup.rs) 来安装。Rustup 是一个管理 Rust 安装，包括多版本多工具链安装的环境管理器。

Nu 目前需要 **最近的稳定版（1.43 或更新）** 的 Rust。最好让 `rustup` 来为你找到正确的版本。当你第一次运行 rustup ，它将会询问你要安装的 Rust 版本：

```
Current installation options:

default host triple: x86_64-unknown-linux-gnu
default toolchain: stable
profile: default
modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
```

一旦我们准备好了，按下 1 然后回车。

如果你不喜欢用 `rustup` 来安装，你也可以通过其他方法（例如 Linxu 发行版的包管理器）。只要确保 Rust 版本在 1.39 以上就好。

## 依赖

### Debian/Ubuntu

你需要安装 "pkg-config" 和 "libssl-dev" 包：

```
apt install pkg-config libssl-dev
```

希望使用 `rawkey` 或 `clipboard` 两个可选特性的 Linux 用户需要安装 "libx11-dev" 和 "libxcb-composite0-dev" 包：

```
apt install libxcb-composite0-dev libx11-dev
```

### RHEL

你需要安装 "libxcb", "libssl-dev" 和 "lib11-dev"。

### macOS

使用 [Homebrew](https://brew.sh/)，你需要安装 "openssl" 和 "cmake"：

```
brew install openssl cmake
```

## 从 [crates.io](https://crates.io) 安装

一旦我们拥有了 Nu 所需的依赖项，我们可以通过 Rust 编译器套件提供的 `cargo` 命令来安装它：

```
> cargo install nu
```

就这样！cargo 将会自动地下载和编译 Nu 与他的依赖，然后将它安装到 cargo bin 路径下，因此我们可以直接运行它。

如果你想要在安装时启用更多的特性，只需要：

```
> cargo install nu --features=stable
```

要启用所有可用的特性，最简单的方法是检出 Nu 的源代码，然后自行编译它：

```
> git clone https://github.com/nushell/nushell.git
> cd nushell
nushell> cargo install --path . --force --features=stable
```

在这个步骤，确保你系统里拥有上述所有依赖：

一旦安装成功，我们可以通过 `nu` 命令来运行 Nu：

```
$ nu
/home/jonathan/Source>
```

## 从源代码构建

我们也可以从 github 直接下载 Nu 的源代码来构建。这可以让我们立刻接触到 Nu 最新的特性和 BUG 修复。

```
> git clone https://github.com/nushell/nushell.git
```

Git 将会为我们克隆 nushell 的主仓库。然后，我们可以使用 `rustup` 来构建并运行 Nu：

```
> cd nushell
nushell> cargo build --workspace --features=stable && cargo run --features=stable
```

我们同样可以以 release 模式编译 Nu：

```
nushell> cargo build --release --workspace --features=stable && cargo run --release --features=stable
```

熟悉 Rust 的人们应该想知道，为什么我们在能够通过 "run" 直接进行构建并运行的情况下仍使用 "build" 和 "run" 两个步骤。这是为了避免 Cargo 中新的 `default-run` 选项的缺点，并且确保所有的插件都构建了，尽管它们可能在未来并没有用到。

## 设为你的登录 Shell

**!!! Nu 仍然在开发中，对于日常使用可能并不稳定。!!!**

为了设置登录 Shell，你可以使用 [`chsh`](https://linux.die.net/man/1/chsh) 命令。
一些 Linux 发行版在 `/etc/shells` 文件内保存可用的 Shell 们，并且不允许改变 Shell 除非 Nu 在这个白名单中。如果你没有更新 `shells` 文件，你可能会看到一个类似于以下内容的报错：

```
chsh: /home/username/.cargo/bin/nu is an invalid shell
```

你可以将 Nu 的路径添加到 `shells` 文件的末尾，绝对路径可以通过 `which nu` 来获取，通常为 `$HOME/.cargo/bin/nu`。
