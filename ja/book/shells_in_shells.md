# シェルの中のシェル

## 複数のディレクトリで作業する

ひとつのディレクトリで作業することが一般的ですが、同時に複数の場所で作業できれば便利です。このため、Nuは"shells"という概念を提供します。その名の通り、これらは同じ場所で複数のシェルを実行する方法であり、作業ディレクトリ間をすばやく移動することができます。

まずはじめに、ディレクトリを入力しましょう。

```
/home/jonathant/Source/nushell(master)> enter ../book
/home/jonathant/Source/book(master)> ls
────┬────────────────────┬──────┬────────┬─────────────
 #  │ name               │ type │ size   │ modified 
────┼────────────────────┼──────┼────────┼─────────────
  0 │ 404.html           │ File │  429 B │ 2 hours ago 
  1 │ CONTRIBUTING.md    │ File │  955 B │ 2 hours ago 
  2 │ Gemfile            │ File │ 1.1 KB │ 2 hours ago 
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 2 hours ago 
```

`enter`はディレクトリの変更に似ています(`cd`コマンドでみたように)。これによりディレクトリにジャンプして作業することができます。ディレクトリを変更するかわりに、２つのディレクトリに移動しました。このことをより明確にするために、`shells`コマンドを実行して、アクティブな現在のディレクトリの一覧を表示してみましょう。

```
/home/jonathan/Source/book(master)> shells
───┬────────┬────────────┬─────────────────────────────────
 # │ active │ name       │ path 
───┼────────┼────────────┼─────────────────────────────────
 0 │        │ filesystem │ /home/jonathant/Source/nushell/ 
 1 │ X      │ filesystem │ /home/jonathant/Source/book 
───┴────────┴────────────┴─────────────────────────────────
```

`shells`コマンドは現在２つのシェルがアクティブであることを示しています。もともといた"nushell"のソースディレクトリと新しい"book"ディレクトリです。

"next"と"previous"のショートカットである`n`と`p`を利用して、両者のシェルを行き来できます。

```
/home/jonathant/Source/book(master)> n
/home/jonathant/Source/nushell(master)> p
/home/jonathant/Source/book(master)>
```

ディレクトリを変更できることがわかります。そしていつでも元いた作業ディレクトリに戻ることができるのです。これにより、同じセッションにいながら複数のディレクトリで作業できます。

## シェルを終了する

`exit`コマンドを利用して`enter`したシェルを終了することができます。もし最後のシェルを終了したときはNuが終了します。

`exit --now`のように、`--now`フラグを`exit`コマンドに渡すことで、複数のシェルがアクティブな場合でもすぐにNuを終了することができます。 こんなふうに: `exit --now`

## ディレクトリを超えて

Nuはファイルシステムのパスとは別に、他のものからシェルを作ることもできます。たとえば、大規模なデータセットを使用していて、その中の場所を失いたくないとしましょう。

これがどのように機能するかを見るために、次の演習を行いましょう。現在、"Cargo.toml"ファイルの中に開発した[Nuプラグイン](plugins.md)をリストしています。src/pluginsディレクトリの中に"doc.rs"とよばれる新しいプラグインを作成したので、正しくコンパイルされインストールされるか確認したいので"Cargo.toml"にリストされているか知りたいとしましょう。

Nuのソースコードから"Cargo.toml"ファイルに`enter`してみましょう。

```
/home/jonathant/Source/nushell(master)> enter Cargo.toml
/> ls
────────────────────┬───────────────────────────
 bin                │ [table 18 rows] 
 build-dependencies │ [row nu-build serde toml] 
 dependencies       │ [row 29 columns] 
 dev-dependencies   │ [row nu-test-support] 
 features           │ [row 19 columns] 
 package            │ [row 12 columns] 
 workspace          │ [row members] 
────────────────────┴───────────────────────────
```

今のところ、ファイルに`enter`し、`ls`から得られたテーブルで中身を確認できます。注意深くみてみると、今回はNuが理解できる(.toml)ファイル形式にエンターしていることがわかります。Nuはファイルの中身をファイルシステムのように表示するので、あたかも通常のファイルシステムのように内容を確認することができます。

続きを始める前に、アクティブなシェルを確認しておきましょう。

```
> shells
───┬────────┬─────────────────────────────────────────────┬─────────────────────────────────
 # │ active │ name                                        │ path 
───┼────────┼─────────────────────────────────────────────┼─────────────────────────────────
 0 │        │ filesystem                                  │ /home/jonathant/Source/nushell/ 
 1 │ X      │ {/home/jonathant/Source/nushell/Cargo.toml} │ / 
───┴────────┴─────────────────────────────────────────────┴─────────────────────────────────
```

２つのアクティブなシェルがあり、"Cargo.toml"内のデフォルトのルートパスである"/"にいることがわかります。内容をもう一度表示してみましょう。

```
/> ls
────────────────────┬───────────────────────────
 bin                │ [table 18 rows] 
 build-dependencies │ [row nu-build serde toml] 
 dependencies       │ [row 29 columns] 
 dev-dependencies   │ [row nu-test-support] 
 features           │ [row 19 columns] 
 package            │ [row 12 columns] 
 workspace          │ [row members] 
────────────────────┴───────────────────────────
```

今探しているのは、"bin"列の中なので、そこにいってみましょう。

```
> cd bin
/bin> ls
────┬─────────────────────────────┬────────────────────────────────────────────┬───────────────────
 #  │ name                        │ path                                       │ required-features 
────┼─────────────────────────────┼────────────────────────────────────────────┼───────────────────
  0 │ fail                        │ crates/nu-test-support/src/bins/fail.rs    │ [table 1 rows] 
  1 │ chop                        │ crates/nu-test-support/src/bins/chop.rs    │ [table 1 rows] 
  2 │ cococo                      │ crates/nu-test-support/src/bins/cococo.rs  │ [table 1 rows] 
  3 │ nonu                        │ crates/nu-test-support/src/bins/nonu.rs    │ [table 1 rows] 
  4 │ iecho                       │ crates/nu-test-support/src/bins/iecho.rs   │ [table 1 rows] 
  5 │ nu_plugin_core_textview     │ src/plugins/nu_plugin_core_textview.rs     │ [table 1 rows] 
```

ここから、`p`(previous)を使うことでいつでも以前の作業ディレクトリに戻ることができます。

```
/bin> p
```

シェルをもう一度確認しましょう。

```
/home/jonathant/Source/nushell/(simple_list_view)> shells
───┬────────┬─────────────────────────────────────────────┬─────────────────────────────────
 # │ active │ name                                        │ path 
───┼────────┼─────────────────────────────────────────────┼─────────────────────────────────
 0 │ X      │ filesystem                                  │ /home/jonathant/Source/nushell/ 
 1 │        │ {/home/jonathant/Source/nushell/Cargo.toml} │ /bin 
───┴────────┴─────────────────────────────────────────────┴─────────────────────────────────


```

"Cargo.toml"ファイルにエンターする前の作業ディレクトリにもどっていることがわかります。
