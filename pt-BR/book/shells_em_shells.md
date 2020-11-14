# Shells em shells

## Trabalhando em múltiplos diretórios

Embora seja comum trabalhar em um único diretório, pode ser útil trabalhar em múltiplos locais ao mesmo tempo. Para isso, Nu oferece o conceito de "shells". Como o nome implica, eles são uma maneira de executar múltiplos shells em um, permitindo que você salte rapidamente entre diretórios e muito mais.

Para começar, vamos entrar num diretório:

```shell
/home/jonathan/Source/nushell(master)> enter ../lark
/home/jonathan/Source/lark(master)> ls
----+----------------+-----------+----------+---------+---------------+---------------
 #  | name           | type      | readonly | size    | accessed      | modified 
----+----------------+-----------+----------+---------+---------------+---------------
 0  | Cargo.toml     | File      |          | 2.2 KB  | 6 months ago  | 6 months ago 
 1  | target         | Directory |          | 4.1 KB  | 10 months ago | 6 months ago 
 2  | notes          | Directory |          | 4.1 KB  | 10 months ago | 6 months ago
```

Entrar é semlhante a mudar de diretório (como vimos com o comando `cd`), permitindo que você salte para o diretório dentro do qual vai trabalhar. Ao invés de mudar de diretório, nós agora estamos em dois diretórios. Para ver isso mais claramente, podemos usar o comando `shells` para listar os diretórios ativos agora:

```shell
/home/jonathan/Source/lark(master)> shells
---+---+------------+-------------------------------
 # |   | name       | path 
---+---+------------+-------------------------------
 0 |   | filesystem | /home/jonathan/Source/nushell 
 1 | X | filesystem | /home/jonathan/Source/lark 
---+---+------------+-------------------------------
```

O comando `shells` nos mostra que há dois diretórios ativos agora: nosso diretório original "nushell" e agora esse novo diretório "lark".

Podemos saltar entre esses shells com os atalhos `n` e `p`, abrevisções para "next" (próximo) e "previous" (anterior):

```
/home/jonathan/Source/lark(master)> n
/home/jonathan/Source/nushell(master)> p
/home/jonathan/Source/lark(master)>
```

Podemos ver a alteração de diretórios, mas sempre somos capazes de voltar para um diretório anterior em que estávamos trabalhando. Isso nos permite trabalhar em múltiplos diretórios na mesma sessão.

## Saindo do shell

Você pode sair de um shell em que tenha entrado (usando `enter`) através do comando `exit`. Se esse for o último shell aberto, Nu será encerrado.

Você sempre pode emcerrar o Nu, mesmo que múltiplos shells estejam ativos, passando o modificador `--now` para o comando `exit`. Assim: `exit --now`.

## Indo além de diretórios

O Nu também pode criar shells a partir de outras coisas além de caminhos do sistema de arquivos. Digamos, por exemplo, que você está trabalhando com uma grande massa de dadose não quer perder seu lugar dentro dela.

Para ver como isso funciona, vamos fazer o seguinte exercício. Atualmente, listamos os [plugins](plugins.md) que desenvolvemos para o Nu no arquivo "Cargo.toml". Digamos que tenhamos acabado de criar um novo plugin no diretório src/plugins chamado "doc.rs" e queremos saber se ele também está listado, de forma que possa ser compilado e instalado corretamente.

Vamos entrar no arquivo "Cargo.toml" do código fonte do Nu:

```shell
/Users/andresrobalino/Code/nushell(master)> enter Cargo.toml
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package 
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object] 
------------+--------------+------------------+----------+----------
```

Até o momento, apenas entramos no arquivo (usando o comando `enter`) e podemos ver o que há dentro dele pela tabela que o `ls` nos retorna. Se você prestar bastante atenção, dessa vez entramos num arquivo cujo formato o Nu entende (.toml). O Nu também projeta o conteúdo do arquivo em algo semelhante a um sistema de arquivos para que possamos explorá-lo como se fosse um sistema de arquivos regular.

Antes de continuarmos, vamos checar os shells ativos:

```shell
/> shells
---+---+-------------------------------------------------+------------------------------------
 # |   | name                                            | path
---+---+-------------------------------------------------+------------------------------------
 0 |   | filesystem                                      | /Users/andresrobalino/Code/nushell
 1 | X | {/Users/andresrobalino/Code/nushell/Cargo.toml} | /
---+---+-------------------------------------------------+------------------------------------

```

Podemos observar que temos dois shells ativos e que estamos agora dentro do arquivo "Cargo.toml" com um caminho raíz padrão "/". Vamos ver seu contéudo novamente:

```shell
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package 
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object] 
------------+--------------+------------------+----------+----------
```

O que estamos procurando pode estar dentro da coluna "bin", então vamos entrar lá:

```shell
> cd bin
/bin> ls
----+----------------------+---------------------------
 #  | name                 | path 
----+----------------------+---------------------------
 0  | nu_plugin_inc        | src/plugins/inc.rs 
 1  | nu_plugin_sum        | src/plugins/sum.rs 
 2  | nu_plugin_add        | src/plugins/add.rs 
 3  | nu_plugin_edit       | src/plugins/edit.rs 
 4  | nu_plugin_str        | src/plugins/str.rs 
 5  | nu_plugin_skip       | src/plugins/skip.rs 
 6  | nu_plugin_sys        | src/plugins/sys.rs 
 7  | nu_plugin_tree       | src/plugins/tree.rs 
 8  | nu_plugin_binaryview | src/plugins/binaryview.rs 
 9  | nu_plugin_textview   | src/plugins/textview.rs 
 10 | nu                   | src/main.rs 
----+----------------------+---------------------------
```

Daqui, sempre podemos voltar para o diretório em que estávamos trabalhando antes usando p (de prévio, anterior).

```shell
/bin> p
```

Vamos verificar os shells de novo:

```shell
/Users/andresrobalino/Code/nushell(master)> shells
---+---+-------------------------------------------------+------------------------------------
 # |   | name                                            | path
---+---+-------------------------------------------------+------------------------------------
 0 | X | filesystem                                      | /Users/andresrobalino/Code/nushell
 1 |   | {/Users/andresrobalino/Code/nushell/Cargo.toml} | /bin
---+---+-------------------------------------------------+------------------------------------

```

Estamos de volta ao diretório onde estávamos trabalhando antes de entrar no arquivo "Cargo.toml". Agora vamos mudar para o diretório onde então os códigos fonte dos plugins e rastreá-los:

```shell
/Users/andresrobalino/Code/nushell(master)> cd src/plugins/
/Users/andresrobalino/Code/nushell/src/plugins(master)> ls
----+---------------+------+----------+---------+------------+------------
 #  | name          | type | readonly | size    | accessed   | modified 
----+---------------+------+----------+---------+------------+------------
 0  | doc.rs        | File |          | 3.0 KB  | a week ago | a week ago
 1  | sum.rs        | File |          | 3.0 KB  | a week ago | a week ago 
 2  | inc.rs        | File |          | 11.8 KB | a week ago | a week ago 
 3  | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago 
 4  | edit.rs       | File |          | 2.7 KB  | a week ago | a week ago 
 5  | str.rs        | File |          | 21.4 KB | 5 days ago | 5 days ago 
 6  | secret.rs     | File |          | 1.8 KB  | 2 days ago | 2 days ago 
 7  | skip.rs       | File |          | 1.7 KB  | a week ago | a week ago 
 8  | binaryview.rs | File |          | 13.0 KB | a week ago | a week ago 
 9  | tree.rs       | File |          | 3.0 KB  | a week ago | a week ago 
 10 | add.rs        | File |          | 2.7 KB  | a week ago | a week ago 
 11 | textview.rs   | File |          | 9.4 KB  | 5 days ago | 5 days ago 
----+---------------+------+----------+---------+------------+------------
```

Podemos agora comparar os dois para ver se há algum plugin faltando ou a mais que precisemos adicionao ao nosso arquivo (claramente precisamos adicionar o plugin `doc.rs` que criamos ao arquivo "Cargo.toml"!).
