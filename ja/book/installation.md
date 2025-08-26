# Nu のインストール

Nu を入手して実行するには多くの方法があります。[リリースページ](https://github.com/nushell/nushell/releases) からビルド済みのバイナリーをダウンロードすることもできますし、 [あなたの好きなパッケージマネージャーを使う](https://repology.org/project/nushell/versions) ことも、あるいはソースからビルドする方法もあります。

Nushell のメインのバイナリーは `nu` (Windowsでは `nu.exe`) という名前です。インストールが済めば、 `nu` と打って起動することができます。

@[code](@snippets/installation/run_nu.sh)

## ビルド済みのバイナリー

Linux、macOS、Windows向けのビルド済み Nu バイナリーはそれぞれの[GitHub リリース](https://github.com/nushell/nushell/releases)で提供されています。ダウンロードして、バイナリを解凍して、PATH の場所にそれらをコピーするだけです。

## パッケージマネージャー

Nu はいくつかのパッケージマネージャーで入手することができます。

[![Packaging status](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

macOS、Linuxでは、 [Homebrew](https://brew.sh/) が人気です (`brew install nushell`)。

Windowsでは:

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) (`winget install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

クロスプラットフォームのインストールとしては:

- [npm](https://www.npmjs.com/) (`npm install -g nushell` この方法でインストールした場合、 Nu プラグインは含まれないことに注意してください)

## ソースからビルドする

Nu をソースからビルドすることもできます。まず、 Rust のツールチェインと依存関係をセットアップする必要があります。

### コンパイラスイートのインストール

Rust を正しく動作させるためには、互換性のあるコンパイラスイートがシステムにインストールされている必要があります。推奨されるコンパイラスイートは以下のとおりです。

- Linux: GCC or Clang
- macOS: Clang (Xcode をインストール)
- Windows: MSVC ([Visual Studio](https://visualstudio.microsoft.com/vs/community/) または [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) をインストール)
  - "C++ によるデスクトップ開発" ワークロードを必ずインストールしてください。
  - どの Visual Studio エディションでも動作します(Community は無料です)。

### Rust のインストール

Rust がシステムにまだインストールされていない場合は、[rustup](https://rustup.rs/)を利用して Rust をインストールする方法がベストです。Rustup は、異なる Rust のバージョンのインストールを管理するツールです。

Nu は現在、 **最新の stable (1.66.1 or later)** バージョンの Rust を必要とします。
`rustup`で正しい version を選択するのが良い方法です。
最初に"rustup"を実行すると、インストールする Rust のバージョンを尋ねられます。

@[code](@snippets/installation/rustup_choose_rust_version.sh)

準備ができたら、1 を押してからエンターを押します。

もし、`rustup`を経由して Rust をインストールしたくない場合、他の方法でもインストールすることができます。(例えば、Linux ディストリビューションのパッケージから)。
その場合でも Rust の 1.66.1 以上のバージョンがインストールされるようにしてください。

### 依存関係

#### Debian/Ubuntu

"pkg-config"および"libssl-dev"パッケージをインストールしてください。

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### RHEL ベースのディストロ

"libxcb", "openssl-devel"および"libX11-devel"パッケージをインストールする必要があります。

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

[Homebrew](https://brew.sh/)を利用して、"openssl"と"cmake"をインストールしてください。

@[code](@snippets/installation/macos_deps.sh)

### [crates.io](https://crates.io) を利用してのビルド

Nu はソースの形で、Rust で人気のパッケージレジストリ [crates.io](https://crates.io/) にリリースされています。これにより、`cargo` を使って簡単に最新の Nu リリースをビルド、インストールすることができます。

@[code](@snippets/installation/cargo_install_nu.sh)

これでおしまいです！`cargo`は Nu のソースコードとその依存関係をダウンロードしてビルドし、`cargo`のバイナリーパスにインストールすることで Nu を実行できるようにします。

### GitHub リポジトリからのビルド

GitHub の最新のソースから直接ビルドすることもできます。こうすることで、最新の機能やバグ修正にすぐにアクセスすることができます。まず、リポジトリをクローンします。

@[code](@snippets/installation/git_clone_nu.sh)

これで、Nu をビルドして実行できます。

@[code](@snippets/installation/build_nu_from_source.sh)

さらに最適化されたリリースモードで Nu をビルドし実行することもできます。

@[code](@snippets/installation/build_nu_from_source_release.sh)

Rust に慣れている人は、"run"がデフォルトでビルドを行うのに、なぜ"build"と"run"の両方を行うのか疑問に思うかもしれません。
これは Cargo の新しい`default-run`オプションの欠点を回避し、全てのプラグインがビルドされるようにするためですが、将来的には必要なくなるかもしれません。
