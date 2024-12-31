# Trabajando con tablas

Una de las maneras comunes de mirar datos en Nu es a través de una tabla. Nu viene con una serie de comandos que trabajan con tablas para que pueda ser más conveniente encontrar lo que estás buscando y para limitar los datos a solo lo que necesites.

Para empezar, consigamos una tabla que podamos usar:

```
ls
# => ---+---------------+------+----------+---------+------------+------------
# =>  # | name          | type | readonly | size    | accessed   | modified
# => ---+---------------+------+----------+---------+------------+------------
# =>  0 | add.rs        | File |          | 2.7 KB  | 2 days ago | 2 days ago
# =>  1 | sum.rs        | File |          | 3.0 KB  | 2 days ago | 2 days ago
# =>  2 | inc.rs        | File |          | 11.8 KB | 2 days ago | 2 days ago
# =>  3 | str.rs        | File |          | 21.4 KB | 2 days ago | 2 days ago
# =>  4 | skip.rs       | File |          | 1.7 KB  | 2 days ago | 2 days ago
# =>  5 | textview.rs   | File |          | 9.4 KB  | 2 days ago | 2 days ago
# =>  6 | binaryview.rs | File |          | 13.0 KB | a day ago  | a day ago
# =>  7 | edit.rs       | File |          | 2.7 KB  | 2 days ago | 2 days ago
# =>  8 | tree.rs       | File |          | 3.0 KB  | 2 days ago | 2 days ago
# =>  9 | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
# => ---+---------------+------+----------+---------+------------+------------
```

## Ordenando los datos

Podemos ordenar la tabla llamando el comando `sort-by` e indicándole qué columnas queremos usar al ordenar. Digamos que deseamos ordenar nuestra tabla por tamaño de archivo:

```
ls | sort-by size
# => ---+---------------+------+----------+---------+------------+------------
# =>  # | name          | type | readonly | size    | accessed   | modified
# => ---+---------------+------+----------+---------+------------+------------
# =>  0 | skip.rs       | File |          | 1.7 KB  | 2 days ago | 2 days ago
# =>  1 | add.rs        | File |          | 2.7 KB  | 2 days ago | 2 days ago
# =>  2 | edit.rs       | File |          | 2.7 KB  | 2 days ago | 2 days ago
# =>  3 | sum.rs        | File |          | 3.0 KB  | 2 days ago | 2 days ago
# =>  4 | tree.rs       | File |          | 3.0 KB  | 2 days ago | 2 days ago
# =>  5 | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
# =>  6 | textview.rs   | File |          | 9.4 KB  | 2 days ago | 2 days ago
# =>  7 | inc.rs        | File |          | 11.8 KB | 2 days ago | 2 days ago
# =>  8 | binaryview.rs | File |          | 13.0 KB | a day ago  | a day ago
# =>  9 | str.rs        | File |          | 21.4 KB | 2 days ago | 2 days ago
# => ---+---------------+------+----------+---------+------------+------------
```

Podemos ordenar una tabla con cualquier columna que pueda ser comparada. Por ejemplo, también pudimos haber ordenador usando las columnas "name", "accessed", o "modified".

# Seleccionando los datos que quieres

Podemos seleccionar datos de una tabla seleccionando columnas o filas específicas. Escojamos algunas columnas de nuestra tabla para usar:

```
ls | select name size
# => ---+---------------+---------
# =>  # | name          | size
# => ---+---------------+---------
# =>  0 | add.rs        | 2.7 KB
# =>  1 | sum.rs        | 3.0 KB
# =>  2 | inc.rs        | 11.8 KB
# =>  3 | str.rs        | 21.4 KB
# =>  4 | skip.rs       | 1.7 KB
# =>  5 | textview.rs   | 9.4 KB
# =>  6 | binaryview.rs | 13.0 KB
# =>  7 | edit.rs       | 2.7 KB
# =>  8 | tree.rs       | 3.0 KB
# =>  9 | sys.rs        | 9.2 KB
# => ---+---------------+---------
```

Esto ayuda a crear una table más enfocada para lo que necesitamos. Siguiente, digamos que queremos ver los 5 archivos más livianos de este directorio:

