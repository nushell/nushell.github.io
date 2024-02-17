---
title: Complementos (plugins)
---

Se puede ampliar la funcionalidad de Nu a través de complementos. Los complementos pueden realizar muchas de las mismas operaciones que los comandos integrados de Nu con el beneficio adicional de que se pueden agregar separado de Nu.

Para agregar un complemento simplemente compílalo y colóca el binario en el PATH. Los complementos de Nu empiezan con `nu_plugin_` de manera que Nu pueda encontrarlos entre otros binarios en su PATH.

**Nota:** en el futuro los complementos pueden que tengan un lugar específico que deban ser puestos para Nu encontrarlos.

Cuándo Nu arranca escanea el sistema y carga los complementos que encuentre.

El protocolo que usan los complementos de Nu está sujetos a cambios mientras Nu está bajo fuerte desarrollo. El mejor lugar para aprender más sobre el protocolo y cómo crear tus propios complementos es leyendo el código fuente de los [complementos en el repositorio de Nu](https://github.com/nushell/nushell/tree/master/crates). También puedes dirigirte al [capítulo de plugins en el manual para contribuyentes de Nu](https://github.com/nushell/contributor-book/blob/master/en/plugins.md)
