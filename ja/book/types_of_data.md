# データ型

従来、Unixシェルコマンドは文字列テキストを通じて互いに通信してきました。あるコマンドは標準出力(しばしば'stdout'と略されます)を介してテキストを出力し、他方のコマンドは標準入力(または'stdin')を介してテキストを読み込みます。このようにして、２つのコマンドは通信できます。

この種の通信は文字列ベースと考えることができます。

Nuはコマンドに対してこのアプローチを採用しつつ、他の種類のデータを扱えるよう拡張しています。現在、Nuはシンプルなデータと構造化されたデータ、２つの種類をサポートしています。


## シンプルなデータ

多くのプログラミング言語と同様に、Nuはシンプルなデータと構造化されたデータを用いてデータをモデル化します。シンプルなデータ型には、整数、浮動小数点、文字列、真偽値、日付、およびパスが含まれます。ファイルサイズのための特別な型もこれに含まれます。

### 整数

整数(または丸めた数)。例として、１，５，および100があります。

### 浮動小数点

浮動小数点は小数部を含む数です。例として、1.5、2.0、および15.333があります。

### 文字列

文字列はテキストを表す基本的な方法です。文字列はダブルクォートを使って表されます。例として、"Fred", "myname.txt", and "Lynchburg, VA"があります。

Nuの文字列はデフォルトでUnicodeに対応しているためUTF-8のテキストを簡単に渡すことができます。

### Lines

LinesはOSに依存した行末をもつ文字列です。使用される場合は、OS固有の行末が使用されます。

### Column paths

Column pathsはテーブルにおける特定のサブテーブル、列、行、またはセルへのパスです。

### パターン

"glob"パターンと呼ばれたりもするパターンはシェルでよく利用されるファイル名のマッチング方法です。  
`*`は何にでもマッチし、`?`は一文字にマッチすることを表しています。

例) `ls test*`における`test*`がパターンです。

### 真偽値

真偽値は真か偽かの状態をとります。しばしば比較の結果を表すために使われます。

真偽値の２つの値は、`$true`と`$false`です。

### 日付

日付と時間は日付型のデータに一緒に保持されます。システムで利用される日付データはタイムゾーンをもち、デフォルトではUTCタイムゾーンが使用されます。

### Duration

Durationは時間の長さを表します。1秒、5週間、1年はすべてDurationの値です。

例) `1wk`は1週間を表すDurationです。

この表は現在サポートされているすべてのDurationを示しています。

| Duration | Length     |
|----------|------------|
|1sec      | one second |
|1min      | one minute |
|1hr       | one hour   |
|1day      | one day    |
|1wk       | one week   |

### Ranges

値の範囲を表すこともできます。大抵は、開始と終了の間の数値を表すために利用します。

例) `ls | range 1..4`

### パス

パスは、特定のOSでファイルパスを表すプラットフォームに依存しない方法です。例として、`/usr/bin`や`C:\Users\file.txt`があげられます。

### バイト

ファイルサイズはバイトと呼ばれる特別な整数型で保持されます。例として、`100`, `15kb`、`100mb`があります。

### バイナリデータ

バイナリデータは、画像ファイルのデータのように、生のバイトの集まりです。

## 構造化データ

構造化データはシンプルなデータから作られます。例えば、構造化データは、複数の整数を表す方法を提供します。現在サポートされている構造化データは次のとおりです。rows, lists, そしてblocksです。

### Rows

rowデータ型は表の１行のデータで見えるものを表しています。異なる要素のデータをもち、データにはそれぞれ列名が与えられます。

### Lists

Listsは一つ以上の値を保持できます。単純な値だけでなく、rowsも保持することができます。rowsのlistsはしばしばテーブルと呼ばれます。

```
> echo [sam fred george]
───┬────────
 0 │ sam 
 1 │ fred 
 2 │ george 
───┴────────
``` 

### Blocks

BlocksはNuのコードブロックを表します。例えば、`each { echo $it }`というコマンドでは、`{ echo $it }`がblockになります。
blockはデータの行ごとに実行するコードを表すのに便利です。
