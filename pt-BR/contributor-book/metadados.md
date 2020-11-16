---
title: Metadados
---

# Metadados

Todos os valores que fluem para/de um comando no Nu são marcados com metadados. Você verá isso no código-fonte normalmente como um `Tagged<Value>`.

Apesar de os metadados que são monitorados ainda estão em fase inicial, esperamos expandir isso conforme o Nu amadurecer.
Atualmente, existem dois tipos de metadados monitorados em cada valor:

## Anchor

Anchor representa a localização de origem de um valor. Se o valor foi carregado de um arquivo, vai ser o nome do arquivo. Se foi carregado de uma URL, vai ser a URL, e assim por diante.

## Span

Um Span são as localizações de início e fim do valor que foi criado ou referenciado na linha de comando. Eles são normalmente vistos como o underline abaixo de uma mensagem de erro.

Enquanto spans de linguagens de programação tradicionalmente carregam também o arquivo de origem do span, aqui assumimos que um span While spans from programming languages traditionally also carry the file the span came from, aqui assumimos que o span  sempre abrange um valor referenciado na linha de comando, em vez de em um arquivo de origem. Quando o Nu for capaz de executar seus próprios arquivos fonte, isso provavelmente vai precisar ser revisado.
