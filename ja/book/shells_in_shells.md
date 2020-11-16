# シェルの中のシェル

## 複数のディレクトリで作業する

ひとつのディレクトリで作業することが一般的ですが、同時に複数の場所で作業できれば便利です。このため、Nuは"shells"という概念を提供します。名前が示すとおり、これらは同じ場所で複数のシェルを実行する方法であり、作業ディレクトリ間をすばやく移動できたりします。

まずはじめに、ディレクトリを入力しましょう。

```
/home/jonathan/Source/lark(master)> enter ../lark
lark(master)> ls
----+----------------+-----------+----------+---------+---------------+---------------
 #  | name           | type      | readonly | size    | accessed      | modified
----+----------------+-----------+----------+---------+---------------+---------------
 0  | Cargo.toml     | File      |          | 2.2 KB  | 6 months ago  | 6 months ago
 1  | target         | Directory |          | 4.1 KB  | 10 months ago | 6 months ago
 2  | notes          | Directory |          | 4.1 KB  | 10 months ago | 6 months ago
```

`enter`はディレクトリの変更に似ています(`cd`コマンドでみたように)。これによりディレクトリにジャンプして作業することができます。ディレクトリを変更するかわりに、２つのディレクトリに移動しました。このことをより明確にするために、`shells`コマンドを実行して、アクティブな現在のディレクトリの一覧を表示してみましょう。

```
/home/jonathan/Source/lark(master)> shells
---+---+------------+-------------------------------
 # |   | name       | path
---+---+------------+-------------------------------
 0 |   | filesystem | /home/jonathan/Source/nushell
 1 | X | filesystem | /home/jonathan/Source/lark
---+---+------------+-------------------------------
```

`shells`コマンドは現在２つのシェルがアクティブであることを示しています。もともといた"nushell"のソースディレクトリと新しい"lark"ディレクトリです。

"next"と"previous"のショートカットである`n`と`p`を利用して、両者のシェルを行き来できます。

```
/home/jonathan/Source/lark(master)> n
/home/jonathan/Source/nushell(master)> p
/home/jonathan/Source/lark(master)>
```

ディレクトリを変更できることがわかります。そしていつでも元いた作業ディレクトリに戻ることができるのです。これにより、同じセッションにいながら複数のディレクトリで作業できます。

## シェルを終了する

`exit`コマンドを利用して`enter`したシェルを終了することができます。もし最後のシェルを終了したときはNuが終了します。

`exit --now`のように、`--now`フラグを`exit`コマンドに渡すことで、複数のシェルがアクティブな場合でもすぐにNuを終了することができます。

## ディレクトリを超えて

Nuはファイルシステムのパスとは別に、他のものからシェルを作ることもできます。たとえば、大規模なデータセットを使用していて、その中の場所を失いたくないとしましょう。

これがどのように機能するかを見るために、次の演習を行いましょう。現在、"Cargo.toml"ファイルの中に開発した[Nuプラグイン](plugins.md)をリストしています。src/pluginsディレクトリの中に"doc.rs"とよばれる新しいプラグインを作成したので、正しくコンパイルされインストールされるか確認したいので"Cargo.toml"にリストされているか知りたいとしましょう。

Nuのソースコードから"Cargo.toml"ファイルに`enter`してみましょう。

```
/Users/andresrobalino/Code/nushell(master)> enter Cargo.toml
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object]
------------+--------------+------------------+----------+----------
```

今のところ、ファイルに`enter`し、`ls`から得られたテーブルで中身を確認できます。注意深くみてみると、今回はNuが理解できる(.toml)ファイル形式にエンターしていることがわかります。Nuはファイルの中身をファイルシステムのように投影するので、あたかも通常のファイルシステムにいるかのように中身を探検できます。

続きを始める前に、アクティブなシェルを確認しておきましょう。

```
/> shells
---+---+-------------------------------------------------+------------------------------------
 # |   | name                                            | path
---+---+-------------------------------------------------+------------------------------------
 0 |   | filesystem                                      | /Users/andresrobalino/Code/nushell
 1 | X | {/Users/andresrobalino/Code/nushell/Cargo.toml} | /
---+---+-------------------------------------------------+------------------------------------

```

２つのアクティブなシェルがあり、"Cargo.toml"内のデフォルトのルートパスである"/"にいることがわかります。内容をもう一度表示してみましょう。

```
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object]
------------+--------------+------------------+----------+----------
```

今探しているのは、"bin"列の中なので、そこにいってみましょう。

```
> cd bin
/bin> ls
----+----------------------+---------------------------
 #  | name                 | path
----+----------------------+---------------------------
 0  | nu_plugin_inc        | src/plugins/inc.rs
 1  | nu_plugin_sum        | src/plugins/sum.rs
 2  | nu_plugin_add        | src/plugins/add.rs
 3  | nu_plugin_edit       | src/plugins/edit.rs
 4  | nu_plugin_str        | src/plugins/str.rs
 5  | nu_plugin_skip       | src/plugins/skip.rs
 6  | nu_plugin_sys        | src/plugins/sys.rs
 7  | nu_plugin_tree       | src/plugins/tree.rs
 8  | nu_plugin_binaryview | src/plugins/binaryview.rs
 9  | nu_plugin_textview   | src/plugins/textview.rs
 10 | nu                   | src/main.rs
----+----------------------+---------------------------
```

ここから、`p`(previous)を使うことでいつでも以前の作業ディレクトリに戻ることができます。

```
/bin> p
```

シェルをもう一度確認しましょう。

```
/Users/andresrobalino/Code/nushell(master)> shells
---+---+-------------------------------------------------+------------------------------------
 # |   | name                                            | path
---+---+-------------------------------------------------+------------------------------------
 0 | X | filesystem                                      | /Users/andresrobalino/Code/nushell
 1 |   | {/Users/andresrobalino/Code/nushell/Cargo.toml} | /bin
---+---+-------------------------------------------------+------------------------------------

```

"Cargo.toml"ファイルにエンターする前の作業ディレクトリにもどっていることがわかります。次にプラグインののソースコードがあるディレクトリに移動してそれらを追跡します。

```
/Users/andresrobalino/Code/nushell(master)> cd src/plugins/
/Users/andresrobalino/Code/nushell/src/plugins(master)> ls
----+---------------+------+----------+---------+------------+------------
 #  | name          | type | readonly | size    | accessed   | modified
----+---------------+------+----------+---------+------------+------------
 0  | doc.rs        | File |          | 3.0 KB  | a week ago | a week ago
 1  | sum.rs        | File |          | 3.0 KB  | a week ago | a week ago
 2  | inc.rs        | File |          | 11.8 KB | a week ago | a week ago
 3  | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
 4  | edit.rs       | File |          | 2.7 KB  | a week ago | a week ago
 5  | str.rs        | File |          | 21.4 KB | 5 days ago | 5 days ago
 6  | secret.rs     | File |          | 1.8 KB  | 2 days ago | 2 days ago
 7  | skip.rs       | File |          | 1.7 KB  | a week ago | a week ago
 8  | binaryview.rs | File |          | 13.0 KB | a week ago | a week ago
 9  | tree.rs       | File |          | 3.0 KB  | a week ago | a week ago
 10 | add.rs        | File |          | 2.7 KB  | a week ago | a week ago
 11 | textview.rs   | File |          | 9.4 KB  | 5 days ago | 5 days ago
----+---------------+------+----------+---------+------------+------------
```

２つを比較して、ファイルに追加する必要のあるプラグインがないか確認できます(あきらかに"Cargo.toml"に追加する必要があります)。