```
ls | sort-by size | first 5
# => ---+---------+------+----------+--------+------------+------------
# =>  # | name    | type | readonly | size   | accessed   | modified
# => ---+---------+------+----------+--------+------------+------------
# =>  0 | skip.rs | File |          | 1.7 KB | 2 days ago | 2 days ago
# =>  1 | add.rs  | File |          | 2.7 KB | 2 days ago | 2 days ago
# =>  2 | edit.rs | File |          | 2.7 KB | 2 days ago | 2 days ago
# =>  3 | sum.rs  | File |          | 3.0 KB | 2 days ago | 2 days ago
# =>  4 | tree.rs | File |          | 3.0 KB | 2 days ago | 2 days ago
# => ---+---------+------+----------+--------+------------+------------
```

Notarás que primero ordenamos la tabla por tamaño para llegar hasta el archivo más pequeño y luego usamos `first 5` que nos devuelve las primeras 5 filas de la tabla.

También puedes saltarte filas con `skip` que no deseas. Saltemos las primeras dos de las 5 filas que obtuvimos arriba:

```
ls | sort-by size | first 5 | skip 2
# => ---+---------+------+----------+--------+------------+------------
# =>  # | name    | type | readonly | size   | accessed   | modified
# => ---+---------+------+----------+--------+------------+------------
# =>  0 | edit.rs | File |          | 2.7 KB | 2 days ago | 2 days ago
# =>  1 | sum.rs  | File |          | 3.0 KB | 2 days ago | 2 days ago
# =>  2 | tree.rs | File |          | 3.0 KB | 2 days ago | 2 days ago
# => ---+---------+------+----------+--------+------------+------------
```

Hemos reducido a tres filas que nos interesa.

Veamos algunos otros comandos para seleccionar datos. Es posible que te hayas preguntado por qué las filas de la tabla son números. Esto actúa como una forma práctica de llegar a una sola fila. Ordenemos nuestra tabla por el nombre del archivo y luego escojamos una de las filas con el comando `n-th` usando el número de fila:

```
ls | sort-by name
# => ---+---------------+------+----------+---------+------------+------------
# =>  # | name          | type | readonly | size    | accessed   | modified
# => ---+---------------+------+----------+---------+------------+------------
# =>  0 | add.rs        | File |          | 2.7 KB  | 2 days ago | 2 days ago
# =>  1 | binaryview.rs | File |          | 13.0 KB | a day ago  | a day ago
# =>  2 | edit.rs       | File |          | 2.7 KB  | 2 days ago | 2 days ago
# =>  3 | inc.rs        | File |          | 11.8 KB | 2 days ago | 2 days ago
# =>  4 | skip.rs       | File |          | 1.7 KB  | 2 days ago | 2 days ago
# =>  5 | str.rs        | File |          | 21.4 KB | 2 days ago | 2 days ago
# =>  6 | sum.rs        | File |          | 3.0 KB  | 2 days ago | 2 days ago
# =>  7 | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago
# =>  8 | textview.rs   | File |          | 9.4 KB  | 2 days ago | 2 days ago
# =>  9 | tree.rs       | File |          | 3.0 KB  | 2 days ago | 2 days ago
---+---------------+------+----------+---------+------------+------------

ls | sort-by name | nth 5
# => --------+------+----------+---------+------------+------------
# =>  name   | type | readonly | size    | accessed   | modified
# => --------+------+----------+---------+------------+------------
# =>  str.rs | File |          | 21.4 KB | 2 days ago | 2 days ago
# => --------+------+----------+---------+------------+------------
```

## Obteniendo datos de una tabla

Hasta ahora hemos trabajado con tablas reduciendo la tabla a solo lo que necesitamos. A veces es posible que queramos ir un paso más allá y solo mirar los valores en las celdas en lugar the tomar una columna completa. Digamos, por ejemplo, que queramos obtener una lista de los nombres de los archivos. Para esto usamos el comando `get`:

```
ls | get name
# => ---+---------------
# =>  # | value
# => ---+---------------
# =>  0 | add.rs
# =>  1 | sum.rs
# =>  2 | inc.rs
# =>  3 | str.rs
# =>  4 | skip.rs
# =>  5 | textview.rs
# =>  6 | binaryview.rs
# =>  7 | edit.rs
# =>  8 | tree.rs
# =>  9 | sys.rs
# => ---+---------------
```

