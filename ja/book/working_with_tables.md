# テーブルを扱う

Nuでデータを表示する一般的な方法はテーブルを使用することです。Nuには、探しているものを見つけやすくしたり、必要なデータを絞り込んだりするのに便利なテーブルを操作するためのコマンドが多数付属しています。

まずはじめに、今回利用するテーブルを確認しましょう。

```
> ls
---+---------------+------+----------+---------+------------+------------
 # | name          | type | readonly | size    | accessed   | modified
---+---------------+------+----------+---------+------------+------------
 0 | add.rs        | File |          | 2.7 KB  | 2 days ago | 2 days ago
 1 | sum.rs        | File |          | 3.0 KB  | 2 days ago | 2 days ago
 2 | inc.rs        | File |          | 11.8 KB | 2 days ago | 2 days ago
 3 | str.rs        | File |          | 21.4 KB | 2 days ago | 2 days ago
 4 | skip.rs       | File |          | 1.7 KB  | 2 days ago | 2 days ago
 5 | textview.rs   | File |          | 9.4 KB  | 2 days ago | 2 days ago
 6 | binaryview.rs | File |          | 13.0 KB | a day ago  | a day ago
 7 | edit.rs       | File |          | 2.7 KB  | 2 days ago | 2 days ago
 8 | tree.rs       | File |          | 3.0 KB  | 2 days ago | 2 days ago
 9 | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
---+---------------+------+----------+---------+------------+------------
```

## データのソート

ソートに利用する列名を指定して、`sort-by`コマンドを呼びだすことでテーブルをソートできます。ファイルのサイズでテーブルをソートしたいとしましょう。

```
> ls | sort-by size
---+---------------+------+----------+---------+------------+------------
 # | name          | type | readonly | size    | accessed   | modified
---+---------------+------+----------+---------+------------+------------
 0 | skip.rs       | File |          | 1.7 KB  | 2 days ago | 2 days ago
 1 | add.rs        | File |          | 2.7 KB  | 2 days ago | 2 days ago
 2 | edit.rs       | File |          | 2.7 KB  | 2 days ago | 2 days ago
 3 | sum.rs        | File |          | 3.0 KB  | 2 days ago | 2 days ago
 4 | tree.rs       | File |          | 3.0 KB  | 2 days ago | 2 days ago
 5 | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
 6 | textview.rs   | File |          | 9.4 KB  | 2 days ago | 2 days ago
 7 | inc.rs        | File |          | 11.8 KB | 2 days ago | 2 days ago
 8 | binaryview.rs | File |          | 13.0 KB | a day ago  | a day ago
 9 | str.rs        | File |          | 21.4 KB | 2 days ago | 2 days ago
---+---------------+------+----------+---------+------------+------------
```

比較さえできれば任意の列でソートが行なえます。例えば、"name"、"accessed"、または"modified"列でソートすることができます。

## 必要なデータを選択する

列や行を選択することでテーブルから必要なデータを選択できます。テーブルからいくつかの列を選択してみましょう。

```
> ls | select name size
---+---------------+---------
 # | name          | size
---+---------------+---------
 0 | add.rs        | 2.7 KB
 1 | sum.rs        | 3.0 KB
 2 | inc.rs        | 11.8 KB
 3 | str.rs        | 21.4 KB
 4 | skip.rs       | 1.7 KB
 5 | textview.rs   | 9.4 KB
 6 | binaryview.rs | 13.0 KB
 7 | edit.rs       | 2.7 KB
 8 | tree.rs       | 3.0 KB
 9 | sys.rs        | 9.2 KB
---+---------------+---------
```

こうすることで、より必要とするデータにフォーカスしたテーブルを作ることができます。次にディレクトリからもっとも小さい5つのファイルを表示してみます。

```
> ls | sort-by size | first 5
---+---------+------+----------+--------+------------+------------
 # | name    | type | readonly | size   | accessed   | modified
---+---------+------+----------+--------+------------+------------
 0 | skip.rs | File |          | 1.7 KB | 2 days ago | 2 days ago
 1 | add.rs  | File |          | 2.7 KB | 2 days ago | 2 days ago
 2 | edit.rs | File |          | 2.7 KB | 2 days ago | 2 days ago
 3 | sum.rs  | File |          | 3.0 KB | 2 days ago | 2 days ago
 4 | tree.rs | File |          | 3.0 KB | 2 days ago | 2 days ago
---+---------+------+----------+--------+------------+------------
```

もっとも小さいファイルを取得するためにまずサイズでソートし、それから`first 5`を利用してテーブルから最初の5行を返しています。

不要な行を`skip`することもできます。上記で返された５行のうち最初の２行をスキップしてみましょう。

```
> ls | sort-by size | first 5 | skip 2
---+---------+------+----------+--------+------------+------------
 # | name    | type | readonly | size   | accessed   | modified
---+---------+------+----------+--------+------------+------------
 0 | edit.rs | File |          | 2.7 KB | 2 days ago | 2 days ago
 1 | sum.rs  | File |          | 3.0 KB | 2 days ago | 2 days ago
 2 | tree.rs | File |          | 3.0 KB | 2 days ago | 2 days ago
---+---------+------+----------+--------+------------+------------
```

関心のある３行に絞り込みました。

データを選択するための他のコマンドもみてみましょう。テーブルの各行が数字をもつことを疑問に思っているかもしれません。これは単一の行を簡単に指定する方法として機能します。テーブルをファイル名でソートして、`n-th`コマンドを利用してn行目を選択してみましょう。

