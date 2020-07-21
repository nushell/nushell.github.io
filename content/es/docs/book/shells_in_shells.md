---
layout: content
title: Shells en shells
prev: Metadatos
next: Escapando
link_prev: /es/metadatos.html
link_next: /es/escapando.html
---

## Trabajando con múltiples directorios

Mientras es común trabajar en un directorio puede ser beneficioso trabajar en múltiples lugares al mismo tiempo. Para esto Nu ofrece el concepto de "shells". Tal como implica, son una manera de tener activo múltiples shells en uno permitiendote rápidamente saltar entre directorios de trabajo y más.

Para empezar entremos a un directorio: 

```
/home/jonathan/Source/nushell(master)> enter ../lark
/home/jonathan/Source/lark(master)> ls
----+----------------+-----------+----------+---------+---------------+---------------
 #  | name           | type      | readonly | size    | accessed      | modified 
----+----------------+-----------+----------+---------+---------------+---------------
 0  | Cargo.toml     | File      |          | 2.2 KB  | 6 months ago  | 6 months ago 
 1  | target         | Directory |          | 4.1 KB  | 10 months ago | 6 months ago 
 2  | notes          | Directory |          | 4.1 KB  | 10 months ago | 6 months ago
```

Entrar es similar a cambiar directorios (como vimos previamente con el comando `cd`). Esto permite saltar al directorio para trabajar dentro del mismo. En lugar de cambiar de directorio, ahora estamos en dos directorios. Para ver esto con más claridad podemos usar el comando `shells` que enumera los directorios actualmente activos:

```
/home/jonathan/Source/lark(master)> shells
---+---+------------+-------------------------------
 # |   | name       | path 
---+---+------------+-------------------------------
 0 |   | filesystem | /home/jonathan/Source/nushell 
 1 | X | filesystem | /home/jonathan/Source/lark 
---+---+------------+-------------------------------
```

El comando `shells` nos muestra que hay dos shells activos: nuestro directorio fuente original "nushell" y ahora este nuevo directorio "lark".

Podemos saltar entre estas shells con los accesos directos `n` y `p`, cortos de siguiente "next" y previo "previous":

```
/home/jonathan/Source/lark(master)> n
/home/jonathan/Source/nushell(master)> p
/home/jonathan/Source/lark(master)>
```

Podemos notar el directorio cambiando pero también siempre podremos regresar al directorio previo en el cual estábamos trabajando. Esto nos permite trabajar en múltiples directorio en la misma sesión.

## Saliendo del shell

Puedes salir de una shell que hayas entrado (usando `enter`) a través del comando `exit`. Si esta es la última shell, Nu se cerrará.

Siempre puedes cerrar Nu incluso si tienes múltiples shells activas usando el comando `exit` pasando la bandera `--now` de la siguiente forma `exit --now`

## Más allá de los directorios

Nu también puede crear shells de otras cosas aparte de las rutas del sistema de archivos. Digamos por ejemplo que estás trabajando con un gran conjunto de datos y no deseas perderte dentro del mismo.

Para ver cómo funciona haremos el siguiente ejercicio. Actualmente en Nu tenemos enumerados los [complementos](plugins.md) desarrollados (plugins) en "Cargo.toml" digamos que también acabamos de crear un nuevo complemento en el directorio src/plugins llamado "doc.rs" y nos interesa saber que se encuentre enumerado también en "Cargo.toml" para que se instale al compilar Nu.

Entraremos al archivo "Cargo.toml" del código fuente de Nu:

```
/Users/andresrobalino/Code/nushell(master)> enter Cargo.toml
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package 
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object] 
------------+--------------+------------------+----------+----------
```

Por el momento solo hemos entrado al archivo y podemos observar en la tabla devuelta por `ls` lo que hay. Si prestas atención hemos entrado a un archivo con formato que reconoce Nu (.toml). Nu también nos proyecta el contenido del archivo en forma de sistema de archivos para explorarlo como si estuvieramos dentro de un sistema de archivos.

Antes de continuar revisemos las shells activas:

