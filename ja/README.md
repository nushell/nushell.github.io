---
home: true
heroImage: null
heroText: Nushell
tagline: 新しいタイプのシェル
actionText: 始める →
actionLink: /ja/book/
features:
  - title: あらゆるOSを制御するパイプライン
    details: Nuは、Linux、macOS、Windowsで動作します。一度身に付ければ、どこでも使えるようになります。
  - title: すべてはデータである
    details: Nuパイプラインは構造化されたデータを使用するため、毎回同じ方法で安全に選択、フィルタリング、ソートを行うことができます。文字列をパースするのをやめて、問題を解決しましょう。
  - title: 強力なプラグイン
    details: 強力なプラグインシステムを使って、Nuを簡単に拡張することができます。
---

<img src="https://www.nushell.sh/frontpage/ls-example.png" alt="Screenshot showing using the ls command" class="hero"/>

### Nu は既存のデータとの連携が可能

Nu はでは[JSON, YAML, XML, Excel and more](/book/loading_data.md)を標準サポートしています。ファイル、データベース、Web API など、どのようなデータでも簡単に Nu パイプラインに取り込むことができます。

<img src="https://www.nushell.sh/frontpage/fetch-example.png" alt="Screenshot showing fetch with a web API" class="hero"/>

### Nu のエラーメッセージは非常に分かりやすい

Nu は型付けされたデータを操作するので、他のシェルでは見つけられないバグを発見することができます。そして、壊れたときには、どこで、なぜ壊れたかを正確に教えてくれます。

<img src="https://www.nushell.sh/frontpage/miette-example.png" alt="Screenshot showing Nu catching a type error" class="hero"/>

## Nu をインストールする

Nushell は、[バイナリのダウンロード](https://github.com/nushell/nushell/releases)、[パッケージマネージャによるインストール](https://repology.org/project/nushell/versions)、[ソースコードによるインストール](https://github.com/nushell/nushell)を提供しています。 [詳細なインストール方法](/book/installation.md)を読むかもしくは、下記のようにインストールすることもできます。

#### macOS / Linux:

```sh
$ brew install nushell
```

#### Windows:

```powershell
$ winget install nushell
```

## Nu を Github Actions で利用する

Github Actions で `Nushell` を使うこともできます。 [`setup-nu`](https://github.com/marketplace/actions/setup-nu) が用意されているので、それを使ってください。

## コミュニティ

Nu に関する質問がある場合は[Discord](https://discord.gg/NtAbbGn)に参加してください！

サイトの改善には、[フィードバック](https://github.com/nushell/nushell.github.io/issues)や[PR](https://github.com/nushell/nushell.github.io/pulls)をお寄せください。
