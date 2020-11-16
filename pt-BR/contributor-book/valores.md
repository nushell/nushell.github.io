---
title: Valores
---

# Valores

Um Valor é a estrutura básica de dados no Nu.

```rust
pub struct Value {
    pub value: UntaggedValue,
    pub tag: Tag,
}
```

Onde o campo `value` é qualquer tipo de valor `UntaggedValue` e o campo `tag` armazena um [metadado](metadados.md) associado com o valor.

Um `UntaggedValue` representa um dos seguintes tipos de valor:

```rust
pub enum UntaggedValue {
    Primitive(Primitive),
    Row(Dictionary),
    Table(Vec<Value>),

    Error(ShellError),

    Block(Evaluate),
}
```

Onde `Primitive` é:

```rust
pub enum Primitive {
    Nothing,
    Int(BigInt),
    Decimal(BigDecimal),
    Bytes(u64),
    String(String),
    Line(String),
    ColumnPath(ColumnPath),
    Pattern(String),
    Boolean(bool),
    Date(DateTime<Utc>),
    Duration(u64),
    Range(Box<Range>),
    Path(PathBuf),
    Binary(Vec<u8>),

    // Stream markers (used as bookend markers rather than actual values)
    BeginningOfStream,
    EndOfStream,
}
```

Vamos ver em ordem reversa para ver como Primitives é construido até um Value completo:

## Primitive

Um tipo de dado `Primitive` é um tipo fundamental no Nu. Apesar disso ter similaridades com tipos de dados de linguagens de programação, existem algumas diferenças devido as capacidades de shell do Nu.

Nu vêm com dois "grandes" tipos de números: `BigInt` para inteiros e `BigDecimal` para números decimais. Isso permite que o Nu realize futuramente operações matemáticas e mantenha precisão por mais tempo.

Outros tipos de dados que talvez sejam um pouco diferentes do normal:

* `Nothing` = Um valor vazio
* `Bytes(u64)` = tamanho do arquivo em número de bytes
* `Line(String)` = Um valor do tipo string com um carriage return (ou cr/lf) no final
* `ColumnPath(ColumnPath)` = Um caminho para percorrer até chegar a um valor em uma tabela
* `Pattern(string)` = um padrão glob (como `nu*` em `ls nu*`)
* `Duration(u64)` = Uma contagem no valor de segundos (como `1h`, `3600s`, `1440m`, `1d`, `86400s` em `echo 1h 3600s 1440m 1d 86400s` )
* `Range(Box<Range>)` = Um intervalo de valores (como `0..2` em `ls | range 0..2`)
* `Path(PathBuf)` = um caminho de arquivo
* `Binary(Vec<u8>)` = um array de bytes
* `BeginningOfStream` = um marcador para indicar o início de uma stream
* `EndOfStream` = um marcador para indicar o fim de uma stream

## UntaggedValue

Além dos tipos primitivos, Nu sporta agregação de tipos de dados. Coletivamente, esses valores agregados são chamados de `UntaggedValue`s.

Atualmente, Nu suporta 5 tipos de `UntaggedValue`: `Row`, `Table`, `Block`, `Primitive`, e `Error`.

### Tables e Rows

Nu usa um conjunto de termos que são mais próximos de planilhas. Ao invés de ter listas de objetos, Nu tem uma tabela, que contém linhas. Cada linha contém o nome das colunas e os seus respectivos valores.

### Blocks

Blocks representam código que está pronto para ser executado pelo avaliador. Um exemplo disso é a condição na expressão `where {$it > 10}`.

### Errors

Representa erros que podem ocorrer quando o pipeline é executado.