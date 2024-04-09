# Introdução

Olá! Seja bem vindo ao projeto Nushell. O objetivo desse projeto é trazer a filosofia de shells do Unix, onde pipes conectam comandos simples, para o estilo moderno de desenvolvimento.

Nu usa dicas de vários terrenos familiares: shells tradicionais como bash, shells avançados como PowerShell, programação funcional, programação de sistemas, e outros. Porém, mais do que tentar ser "pau pra toda obra", Nu foca sua energia em fazer poucas coisas muito bem:

- Criar um shell multiplataforma flexível para o programador moderno da era GitHub
- Permitir que você combine aplicações de linha de comando com um shell que entende a estrutura dos seus dados
- Ter o mesmo nível de polimento de UX (experência do usuário) fornecido pelas aplicações CLI modernas

O jeito mais fácil de ver o que o Nu pode fazer é começar com alguns exemplos, então vamos nessa.

A primeira coisa que você vai perceber quando rodar um comando como `ls` é que ao invés de um bloco de texto, você recebe de volta uma tabela estruturada.

```nu
> ls
----+------------------+-----------+----------+----------+----------------+----------------
 #  | name             | type      | readonly | size     | accessed       | modified
----+------------------+-----------+----------+----------+----------------+----------------
 0  | .azure           | Directory |          | 4.1 KB   | 2 months ago   | a week ago
 1  | IMG_1291.jpg     | File      |          | 115.5 KB | a month ago    | 4 months ago
 2  | Cargo.toml       | File      |          | 3.1 KB   | 17 minutes ago | 17 minutes ago
 3  | LICENSE          | File      |          | 1.1 KB   | 2 months ago   | 2 months ago
 4  | readonly.txt     | File      | readonly | <empty>  | a month ago    | a month ago
 5  | target           | Directory |          | 4.1 KB   | 2 days ago     | 15 minutes ago
...
```

Essa tabela faz mais do que somente mostrar o diretório de um jeito diferente. Assim como uma planilha, ela nos permite trabalhar com os dados interativamente.

A primeira coisa que vamos fazer é ordenar a tabela por nome. Para isso, vamos direcionar a saída do `ls` para um comando capaz de ordenar tabelas com base no conteúdo de uma coluna.

```nu
> ls | sort-by name
----+------------------+-----------+----------+----------+----------------+----------------
 #  | name             | type      | readonly | size     | accessed       | modified
----+------------------+-----------+----------+----------+----------------+----------------
 0  | .azure           | Directory |          | 4.1 KB   | 2 months ago   | a week ago
 1  | .cargo           | Directory |          | 4.1 KB   | 2 months ago   | 2 months ago
 2  | .editorconfig    | File      |          | 148 B    | 2 months ago   | 2 months ago
 3  | .git             | Directory |          | 4.1 KB   | 2 months ago   | 20 minutes ago
 4  | .gitignore       | File      |          | 58 B     | a week ago     | a week ago
 5  | .vscode          | Directory |          | 4.1 KB   | a month ago    | a month ago
...
```

Você pode ver que, para fazer isso funcionar, não passamos parâmetros de linha de comando para o `ls`. Ao invés disso, usamos o comando `sort-by`, fornecido pelo Nu, para ordenar a saída do comando `ls`.

O Nu fornece muitos comandos que trabalham com tabelas. Por exemplo, podemos filtrar o conteúdo da tabela do `ls` para que ela mostre apenas os arquivos com mais de 4 kilobytes:

```nu
> ls | where size > 4kb
----+----------------+------+----------+----------+----------------+----------------
 #  | name           | type | readonly | size     | accessed       | modified
----+----------------+------+----------+----------+----------------+----------------
 0  | IMG_1291.jpg   | File |          | 115.5 KB | a month ago    | 4 months ago
 1  | README.md      | File |          | 11.1 KB  | 2 days ago     | 2 days ago
 2  | IMG_1291.png   | File |          | 589.0 KB | a month ago    | a month ago
 3  | IMG_1381.jpg   | File |          | 81.0 KB  | a month ago    | 4 months ago
 4  | butterfly.jpeg | File |          | 4.2 KB   | a month ago    | a month ago
 5  | Cargo.lock     | File |          | 199.6 KB | 22 minutes ago | 22 minutes ago
```

Assim como na filosofia Unix, fazer os comandos conversarem uns com os outros nos permite combiná-los de muitas maneiras diferentes. Vamos ver outro comando:

