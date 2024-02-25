---
title: Matemáticas
---

Hay veces que simplemente necesitas sumar un par de números cuando te encuentras resolviendo problemas. Nu ofrece un conjunto de operaciones matemáticas básicas que puedes utilizar. Expresiones matemáticas se encuentran disponibles cuando llamas a un comando.

## Sumar, Restar, Mupltiplicar, Dividir

```nu
> 1 + 3
4
```

En Nu puedes realizar lo usual: sumar, restar, mutiplicar y dividir con los operadores `+`, `-`, `*`, y `/` respectivamente. Precedencia de operadores es respetada, por lo que `1 + 2 * 3` será tratado como `1 + (2 * 3)`. Lo que nos lleva a paréntesis.

## Paréntesis

Puedes usar paréntesis para agrupar expresiones matemáticas en modo `math`. Esto te permite escribir `(1 + 2) * 3` si deseas que adición tenga mayor precedencia.

## `in` y `not-in`

Puedes revisar si un valor se encuentra dentro de un conjunto de valores o no, usando los operadores `in` y `not-in`.

```nu
> 1 in [1 2 3]
true
```

```nu
> 1 not-in [1 2 3]
false
```

## =~ y !~

Puedes revisar si una cadena se encuentra dentro de otra cadena o no, usando `=~` y `!~`.

```nu
> "gallinagallo" =~ "gallo"
true
```

```nu
> "gallinagallo" !~ "pollito"
true
```

## Comparaciones

Los siguientes comparadores también se encuentran disponibles:

- `<` - menor que
- `<=` - menor o igual que
- `>` - mayor que
- `>=` - mayor o igual que
- `==` - igual a
- `!=` - no es igual a

## Operadores Compuestos

Nushell también soporta `&&` y `||` para unir dos operaciones que regresen valores booleanos, usando `y` y `o` respectivamente. Por ejemplo: `ls | where name in ["uno" "dos" "tres"] && size > 10kb`

## Orden de operaciones

Las operaciones matemáticas son evaluadas de la siguiente manera (de mayor precedencia a menor):

- Parentesis (`()`)
- Multiplicación (`*`) y División (`/`)
- Suma (`+`) y Resta (`-`)

```nu
> 3 * (1 + 2)
9
```

## Modo matemático abreviado

Hay una variación abreviada "short-hand" en modo matemático incluída en Nushell. La razón se debe a que permite una forma de acceder columnas de manera más simple.

Es probable que ya la usaste antes. Por ejemplo, supongamos que deseamos ver filas de `ls` donde para cada uno por lo menos tenga 10 kilobytes, podemos escribir:

```nu
> ls | where size > 10kb
```

El comando `where memoria > 10kb` tiene dos partes: El nombre del comando `where` y su abreviación expresión matemática `size > 10kb`. Indicamos `abreviada` debido a que `size` es una versión acortada de escribir `$it.size`. Si observamos su forma completamente expandida, veríamos:

```nu
> ls | where {|$it| $it.size > 10kb }
```

Usamos el modo abreviado para trabajar con datos de columnas para no tener que repetir la forma expandida siempre.

Para el funcionamiento apropiado de la abreviación acortada y por lo tanto su expansión, el nombre de la columna tiene que aparecer en el lado izquierdo de la operación. Arriba, `size` aparece en en lado izquierdo de la comparación que permite la expresión expanderse al modo completo matemático del bloque.
