# 設定

Nuには、見た目や挙動を変更させるための内部的な変数があります。
以下がそのリストです。

| 変数        | 型           | 説明  |
| ------------- | ------------- | ----- |
| path | table of strings | バイナリーを検索するためのPATH |
| env | row | 外部コマンドに渡す環境変数 |
| ctrlc_exit | boolean | Ctrl-cを複数回おしたときにNuを終了するかどうか|
| table_mode | "light" or other | 軽量なテーブルを有効にする |
| edit_mode | "vi" or "emacs" | 行編集を"vi"または"emacs"モードに変更する|

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
━━━━━━━━━━━┯━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━
 edit_mode │ env            │ path             │ table_mode 
───────────┼────────────────┼──────────────────┼────────────
 emacs     │ [table: 1 row] │ [table: 10 rows] │ normal 
━━━━━━━━━━━┷━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━
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
config path
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 <value> 
───────────────────────────────────────
 /home/nusheller/.config/nu/config.toml 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

現在、プロンプトの設定は[starship](https://github.com/starship/starship)プロンプトサポートつきでNuをインストールすることで可能になります。

```
nushell on 📙 master [$] is 📦 v0.5.1 via 🦀 v1.40.0-nightly 
❯ 
```

Starshipは楽しくカラフルで驚くほど強力なプロンプトです。設定するには[starshipのドキュメント](https://starship.rs/config/)の手順にしたがってください。