# Reedline, o editor de linha do Nu

O editor de linha Reedline do Nushell é um leitor de linha multiplataforma projetado para ser modular e flexível. O motor é responsável por controlar o histórico de comandos, validações, preenchimentos, dicas e pintura da tela.

## Configuração
### Modo de edição

Reedline permite você editar o texto usando dois modos: vi e emacs. Se não especificado, o modo padrão é o modo emacs. No intuito de selecionar o seu favorito, você precisa modificar o arquivo config e escrever nele seu modo favorito.

Por exemplo:
```nu
$env.config = {
    ...
    edit_mode: emacs
    ...
  }
```
### Padrão da combinação de teclas

Cada modo de edição vem com teclas de atalho usuais para edição de texto no vi e emacs.

### Combinação de teclas para Emacs e Vi
| Tecla         | Evento                       |
|---------------|------------------------------|
| Esc           | Esc                          |
| Backspace     | Backspace                    |
| End           | Mover para o final da linha  |
| End           | Completar dica de histórico  |
| Home          | Mover para o início da linha |
| Ctrl + c      | Cancelar linha atual         |
| Ctrl + l      | Limpar tela                  |
| Ctrl + r      | Pesquisar histórico          |
| Ctrl + Right  | Completar palavra do histórico|
| Ctrl + Right  | Mover palavra para a direita  |
| Ctrl + Left   | Mover palavra para a esquerda |
| Up            | Mover menu para cima         |
| Up            | Mover para cima              |
| Down          | Mover menu para baixo        |
| Down          | Mover para baixo             |
| Left          | Mover menu para a esquerda   |
| Left          | Mover para a esquerda        |
| Right         | Completar dica de histórico  |
| Right         | Mover menu para a direita    |
| Right         | Mover para a direita         |
| Ctrl + b      | Mover menu para a esquerda   |
| Ctrl + b      | Mover para a esquerda        |
| Ctrl + f      | Completar dica de histórico  |
| Ctrl + f      | Mover menu para a direita    |
| Ctrl + f      | Mover para a direita         |
| Ctrl + p      | Mover menu para cima         |
| Ctrl + p      | Mover para cima              |
| Ctrl + n      | Mover menu para baixo        |
| Ctrl + n      | Mover para baixo             |

### Vi Bindings Normais
| Tecla         | Evento                       |
|---------------|------------------------------|
| Ctrl + c      | Cancelar linha atual         |
| Ctrl + l      | Limpar tela                  |
| Up            | Mover menu para cima         |
| Up            | Mover para cima              |
| Down          | Mover menu para baixo        |
| Down          | Mover para baixo             |
| Left          | Mover menu para a esquerda   |
| Left          | Mover para a esquerda        |
| Right         | Mover menu para a direita    |
| Right         | Mover para a direita         |

Além das teclas de atalho anteriores, enquanto estiver no modo normal do Vi, você pode usar o modo clássico do Vi para executar ações selecionando um movimento ou uma ação. As opções disponíveis para as combinações são:

### Vi Movimentos Normais
| Tecla | Movimento         |
|-------|-------------------|
| w     | Palavra           |
| d     | Fim da linha      |
| 0     | Início da linha   |
| $     | Fim da linha      |
| f     | Direita até char  |
| t     | Antes à direita char|
| F     | À esquerda até char|
| T     | Antes à esquerda char|

### Vi Ações Normais
| Tecla | Ação                |
|-------|---------------------|
| d     | Deletar             |
| p     | Colar depois        |
| P     | Colar antes         |
| h     | Mover para a esquerda|
| l     | Mover para a direita |
| j     | Mover para baixo    |
| k     | Mover para cima     |
| w     | Mover palavra para a direita|
| b     | Mover palavra para a esquerda|
| i     | Entrar no modo de inserção Vi no caractere atual|
| a     | Entrar no modo de inserção Vi após o caractere atual|
| 0     | Mover para o início da linha|
| ^     | Mover para o início da linha|
| $     | Mover para o final da linha|
| u     | Desfazer            |
| c     | Mudar               |
| x     | Deletar caractere   |
| s     | Pesquisar histórico |
| D     | Deletar até o final |
| A     | Anexar ao final     |