Ahora tenemos los valores de cada nombre de los archivos.

Puede parecerse al comando `select` que vimos previamente, probemos `select` para comparar los dos:

```
ls | select name
# => ---+---------------
# =>  # | name
# => ---+---------------
# =>  0 | add.rs
# =>  1 | sum.rs
# =>  2 | inc.rs
# =>  3 | str.rs
# =>  4 | skip.rs
# =>  5 | textview.rs
# =>  6 | binaryview.rs
# =>  7 | edit.rs
# =>  8 | tree.rs
# =>  9 | sys.rs
# => ---+---------------
```

¡Se ven muy similares! Veamos si podemos explicar la diferencia entre estos dos comandos para aclarar:

- `select` - crea una tabla donde incluye únicamente las columnas indicadas
- `get` - devuelve los valores dentro de la columna indicada

La manera de distinguirlas mirando la tabla de forma característica es con el nombre de columna `value` que nos permite saber que será una lista de valores con la que podemos trabajar.

El comando `get` puede ir más allá y tomar una ruta para datos más profundos en la tabla. Esto simplifica trabajar con datos más complejos como las estructuras que podrías encontrar en archivos .json.

## Cambiando datos de una tabla

Además de seleccionar datos de una tabla, también podemos actualizar lo que contiene una tabla. Es posible que queramos agregar nuevas columnas o editar el contenido de una celda. En Nu, en lugar la misma tabla, cada uno de los comandos en la sección devolvera una nueva tabla en la tubería.

### Agregando una nueva columna

Podemos utilizar el comando `add` para agregar una nueva columna a la tabla. Veamos un ejemplo:

```
open rustfmt.toml
# => ---------
# =>  edition
# => ---------
# =>  2018
# => ---------
```

Agreguemos una columna llamada "next_edition" con el valor 2021:

```
open rustfmt.toml | add next_edition 2021
# => ---------+--------------
# =>  edition | next_edition
# => ---------+--------------
# =>  2018    | 2021
# => ---------+--------------
```

Observa que si abrimos el archivo original el contenido permanece igual:

```
open rustfmt.toml
# => ---------
# =>  edition
# => ---------
# =>  2018
# => ---------
```

Los cambios en Nu son cambios funcionales, lo que significa que funcionan en los valores mismos en vez de causar cambios permanentes. Esto nos permite realizar diferentes tipos de trabajo en nuestra tubería hasta que estemos listos para grabar los resultados con cualquier cambio que nos gustaría si así decidimos. Aquí podríamos grabar los resultados usando el comando `save`:

```
open rustfmt.toml | add next_edition 2021 | save rustfmt2.toml
open rustfmt2.toml
# => ---------+--------------
# =>  edition | next_edition
# => ---------+--------------
# =>  2018    | 2021
# => ---------+--------------
```

### Editando una columna

Similarmente al comando `add`, también podemos usar el comando `edit` para cambiar el contenido de una columna a un nuevo valor. Abramos el mismo archivo para verlo en acción:

```
open rustfmt.toml
# => ---------
# =>  edition
# => ---------
# =>  2018
# => ---------
```

y ahora, actualizemos la edición y que apunte a la siguiente edición que esperamos soportar:

```
open rustfmt.toml | edit edition 2021
# => ---------
# =>  edition
# => ---------
# =>  2021
# => ---------
```

### Incrementando valores

Hay un comando más en Nu que nos ayudará a trabajar con números y versiones: `inc`.

```
open rustfmt.toml
# => ---------
# =>  edition
# => ---------
# =>  2018
# => ---------
open rustfmt.toml | inc edition
# => ---------
# =>  edition
# => ---------
# =>  2019
# => ---------
```

Como el valor en "edition" es un número, podemos usar `inc` para actualizarlo. `inc` realmente brilla cuando trabajamos con versiones:

```
open Cargo.toml | get package.version
# => 0.1.3
open Cargo.toml | inc package.version --minor | get package.version
# => 0.2.0
```

Cuando trabajamos con versiones podemos usar banderas e indicar cómo incrementar la versión:

- **--major** - incrementar major (0.1.3 -> 1.0.0)
- **--minor** - incrementar minor (0.1.3 -> 0.2.0)
- **--patch** - incrementar patch (0.1.3 -> 0.1.4)