```nu
> ps
-----+-------+----------+------+--------------------------------------------------------------------------------
 #   | pid   | status   | cpu  | name
-----+-------+----------+------+--------------------------------------------------------------------------------
 0   | 1003  | Unknown  | 0.00 |
 1   | 1515  | Sleeping | 0.00 | /usr/lib/gnome-settings-daemon/gsd-screensaver-proxy
 2   | 2128  | Sleeping | 0.00 | /usr/lib/gnome-settings-daemon/gsd-screensaver-proxy
 3   | 2285  | Unknown  | 0.00 |
 4   | 8872  | Sleeping | 0.00 | /usr/lib/gvfs/gvfsd-dnssd--spawner:1.23/org/gtk/gvfs/exec_spaw/4
 5   | 1594  | Sleeping | 0.00 | /usr/lib/ibus/ibus-engine-simple
```

Você deve conhecer o comando `ps` se já usou Linux. Com ele, vemos uma lista com todos os processos que o sistema está rodando atualmente, seus estados e seus nomes. Também podemos ver a carga de CPU para cada processo.

E se quiséssemos mostrar somente os processos que estão usando a CPU de fato? Exatamente como fizemos com o comando `ls` anteriormente, podemos também manipular a tabela que o comando `ps` nos retorna:

```nu
> ps | where cpu > 10
---+-------+----------+-------+-----------------------------
 # | pid   | status   | cpu   | name
---+-------+----------+-------+-----------------------------
 0 | 1992  | Sleeping | 44.52 | /usr/bin/gnome-shell
 1 | 1069  | Sleeping | 16.15 |
 2 | 24116 | Sleeping | 13.70 | /opt/google/chrome/chrome
 3 | 21976 | Sleeping | 12.67 | /usr/share/discord/Discord
```

Até agora vimos como usar `ls` e `ps` para listar arquivos e processos. O Nu também oferece outros comandos que podem criar tabelas com informações úteis. A seguir vamos explorar `date` e `sys`.

Ao executar `date` obtemos informações sobre a data e hora correntes:

```nu
> date
------+-------+-----+------+--------+--------+----------
 year | month | day | hour | minute | second | timezone
------+-------+-----+------+--------+--------+----------
 2019 | 8     | 17  | 19   | 20     | 50     | +12:00
------+-------+-----+------+--------+--------+----------
```

E ao executar `sys` obtemos informações sobre o sistema em que o Nu está rodando:

```nu
> sys
----------+----------+-----------+----------+-----------+-----------
 host     | cpu      | disks     | mem      | temp      | net
----------+----------+-----------+----------+-----------+-----------
 [object] | [object] | [3 items] | [object] | [3 items] | [3 items]
----------+----------+-----------+----------+-----------+-----------
```

Essa tabela é um pouco diferente das que vimos antes. O comando `sys` retorna uma tabela que contém tabelas estruturadas em suas células, ao invés de valores simples. Para dar uma olhada nesses dados, precisamos selecionar a coluna que queremos ver:

```nu
> sys | get host
-------+------------------+----------+--------+----------+----------
 name  | release          | hostname | arch   | uptime   | users
-------+------------------+----------+--------+----------+----------
 Linux | 5.0.0-21-generic | pop-os   | x86_64 | [object] | [1 item]
-------+------------------+----------+--------+----------+----------
```

O comando `get` permite que tenhamos acesso ao conteúdo de uma coluna da tabela. Aqui, estamos olhando para dentro da coluna `host`, que contém informações a respeito da máquina host em que o Nu está rodando, como nome do SO (sistema operacional), o nome de host, a CPU e outros dados mais. Vamos ver os nomes dos usuários do sistema:

```nu
> sys | get host.users
sophia
```

Nesse momento só tem um único usuário no sistema, chamado "sophia". Note que nós podemos passar um caminho e não apenas o nome de uma coluna. O Nu vai seguir esse caminho até o dado correspondente na tabela.

Talvez você tenha notado mais alguma coisa de diferente. Ao invés de uma tabela, recebemos apenas um elemento simples: a string "sophia". O Nu trabalha tanto com tabelas de dados como com strings, que são uma parte importante da interação com comandos externos ao Nu.

Vejamos como as strings funcionam fora do Nu. Vamos usar nosso exemplo anterior e executar o comando externo `echo`, presente na maioria dos SOs:

```nu
> sys | get host.users | echo $it
sophia
```

Se isso lhe parece bastante similar ao que tínhamos anteriormente, você tem um olho afiado! É similar, mas com uma diferença importante: chamamos `echo` com o valor retornado antes. Isso permite que passemos dados para o `echo` fora do Nu (ou para qualquer outro comando de fora do Nu, como `git`, por exemplo).

_Nota: você pode obter um texto de ajuda para quaisquer comandos embutidos do Nu usando o comando `help`_:

```nu
> help config
Configuration management.
Usage:
  > config <subcommand> {flags}

Subcommands:
  config get -
  config set -
  config set_into -
  config clear -
  config load -
  config remove -
  config path -

Flags:
  -h, --help: Display this help message
```
