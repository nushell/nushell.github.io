# Explorando en el sistema

Shells de antes permiten explorar el sistema de archivos y ejecutar comandos. Shells modernas como Nu permiten hacer lo mismo. Miremos algunos comandos comunes que puedas usar cuando interactues con el sistema.

## Ver contenido de un directorio

<<< @/snippets/moving_around/ls_example.sh

Cómo hemos visto en otros capítulos, `ls` es un comando para mirar el contenido de una ruta. Nu devolverá el contenido en una tabla que podemos usar.

El comando `ls` también recibe un argumento opcional para cambiar qué te gustaría ver. Por ejemplo, podemos enumerar los archivos que terminan en ".md"

<<< @/snippets/moving_around/ls_shallow_glob_example.sh

El asterisco  (\*) en el argumento que pasamos "\*.md" a veces se llama comodín o glob. Nos permite complementar cualquier cosa. Puedes leer el glob "\*.md" como "complementa cualquier archivo siempre y cuando termine en '.md'"

Nu también usa globs modernos permitiendo acceder directorios más profundos.

<<< @/snippets/moving_around/ls_deep_glob_example.sh

Aquí, buscamos cualquier archivo que termine con ".md", y los dos asteriscos dicen además "en cualquier directorio que comience desde aquí".

## Cambiar el directorio actual

<<< @/snippets/moving_around/cd_example.sh

Para cambiar del directorio actual a uno nuevo usamos el comando `cd`. Al igual que en otras shells, podemos usar tanto el nombre del directorio o si deseamos subir a un directorio podemos usar el acceso directo `..`.

También se puede cambiar el directorio si se omite `cd` y se proporciona una ruta por si sola:

<<< @/snippets/moving_around/cd_without_command_example.sh

## Comandos del sistema de archivos

Nu también proporciona algunos comandos básicos del sistema de archivos que funcionan multiplataforma.

Podemos mover un item de un lugar a otro usando el comando `mv`:

<<< @/snippets/moving_around/mv_example.sh

Podemos copiar un item de un lugar a otro:

<<< @/snippets/moving_around/cp_example.sh

Podemos eliminar un item.

<<< @/snippets/moving_around/rm_example.sh

Los tres comandos también pueden usar las capacidades de glob que vimos previamente con `ls`.

Finalmente, podemos crear un directorio usando el comando `mkdir`:

<<< @/snippets/moving_around/mkdir_example.sh
