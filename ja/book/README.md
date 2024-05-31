# はじめに

こんにちは、Nushellプロジェクトへようこそ。

このプロジェクトの目的は、Unixシェルの哲学を採用し、シンプルなコマンドをパイプでつなぐアイデアを現代の開発スタイルに適応させることです。
したがって、Nushell はシェルでもプログラミング言語でもなく、豊かなプログラミング言語とフル機能のシェルを一つのパッケージに統合したものなのです。

Nuは様々な馴染みのある要素からヒントを得ています：伝統的なシェル（例えばbash）、オブジェクトベースのシェル（PowerShellなど）、徐々に型付けされる言語（TypeScriptなど）、関数型プログラミング、システムプログラミングなど。

しかし、万能であるよりも、Nuはいくつかのことを上手に行うことに重点を置いています：

- モダンで柔軟なクロスプラットフォームシェルであること
- データの構造を利用して問題を解決する、モダンなプログラミング言語として機能すること
- 明確なエラーメッセージとクリーンなIDEサポートを提供すること

## この本について

この本はいくつかの章に分けられ、さらにセクション毎に分割されています。
章のヘッダーをクリックすると、その章についての詳細情報が得られます。

- [Getting Started](getting_started.md) では、Nushellのインストール方法と基本的な使い方を学びます。また、Nushellが典型的なシェル（例えばbash）と異なる設計原則についても説明します。
- [Nu Fundamentals](/book/nu_fundamentals.md) では、Nushell言語の基本概念について説明します。
- [Programming in Nu](/book/programming_in_nu.md) では、言語の機能をより深く掘り下げ、コードの組織化と構造化のさまざまな方法を紹介します。
- [Nu as a Shell](/book/nu_as_a_shell.md)はシェル機能に焦点を当て、特に設定と環境について詳しく説明します。
- [Coming to Nu](/book/coming_to_nu.md)は、他のシェルや言語から移行するユーザーに迅速なスタートを提供することを目的としています。
- [Design Notes](/book/design_notes.md)では、Nushellの設計上の選択について詳細な説明があります。
- [(Not So) Advanced](/book/advanced.md)には、少し高度なトピックが含まれています（それほど高度ではないので、ぜひチェックしてください！）。

## Nushellの全て

Nushellプロジェクトは、複数の異なるリポジトリやサブプロジェクトで構成されています。[our organization on GitHub](https://github.com/nushell)でそれらをすべて見つけることができます。

- メインのNushellリポジトリは[こちら](https://github.com/nushell/nushell)です。これは複数のクレートに分けられており、ご希望であれば独自のプロジェクトで独立したライブラリとして使用できます。
- 当社の[nushell.sh](https://github.com/nushell/nushell.github.io)ページとこの本のリポジトリは[こちら](https://github.com/nushell/nushell.github.io)です。
- Nushellは独自のラインエディタを持っており、[そのためのリポジトリ](https://github.com/nushell/reedline)があります。
- [`nu_scripts`](https://github.com/nushell/nu_scripts)は、パッケージマネージャーができるまでの間、他のユーザーとスクリプトやモジュールを共有する場所です。
- [Nana](https://github.com/nushell/nana) は、Nushellのグラフィカルユーザーインターフェースを探求する実験的な取り組みです。
- [Awesome Nu](https://github.com/nushell/awesome-nu) には、Nushellエコシステムで動作するツールのリストが含まれています：プラグイン、スクリプト、エディタ拡張、サードパーティの統合など。
- [Nu Showcase](https://github.com/nushell/showcase) は、Nushellに関する作品を共有する場所です。ブログ、アートワーク、その他。
- [Request for Comment (RFC)](https://github.com/nushell/rfcs) は、大きな設計変更を提案し議論するための場所として機能します。現在はあまり活用されていませんが、1.0に近づくにつれて、より多く使用されることを期待しています。

## 貢献

私たちは貢献を歓迎します！
[ご覧の通り](#the-many-parts-of-nushell)、貢献する場所はたくさんあります。
ほとんどのリポジトリには、貢献を始めるのに役立つヒントと詳細が含まれているCONTRIBUTING.mdファイルがあります。（もしなければ、修正を提案することも検討してください！）。

Nushell自体はRustで書かれています。
しかし、Rustプログラマーでなくても助けることができます。
Web開発を知っている場合は、このウェブサイトやNanaプロジェクトの改善に貢献できます。
Dataframesはあなたのデータ処理の専門知識を活用できます。

もし、クールなスクリプトやプラグインを書いたり、Nushellをどこかに統合したりした場合、nu_scriptsやAwesome Nuへの貢献を歓迎します。
バグを発見し、それに対する再現ステップを提供し、GitHubのイシューとして報告することも貴重な助けとなります。Nushellを使用するだけでも、Nushellに貢献していることになります！

Nushellは急速に進化しているため、この本は常に更新が必要です。
この本への貢献には、Markdownに精通していること以外に特別なスキルは必要ありません。
さらに、あなたの言語での部分的な翻訳もできます。

## コミュニティ

Nushellについて何か話し合う主な場所は、私たちの[Discord](https://discord.com/invite/NtAbbGn)です。
ニュースやアップデートについては、[Twitter](https://twitter.com/nu_shell) でフォローすることもできます。
最後に、GitHubのディスカッションを使用するか、GitHubのイシューを提出することもできます。
