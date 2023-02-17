# Cargando datos

Hemos visto como puedes usar comandos como `ls`, `ps`, `date`, y `sys` para cargar información sobre los archivos, procesos, hora de fecha, y del mismo sistema. Cada comando nos entrega una tabla de información que podemos explorar. Hay otras maneras de cargar datos en una tabla de datos para trabajar.

## Abriendo archivos

Una de las funciones más destacadas de Nu para trabajar con datos es el comando `open`. Es una multi-herramienta que puede trabajar con varios formatos de datos. Para ver qué significa esto intentemos abrir un archivo en formato json:

```
> open editors/vscode/package.json
------+----------+----------+---------+---------+----------+----------+----------+----------+----------+----------+----------+----------+----------+----------
 name | descript | author   | license | version | reposito | publishe | categori | keywords | engines  | activati | main     | contribu | scripts  | devDepen
      | ion      |          |         |         | ry       | r        | es       |          |          | onEvents |          | tes      |          | dencies
------+----------+----------+---------+---------+----------+----------+----------+----------+----------+----------+----------+----------+----------+----------
 lark | Lark     | Lark     | MIT     | 1.0.0   | [object] | vscode   | [0       | [1 item] | [object] | [1 item] | ./out/ex | [object] | [object] | [object]
      | support  | develope |         |         |          |          | items]   |          |          |          | tension  |          |          |
      | for VS   | rs       |         |         |          |          |          |          |          |          |          |          |          |
      | Code     |          |         |         |          |          |          |          |          |          |          |          |          |
------+----------+----------+---------+---------+----------+----------+----------+----------+----------+----------+----------+----------+----------+----------
```

De manera similar a `ls`, abrir un tipo de archivo que Nu entienda nos devolverá algo más que solo texto (o una secuencia de bytes). Aquí abrimos el archivo "package.json" de un proyecto de JavaScript. Nu puede reconocer y abrir el texto en JSON y devolvernos una tabla de datos.

Si deseamos revisar la versión del proyecto que estamos mirando podemos usar el comando `get`.

```
> open editors/vscode/package.json | get version
1.0.0
```

Actualmente Nu soporta los siguiente formatos para cargar datos directamente a tablas:

- json
- yaml
- toml
- xml
- csv
- ini

¿Pero qué sucede si cargas un archivo de texto que no sea de estos? Probemos:

```
> open README.md
```

Se nos muestra el contenido del archivo. Si el archivo es muy grande obtendremos una vista práctica desplazable para mirar el archivo y luego regresar a la terminal. Para ayudar con legibilidad Nu resaltará la sintaxis de formatos comunes de archivos como de código, markdown, y más.

Debajo de la superficie Nu mira estos archivos de texto como una cadena larga. Próximamente hablaremos de cómo trabajar con estas cadenas para extraer los datos que necesitemos de ellas.

## Trabajando con cadenas

Una parte importante de trabajar con datos llegando fuera de Nu es que no siempre estará en formato que Nu entiende. Comúnmente estos datos son proporcionados como una cadena.

Imaginemos que nos proporcionan estos datos de archivo:

```
> open gente.txt
Octavia | Butler | Writer
Bob | Ross | Painter
Antonio | Vivaldi | Composer
```

Cada pedazo de dato que deseamos está separada por el símbolo de tubería (pipe '|'), y cada persona está en líneas separadas. Nu no contiene un formato de archivo delimitado con pleca ('|') predeterminado, por lo que tendremos que parsearlo nosotros mismos.

Lo primero que queremos hacer al cargar el archivo es trabajarlo línea por línea:

```
> open gente.txt | lines
---+------------------------------
 # | value
---+------------------------------
 0 | Octavia | Butler | Writer
 1 | Bob | Ross | Painter
 2 | Antonio | Vivaldi | Composer
---+------------------------------
```

Podemos darnos cuenta que estamos trabajando con las líneas porque estamos de vuelta a una lista. Nuestro próximo paso es mirar si podemos dividir las filas a algo más útil. Para eso, usaremos el comando `split`. `split`, como implica el nombre, nos da una manera de dividir una cadena delimitada. Usaremos el subcomando `column` para dividir el contenido a varias columnas. Indicamos cuál es el delimitador y se hace el resto:

