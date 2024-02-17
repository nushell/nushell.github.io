---
title: クイックツアー
---

Nu で何ができるかを知るための最も簡単な方法は、例をいくつか見ることです。では始めましょう。

[`ls`](/commands/docs/ls.md) などのコマンドを実行してまず気づくことは、テキストブロックの代わりに構造化されたテーブルが返ってくることです。

@[code](@snippets/introduction/ls_example.sh)

このテーブルは、ただ別の形でディレクトリを表示しているだけではありません。スプレッドシートのように、このテーブルではデータをより対話的に扱うことができます。

はじめに、テーブルをサイズでソートしてみましょう。 [`ls`](/commands/docs/ls.md) の出力を取得し、カラムの値に基づいてテーブルをソートするコマンドに渡してみます。

@[code](@snippets/introduction/ls_sort_by_reverse_example.sh)

これをするのに、 [`ls`](/commands/docs/ls.md) にコマンドライン引数を渡してはいないことが確認できます。代わりに、 Nu が [`ls`](/commands/docs/ls.md) コマンドの出力をソートするために提供している [`sort-by`](/commands/docs/sort-by.md) コマンドを使用しています。また、最も大きいファイルが一番上に来るように、 [`reverse`](/commands/docs/reverse.md) も使用しています。

Nu はテーブルを操作するコマンドを多数提供しています。例えば、 [`where`](/commands/docs/where.md) を使用して [`ls`](/commands/docs/ls.md) テーブルのコンテンツをフィルターすることができるので、1キロバイトを超えるファイルのみを表示することができます。

@[code](@snippets/introduction/ls_where_example.sh)

Unix の哲学と同様、互いに対話可能なコマンドにより、さまざまな異なる組み合わせの使用が可能になります。では、別のコマンドを見てみましょう。

@[code](@snippets/introduction/ps_example.sh)

もし Linux を使用したことがあるなら、 [`ps`](/commands/docs/ps.md) コマンドは馴染みがあるでしょう。これを使用して、システム上で現在実行されている全てのプロセスのリストと、それらのステータス、名前を取得することができます。プロセスのCPU使用率を見ることもできます。

いま表示したいのは、CPUをたくさん使用しているプロセスですか？ [`ls`](/commands/docs/ls.md) コマンドで以前したのと同じように、 [`ps`](/commands/docs/ps.md) コマンドが返したテーブルに対しても操作することができます。

@[code](@snippets/introduction/ps_where_example.sh)

いま、[`ls`](/commands/docs/ls.md) と [`ps`](/commands/docs/ps.md) を使用してファイルとプロセスのリストを表示しました。Nu はほかにも有用な情報をもつテーブルを作成するコマンドを提供しています。次は、 [`date`](/commands/docs/date.md) と [`sys`](/commands/docs/sys.md) について見てみましょう。

[`date now`](/commands/docs/date_now.md) を実行すると、現在の日時に関する情報が得られます。

@[code](@snippets/introduction/date_example.sh)

テーブルとして取得したい場合は、これを [`date to-table`](/commands/docs/date_to-table.md) に渡します。

@[code](@snippets/introduction/date_table_example.sh)

[`sys`](/commands/docs/sys.md) を実行すると、 Nu が実行されているシステムに関する情報が得られます。

@[code](@snippets/introduction/sys_example.sh)

これはいままでに見たテーブルと少し異なります。 [`sys`](/commands/docs/sys.md) コマンドは、単純な値の代わりに構造化されたテーブルをセルに持つテーブルを返します。このデータを覗くには、カラムを _get_ する必要があります。

@[code](@snippets/introduction/sys_get_example.sh)

[`get`](/commands/docs/get.md) コマンドを使用すると、テーブルのカラムの内容にジャンプすることができます。この例では、 Nu が実行されているホストに関する情報が含まれる "host" カラムを見ています。OSの名前、ホスト名、CPUなどです。では、システム上に存在するユーザーの名前を取得してみましょう。

@[code](@snippets/introduction/sys_get_nested_example.sh)

いま、システムには "jt" という名前のユーザー一人だけがいます。ここで、ただのカラム名ではなく、カラムのパス（ `host.sessions.name` の部分）を渡していることに気づくでしょう。Nu はカラムのパスを受け取って、テーブル中の対応する部分に移動します。

もう一つ違いがあることに気づいたかもしれません。データのテーブルではなく、文字列 "jt" という、ただ一つの要素を受け取っています。Nu はデータのテーブルでも、文字列でも動作します。文字列は Nu の外部コマンドで作業する際の重要な役割を担います。

実際に Nu の外部での文字列の働きを見てみましょう。先程の例にならい、[`echo`](/commands/docs/echo.md) コマンド（ `^` は Nu に、ビルトインの [`echo`](/commands/docs/echo.md) コマンドを使用しないことを伝えます）を実行してみます

@[code](@snippets/introduction/sys_get_external_echo_example.sh)

これが前に試したものとよく似ているように見えるなら鋭いです！これは似ていますが、一つ重要な違いがあります。先程の値で `^echo` を呼び出しました。これで、データをNu から [`echo`](/commands/docs/echo.md) （あるいは `git` のような、あらゆる Nu の外部のコマンド）に渡すことができるのです。

### ヘルプの取得

Nu のビルトインコマンド全てのヘルプテキストは、 [`help`](/commands/docs/help.md) で見つけることができます。すべてのコマンドを見たい場合は、 [`help commands`](/commands/docs/help_commands.md) を実行してください。また、 `help -f <topic>` を実行すれば、あるトピックについて検索することもできます。

@[code](@snippets/introduction/help_example.sh)
