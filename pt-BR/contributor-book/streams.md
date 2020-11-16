---
title: Streams
---

# Streams

Streams assíncronas formam a base de como a informação trafega de um lado do pipeline para o outro. Isso permite que o Nu trabalhe com comandos internos, comandos externos e plugins  de uma forma relativamente contínua.

Existem dois tipos fundamentais de streams no Nu: InputStream e OutputStream

## InputStream

Vamos ver o tipo InputStream mais próximo:

```rust
BoxStream<'static, Tagged<Value>>
```

É uma stream assíncrona que vai enviar um `Tagged<Value>` no comando. Para mais informações sobre tagging, veja no capítulo de [metadados](metadados.md).

## OutputStream

Similar ao InputStream a cima, um OutputStream vai retornar valores de um comando:

```rust
BoxStream<'static, ReturnValue>
```

Onde um ReturnValue é:

```rust
pub type ReturnValue = Result<ReturnSuccess, ShellError>;
```

E um ReturnSuccess é:

```rust
pub enum ReturnSuccess {
    Value(Tagged<Value>),
    Action(CommandAction),
}
```

Por que o OutputStream é diferente do InputStream? Isso ocorre devido as diferentes necessidades de cada ponta (entrada e saída) da stream. No momento em que os dados estiverem disponíveis no comando, já foi realizada a verificação de possíveis erros, então é esperado que seja uma stream pura de dados.

Por outro lado, OutputStreams devem ser capazes de retornar dois outros tipos de dado além dos valores: erros e ações.

### Errors

Erros que forem passados para a stream vão ser detectados como valores que são copiados de uma stream para a outra. Assim que o erro for detectado, a stream vai ser parada e o erro informado.

### Actions

Uma ação se difere de um valor, pois enquanto um valor é um pedaço de dado que será visto pelo próximo comando no pipeline, uma ação é algo destinado apenas para o ambiente de execução interno do Nu. Ações mudam o estado do shell, por exemplo, ao mudar o diretório corrente, mudando o shell atual, atualizando tabelas, e assim por diante.




