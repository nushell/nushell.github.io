# Nu のインストール

今のところ Nu をインストールするもっともよい方法は、[crates.io](https://crates.io)からインストールするか、ビルド済のバイナリーを[リリースページ](https://github.com/nushell/nushell/releases)からダウンロードするか、ソースからビルドすることです。
Docker を利用してビルド済のコンテナをプルしてくる方法もあります。

## ビルド済みのバイナリー

ビルド済の Nu は[リリースページ](https://github.com/nushell/nushell/releases)からダウンロードできます。もし、macOS で[Homebrew](https://brew.sh/) を利用しているなら、`brew install nushell`を実行して、バイナリーをインストールできます。

## Windows

**Note** Nu は Windows 10 で動作しますが、現在のところ 7/8.1 はサポートされていません。

[リリースページ](https://github.com/nushell/nushell/releases)から`.zip`ファイルをダウンロードして、例えば次の箇所に解凍します。

<<< @/snippets/installation/windows_example_extraction_location.sh

そして、`nu`フォルダを PATH に追加します。これが済めば、`nu`コマンドで Nu を起動できます。

<<< @/snippets/installation/windows_run_nu.sh

もし、[Windows Terminal](https://github.com/microsoft/terminal)を使っているなら、次のようにして`nu`をデフォルトシェルに指定できます。

<<< @/snippets/installation/windows_terminal_default_shell.sh

この設定を Terminal Settings の`"profiles"`に追加します。そして、`"defaultProfile"`を次のように変更します。

<<< @/snippets/installation/windows_change_default_profile.sh

これで`nu`が Windows Terminal の起動時にロードされます。

## 事前準備

Nu をインストールする前に、システムに必要なツールがそろっているか確認する必要があります。現在、Rust のツールチェインといくつかの依存関係が必要です。

### コンパイラスイートのインストール

Rust が適切に機能するには、互換性のあるコンパイラスイートがシステムにインストールされている必要があります。推奨されるコンパイラスイートは次のとおりです。

- Linux: GCC or Clang
- macOS: Clang (install Xcode)
- Windows: [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/)

Linux と macOS の場合、コンパイラのインストールが完了すれば、`rustup`での Rust のインストールの準備が整います。

Windows の場合、Visual Studio Community Edition をインストールするときに、「C ++ビルドツール」をインストールする必要があります。
オプショナルなインストールとして提供されている`link.exe`が必要なためです。これで次のステップに進む準備ができました。

### Rust のインストール

Rust がシステムにまだインストールされていない場合は、[rustup](https://rustup.rs/)を利用して Rust をインストールする方法がベストです。Rustup は、異なる Rust のバージョンのインストールを管理するツールです。

Nu は現在、**最新の stable(1.46 or later)** バージョンの Rust を必要とします。
`rustup`で正しい version を選択するのが良い方法です。
最初に"rustup"を実行すると、インストールする Rust のバージョンを尋ねられます。

<<< @/snippets/installation/rustup_choose_rust_version.sh

準備ができたら、1 を押してからエンターを押します。

もし、`rustup`を経由して Rust をインストールしたくない場合、他の方法でもインストールすることができます。(例えば、Linux ディストリビューションのパッケージから)
その場合でも Rust の 1.46 以上のバージョンがインストールされるようにしてください。

## 依存関係

### Debian / Ubuntu

"pkg-config"および"libssl-dev"パッケージをインストールしてください。

<<< @/snippets/installation/install_pkg_config_libssl_dev.sh

`rawkey`や`clipboard`機能を使用する Linux ユーザーは"libx11-dev"および"libxcb-composite0-dev"パッケージをインストールする必要があります。

<<< @/snippets/installation/use_rawkey_and_clipboard.sh

### RHEL based distros

"libxcb", "openssl-devel"および"libX11-devel"パッケージをインストールする必要があります。

<<< @/snippets/installation/install_rhel_dependencies.sh

### macOS

[Homebrew](https://brew.sh/)を利用して、"openssl"と"cmake"をインストールしてください。

<<< @/snippets/installation/macos_deps.sh

## [crates.io](https://crates.io)からのインストール

必要となる依存関係が準備できたら、Rust コンパイラーに付属している`cargo`を使って、Nu をインストールできます。  
cargo は Nu とそのソースの依存関係をダウンロードし、ビルドしたあと、実行できるように cargo の bin path にインストールします。

<<< @/snippets/installation/cargo_install_nu.sh

これでおしまいです！`cargo`は Nu のソースコードとその依存関係をダウンロードしてビルドし、`cargo`のバイナリーパスにインストールすることで Nu を実行できるようにします。

より多くの機能をインストールするには、次のようにします。

<<< @/snippets/installation/cargo_install_nu_more_features.sh

すべての機能を利用するための最も簡単な方法は Nu をチェックアウトして、Rust ツールを利用してビルドすることです。

<<< @/snippets/installation/build_nu_yourself.sh

上で示したすべての依存関係がシステムにあることを確認してください。  
インストールが完了すると、`nu`コマンドで Nu を実行できます。

<<< @/snippets/installation/crates_run_nu.sh

## ソースからビルド

github のソースから直接ビルドすることもできます。こうすることで、最新の機能やバグ修正にすぐにアクセスすることができます。

<<< @/snippets/installation/git_clone_nu.sh

Git でメインの nushell リポジトリをクローンし、Nu をビルドして実行できます。

<<< @/snippets/installation/build_nu_from_source.sh

リリースモードで Nu をビルドし実行することもできます。

<<< @/snippets/installation/build_nu_from_source_release.sh

Rust に慣れている人は、"run"がデフォルトでビルドを行うのに、なぜ"build"と"run"の両方を行うのか疑問に思うかもしれません。  
これは Cargo の新しい`default-run`オプションの欠点を回避し、全てのプラグインがビルドされるようにするためですが、将来的には必要なくなるかもしれません。

## ログインシェルとして設定するには

**!!! Nu は開発中なので、日常使いのシェルとしての安定性を欠く可能性があります!!!**

[`chsh`](https://linux.die.net/man/1/chsh)コマンドを使用して、ログインシェルを設定できます。
一部の Linux ディストリビューションには`/etc/shells`に有効なシェルのリストが記載されており、Nu がホワイトリストに登録されるまで変更ができません。
`shells`ファイルを更新していない場合は次のようなエラーが表示される場合があります。

<<< @/snippets/installation/chsh_invalid_shell_error.sh

Nu バイナリを`shells`ファイルに追加することにより、許可されたシェルのリストに Nu を追加できます。
追加するパスは`which nu`コマンドで見つけることができます。通常は`$HOME/.cargo/bin/nu`です。
