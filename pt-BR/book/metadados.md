# Metadados

Usando o Nu vocë pode se deparar com momentos em que sente como se houvesse algo a mais acontecendo nos bastidores. Por exemplo, digamos que vocë vai tentar abrir um arquivo mas se esquece que ele é suportado pelo Nu e tenta convertê-lo novamente:

```nu
open Cargo.toml | from toml
# => error: Expected a string from pipeline
# => - shell:1:18
# => 1 | open Cargo.toml | from toml
# =>   |                   ^^^^^^^^^ requires string input
# => - shell:1:5
# => 1 | open Cargo.toml | from toml
# =>   |      ---------- object originates from here
```

A mensagem de erro nos diz não só que o que passamos para o `from toml` não era uma string, mas também de onde o valor veio originalmente. Como o Nu sabe isso?

Valores que fluem pelo pipeline do Nu normalmente trazem consigo um conjunto adicional de informações, ou metadados, conhecidos como tags, semnelhantes às etiquetas penduradas nos produtos de uma loja. Essas tags não afetam os dados, mas proporcionam ao Nu uma forma de aprimorar a experiência de se trabalhar com esses dados.

Vamos executar o comando `open` de novo, mas, dessa vez, vamos olhar as tags que ele retorna:

```nu
open Cargo.toml | tags
# => ----------+----------------------------------------
# =>  span     | origin
# => ----------+----------------------------------------
# =>  [object] | /home/sophia/Source/nushell/Cargo.toml
# => ----------+----------------------------------------
```

Atualmente, rastreamos dois pedaços de metadados dos valores no pipeline. Você pode observar que temos a origem, que nos dá a localização de onde os dados foram carregados, o que pode ajudar o Nu a entender melhor como apresentá-los.

Há também um coluna intervalo (span). Vamos ver mais de perto:

```nu
open Cargo.toml | tags | get span
# => -------+-----
# =>  start | end
# => -------+-----
# =>  5     | 15
# => -------+-----
```

O início (start) e fim (end) do intervalo aqui se referem a onde o sublinhado ficará na linha da mensagem de erro. Se você contar até depois do 5 e então até 15, verá que esse intervalo coincide com o nome do arquivo "Cargo.toml". É assim que o erro que vimos antes sabe onde sublinhar a mensagem.