```
/> shells
---+---+-------------------------------------------------+------------------------------------
 # |   | name                                            | path
---+---+-------------------------------------------------+------------------------------------
 0 |   | filesystem                                      | /Users/andresrobalino/Code/nushell
 1 | X | {/Users/andresrobalino/Code/nushell/Cargo.toml} | /
---+---+-------------------------------------------------+------------------------------------

```

Observamos que hay dos activas indicándonos que nos encontramos dentro de "Cargo.toml" en la ruta predeterminada "/". Revisemos el listado de nuevo:

```
/> ls
------------+--------------+------------------+----------+----------
 bin        | dependencies | dev-dependencies | lib      | package 
------------+--------------+------------------+----------+----------
 [11 items] | [object]     | [object]         | [object] | [object] 
------------+--------------+------------------+----------+----------
```

Puede que los complementos se encuentren en "bin", vamos ahí:

```
> cd bin
/bin> ls
----+----------------------+---------------------------
 #  | name                 | path 
----+----------------------+---------------------------
 0  | nu_plugin_inc        | src/plugins/inc.rs 
 1  | nu_plugin_sum        | src/plugins/sum.rs 
 2  | nu_plugin_add        | src/plugins/add.rs 
 3  | nu_plugin_edit       | src/plugins/edit.rs 
 4  | nu_plugin_str        | src/plugins/str.rs 
 5  | nu_plugin_skip       | src/plugins/skip.rs 
 6  | nu_plugin_sys        | src/plugins/sys.rs 
 7  | nu_plugin_tree       | src/plugins/tree.rs 
 8  | nu_plugin_binaryview | src/plugins/binaryview.rs 
 9  | nu_plugin_textview   | src/plugins/textview.rs 
 10 | nu                   | src/main.rs 
----+----------------------+---------------------------
```

Notar que siempre podemos saltar de vuelta al directorio en el que estuvimos trabajando usando `p` (para previo). 

```
/bin> p
```

Verifiquemos las shells:

```
/Users/andresrobalino/Code/nushell(master)> shells
---+---+-------------------------------------------------+------------------------------------
 # |   | name                                            | path
---+---+-------------------------------------------------+------------------------------------
 0 | X | filesystem                                      | /Users/andresrobalino/Code/nushell
 1 |   | {/Users/andresrobalino/Code/nushell/Cargo.toml} | /bin
---+---+-------------------------------------------------+------------------------------------

```

Nos encontramos ahora en la shell donde estuvimos antes de entrar al archivo "Cargo.toml", vamos al directorio donde se encuentra el código fuente de los complementos (plugins):

```
/Users/andresrobalino/Code/nushell(master)> cd src/plugins/
/Users/andresrobalino/Code/nushell/src/plugins(master)> ls
----+---------------+------+----------+---------+------------+------------
 #  | name          | type | readonly | size    | accessed   | modified 
----+---------------+------+----------+---------+------------+------------
 0  | doc.rs        | File |          | 3.0 KB  | a week ago | a week ago
 1  | sum.rs        | File |          | 3.0 KB  | a week ago | a week ago 
 2  | inc.rs        | File |          | 11.8 KB | a week ago | a week ago 
 3  | sys.rs        | File |          | 9.2 KB  | 2 days ago | 2 days ago 
 4  | edit.rs       | File |          | 2.7 KB  | a week ago | a week ago 
 5  | str.rs        | File |          | 21.4 KB | 5 days ago | 5 days ago 
 6  | secret.rs     | File |          | 1.8 KB  | 2 days ago | 2 days ago 
 7  | skip.rs       | File |          | 1.7 KB  | a week ago | a week ago 
 8  | binaryview.rs | File |          | 13.0 KB | a week ago | a week ago 
 9  | tree.rs       | File |          | 3.0 KB  | a week ago | a week ago 
 10 | add.rs        | File |          | 2.7 KB  | a week ago | a week ago 
 11 | textview.rs   | File |          | 9.4 KB  | 5 days ago | 5 days ago 
----+---------------+------+----------+---------+------------+------------
```

Ahora podemos comparar los dos para verificar si faltan complementos adicionales o si hay complementos adicionales que necesitemos agregar a nuestro archivo "Cargo.toml" (¡y claramente falta agregarlo a "Cargo.toml"!)
