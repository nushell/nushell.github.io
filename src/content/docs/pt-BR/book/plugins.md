---
title: Plugins
---

A funcionalidade do Nu pode ser extendida usando plugins. Os plugins podem desenpenhar muitas das mesmas operações que os comandos embutidos do Nu, com o benefício adicional de que eles podem ser incluídos separadamente do Nu em si.

Para adicionar um plugin, simplesmente implemente-o e coloque o binário no seu PATH. Os nomes dos arquivos de plugins do Nu começam com `nu_plugin_` para que o Nu possa encontrá-los em meio aos outros binários no seu PATH.

**Nota:** no futuro, plugins podem ter um local específico em precisem ser colocados a fim de que o Nu possa encontrá-los.

Quando o Nu inicia, ele faz uma busca no sistema e carrega os plugins que encontra.

O protocolo que os plugins do Nu usam estão sujeitos a mudar enquanto o Nu estiver em pleno desenvolvimento. O melhor lugar para aprender mais sobre o protocolo e como criar seus próprios plugins é lendo o código fonte para os [plugins no repositório do Nu](https://github.com/nushell/nushell/tree/master/src/plugins). Você pode também se dirigir ao [capítulo de plugins no livro do colaborador](https://github.com/nushell/contributor-book/blob/master/en/plugins.md).
