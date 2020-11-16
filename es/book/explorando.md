# Explorando en el sistema

Shells de antes permiten explorar el sistema de archivos y ejecutar comandos. Shells modernas como Nu permiten hacer lo mismo. Miremos algunos comandos comunes que puedas usar cuando interactues con el sistema.

## Ver contenido de un directorio

<<< @/snippets/moving_around/ls_example.sh

Cómo hemos visto en otros capítulos, `ls` es un comando para mirar el contenido de una ruta. Nu devolverá el contenido en una tabla que podemos usar.

El comando `ls` también recibe un argumento opcional para cambiar qué te gustaría ver. Por ejemplo, podemos enumerar los archivos que terminan en ".txt"

```
> ls *.txt
---+--------------+------+----------+---------+--------------+--------------
 # | name         | type | readonly | size    | accessed     | modified 
---+--------------+------+----------+---------+--------------+--------------
 0 | history.txt  | File |          | 1.3 KB  | 2 months ago | a day ago 
 1 | readonly.txt | File | readonly | <empty> | 2 months ago | 2 months ago 
---+--------------+------+----------+---------+--------------+--------------
```

El asterisco  (\*) en el argumento que pasamos "\*.txt" a veces se llama comodín o glob. Nos permite complementar cualquier cosa. Puedes leer el glob "\*.txt" como "complementa cualquier archivo siempre y cuando termine en '.txt'"

Nu también usa globs modernos permitiendo acceder directorios más profundos.

```
> ls **/*.rs
-----+-----------------------------------------------------+------+----------+----------+----------------+----------------
 #   | name                                                | type | readonly | size     | accessed       | modified 
-----+-----------------------------------------------------+------+----------+----------+----------------+----------------
 0   | src/cli.rs                                          | File |          | 19.1 KB  | 15 hours ago   | 15 hours ago 
 1   | src/commands/args.rs                                | File |          | 244 B    | 2 months ago   | 2 months ago 
 2   | src/commands/autoview.rs                            | File |          | 2.5 KB   | 15 hours ago   | 15 hours ago 
 3   | src/commands/cd.rs                                  | File |          | 277 B    | a week ago     | a week ago 
 4   | src/commands/classified.rs                          | File |          | 13.5 KB  | 15 hours ago   | 15 hours ago 
 5   | src/commands/clip.rs                                | File |          | 2.0 KB   | 2 days ago     | 2 days ago
 ```
 
 Aquí estamos mirando cualquier archivo que termine en ".rs" y los dos asteriscos indican "en cualquier directorio empezando desde aquí"

## Cambiar el directorio actual

```
> cd nuevo_directorio
```

Para cambiar del directorio actual a uno nuevo usamos el comando `cd`. Al igual que en otras shells, podemos usar tanto el nombre del directorio o si deseamos subir a un directorio podemos usar el acceso directo `..`.

## Comandos del sistema de archivos

Nu también proporciona algunos comandos básicos del sistema de archivos que funcionan multiplataforma.

Podemos mover un item de un lugar a otro usando el comando `mv`:

```
> mv item ubicacion
```

Podemos copiar un item de un lugar a otro:

```
> cp item ubicacion
```

Podemos eliminar un item.

```
> rm item
```

Los tres comandos también pueden usar las capacidades de glob que vimos previamente con `ls`.

Finalmente, podemos crear un directorio usando el comando `mkdir`:

```
> mkdir nuevo_directorio
```
