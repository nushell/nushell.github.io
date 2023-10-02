# O pipeline

Um dos principais designs do Nu é o pipeline, uma ideia de design que tem suas raízes décadas atrás, na filosofia original por trás do Unix. Assim como Nu se extende a partir do tipo de dado string do Unix, também extende a ideia do pipeline para incluir mais do que apenas texto.

## Básico

Um pipeline é construído com três partes: a entrada, o filtro e a saída.

```nu
> open "Cargo.toml" | inc package.version | save "Cargo_new.toml"
```

O primeiro comando, `open "Cargo.toml"`, é uma entrada (às vezes também chamado de "fonte" ou "produtor"). Ele cria ou carrega dados com os quais alimenta o pipeline. É a partir da entrada que os pipelines conseguem dados para trabalhar. Comandos como `ls` também são entradas, já que pegam dados do sistema de arquivos e os enviam através dos pipelines para que possam ser usados adiante.

O segundo comando, `inc package.version`, é um filtro. Filtros recebem dados e normalmente fazem alguma coisa com eles. Podem mudá-los (como o comando `inc` no nosso exemplo), ou podem executar outra operação, como registro de log, conforme os valores passam.

O último comando, `save "Cargo_new.toml"`, é uma saída (às vezes chamado de "pia" ou "ralo"). Uma saída recebe dados do pipeline e executa alguma operação final sobre eles. No nosso exemplo, salvamos o que chega pelo pipeline em um arquivo como passo final. Outros tipos de comandos de saída podem exibir os dados para o usuário.

## Trabalhando com comandos externos

Os comandos do Nu se comunicam entre si usando tipos de dados fornecidos pelo próprio Nu (veja [tipos de dados](tipos_de_dados.md)), mas e os comandos de fora do Nu? Vejamos alguns exemplos de como trabalhar com comandos externos:

`comando_interno | comando_externo`

Dados fluem do comando_interno para o comando_externo. Espera-se que esses dados sejam strings, para que possam ser enviados para a entrada padrão (`stdin`) do comando_externo.

`comando_externo | comando_interno`

Dados vindo de um comando externo para o Nu são agrupados em uma string única e, então, passados para o comando_interno. Comandos como `lines` ajudam a trazer dados de comandos externos de modo a facilitar sua utilização.

`comando_externo_1 | comando_externo_2`

Nu trabalha com dados canalizados entre dois comandos externos da mesma maneira que em outros shells, como Bash. A saída padrão (`stdout`) do comando_externo_1 é conectada à entrada padrão (`stdin`) do comando_externo_2, permitindo que os dados fluam naturalmente entre os dois comandos.

## Nos bastidores

Você pode ter se perguntado como vemos uma tabela se o `ls` é uma entrada e não uma saída. Nu adiciona automaticamente por nós uma saída usando outro comando chamado `autoview`, que é adicionado a qualquer pipeline que não tenha uma saída que nos permita ver o resultado.

Com efeito, o comando:

```nu
> ls
```

E o pipeline:

```nu
> ls | autoview
```

São a mesma coisa.