## Histórico de comando
Conforme mencionado anteriormente, o Reedline gerencia e armazena todos os comandos que são editados e enviados para o Nushell. Para configurar o número máximo de registros que o Reedline deve armazenar, você precisará ajustar esse valor no seu arquivo de configuração:

```nu
  $env.config = {
    ...
    history: {
      ...
      max_size: 1000
      ...
    }
    ...
  }
```

## Customizando o prompt

O reedline prompt também é altamente customizável. Na ideia de construir o prompt perfeito, você pode definir as próximas variáveis de ambiente no seu arquivo config:

``` nu
# Use nushell functions to define your right and left prompt
def create_left_prompt [] {
    let path_segment = ($env.PWD)

    $path_segment
}

def create_right_prompt [] {
    let time_segment = ([
        (date now | format date '%m/%d/%Y %r')
    ] | str join)

    $time_segment
}

$env.PROMPT_COMMAND = { create_left_prompt }
$env.PROMPT_COMMAND_RIGHT = { create_right_prompt }
```
>**DICA**
<br>Você não precisa definir as variáveis de ambiente usando funções do Nushell. Você pode usar strings simples para defini-las.

Você também pode personalizar o indicador do prompt para o editor de linha modificando as seguintes variáveis de ambiente.

```nu
$env.PROMPT_INDICATOR = "〉"
$env.PROMPT_INDICATOR_VI_INSERT = ": "
$env.PROMPT_INDICATOR_VI_NORMAL = "〉"
$env.PROMPT_MULTILINE_INDICATOR = "::: "
```
>**DICA**
<br>Os indicadores de prompt são variáveis de ambiente que representam o estado do prompt.

## Teclas de atalho
Teclas de atalho do Reedline são constructos poderosos que te permitem construir uma cadeia de eventos que pode ser desencadeada com uma específica combinação de teclas.

Por exemplo, vamos dizer que você gostaria de mapear o menu de conclusão para a combinação de teclas `Ctrl + t` (o padrão é `tab`). Você pode adicionar a seguinte entrada ao seu arquivo de configuração.

```nu
$env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: { send: menu name: completion_menu }
      }
    ]

    ...
  }
```
Após carregar esse novo config.nu, seu novo atalho (`Ctrl + t`) irá abrir o menu de conclusão. 

Cada atalho requer os seguintes elementos:

- name: Nome único para seu atalho para fácil referência for easy reference in `$config.keybindings`
- modifier: Uma chave modificadora para o atalho. As opções são:
    + none
    + control
    + alt
    + shift
    + shift_alt
    + alt_shift
    + control_alt
    + alt_control
    + control_shift
    + shift_control
    + control_alt_shift
    + control_shift_alt
- keycode: Representa a tecla a ser apertada.
- mode: emacs, vi_insert, vi_normal (uma simples string ou lista. ex: [`vi_insert` `vi_normal`])
-event: O tipo de evento que vai ser associado pelo atalho. As opções são: 
    + send
    + edit
    + until

>**DICA**
<br> Todas as opções disponíveis de modificadores, códigos de teclas e eventos podem ser encontradas com o comando `keybindings list`.

>**DICA**
<br>As teclas de atalho adicionadas ao modo `vi_insert` estarão disponíveis quando o editor de linha estiver no modo de inserção (quando você pode escrever texto), e as teclas de atalho marcadas com `vi_normal` estarão disponíveis quando estiver no modo normal (quando o cursor se move usando h, j, k ou l).

A seção de evento (event) da entrada de teclas é onde as ações a serem realizadas são definidas. Neste campo, você pode usar tanto um registro (record) quanto uma lista de registros. Algo como:

```nu
  ...
  event: { send: Enter }
  ...
```
ou 

```nu
 ...
  event: [
    { edit: Clear }
    { send: Enter }
  ]
  ...
```
O primeiro exemplo de teclas de atalho mostrado nesta página segue o primeiro caso; um único evento é enviado para o mecanismo.

