---
title: Explorando el sistema
---

Shells de antes permiten explorar el sistema de archivos y ejecutar comandos. Shells modernas como Nu permiten hacer lo mismo. Miremos algunos comandos comunes que puedas usar cuando interactues con el sistema.

## Ver contenido de un directorio

```nu
ls
```

Cómo hemos visto en otros capítulos, `ls` es un comando para mirar el contenido de una ruta. Nu devolverá el contenido en una tabla que podemos usar.

El comando `ls` también recibe un argumento opcional para cambiar qué te gustaría ver. Por ejemplo, podemos enumerar los archivos que terminan en ".md"

```nu
> ls *.md
───┬────────────────────┬──────┬─────────┬────────────
 # │ name               │ type │ size    │ modified
───┼────────────────────┼──────┼─────────┼────────────
 0 │ CODE_OF_CONDUCT.md │ File │  3.4 KB │ 5 days ago
 1 │ CONTRIBUTING.md    │ File │   886 B │ 5 days ago
 2 │ README.md          │ File │ 15.0 KB │ 5 days ago
 3 │ TODO.md            │ File │  1.6 KB │ 5 days ago
───┴────────────────────┴──────┴─────────┴────────────
```

El asterisco (\*) en el argumento que pasamos "\*.md" a veces se llama comodín o glob. Nos permite complementar cualquier cosa. Puedes leer el glob "\*.md" como "complementa cualquier archivo siempre y cuando termine en '.md'"

Nu también usa globs modernos permitiendo acceder directorios más profundos.

```nu
ls **/*.md
──┬───────────────────────────────────────────┬──────┬─────────┬───────────
# │ name                                      │ type │ size    │ modified
──┼───────────────────────────────────────────┼──────┼─────────┼───────────
0 │ CODE_OF_CONDUCT.md                        │ File │  3.4 KB │ 5 days ago
1 │ CONTRIBUTING.md                           │ File │   886 B │ 5 days ago
2 │ README.md                                 │ File │ 15.0 KB │ 5 days ago
3 │ TODO.md                                   │ File │  1.6 KB │ 5 days ago
4 │ crates/nu-source/README.md                │ File │  1.7 KB │ 5 days ago
5 │ docker/packaging/README.md                │ File │  1.5 KB │ 5 days ago
6 │ docs/commands/README.md                   │ File │   929 B │ 5 days ago
7 │ docs/commands/alias.md                    │ File │  1.7 KB │ 5 days ago
8 │ docs/commands/append.md                   │ File │  1.4 KB │ 5 days ago
```

Aquí, buscamos cualquier archivo que termine con ".md", y los dos asteriscos dicen además "en cualquier directorio que comience desde aquí".

## Cambiar el directorio actual

```nu
cd new_directory
```

Para cambiar del directorio actual a uno nuevo usamos el comando `cd`. Al igual que en otras shells, podemos usar tanto el nombre del directorio o si deseamos subir a un directorio podemos usar el acceso directo `..`.

También se puede cambiar el directorio si se omite `cd` y se proporciona una ruta por si sola:

```nu
./new_directory
```

## Comandos del sistema de archivos

Nu también proporciona algunos comandos básicos del sistema de archivos que funcionan multiplataforma.

Podemos mover un item de un lugar a otro usando el comando `mv`:

```nu
mv item location
```

Podemos copiar un item de un lugar a otro:

```nu
cp item location
```

Podemos eliminar un item.

```nu
rm item
```

Los tres comandos también pueden usar las capacidades de glob que vimos previamente con `ls`.

Finalmente, podemos crear un directorio usando el comando `mkdir`:

```nu
mkdir new_directory
```
