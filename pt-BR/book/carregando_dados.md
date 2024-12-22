# Carregando dados

Anteriormente vimos como você pode usar comandos como `ls`, `ps`, `date` e `sys` para carregar informações sobre seus arquivos, processos, data e hora e sobre o sistema em si. Cada comando retorna uma tabela de informações que podemos explorar. Há outras maneiras de se carregar uma tabela de dados com a qual trabalhar.

## Abrindo arquivos

Uma das funcionalidades mais poderosas do Nu para lidar com dados é o comando `open`. Ele é uma ferramenta múltipla, capaz de trabalhar com diversos formatos de dados. Para vermos o que isso significa, vamos tentar abrir um arquivo json:

```nu
open editors/vscode/package.json
# => ------+----------+----------+---------+---------+----------+----------+----------+----------+----------+----------+----------+----------+----------+----------
# =>  name | descript | author   | license | version | reposito | publishe | categori | keywords | engines  | activati | main     | contribu | scripts  | devDepen
# =>       | ion      |          |         |         | ry       | r        | es       |          |          | onEvents |          | tes      |          | dencies
# => ------+----------+----------+---------+---------+----------+----------+----------+----------+----------+----------+----------+----------+----------+----------
# =>  lark | Lark     | Lark     | MIT     | 1.0.0   | [object] | vscode   | [0       | [1 item] | [object] | [1 item] | ./out/ex | [object] | [object] | [object]
# =>       | support  | develope |         |         |          |          | items]   |          |          |          | tension  |          |          |
# =>       | for VS   | rs       |         |         |          |          |          |          |          |          |          |          |          |
# =>       | Code     |          |         |         |          |          |          |          |          |          |          |          |          |
# => ------+----------+----------+---------+---------+----------+----------+----------+----------+----------+----------+----------+----------+----------+----------
```

De um jeito similar ao comando `ls`, abrir um tipo de arquivo que o Nu entende vai nos retornar algo que é mais do que apenas texto (ou um fluxo de bytes). Aqui nós abrimos um arquivo "package.json" de um projeto JavaScript. O Nu abre e reconhece o texto JSON e retorna uma tabela de dados.

Se quisermos checar a versão do projeto que estamos olhando, podemos usar o comando `get`.

```nu
open editors/vscode/package.json | get version
# => 1.0.0
```

O Nu atualmente suporta carregar dados diretamente para tabelas a partir dos seguintes formatos:

- json
- yaml
- toml
- xml
- csv
- ini

Mas o que acontece se você carregar um arquivo texto cujo formato não é um desses? Vamos tentar:

```nu
open README.md
```

O conteúdo do arquivo é mostrado. Se o arquivo for muito grande, obteremos uma visão rolável para examinar o arquivo e depois voltar para o terminal. Para ajudar na legibilidade, Nu faz realce de sintaxe para formatos comuns como arquivos de código fonte, markdown e outros.

Por baixo dos panos, o que o Nu enxerga nesses arquivos texto é uma grande string. A seguir, vamos falar sobre como trabalhar com essas strings para obter os dados que precisamos delas.

## Trabalhando com strings

Uma parte importante de se trabalhar com dados vindos de fora do Nu é que eles nem sempre vêm num formato que o Nu entende. Com frequência, esses dados são passados como uma string.

Vamos imaginar que obtivemos esse arquivo de dados:

```nu
open people.txt
# => Octavia | Butler | Writer
# => Bob | Ross | Painter
# => Antonio | Vivaldi | Composer
```

Cada pedacinho de dado que queremos está separado pelo símbolo de pipe ('|') e cada pessoa está numa linha em separado. Nu não possui por padrão um formato de arquivos delimitados por pipe, então teremos que interpretá-lo nós mesmos.

A primeira coisa que queremos fazer ao carregar o arquivo é trabalhar com ele linha a linha:

```nu
open people.txt | lines
# => ---+------------------------------
# =>  # | value
# => ---+------------------------------
# =>  0 | Octavia | Butler | Writer
# =>  1 | Bob | Ross | Painter
# =>  2 | Antonio | Vivaldi | Composer
# => ---+------------------------------
```

Podemos notar que estamos lidando com linhas porque voltamos a ver uma lista. Nosso próximo passo é tentar dividir as linhas em algo um pouco mais útil. Para isso, vamos usar o comando `split column`. Como o nome implica, esse comando nos dá uma forma de dividir em colunas uma string delimitada. Informamos qual é o delimitador e o comando faz o resto:

```nu
open people.txt | lines | split column "|"
# => ---+----------+-----------+-----------
# =>  # | Column1  | Column2   | Column3
# => ---+----------+-----------+-----------
# =>  0 | Octavia  |  Butler   |  Writer
# =>  1 | Bob      |  Ross     |  Painter
# =>  2 | Antonio  |  Vivaldi  |  Composer
# => ---+----------+-----------+-----------
```

Está quase certo. Parece que tem um espaço extra ali. Vamos mudar nosso delimitador:

```nu
open people.txt | lines | split column " | "
# => ---+---------+---------+----------
# =>  # | Column1 | Column2 | Column3
# => ---+---------+---------+----------
# =>  0 | Octavia | Butler  | Writer
# =>  1 | Bob     | Ross    | Painter
# =>  2 | Antonio | Vivaldi | Composer
# => ---+---------+---------+----------
```

Nada mal. O comando `split column` retorna dados que podemos usar. Ele também vai além e nos dá nomes de coluna padrão:

```nu
open people.txt | lines | split column " | " | get Column1
# => ---+---------
# =>  # | value
# => ---+---------
# =>  0 | Octavia
# =>  1 | Bob
# =>  2 | Antonio
# => ---+---------
```

Podemos também nomear nossas colunas ao invés de usar os nomes padrão:

```nu
open people.txt | lines | split column " | " first_name last_name job
# => ---+------------+-----------+----------
# =>  # | first_name | last_name | job
# => ---+------------+-----------+----------
# =>  0 | Octavia    | Butler    | Writer
# =>  1 | Bob        | Ross      | Painter
# =>  2 | Antonio    | Vivaldi   | Composer
# => ---+------------+-----------+----------
```

Agora que nossos dados estão em uma tabela, podemos usar todos os comandos que já usávamos antes em tabelas:

```nu
open people.txt | lines | split column " | " first_name last_name job | sort-by first_name
# => ---+------------+-----------+----------
# =>  # | first_name | last_name | job
# => ---+------------+-----------+----------
# =>  0 | Antonio    | Vivaldi   | Composer
# =>  1 | Bob        | Ross      | Painter
# =>  2 | Octavia    | Butler    | Writer
# => ---+------------+-----------+----------
```

Há outros comandos que você pode usar para trabalhar com strings:

- str
- lines
- size

Há também um conjunto de comandos auxiliares que podemos chamar se soubermos que os dados têm uma estrutura que o Nu deve ser capaz de entender. Por exemplo, vamos abrir um arquivo de lock do Rust:

```nu
open Cargo.lock
# => # This file is automatically @generated by Cargo.
# => # It is not intended for manual editing.
# => [[package]]
# => name = "adhoc_derive"
# => version = "0.1.2"
```

O arquivo "Cargo.lock" é na verdade um arquivo .toml, mas a extensão do arquivo não é .toml. Tudo bem, podemos usar o comando `from toml`:

```nu
open Cargo.lock | from toml
# => ----------+-------------
# =>  metadata | package
# => ----------+-------------
# =>  [object] | [405 items]
# => ----------+-------------
```

Há um comando `from` para cada formato de dados estruturados em texto que o Nu entende e pode abrir.

## Abrindo no modo bruto

Embora seja útil poder abrir um arquivo e trabalhar imediatamente com uma tabela dos seus dados, nem sempre é isso o que queremos fazer. Para ter acesso ao texto subjacente, o comando `open` pode receber um modificador opcional `--raw`:

```nu
open Cargo.toml --raw
# => [package]                                                                                        name = "nu"
# => version = "0.1.3"
# => authors = ["Yehuda Katz <wycats@gmail.com>", "Sophia Turner <547158+sophiajt@users.noreply.github.com>"]
# => description = "A shell for the GitHub era"
# => license = "MIT"
```

## Abrindo URLs

Além de carregar dados a partir do sistema de arquivos, você também pode passar uma URL para o comando `open`. Ele trará da internet o conteúdo dessa URL e o retornará para você:

```nu
open https://www.jonathanturner.org/feed.xml
# => ----------
# =>  rss
# => ----------
# =>  [1 item]
# => ----------
```
