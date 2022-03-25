# 設定

Nuには、見た目や挙動を変更させるための内部的な変数があります。
以下がそのリストです。

| Variable        | Type           | Description  |
| ------------- | ------------- | ----- |
| completion_mode | "list" or "circular" | 利用する自動補完のモード |
| ctrlc_exit | boolean | ctrl-cを複数回押したときにNuをexitするかどうか |
| disable_table_indexes | boolean | テーブルインデックスカラムを無効にするかどうか |
| edit_mode | "vi" or "emacs" | 行の編集モードを"vi"か"emacs"モードに変更する |
| env | row | 外部コマンドに渡す環境変数 |
| header_align | "center", "right", or other | テーブルのヘッダーの揃え方 |
| key_timeout | integer | editモードのスイッチ時のタイムアウト |
| nonzero_exit_errors | boolean | 外部コマンドが0以外の終了ステータスの場合にエラーを表示するかどうか|
| path | list of strings | バイナリーを検索するPATH |
| startup | list of strings | `alias`のようなnushell起動時に実行するコマンド |
| table_mode | "light" or other | テーブルのモード |
| no_auto_pivot | boolean | 自動で1行のデータをpivotするかどうか |
| skip_welcome_message | boolean | nushell起動時にウェルカムメッセージの表示をスキップするかどうか |


## 利用方法

### 変数の設定

これらの変数のいずれかを設定するには`config set` コマンドを利用します。例えば

```
> config set edit_mode "vi"
```

### パイプラインからの変数を設定

設定したい値をパイプラインを通じて設定することもできます。このためには`set_into`フラグを利用します。

```
> echo "bar" | config set_into foo
```

この方法は、`env`や`path`変数を設定する際に便利です。

### すべての変数の表示

`config`コマンドを引数なしで実行すると現在の設定されている変数を表示します。

```
> config
─────────────────┬──────────────────
 completion_mode │ circular 
 env             │ [row 51 columns] 
 path            │ [table 9 rows] 
 startup         │ [table 1 rows] 
─────────────────┴──────────────────
```

注: もしまだ変数を設定していない場合、出力が空の場合があります。

### 変数の取得

``get``フラグを利用して特定の変数の値を取得できます。

```
> config get edit_mode
```

### 変数の削除

変数を削除する場合、`remove`フラグを利用します。

```
> config remove edit_mode
```

### 設定全体のクリア

設定全体をクリアして、最初からやりなおしたい場合は`--clear`フラグを利用できます。このコマンドを実行すると設定ファイルもクリアされるので注意してください。

```
> config clear
```

### 設定が保存されている場所をみつける

設定ファイルはデフォルトの場所から読み込まれます。この場所をみつけるには`-path`フラグを利用します。

```
> config path
/home/jonathant/.config/nu/config.toml
```

### ファイルから設定を読み込む

デフォルトとは違う設定ファイルを読み込みたい場合は、`load` パラメーターを利用します。

```
> config load myconfiguration.toml
```

## Nuをログインシェルとして設定する

Nuをログインシェルとして利用するには、`path`と`env`変数を設定する必要があります。これらによりログインシェルとして外部コマンドを実行するのに十分なサポートが得られます。

切り替える前に、Bash等の別のシェルからNuを実行します。そして次のコマンドで環境変数とPATHをシェルから取得します。

```
> config set path $nu.path
> config set env $nu.env
```

0.7.2より以前のバージョンでは

```
> config --set [path $nu:path]
> config --set [env $nu:env]
```

`$nu.path`および`$nu.env`にはそれぞれ、現在のPATHと環境変数がセットされています。これらをセットすると、のちにNuをログインシェルとして利用したさいに利用できるようになります。

次にいくつかのディストリビューションでは、Nuが`/etc/shells`のリストに含まれているかを確認する必要があります。

```
❯ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/dash
/bin/bash
/bin/rbash
/usr/bin/screen
/usr/bin/fish
/home/jonathan/.cargo/bin/nu
```

これにより、`chsh`でNuをログインシェルとして設定できるようになります。ログアウト後、次回のログイン時にNuの素敵なプロンプトが表示されます。

## プロンプトの設定

プロンプトの設定は`prompt`の値を設定することで行います。  
例えば、[starship](https://starship.rs)を使うには、ダウンロードして次のコマンドを実行します。(0.18.2 and later)

```
config set prompt "starship prompt"
```

Nuを再起動すると

```
nushell on 📙 master [$] is 📦 v0.18.2 via 🦀 v1.48.0-nightly
❯
```