A próxima tecla de atalho é um exemplo de uma série de eventos enviados para o mecanismo. Primeiro, ela limpa o prompt, insere uma string e, em seguida, entra com esse valor.
```nu
  $env.config = {
    ...

    keybindings: [
    {
      name: change_dir_with_fzf
      modifier: CONTROL
      keycode: Char_t
      mode: emacs
      event:[
          { edit: Clear }
          { edit: InsertString,
            value: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"

          }
          { send: Enter }
        ]
    }

    ...
  }
```
Uma desvantagem da tecla de atalho anterior é o fato de que o texto inserido será processado pelo validador e salvo no histórico, tornando a tecla de atalho um pouco mais lenta e populando o histórico de comandos com o mesmo comando. Por esse motivo, existe o tipo de evento `executehostcommand`. O próximo exemplo faz o mesmo que o anterior, de uma maneira mais simples, enviando um único evento para o mecanismo.

```nu
  $env.config = {
    ...

    keybindings: [
    {
      name: change_dir_with_fzf
      modifier: CONTROL
      keycode: Char_y
      mode: emacs
      event: {
        send: executehostcommand,
        cmd: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
      }
    }
  ]

    ...
  }
```
Antes de continuarmos, você deve ter percebido que a sintaxe muda para edições e envios, e por esse motivo é importante explicá-las um pouco mais. Um "send" é todo evento do Reedline que pode ser processado pelo mecanismo, e uma "edit" são todos os EditCommands que podem ser processados pelo mecanismo.

### Tipo de envio
Para encontrar todas as opções disponíveis para o envio, você pode usar:
```nu
keybindings list | where type == events
```
E a sintaxe para eventos de envio é a seguinte:
```nu
    ...
      event: { send: <NAME OF EVENT FROM LIST> }
    ...
```
>**DICA**
<br>Você pode escrever o nome dos eventos em letras maiúsculas. O analisador de teclas de atalho é insensível a maiúsculas e minúsculas.

Há duas exceções a essa regra: o Menu e o ExecuteHostCommand. Esses dois eventos exigem um campo extra para serem completos. O Menu precisa do nome do menu a ser ativado (completion_menu ou history_menu).

```nu
 ...
      event: {
        send: menu
        name: completion_menu
      }
    ...
```
E o ExecuteHostCommand requer um comando válido que será enviado para o mecanismo.

```nu
    ...
      event: {
        send: executehostcommand
        cmd: "cd ~"
      }
    ...
```
Vale mencionar que na lista de eventos você também verá Edit([]), Multiple([]) e UntilFound([]). Essas opções não estão disponíveis para o analisador, pois são construídas com base na definição da tecla de atalho. Por exemplo, um evento Multiple([]) é construído para você ao definir uma lista de registros no evento da tecla de atalho. Um evento Edit([]) é o mesmo que o tipo de edição mencionado anteriormente. E o evento UntilFound([]) é o mesmo que o tipo until mencionado antes. 

### Tipo de edição

O tipo `edit` é a simplificação do evento `Edit([])`. O tipo de evento simplifica a definição de eventos de edição complexos para as teclas de atalho. Para listar as opções disponíveis, você pode usar o seguinte comando:

```nu
keybindings list | where type == edits
```
A sintaxe usual para uma edição é a seguinte:

```nu
  ...
      event: { edit: <NAME OF EDIT FROM LIST> }
    ...
```
A sintaxe para as edições na lista que têm um `()` muda um pouco. Como essas edições exigem um valor extra para serem totalmente definidas. Por exemplo, se quisermos inserir uma string onde o prompt está localizado, então você terá que usar:

```nu
    ...
      event: {
        edit: insertstring
        value: "MY NEW STRING"
      }
    ...
```
Ou digamos que você queira mover para a direita até o primeiro "S":
```nu
 ...
      event: {
        edit: moverightuntil
        value: "S"
      }
    ...
```
### Tipo Until
Para concluir esta explanação sobre teclas de atalho, precisamos discutir o tipo `until` para eventos. Como você viu até agora, você pode enviar um único evento ou uma lista de eventos. E, como vimos, quando uma lista de eventos é enviada, cada um deles é processado.

