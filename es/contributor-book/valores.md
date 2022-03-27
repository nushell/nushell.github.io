---
title: Valores
---

# Valores

Un Value es el tipo de dato de estructura básica en Nu.

```rust
pub struct Value {
    pub value: UntaggedValue,
    pub tag: Tag,
}
```

Donde el campo `value` es cualquier tipo de valor `UntaggedValue` dado y el campo `tag` contiene [metadatos](metadatos.md) asociado con él.

Un `UntaggedValue` cubre los siguientes tipos de valores:

```rust
pub enum UntaggedValue {
    Primitive(Primitive),
    Row(Dictionary),
    Table(Vec<Value>),

    Error(ShellError),

    Block(Evaluate),
}
```

Donde `Primitive` es:

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

Revisemos al revés para ver cómo se construyen tipos de datos completos a partir de los primitivos:

## Primitivos (`Primitive`)

El tipo de dato `Primitive` es el tipo fundamental en Nu. Mientras hay similaridades a tipos de datos fundamentales de lenguajes de programación, hay algunas diferencias debido a las capacidades en la shell de Nu.

Nu viene con dos tipos de números 'grandes': `BigInt` para enteros y `BigDecimal` para números decimales. Esto permite en el futuro lograr operaciones matemáticas y mantener precisión más tiempo en Nu.

Otros tipo de datos, quizás un poco diferentes a la norma:

- `Nothing` = representa un valor vacío
- `Bytes(u64)` = tamaños de archivo en números de bytes
- `Line(String)` = valor de cadena con un final de retorno de carro implícito (o cr / lf)
- `ColumnPath(ColumnPath)` = rutas para extraer valores de las tablas
- `Pattern(string)` = un patrón glob (como `nu*` en `ls nu*`)
- `Duration(u64)` = representa duración en segundos (como `1hr` en `ls | where modified < 1hr` )
- `Range(Box<Range>)` = rangos (como `0..2` en `ls | range 0..2`)
- `Path(PathBuf)` = una ruta de archivo
- `Binary(Vec<u8>)` = un arreglo de bytes
- `BeginningOfStream` = un marcador para denotar el inicio de un stream
- `EndOfStream` = un marador para denotar el fin de un stream

## UntaggedValue

Además de los tipos primitivos, Nu admite tipos de datos agregados. Colectivamente, estos tipos agregados se llaman `UntaggedValue`s.

Actualmente, Nu admite 5 tipos de valor `UntaggedValue`: `Row`, `Table`, `Block`, `Primitive`, y `Error`.

### Tablas y Filas (`Table` y `Row`)

Nu utiliza un conjunto de términos que coinciden un poco más con las hojas de cálculo. En lugar de tener listas de objetos, Nu tiene una tabla que contiene filas. Cada fila contiene los nombres de columna y sus valores correspondientes.

### Bloques (`Block`)

Bloques representa código listo para ser ejecutado por el evaluador. Un ejemplo de esto es la condición `where {$it > 10}`.

### Errores (`Error`)

Representa los errores que pueden ocurrir cuando se ejecutan los comandos en la tubería.
