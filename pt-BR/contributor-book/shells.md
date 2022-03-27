---
title: Shells
---

# Shells

Talvez um conceito único de Nu seja o de `shells`, apesar de a ideia de trabalhar em diversos lugares ao mesmo tempo em um shell é bem comum (via pushd/popd, telas, e mais). O que talvez torne o Nu um pouco diferente é que o seu conceito de `shells` é de ambas plataformas e funciona tanto no sistema de arquivos quanto dentro de valores.

**Nota:** O conceito de um Value Shell é um de muitos fatores de design abertos e está sujeito a mudanças no futuro.

Um **Shell** é uma interface semelhante a um sistema de arquivos que descreve um conjunto de operações de arquivos e como operá-los, incluindo: `cd`, `ls`, `mkdir`, `rm`, `cp`, e `mv`. Nem todos os tipos de shells suportam todas as operações de arquivos, mas as operações de arquivos servem para tentar descrever o que um shell deveria fazer.

Os dois tipos de shell atualmente disponíveis são FilesystemShell and ValueShell, mas outros tipos de shells já foram discutidos.

## Filesystem Shell

O filesystem shell é um shell que trabalha diretamente com o sistema de arquivos e um arquivo correspondente. Por padrão, Nu inicia com um único filesystem shell no diretório atual.

```
> shells
━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━
   │ name       │ path
───┼────────────┼────────────────
 X │ filesystem │ /home/jonathan
━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━
```

Podemos adicionar mais um filesystem shell para essa lista usando o comando `enter`. Isso vai adicionar uma nova combinação shell+path para o nosso buffer circular de shells.

```
> enter Source
/home/jonathan/Source> shells
━━━┯━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━
 # │   │ name       │ path
───┼───┼────────────┼───────────────────────
 0 │   │ filesystem │ /home/jonathan
 1 │ X │ filesystem │ /home/jonathan/Source
━━━┷━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━
```

Dessa forma, você pode intercalar entre diretórios de trabalho. Note que atualmente o Nu não permite intercalar entre aplicações em execução, apenas diretórios de trabalho.

**Limitações**

Existem algumas limitações no filesystem shell no seu estado atual de desenvolvimento. Uma das limitações é que não é simples adicionar múltiplos caminhos no buffer circular de uma só vez (por exemplo: `enter $it`), já que cada adição ao buffer circular vai mudar o diretório atual. Essa limitação não é inerente ao design do buffer circular e em um design futuro seria desejável separar `enter` da mudança de diretório atual.

## Value Shell

O Value Shell da a habilidade de explorar um valor estruturado internamente ao carregar um arquivo e tratando seu conteúdo como se fosse um sistema de arquivos. Isso permite explorar os seus dados como um dos shells no buffer circular.

A implementação atual do Value Shell é limitada ao sub-conjunto de operações de leitura de operações de arquivo, isto é: `cd` e `ls`. Em designs futuros seria interessante expandir isso, mas existem perguntas abertas sobre alterar um arquivo aberto com `enter` e como o resto do ambiente observa essas mudanças (o que acontece se você usar enter no arquivo sendo usado pelo `config`?)

Em um Value Shell, o comando `cd`muda o caminho sendo observado como o "diretório atual" no objeto, mas na verdade é o caminho de campo. Isso significa que o caminho "/abc/def" é o caminho "abc.def" fora do Value Shell.
