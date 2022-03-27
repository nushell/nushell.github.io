---
title: Comandos
---

# Comandos

Comandos são os blocos de construção para pipelines em Nu. Eles fazem a ação do pipeline, seja criando dados, mudando dados que fluem de entradas para saídas, ou visualizar dados assim que estes saem do pipeline. Existem dois tipos de comandos: comandos internos, que são comandos feitos para executar dentro do Nu, e comandos externos, que são externos ao Nu e se comunicam com o padrão Unix `stdin`/`stdout`.

## Comandos internos

Todos os comandos dentro do Nu, incluindo plugins, são comandos internos. Comandos internos se comunicam usando streams dos tipos [`Tagged<Value>`](https://github.com/nushell/nushell/blob/d30c40b40ebfbb411a503ad7c7bceae8029c6689/crates/nu-source/src/meta.rs#L91) e [ShellError](https://github.com/nushell/nushell/blob/main/crates/nu-errors/src/lib.rs#L179)

### Signature

Comandos usam uma checagem de tipo simples para garantir que os argumentos passados possam ser lidados corretamente. Para permitir isso, cada comando oferece uma Signature que informa o Nu:

- O nome do comando
- Os argumentos posicionauis (eg, em `start x y` o `x` e o `y`são argumentos posicionais)
- Se o comando recebe um número irrestrito de argumentos posicionais adicionais (eg, `start a1 a2 a3 ... a99 a100`)
- Os argumentos nomeados (eg, `start --now`)
- Se o comando é um filtro ou a saída

Com essa informação, um pipeline pode verificar problemas potenciais antes de ser executado.

## Comandos externos

Um comando externo é qualquer comando que não é parte dos comandos imbutidos no Nu ou em seus plugins. Se um comando desconhecido pelo Nu é chamado, o sistema subjacente vai ser chamado com os argumentos fornecidos em uma tentativa de invocar esse comando como um programa externo.

## Comunicação entre comandos externos e internos

### Interno para interno

Comandos internos se comunicam usando o valor completo da stream que o Nu fornece, que incluí todos os tipos de arquivos embutidos. Isso incluí a comunicação entre comandos internos e plugins (em ambas as direções).

### Interno para externo

Comandos internos que enviam texto para comandos externos precisam ter texto (strings) preparados antes do tempo. Se um objeto é enviado diretamente para um comando externo, isso é considerado um erro já que não é possível inferir de que maneira os dados estruturados devem ser representados para o comando externo. É esperado que o usuário. O usuário deve limitar-se a uma célula de dados simples ou usar um dos conversores de tipo de arquivo (como `to-json`) para converter a tabela em uma representação de string.
O comando externo é aberto para que seu `stdin` seja redirecionado, para que os dados possam ser enviados a ele.

### Externo para interno

Comandos internos enviam uma série de strings pelo seu `stdout`. Essas strings são lidas no pipeline e são disponibilizadas para o comando interno seguinte no pipeline, ou expostas para o usuário se o comando externo for o último passo do pipeline.

### Externo para externo

Comandos externos se comunicam através do `stdin`/`stdout`. Quando o Nu detectar essa situação, vai redirecionar o `stdout` do primeiro comando para o `stdin` do comando externo seguinte. Dessa forma, o comportamento esperado do pipeline do shell entre comandos externos é mantido.
