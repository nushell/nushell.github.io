---
title: Metadatos
---

# Metadatos

Todos los valores que fluyen dentro y fuera de los comandos en Nu están etiquetadas con metadatos. Lo encontrarás comúnmente alrededor del código como `Tagged<Value>`

Aunque los metadatos que se rastrean sigue en sus primeros días, esperamos expandir esto a medida que Nu madure.

Actualmente, hay dos piezas de metadatos rastreados en cada valor:

## Origin

Origin representa la ubicación de donde vino originalmente el valor. Si el valor fue cargado desde un archivo, será el nombre del archivo. Si fue cargado desde una Url, serea la Url, y así sucesivamente.

Para ahorrar espacio y mantener los metadatos Copy(copiables), el origen se guarda como un UUID. Este identificador apunta a una tabla de búsqueda donde el UUID se puede traducir al origen completo.

## Span

Span(tramos) es la ubicación de inicio y fin del valor donde fue creado o referenciado en la línea de comandos. Estas se ven comúnmente representadas como el subrayado debajo de un mensaje de error.

Mientras los spans(tramos) de lenguajes de programación tradicionalmente también llevan el archivo del que proviene el tramo, aquí asumimos que el tramo siempre abarca un valor referenciado en la línea de comandos en lugar de un archivo de código fuente. A medida que Nu tenga la capacidad de ejecutar sus propios archivos de código fuente, esto probablemente tendrá que ser revisado.
