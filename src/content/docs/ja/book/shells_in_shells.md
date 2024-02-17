# シェルの中のシェル

## 複数のディレクトリで作業する

ひとつのディレクトリで作業することが一般的ですが、同時に複数の場所で作業できれば便利です。このため、Nu は"shells"という概念を提供します。その名の通り、これらは同じ場所で複数のシェルを実行する方法であり、作業ディレクトリ間をすばやく移動することができます。

まずはじめに、ディレクトリを入力しましょう。

```
/home/jonathan/Source/nushell(main)> enter ../book
/home/jonathan/Source/book(main)> ls
────┬────────────────────┬──────┬────────┬─────────────
 #  │ name               │ type │ size   │ modified
────┼────────────────────┼──────┼────────┼─────────────
  0 │ 404.html           │ File │  429 B │ 2 hours ago
  1 │ CONTRIBUTING.md    │ File │  955 B │ 2 hours ago
  2 │ Gemfile            │ File │ 1.1 KB │ 2 hours ago
  3 │ Gemfile.lock       │ File │ 6.9 KB │ 2 hours ago
```

`enter`はディレクトリの変更に似ています(`cd`コマンドでみたように)。これによりディレクトリにジャンプして作業することができます。ディレクトリを変更するかわりに、今２つのディレクトリの中にいます。このことをより明確にするために、`shells`コマンドを実行して、アクティブな現在のディレクトリの一覧を表示してみましょう。

```
/home/jonathan/Source/book(main)> enter ../music
/home/jonathan/Source/music(main)> shells
───┬────────┬───────────────────────────────
 # │ active │             path
───┼────────┼───────────────────────────────
 0 │ false  │ /home/jonathan/Source/nushell
 1 │ false  │ /home/jonathan/Source/book
 2 │ true   │ /home/jonathan/Source/music
───┴────────┴───────────────────────────────
```

`shells`コマンドは現在３つのシェルが存在していることを示しています。もともといた"nushell"のソースディレクトリと、"book"ディレクトリ、それに現在アクティブになっている"music"ディレクトリです。

"next"、"previous"、"goto"のショートカットである`n`、`p`、`g`を利用して、これらのシェルを行き来できます。

```
/home/jonathan/Source/music(main)> p
/home/jonathan/Source/book(main)> n
/home/jonathan/Source/music(main)> g 0
/home/jonathan/Source/nushell(main)>
```

ディレクトリを変更できることがわかります。そしていつでも元いた作業ディレクトリに戻ることができるのです。これにより、同じセッションにいながら複数のディレクトリで作業できます。

## シェルを終了する

`dexit`コマンドを利用して`enter`したシェルを終了することができます。

複数のシェルが存在しているときでも、`exit`を使用すればいつでもNuを終了することができます。
