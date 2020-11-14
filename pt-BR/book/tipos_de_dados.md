# Tipos de dados

Tradicionalmente, comandos de shell do Unix comunicavam-se entre si através de strings de texto. Um comando gerava texto como saída através da saída padrão (normalmente abreviada como 'stdout') e o outro comando lia o texto pela entrada padrão (ou 'stdin'). Desse modo, os dois comandos podiam se comunicar.

Podemos pensar nesse tipo de comunicação como baseada em texto ou baseada em strings.

Nu adota essa abordagem para seus comandos e a amplia para incluir outros tipos de dados. Atualmente, Nu suporta dois tipos de dados: simples e estruturados.

## Dados simples

Como muitas linguagens de programação, Nu modela dados usando um conjunto de tipos de dados simples e estruturados. Tipos de dados simples incluem inteiros, decimais, strings, booleanos, datas e caminhos. Inclui também um tipo especial para tamanhos de arquivos.

### Inteiros

Números inteiros. Exemplos incluem 1, 5 e 100.

### Decimais

Decimais são números com um componente fracionário. Exemplos incluem 1.5, 2.0 e 15.333.

### Strings

Strings são a maneira fundamental de se representar texto. Aparecem entre aspas duplas. Exemplos incluem "Fred", "myname.txt" e "Lynchburg, VA".

Strings no Nu são compatíveis com Unicode por padrão, então pode-se usar texto UTF-8 com facilidade.

### Booleanos

Booleanos representam os valores verdadeiro ou falso. Ao invés de se escrever seus valores diretamente, são frequentemente o resultado de uma comparação.

### Datas

Datas e horários são mantidos juntos no tipo de dado Data. Valores de Data usados pelo sistema são compatíceis com fusos horários e usam o fuso UTC por padrão.

### Caminhos

Caminhos são uma forma independente de plataforma de se representar o caminho de um arquivo num dado sistema operacional. Exemplos incluem /usr/bin e C:\Users\file.txt.

### Bytes

Tamanhos de arquivos são mantidos num tipo especial de inteiros chamado bytes. Exemplos incluem 100, 15kb e 100mb.

## Dados estruturados

Dados estruturados são criados a partir de dados simples. Por exemplo, em vez de um inteiro simples, dados estruturados nos dão uma maneira de representar múltiplos inteiros no mesmo valor. Aqui está uma lista dos tipos de daods estruturados suportados atualmente: objetos, dados binários, listas e blocos.

### Objetos

O tipo de dados Objeto representa o que você veria em uma linha de dados em uma tabela. Ele tem diferentes elementos de dados e a cada elemento é dado um nome de coluna.

### Dados binários

Dados binários, como os dados de um arquivo de imagem, são um agrupamento cru de bytes.

### Listas

Listas podem guardar mais de um valor. Isso faz com que sejam um bom container para linhas de dados em uma tabela.

### Blocos

Blocos representam a bloco de código no Nu. Por exemplo, no comando `where { $it.size > 10kb }` o bloco é a porção contida entre chaves, `{ $it.size > 10kb }`. Blocos são uma maneira útil de representar código que pode ser executado em linha de dados.
