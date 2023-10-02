# Trabalhando com tabelas

Uma forma comum de ver os dados no Nu é por meio de uma tabela. O Nu traz um conjunto de comandos para se trabalhar com tabelas, facilitar a localização do que você procura e restringir os dados apenas ao que você precisa.

Para começar, vamos usar a seguinte tabela:

```nu
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

## Ordenando os dados

Podemos ordenar uma tabela chamando o comando `sort-by` e informando quais colunas queremos usar na ordenação. Digamos que queremos ordenar nossa tabela pelo tamanho do arquivo:

```nu
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

Podemos ordenar uma tabela por qualquer coluna que possa ser comparada. Por exemplo, poderíamos também ter ordenado a tabela acima usando as colunas "name", "accessed" ou "modified".

## Selecionando os dados que deseja

Podemos selecionar dados de uma tabela escolhendo colunas ou linhas específicas. Vamos escolher algumas colunas da nossa tabela:

```nu
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

Isso ajuda a criar uma tabela mais focada no que precisamos. A seguir, digamos que queremos ver apenas os 5 menores arquivos do diretório:

```nu
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

Note que primeiro ordenamos a tabela por tamanho e depois usamos o `first 5` para retornar as primeiras 5 linhas da tabela.

Você também pode usar `skip` para pular as linhas que não quiser. Vamos pular as duas primeiras das 5 linhas que retornamos acima:

```nu
> ls | sort-by size | first 5 | skip 2
---+---------+------+----------+--------+------------+------------
 # | name    | type | readonly | size   | accessed   | modified
---+---------+------+----------+--------+------------+------------
 0 | edit.rs | File |          | 2.7 KB | 2 days ago | 2 days ago
 1 | sum.rs  | File |          | 3.0 KB | 2 days ago | 2 days ago
 2 | tree.rs | File |          | 3.0 KB | 2 days ago | 2 days ago
---+---------+------+----------+--------+------------+------------
```

Restringimos os dados às 3 linhas que nos interessam.

Vamos examinar alguns outros comandos para selecionar dados. Você pode ter se perguntado por que as linhas da tabela são numeradas. Isso serve como uma maneira prática de acessar uma linha específica. Vamos ordenar nossa tabela pelo nome do arquivo e então escolher uma das linhas com o comando `nth`, usando o número da linha:

```nu
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

## Obtendo dados de uma tabela

Até agora, trabalhamos as tabelas reduzindo-as para somente o que precisamos. Às vezes queremos ir um passo além e só ver os valores das células e não de uma coluna toda. Digamos, por exemplo, que queremos somente uma lista com os nomes do arquivos. Para isso, usamos o comando `get`:

```nu
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

Agora temos os valores para cada um dos nomes de arquivo.

Parece muito com o comando `select` que vimos antes, então vamos colocá-lo aqui de novo para compararmos os dois:

```nu
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

São muito parecidos! Vamos tentar explicar a diferença entre esses dois comandos para esclarecer:

- `select` - cria uam nova tabela que inclui apenas as colunas especificadas
- `get` - retorna os valores dentro da coluna especificada

A única maneira de diferenciá-los olhando para a tabela é o nome característico da coluna `value`, que nos permite saber que se trata de uma lista de valores com a qual podemos trabalhar.

O comando `get` pode ir um passo além e receber um caminho para os dados mais profundos na tabela. Isso simplifica o trabalho com dados mais complexos, como as estruturas que você pode encontrar num arquivo .json.

## Modificando dados em uma tabela

Além de selecionar dados de uma tabela, podemos também alterar o que a tabela traz. Podemos querer adicionar novas colunas ou editar o conteúdo de uma célula. No Nu, em vez de editar localmente, cada comando nesta seção retornará uma nova tabela no pipeline.

### Adicionando uma nova coluna

Podemos usar o comando `add` para adicionar uma nova coluna na tabela. Vejamos um exemplo:

```nu
> open rustfmt.toml
---------
 edition
---------
 2018
---------
```

Vamos adicionar uma coluna chamada "next_edition" com o valor 2021:

```nu
> open rustfmt.toml | add next_edition 2021
---------+--------------
 edition | next_edition
---------+--------------
 2018    | 2021
---------+--------------
```

Note que, se abrirmos o arquivo original, seu conteúdo permanece o mesmo:

```nu
> open rustfmt.toml
---------
 edition
---------
 2018
---------
```

Alterações no Nu são alterações funcionais, isto é, atuam sobre os valores em si ao invés de tentar causar uma alteração permanente, o que nos permite executar muitos tipos diferentes de ações no nosso pipeline até que estejamos prontos para escrever o resultado com quaisquer mudanças, se assim quisermos. Aqui poderíamos salvar o resultado usando o comando `save`:

```nu
> open rustfmt.toml | add next_edition 2021 | save rustfmt2.toml
> open rustfmt2.toml
---------+--------------
 edition | next_edition
---------+--------------
 2018    | 2021
---------+--------------
```

### Editando uma coluna

Semelhante ao comando `add`, podemos usar o comando `edit` para alterar o conteúdo de uma coluna para um novo valor. Para ver isso funcionando, vamos abrir o mesmo arquivo:

```nu
open rustfmt.toml
---------
 edition
---------
 2018
---------
```

E agora vamos alterar a coluna `edition` para mostrar a próxima edição à qual esperamos dar suporte:

```nu
> open rustfmt.toml | edit edition 2021
---------
 edition
---------
 2021
---------
```

### Incrementando valores

Existe mais um comando do Nu que nos ajudará a trabalhar com números e versões: `inc`.

```nu
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

Como o valor em "edition" é um número, podemos usar `inc` para alterá-lo. Onde `inc` realmente se destaca é trabalhando com versões:

```nu
> open Cargo.toml | get package.version
0.1.3
> open Cargo.toml | inc package.version --minor | get package.version
0.2.0
```

Quando estamos trabalhando com versões, podemos usar um dos modificadores a seguir para informar como incrementar a versão:

- **--major** - incrementa a versão major (0.1.3 -> 1.0.0)
- **--minor** - incrementa a versão minor (0.1.3 -> 0.2.0)
- **--patch** - incrementa a versão patch (0.1.3 -> 0.1.4)