No entanto, pode haver casos em que você deseja atribuir eventos diferentes à mesma tecla de atalho. Isso é especialmente útil com menus do Nushell. Por exemplo, digamos que você ainda queira ativar seu menu de conclusão com Ctrl + t, mas também deseja mover para o próximo elemento no menu assim que ele for ativado, usando a mesma tecla de atalho.

Para esses casos, temos a palavra-chave `until`. Os eventos listados dentro do evento `until` serão processados um por um, com a diferença de que assim que um for bem-sucedido, o processamento do evento é interrompido.

A próxima tecla de atalho representa esse caso.
```nu
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: {
          until: [
            { send: menu name: completion_menu }
            { send: menunext }
          ]
        }
      }
    ]

    ...
  }
```
A tecla de atalho anterior primeiro tentará abrir um menu de conclusão. Se o menu não estiver ativo, ele o ativará e enviará um sinal de sucesso. Se a tecla de atalho for pressionada novamente, como há um menu ativo, o próximo evento enviado será o `MenuNext`, o que significa que moverá o seletor para o próximo elemento no menu.

Como você pode ver, a palavra-chave `until` nos permite definir dois eventos para a mesma tecla de atalho. No momento desta redação, apenas os eventos de Menu permitem esse tipo de camada. Os outros tipos de evento não relacionados a menus sempre retornarão um valor de sucesso, significando que o evento `until` será interrompido assim que atingir o comando.

Por exemplo, a próxima tecla de atalho sempre enviará um comando "down" porque esse evento é sempre bem-sucedido.
```nu
$env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: {
          until: [
            { send: down }
            { send: menu name: completion_menu }
            { send: menunext }
          ]
        }
      }
    ]

    ...
  }
```
### Removendo o atalho padrão
Se você deseja remover uma determinada tecla de atalho padrão sem substituí-la por uma ação diferente, você pode definir `event: null`.

Por exemplo, para desativar a limpeza da tela com Ctrl + l para todos os modos de edição:
```nu
  $env.config = {
    ...

    keybindings: [
      {
        modifier: control
        keycode: char_l
        mode: [emacs, vi_normal, vi_insert]
        event: null
      }
    ]

    ...
  }
```
### Resolução de problemas com problemas de teclas de atalho

Seu ambiente de terminal nem sempre pode propagar suas combinações de teclas para o Nushell da maneira que você espera. Você pode usar o comando `keybindings listen` para descobrir se determinadas teclas são realmente recebidas pelo Nushell e como.

## Menus

Graças ao Reedline, o Nushell possui menus que podem auxiliar em suas tarefas diárias de scripting no shell. A seguir, apresentamos os menus padrão que estão sempre disponíveis ao usar o Nushell.

### Menu de Ajuda

O menu de ajuda está lá para facilitar sua transição para o Nushell. Suponha que você esteja montando uma incrível sequência de comandos e, de repente, esqueça o comando interno que inverteria uma string para você. Em vez de excluir sua sequência de comandos, você pode ativar o menu de ajuda com F1. Uma vez ativo, basta digitar palavras-chave para o comando que você está procurando, e o menu mostrará os comandos que correspondem à sua entrada. A correspondência é feita no nome dos comandos ou na descrição dos comandos.

Para navegar pelo menu, você pode selecionar o próximo elemento usando a tecla Tab, pode rolar a descrição pressionando para a esquerda ou para a direita e até mesmo colar exemplos de comandos disponíveis na linha.

O menu de ajuda pode ser configurado modificando os seguintes parâmetros:
```nu
$env.config = {
    ...

    menus = [
      ...
      {
        name: help_menu
        only_buffer_difference: true # Search is done on the text written after activating the menu
        marker: "? "                 # Indicator that appears with the menu is active
        type: {
            layout: description      # Type of menu
            columns: 4               # Number of columns where the options are displayed
            col_width: 20            # Optional value. If missing all the screen width is used to calculate column width
            col_padding: 2           # Padding between columns
            selection_rows: 4        # Number of rows allowed to display found options
            description_rows: 10     # Number of rows allowed to display command description
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```
### Menu de Conclusão

