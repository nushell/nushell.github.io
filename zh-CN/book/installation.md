# 安装 Nu

有很多方法可以获取并使用 Nu。你可以从我们的 [发布页面](https://github.com/nushell/nushell/releases) 下载预编译的二进制文件，也可以 [使用你喜欢的软件包管理器](https://repology.org/project/nushell/versions)，或者从源码构建。

Nushell 的主要二进制文件被命名为 `nu`（或 Windows 下的 `nu.exe`）。安装完成后你可以通过输入 `nu` 来启动它：

@[code](@snippets/installation/run_nu.sh)

[[toc]]

## 预编译二进制包

Nu 二进制文件在 [GitHub 的 Release 页](https://github.com/nushell/nushell/releases) 发布，适用于 Linux、macOS 和 Windows。只需下载并解压二进制文件，然后将其复制到你的系统 `PATH` 上的某个位置即可。

## 软件包管理器

Nu 可以通过几个软件包管理器获得：

[![打包状态](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

对于 macOS 和 Linux，[Homebrew](https://brew.sh/) 是一个流行的选择（`brew install nushell`）。

对于 Windows：

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/)

  - 机器范围安装: `winget install nushell --scope machine`
  - 机器范围升级: `winget update nushell`
  - 用户范围安装: `winget install nushell` or `winget install nushell --scope user`
  - 用户范围升级: 由于 [winget-cli 问题 #3011](https://github.com/microsoft/winget-cli/issues/3011)，运行 `winget update nushell` 会意外地将最新版本安装到 `C:\Program Files\nu`。要解决此问题，请再次运行 `winget install nushell` 以在用户范围内安装最新版本。

- [Chocolatey](https://chocolatey.org/) (`choco install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

对于 Debian 和 Ubuntu：

```sh
curl -fsSL https://apt.fury.io/nushell/gpg.key | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/fury-nushell.gpg
echo "deb https://apt.fury.io/nushell/ /" | sudo tee /etc/apt/sources.list.d/fury.list
sudo apt update
sudo apt install nushell
```

对于 RedHat/Fedora 和 Rocky Linux：

```sh
echo "[gemfury-nushell]
name=Gemfury Nushell Repo
baseurl=https://yum.fury.io/nushell/
enabled=1
gpgcheck=0
gpgkey=https://yum.fury.io/nushell/gpg.key" | sudo tee /etc/yum.repos.d/fury-nushell.repo
sudo dnf install -y nushell
```

对于 Alpine Linux：

```sh
echo "https://alpine.fury.io/nushell/" | tee -a /etc/apk/repositories
apk update
apk add --allow-untrusted nushell
```

跨平台安装：

- [npm](https://www.npmjs.com/) (`npm install -g nushell` 请注意，以这种方式安装，nu 插件是不包含在内的)

## Docker 容器镜像

Docker 镜像可从 GitHub 容器注册表获得。最新版本的镜像会定期为 Alpine 和 Debian 构建。
你可以使用以下命令以交互模式运行镜像：

```nu
docker run -it --rm ghcr.io/nushell/nushell:<version>-<distro>
```

其中 `<version>` 是你想要运行的 Nushell 版本，`<distro>` 是 `alpine` 或最新的受支持的 Debian 版本，例如 `bookworm`。

要运行特定命令，请使用：

```nu
docker run --rm ghcr.io/nushell/nushell:latest-alpine -c "ls /usr/bin | where size > 10KiB"
```

要使用 Bash 从当前目录运行脚本，请使用：

```nu
docker run --rm \
    -v $(pwd):/work \
    ghcr.io/nushell/nushell:latest-alpine \
    "/work/script.nu"
```

## 从源码构建

你也可以从源代码构建 `Nu`。首先，你需要设置 Rust 工具链和它的依赖项。

### 安装编译器套件

为了使 Rust 能够正常工作，你需要在你的系统上安装一个兼容的编译器套件。以下是推荐的编译器套件：

- Linux：GCC 或 Clang
- macOS：Clang（安装 Xcode）
- Windows：MSVC（安装 [Visual Studio](https://visualstudio.microsoft.com/vs/community/) 或 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022))
  - 请确保安装 "用 C++ 进行桌面开发" 相关包
  - 任何 Visual Studio 版本都可以（社区版是免费的）

### 安装 Rust

如果我们的系统中还没有 Rust，最好的方法是通过 [rustup](https://rustup.rs/) 来安装它。Rustup 是一种管理 Rust 安装的工具，可以管理使用不同的 Rust 版本。

Nu 目前需要 **最新（1.66.1 或更高）的稳定** 版本的 Rust。最好的方法是让 `rustup` 为你找到正确的版本。当你第一次打开 `rustup` 时，它会询问你想安装哪个版本的 Rust：

@[code](@snippets/installation/rustup_choose_rust_version.sh)

一旦我们准备好了，我们就按 `1`，然后回车。

如果你不愿意通过 `rustup` 来安装 Rust，你也可以通过其他方法来安装它（比如从 Linux 发行版的软件包中）。只要确保安装 1.66.1 或更高版本的 Rust 即可。

### 依赖

#### Debian/Ubuntu

你将需要安装 "pkg-config"、"build-essential" 和 "libssl-dev" 包：

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### 基于 RHEL 的发行版

你需要安装 "libxcb"、"openssl-devel" 和 "libX11-devel"：

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

##### Homebrew

使用 [Homebrew](https://brew.sh/)，你需要通过如下方式安装 "openssl" 和 "cmake" ：

@[code](@snippets/installation/macos_deps.sh)

##### Nix

如果在 macOS 上使用 [Nix](https://nixos.org/download/#nix-install-macos) 进行包管理，则需要 `openssl`、`cmake`、`pkg-config` 和 `curl` 包。这些可以通过以下方式安装：

- 全局安装，使用 `nix-env --install`（以及其他方式）。
- 本地安装，在你的 `home.nix` 配置中使用 [Home Manager](https://github.com/nix-community/home-manager)。
- 临时安装，使用 `nix-shell`（以及其他方式）。

### 使用 [crates.io](https://crates.io) 和 Cargo 构建

Nu 发行版会作为源码发布到流行的 Rust 包仓库 [crates.io](https://crates.io/)。这使得使用 `cargo` 构建并安装最新的 Nu 版本变得很容易：

```nu
cargo install nu --locked
```

`cargo` 工具将完成下载 Nu 及其源码依赖，构建并将其安装到 cargo bin 路径中。

请注意，使用 `cargo` 时，必须单独安装默认插件。有关说明，请参阅本书的[插件安装](./plugins.html#core-plugins)部分。

### 从 GitHub 仓库构建

我们也可以从 GitHub 上的最新源码构建自己的 Nu。这让我们可以立即获得最新的功能和错误修复。首先，克隆源码仓库：

@[code](@snippets/installation/git_clone_nu.sh)

然后，我们可以用以下方式构建和运行 Nu：

@[code](@snippets/installation/build_nu_from_source.sh)

你也可以在**发布**模式下构建和运行 Nu，以获得更多的编译优化：

@[code](@snippets/installation/build_nu_from_source_release.sh)

熟悉 Rust 的人可能会问，如果 `run` 默认会构建，为什么我们还要做 `build` 和 `run` 这两个步骤？这是为了解决 Cargo 中新的 `default-run` 选项的缺陷，并确保所有插件都被构建，尽管这在将来可能不再需要。
