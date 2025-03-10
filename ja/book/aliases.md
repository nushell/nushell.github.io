# エイリアス

Nu ではパイプラインを利用して自由にデータやシステムを操作できますが、その反面多くのタイピングを要してしまいます。一度作成したパイプラインを保存しておき再利用できるようにしておきたいところです。

そこでエイリアスの出番です。

エイリアスを使うとコマンドのブロックに名前をつけることができます。エイリアスを実行するとそのコマンドブロックが実行されます。

例:

```nu
alias ls-names [] { ls | select name }
ls-names
# => ────┬────────────────────
# =>  #  │ name
# => ────┼────────────────────
# =>   0 │ 404.html
# =>   1 │ CONTRIBUTING.md
# =>   2 │ Gemfile
# =>   3 │ Gemfile.lock
# =>   4 │ LICENSE
```

## パラメータ

エイリアスは、ブロックに渡されるオプションのパラメータをもつことができます。これらはブロック内の新しい変数になります。

```nu
alias e [msg] { echo $msg }
e "hello world"
# => hello world
```

パラメータは任意の数設定することができ、ユーザが値を提供しなかった場合、ブロック内では Nothing と評価されて削除されます。

## 保存

デフォルトでは、エイリアスは現在のセッションでのみ有効です。これは一時的なヘルパーや新しいエイリアスをテストするのに便利ですが、エイリアスを有効に活用するには保存しておく必要があります。エイリアスを保存するには、alias を`--save`(もしくは`-s`)つきで実行します。例えば

```nu
alias e --save [msg] { echo $msg }
```

エイリアスは起動時の設定に保存され、`config get startup`で確認することができます。`startup`設定がまだ存在していない場合はエラーが表示されます。

config.toml ファイルのエイリアスを直接編集することもできます。`vi`を使う場合は

```nu
config path | vi $it
```