```
> ls | sort-by name
---+---------------+------+----------+---------+------------+------------
 # | name          | type | readonly | size    | accessed   | modified
---+---------------+------+----------+---------+------------+------------
 0 | add.rs        | File |          | 2.7 KB  | 2 days ago | 2 days ago
 1 | binaryview.rs | File |          | 13.0 KB | a day ago  | a day ago
 2 | edit.rs       | File |          | 2.7 KB  | 2 days ago | 2 days ago
 3 | inc.rs        | File |          | 11.8 KB | 2 days ago | 2 days ago
 4 | skip.rs       | File |          | 1.7 KB  | 2 days ago | 2 days ago
 5 | str.rs        | File |          | 21.4 KB | 2 days ago | 2 days ago
 6 | sum.rs        | File |          | 3.0 KB  | 2 days ago | 2 days ago
 7 | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
 8 | textview.rs   | File |          | 9.4 KB  | 2 days ago | 2 days ago
 9 | tree.rs       | File |          | 3.0 KB  | 2 days ago | 2 days ago
---+---------------+------+----------+---------+------------+------------

> ls | sort-by name | nth 5
--------+------+----------+---------+------------+------------
 name   | type | readonly | size    | accessed   | modified
--------+------+----------+---------+------------+------------
 str.rs | File |          | 21.4 KB | 2 days ago | 2 days ago
--------+------+----------+---------+------------+------------
```

## テーブルからデータを取得する

これまでは、テーブルを必要なものだけにトリミングする操作を行ってきました。ときには一歩進んで、列全体ではなく、セル自体の値が必要になるかもしれません。たとえば、ファイル名のリストだけを取得したいとしましょう。この場合`get`コマンドを利用することができます。

```
> ls | get name
---+---------------
 # | value
---+---------------
 0 | add.rs
 1 | sum.rs
 2 | inc.rs
 3 | str.rs
 4 | skip.rs
 5 | textview.rs
 6 | binaryview.rs
 7 | edit.rs
 8 | tree.rs
 9 | sys.rs
---+---------------
```

これで各ファイルの名前が取得できました。

これはさきほどみた`select`コマンドと同じにみえるかもしれません、比較のために`select`コマンドの出力もみておきましょう。

```
> ls | select name
---+---------------
 # | name
---+---------------
 0 | add.rs
 1 | sum.rs
 2 | inc.rs
 3 | str.rs
 4 | skip.rs
 5 | textview.rs
 6 | binaryview.rs
 7 | edit.rs
 8 | tree.rs
 9 | sys.rs
---+---------------
```

両者は非常に似ています！両者の違いを明確にしておきましょう。

* `select` - 指定された列のみを含む新しいテーブルを作成します
* `get` - 指定された列内の値を返します

テーブルからこれらを区別する方法の一つは、`value`列名です。これにより値のリストであることがわかります。

`get`コマンドは、パスを受け取りテーブル内のより深いデータへアクセスすることができます。これにより.jsonファイルにあるような複雑なデータを簡単に操作することができます。

## テーブルのデータを変更する

テーブルからデータを選択することに加えて、テーブルの内容を更新することもできます。新しい列を加えたり、セルの内容を編集したりできるのです。Nuでは、その場で編集するのではなく、パイプラインの各コマンドは新しいテーブルを返します。

### 新しい列を追加する

`add`コマンドを使用して、新しい列をテーブルに追加できます。例をみてみましょう。

```
> open rustfmt.toml
---------
 edition
---------
 2018
---------
```

値が2021の"next_edition"列を追加してみましょう。

```
> open rustfmt.toml | add next_edition 2021
---------+--------------
 edition | next_edition
---------+--------------
 2018    | 2021
---------+--------------
```

元のファイルは変更されていないことに注意してください。

```
> open rustfmt.toml
---------
 edition
---------
 2018
---------
```


Nuの変更は永続的な変更ではなく、値自体に作用する関数的な変更です。これにより、結果を書き出す準備ができるまでパイプライン上で様々な種類の作業をおこなうことができます。ここでは、`save`コマンドを使用して結果を書き出すことができます。

```
> open rustfmt.toml | add next_edition 2021 | save rustfmt2.toml
/home/jonathan/Source/nushell(master)> open rustfmt2.toml
---------+--------------
 edition | next_edition
---------+--------------
 2018    | 2021
---------+--------------
```

### 列の編集する

`add`コマンドと同様に、`edit`コマンドを利用して列の内容を新しい値に変更することもできます。実際に動作を確認するために同じファイルを開いてみましょう。

```
open rustfmt.toml
---------
 edition
---------
 2018
---------
```

今度は、サポートした次のeditionを指定するよう更新しましょう。

```
> open rustfmt.toml | edit edition 2021
---------
 edition
---------
 2021
---------
```

### 値を増やす

数字やバージョンを扱う際に便利なコマンドがもうひとつあります、`inc`です。

```
> open rustfmt.toml
---------
 edition
---------
 2018
---------
> open rustfmt.toml | inc edition
---------
 edition
---------
 2019
---------
```

"edition"の値は数字なので、`inc`を使って更新することができます。バージョンを扱う際には`inc`がその真価を発揮します。

```
> open Cargo.toml | get package.version
0.1.3
> open Cargo.toml | inc package.version --minor | get package.version
0.2.0
```

バージョンを扱う際には、フラグを利用して、バージョンのインクリメント方法を指定できます。

* **--major** - メジャーバージョンをインクリメント (0.1.3 -> 1.0.0)
* **--minor** - マイナーバージョンをインクリメント (0.1.3 -> 0.2.0)
* **--patch** - パッチバージョンをインクリメント (0.1.3 -> 0.1.4)
