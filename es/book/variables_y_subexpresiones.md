# Variables y Subexpresiones

En Nushell hay dos tipos de expresiones de evaluación: variables y subexpresiones. Cuando lees expresiones que empiezan con el signo dólar (`$`) sabes que trabajas con una expresión de evaluación. Esto indica que cuando Nushell toma el valor en esta posición, necesitará ejecutar un paso de evaluación para procesar la expresión y posterioremente usar el valor del resultado. Ambas formas de expresión de evaluación soportan un modo simple y una forma ruta (`path`) para trabajar con datos más complejos.

## Variables

La variable es el más simple de ambas expresiones de evaluación. Durante la evaluación, una variable es remplazada for su valor.

Si creamos una variable, podemos imprimir su contenido al usar `$` para referir a la misma:

```nu
let mi_valor = 4
echo $mi_valor
# => 4
```

## Variables rutas (paths)

Una variable ruta funciona al llegar dentro del contenido de una variable, navegando columnas dentro de la misma para alcanzar un valor final. Supongamos que en vez de `4`, hayamos asignado una tabla como valor:

```nu
let mi_valor = [[nombre]; [pruebausuario]]
```

Podemos usar variables ruta para evaluar la variable `$mi_valor` y obtener el valor de la columna `nombre` con un solo paso:

```nu
echo $mi_valor.nombre
# => pruebausuario
```

## Subexpresiones

Siempre puedes evaluar subexpresiones y usar su resultado envolviendo la expresión entre paréntesis `()`.

Los paréntesis contienen una tubería que se ejecutará hasta completar, y su valor final será usado. Por ejemplo, `(ls)` ejecutaría el comando `ls`, devolviendo como resultado la tabla y `(git branch --show-current)` ejecutará el comando externo git y devolver una cadena con el nombre de la rama actual. También puedes usar paréntesis para ejecutar expresiones matemáticas como `(2 + 3)`.

Subexpresiones también pueden ser tuberías y no solamente comandos individuales. Si desearamos una lista de nombres de archivos superiores a diez kilobytes, podemos utilizar subexpresiones para ejecutar una tubería y asignar el resultado a una variable:

```nu
let nombres_de_archivos_grandes = (ls | where size > 10kb)
echo $nombres_de_archivos_grandes
# => ───┬────────────┬──────┬──────────┬──────────────
# =>  # │    name    │ type │   size   │   modified
# => ───┼────────────┼──────┼──────────┼──────────────
# =>  0 │ Cargo.lock │ File │ 155.3 KB │ 17 hours ago
# =>  1 │ README.md  │ File │  15.9 KB │ 17 hours ago
# => ───┴────────────┴──────┴──────────┴──────────────
```

## Subexpresiones y rutas

Subexpresiones también soportan rutas. Por ejemplo, supongamos que queremos una lista de nombres de archivos en el directorio actual. Una manera de hacerlo es con una tubería:

```nu
ls | get name
```

Pero también podemos hacer una acción similar con un solo paso usando una subexpresión de ruta:

```nu
echo (ls).name
```

Todo depende de las necesidades del código o estilo particular que trabaje mejor para ti.