O menu de conclusão é um menu sensível ao contexto que apresentará sugestões com base no estado do prompt. Essas sugestões podem variar de sugestões de caminho a alternativas de comando. Ao escrever um comando, você pode ativar o menu para ver as opções de flags disponíveis para um comando interno. Além disso, se você definiu completions personalizados para comandos externos, esses também aparecerão no menu.

O menu de conclusão, por padrão, é acessado pressionando a tecla Tab e pode ser configurado modificando esses valores no objeto de configuração:
Ao modificar esses parâmetros, você pode personalizar o layout do seu menu de acordo com suas preferências.

### Menu de Histórico

O menu de histórico é uma maneira útil de acessar o histórico do editor. Ao ativar o menu (padrão `Ctrl+r``), o histórico de comandos é apresentado em ordem cronológica reversa, tornando extremamente fácil selecionar um comando anterior.

O menu de histórico pode ser configurado modificando esses valores no objeto de configuração:

```nu
  $env.config = {
    ...

    menus: [
      ...
      {
        name: completion_menu
        only_buffer_difference: false # Search is done on the text written after activating the menu
        marker: "| "                  # Indicator that appears with the menu is active
        type: {
            layout: columnar          # Type of menu
            columns: 4                # Number of columns where the options are displayed
            col_width: 20             # Optional value. If missing all the screen width is used to calculate column width
            col_padding: 2            # Padding between columns
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```
Ao modificar esses parâmetros, você pode personalizar o layout do seu menu de acordo com suas preferências.

### Menu de histórico

O menu de histórico é uma maneira útil de acessar o histórico do editor. Ao ativar o menu (padrão `Ctrl+r``), o histórico de comandos é apresentado em ordem cronológica reversa, tornando extremamente fácil selecionar um comando anterior.

O menu de histórico pode ser configurado modificando esses valores no objeto de configuração:

```nu
$env.config = {
    ...

    menus = [
      ...
      {
        name: history_menu
        only_buffer_difference: true # Search is done on the text written after activating the menu
        marker: "? "                 # Indicator that appears with the menu is active
        type: {
            layout: list             # Type of menu
            page_size: 10            # Number of entries that will presented when activating the menu
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```
Quando o menu de histórico é ativado, ele busca registros da história em lotes (`page_size`) e os apresenta no menu. Se houver espaço no terminal, quando você pressiona Ctrl+x novamente, o menu buscará o mesmo número de registros e os acrescentará à página atual. Se não for possível apresentar todos os registros obtidos, o menu criará uma nova página. As páginas podem ser navegadas pressionando Ctrl+z para ir para a página anterior ou Ctrl+x para ir para a próxima página.

### Pesquisando no Histórico

Para pesquisar no seu histórico, você pode começar a digitar palavras-chave para o comando que está procurando. Uma vez que o menu é ativado, tudo o que você digitar será substituído pelo comando selecionado do seu histórico. Por exemplo, suponha que você já tenha digitado isso:

```nu
let a = ()
```
você pode posicionar o cursor dentro dos parênteses `()` e ativar o menu. Você pode filtrar o histórico digitando palavras-chave e assim que selecionar uma entrada, as palavras digitadas serão substituídas.

```nu
let a = (ls | where size > 10MiB)
```
Outra característica interessante do menu é a capacidade de selecionar rapidamente algo dele. Suponha que você tenha ativado o seu menu e ele pareça assim:

```nu
>
0: ls | where size > 10MiB
1: ls | where size > 20MiB
2: ls | where size > 30MiB
3: ls | where size > 40MiB
```
Em vez de pressionar para baixo para selecionar a quarta entrada, você pode digitar `!3`` e pressionar Enter. Isso irá inserir o texto selecionado na posição do prompt, economizando tempo rolando pelo menu.

A pesquisa no histórico e a seleção rápida podem ser usadas juntas. Você pode ativar o menu, fazer uma pesquisa rápida e, em seguida, fazer uma seleção rápida usando o caractere de seleção rápida.

### Menus Definidos pelo Usuário

Caso você ache que os menus padrão não são suficientes para suas necessidades e tenha a necessidade de criar seu próprio menu, o Nushell pode ajudar nisso.

Para adicionar um novo menu que atenda às suas necessidades, você pode usar um dos layouts padrão como modelo. Os modelos disponíveis no Nushell são columnar (colunar), list (lista) ou description (descrição).

O menu do tipo columnar mostrará dados de maneira colunar, ajustando o número de colunas com base no tamanho do texto exibido em suas colunas.

O tipo de menu list sempre exibirá sugestões como uma lista, dando a opção de selecionar valores usando `!` mais a combinação de número.

O tipo description fornecerá mais espaço para exibir uma descrição para alguns valores, juntamente com informações extras que podem ser inseridas no buffer.

Digamos que queremos criar um menu que exiba todas as variáveis criadas durante sua sessão, chamaremos isso de `vars_menu``. Este menu usará um layout de lista (layout: list). Para pesquisar valores, queremos usar apenas as coisas que são escritas após o menu ter sido ativado (only_buffer_difference: true).

Com isso em mente, o menu desejado seria algo assim:

```nu
$env.config = {
    ...

    menus = [
      ...
      {
        name: vars_menu
        only_buffer_difference: true
        marker: "# "
        type: {
            layout: list
            page_size: 10
        }
        style: {
            text: green
            selected_text: green_reverse
            description_text: yellow
        }
        source: { |buffer, position|
            scope variables
            | where name =~ $buffer
            | sort-by name
            | each { |elt| {value: $elt.name description: $elt.type} }
        }
      }
      ...
    ]
    ...
```
Como você pode ver, o novo menu é idêntico ao `history_menu` descrito anteriormente. A única diferença significativa é o novo campo chamado `source`. O campo `source` é uma definição do Nushell dos valores que você deseja exibir no menu. Para este menu, estamos extraindo os dados de `scope variables` e estamos usando esses dados para criar registros que serão usados para popular o menu.

A estrutura necessária para o registro é a seguinte:

```nu
{
  value:       # The value that will be inserted in the buffer
  description: # Optional. Description that will be display with the selected value
  span: {      # Optional. Span indicating what section of the string will be replaced by the value
    start:
    end:
  }
  extra: [string] # Optional. A list of strings that will be displayed with the selected value. Only works with a description menu
}
```
Para que o menu exiba algo, pelo menos o campo value deve estar presente no registro resultante.

Para tornar o menu interativo, duas variáveis estão disponíveis no bloco: `$buffer` e `$position`. O `$buffer` contém o valor capturado pelo menu; quando a opção `only_buffer_difference` é verdadeira, `$buffer` é o texto escrito após a ativação do menu. Se `only_buffer_difference` for falso, `$buffer` é toda a string na linha. A variável `$position` pode ser usada para criar spans de substituição com base na ideia que você tinha para o seu menu. O valor de `$position` muda com base em se `only_buffer_difference` é verdadeiro ou falso. Quando é verdadeiro, `$position` é a posição inicial na string onde o texto foi inserido após a ativação do menu. Quando o valor é falso, `$position` indica a posição real do cursor.

Usando essas informações, você pode projetar seu menu para apresentar as informações que você precisa e substituir esse valor na localização desejada. A única coisa extra que você precisa para interagir com seu menu é definir uma tecla de atalho que ative seu menu recém-criado.

## Teclas de Atalho para Menus

Caso deseje alterar a maneira padrão como ambos os menus são ativados, você pode fazer isso definindo novas teclas de atalho. Por exemplo, as duas teclas de atalho a seguir atribuem os menus de conclusão e de histórico para Ctrl+t e Ctrl+y, respectivamente:

```nu
$env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: [vi_insert vi_normal]
        event: {
          until: [
            { send: menu name: completion_menu }
            { send: menupagenext }
          ]
        }
      }
      {
        name: history_menu
        modifier: control
        keycode: char_y
        mode: [vi_insert vi_normal]
        event: {
          until: [
            { send: menu name: history_menu }
            { send: menupagenext }
          ]
        }
      }
    ]

    ...
  }
```
