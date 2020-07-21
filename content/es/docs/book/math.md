---
layout: content
title: Matemáticas
prev: Aliases
next: Entorno
link_prev: /en/aliases.html
link_next: /en/entorno.html
---

Hay veces que simplemente necesitas sumar un par de números cuando te encuentras resolviendo problemas. Nu ofrece un conjunto de operaciones matemáticas básicas que puedes utilizar:

Para entrar al modo "math", empiezas el comando con `=`. Esto le informa a Nu que lo que estás a punto de escribir usará operadores. Algunos comandos, como `where` lo harán por ti implícitamente para que no tengas que hacerlo.

## Sumar, Restar, Mupltiplicar, Dividir

```
> = 1 + 3
4
```

En Nu puedes realizar lo usual: sumar, restar, mutiplicar y dividir con los operadores `+`, `-`, `*`, y `/` respectivamente. Precedencia de operadores es respetada, por lo que `1 + 2 * 3` será tratado como `1 + (2 * 3)`. Lo que nos lleva a paréntesis.

## Paréntesis

Puedes usar paréntesis para agrupar expresiones matemáticas en modo `math`. Esto te permite escribir `(1 + 2) * 3` si deseas que adición tenga mayor precedencia.

## `in:` y `not-in:`

Puedes revisar si un valor se encuentra dentro de un conjunto de valores o no, usando los operadores `in:` y `not-in:`.

```
> = 1 in: [1 2 3]
true
```

```
> = 1 not-in: [1 2 3]
false
```

## =~ y !~

Puedes revisar si una cadena se encuentra dentro de otra cadena o no, usando `=~` y `!~`.

```
> = "gallinagallo" =~ "gallo"
true
```

```
> = "gallinagallo" !~ "pollito"
true
```

## Comparaciones

Los siguientes comparadores también se encuentran disponibles:

* `<` - menor que
* `<=` - menor o igual que
* `>` - mayor que
* `>=` - mayor o igual que
* `==` - igual a
* `!=` - no es igual a

## Operadores Compuestos

Nushell también soporta `&&` y `||` para unir dos operaciones que regresen valores booleanos, usando `y` y `o` respectivamente. Por ejemplo: `ls | where name in: ["uno" "dos" "tres"] && size > 10kb`