```
> open gente.txt | lines | split column "|"
---+----------+-----------+-----------
 # | Column1  | Column2   | Column3
---+----------+-----------+-----------
 0 | Octavia  |  Butler   |  Writer
 1 | Bob      |  Ross     |  Painter
 2 | Antonio  |  Vivaldi  |  Composer
---+----------+-----------+-----------
```

Casi se ve correcto. Parece que hay espacio extra ahí. Cambiemos nuestro delimitador:

```
> open gente.txt | lines | split column " | "
---+---------+---------+----------
 # | Column1 | Column2 | Column3
---+---------+---------+----------
 0 | Octavia | Butler  | Writer
 1 | Bob     | Ross    | Painter
 2 | Antonio | Vivaldi | Composer
---+---------+---------+----------
```

Nada mal. El comando `split` nos da datos que podemos usar. Adicionalmente nos crea nombres de columnas predeterminadas:

```
> open gente.txt | lines | split column " | " | get Column1
---+---------
 # | value
---+---------
 0 | Octavia
 1 | Bob
 2 | Antonio
---+---------
```

También podemos nombrar nuestras columnas en vez de usar nombres predeterminados:

```
> open gente.txt | lines | split column " | " primer_nombre apellido trabajo
---+---------------+-----------+----------
 # | primer_nombre | apellido  | trabajo
---+---------------+-----------+----------
 0 | Octavia       | Butler    | Writer
 1 | Bob           | Ross      | Painter
 2 | Antonio       | Vivaldi   | Composer
---+---------------+-----------+----------
```

Ahora que tenemos nuestros datos en una tabla podemos usar todos los comandos que hemos usado en tablas antes:

```
> open gente.txt | lines | split column " | " primer_nombre apellido trabajo | sort-by primer_nombre
---+---------------+-----------+----------
 # | primer_nombre | apellido  | trabajo
---+---------------+-----------+----------
 0 | Antonio       | Vivaldi   | Composer
 1 | Bob           | Ross      | Painter
 2 | Octavia       | Butler    | Writer
---+---------------+-----------+----------
```

Hay otros comandos que puedes usar para trabajar con cadenas:

- str
- lines
- size

También hay un conjunto de comandos auxiliares que podemos llamar si conocemos de antemano que los datos tienen una estructura que Nu debería de entender. Por ejemplo, abramos un Rust archivo lock:

```
> open Cargo.lock
# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
[[package]]
name = "adhoc_derive"
version = "0.1.2"
```

The `from` command can be used for each of the structured data text formats that Nu can open and understand by passing it the supported format as a subcommand.

El archivo "Cargo.lock" es un archivo en formato .toml pero la extensión del archivo no es .toml. Está bien, podemos usar el comando `from` usando el subcomando `toml`:

```
> open Cargo.lock | from toml
----------+-------------
 metadata | package
----------+-------------
 [object] | [405 items]
----------+-------------
```

El comando `from` se puede usar para cada dato estructurado de formatos de texto que Nu pueda abrir y entender pasando el formato soportado como subcomando.

## Abriendo en modo crudo

Mientras es útil poder abrir un archivo e inmediatamente trabajar con una tabla de sus datos, esto no siempre es lo que deseas hacer. Para llegar al texto subyacente, el comando `open` puede tomar una bandera opcional:

```
> open Cargo.toml --raw
[package]
name = "nu"
version = "0.1.3"
authors = ["Yehuda Katz <wycats@gmail.com>", "Jonathan Turner <jonathan.d.turner@gmail.com>"]
description = "A shell for the GitHub era"
license = "MIT"
```

## Abriendo URLs

Además de cargar archivos desde tu archivos de sistema, también puedes usar el comando `http get` proporcionando una URL. Se cargará el contenido de la URL por internet y devolverá:

```
> http get http://www.andresrobalino.com/feed.xml
----------
 rss
----------
 [1 item]
----------
```
