---
layout: content
title: Introducción
prev: Instalación
next: Explorando
link_prev: /es/instalacion.html
link_next: /es/explorando.html
---

Hola, y bienvenido al proyecto Nushell. El objectivo de este proyecto es tomar la filosofía Unix de shells, dónde tuberías (pipes) conectan comandos simples juntos y llevarlos al estilo moderno de desarrollo.

Nu toma ideas de muchos territorios familiares: shells tradicionales como bash, shells avanzadas como PowerShell, programación funcional, programación de sistemas, y más. Pero, en lugar de ser un "Todo en uno", No enfoca su energía en hacer algunas cosas bien:

* Crear una shell flexible de plataforma cruzada con un toque moderno.
* Permitirte mezclar y combinar aplicaciones de línea de comandos con una shell que comprende la estructura de tus datos.
* Tenga el brillo UX que proporcionan las aplicaciones modernas CLI.

La manera más facil de ver qué puede hacer Nu es empezando con ejemplos, así que vamos a sumergirnos.

Lo primero que notarás al ejercutar un comando como `ls` es que en lugar de un bloque de texto que regresa, recibirás una tabla estructurada.

```
> ls
----+------------------+-----------+----------+----------+----------------+----------------
 #  | name             | type      | readonly | size     | accessed       | modified 
----+------------------+-----------+----------+----------+----------------+----------------
 0  | .azure           | Directory |          | 4.1 KB   | 2 months ago   | a week ago 
 1  | IMG_1291.jpg     | File      |          | 115.5 KB | a month ago    | 4 months ago 
 2  | Cargo.toml       | File      |          | 3.1 KB   | 17 minutes ago | 17 minutes ago 
 3  | LICENSE          | File      |          | 1.1 KB   | 2 months ago   | 2 months ago 
 4  | readonly.txt     | File      | readonly | <empty>  | a month ago    | a month ago 
 5  | target           | Directory |          | 4.1 KB   | 2 days ago     | 15 minutes ago
...
```

La tabla es más que solamente mostrar el directorio de una manera diferente. Tanto las tablas en una hoja de cálculo (spreadsheet), esta tabla te permite trabajar con los datos más interactivamente.

Lo primero que vamos hacer es ordenar nuestra tabla por nombre. Para poder hacerlo tomaremos la salida de `ls` and alimentarla al comando que ordena tablas basado en el contenido de una columna.

```
> ls | sort-by name
----+------------------+-----------+----------+----------+----------------+----------------
 #  | name             | type      | readonly | size     | accessed       | modified 
----+------------------+-----------+----------+----------+----------------+----------------
 0  | .azure           | Directory |          | 4.1 KB   | 2 months ago   | a week ago 
 1  | .cargo           | Directory |          | 4.1 KB   | 2 months ago   | 2 months ago 
 2  | .editorconfig    | File      |          | 148 B    | 2 months ago   | 2 months ago 
 3  | .git             | Directory |          | 4.1 KB   | 2 months ago   | 20 minutes ago 
 4  | .gitignore       | File      |          | 58 B     | a week ago     | a week ago 
 5  | .vscode          | Directory |          | 4.1 KB   | a month ago    | a month ago 
...
```

Puedes observar que para lograrlo no tuvimos que pasar argumentos al comando `ls`. En cambio, nosotros usamos el comando `sort-by` que proporciona Nu para ordenar la salida del comando `ls`.

Nu proporciona comandos que trabajan con tablas. Por ejemplo, podemos filtrar los contenidos de la tabla de `ls` para únicamente mostrar archivos superiores a 4 kilobytes:

```
> ls | where size > 4kb
----+----------------+------+----------+----------+----------------+----------------
 #  | name           | type | readonly | size     | accessed       | modified 
----+----------------+------+----------+----------+----------------+----------------
 0  | IMG_1291.jpg   | File |          | 115.5 KB | a month ago    | 4 months ago 
 1  | README.md      | File |          | 11.1 KB  | 2 days ago     | 2 days ago 
 2  | IMG_1291.png   | File |          | 589.0 KB | a month ago    | a month ago 
 3  | IMG_1381.jpg   | File |          | 81.0 KB  | a month ago    | 4 months ago 
 4  | butterfly.jpeg | File |          | 4.2 KB   | a month ago    | a month ago 
 5  | Cargo.lock     | File |          | 199.6 KB | 22 minutes ago | 22 minutes ago
```

Al igual que en la filosofía Unix, poder hacer que los comandos hablen entre ellos nos da maneras de mezclar y combinar de formas distintas. Probemos otro comando:


```
> ps
-----+-------+----------+------+--------------------------------------------------------------------------------
 #   | pid   | status   | cpu  | name 
-----+-------+----------+------+--------------------------------------------------------------------------------
 0   | 1003  | Unknown  | 0.00 |  
 1   | 1515  | Sleeping | 0.00 | /usr/lib/gnome-settings-daemon/gsd-screensaver-proxy 
 2   | 2128  | Sleeping | 0.00 | /usr/lib/gnome-settings-daemon/gsd-screensaver-proxy 
 3   | 2285  | Unknown  | 0.00 |  
 4   | 8872  | Sleeping | 0.00 | /usr/lib/gvfs/gvfsd-dnssd--spawner:1.23/org/gtk/gvfs/exec_spaw/4 
 5   | 1594  | Sleeping | 0.00 | /usr/lib/ibus/ibus-engine-simple
```

Es posible que estés familiarizado con el comando `ps` si has utlizado Linux. Con dicho comando, podemos tener una lista de los procesos actuales que ejecuta el sistema, qué estado tienen y sus nombres. También podemos ver la carga CPU del proceso.

¿Qué tal si quisiéramos mostrar los procesos que activamente usan el CPU? Así como hicimos con el comando `ls` previamente, también podemos trabajar con la tabla que nos devuelve `ps`:

```
> ps | where cpu > 10
---+-------+----------+-------+-----------------------------
 # | pid   | status   | cpu   | name 
---+-------+----------+-------+-----------------------------
 0 | 1992  | Sleeping | 44.52 | /usr/bin/gnome-shell 
 1 | 1069  | Sleeping | 16.15 |  
 2 | 24116 | Sleeping | 13.70 | /opt/google/chrome/chrome 
 3 | 21976 | Sleeping | 12.67 | /usr/share/discord/Discord
```

Hasta ahora, hemos visto el uso de `ls` y `ps` para enumerar archivos y procesos. Nu también ofrece otros comandos que pueden crear tablas de información de utilidad. Exploremos a continuación `date` y `sys`.

Ejecutando `date` nos proporciona información del día y tiempo:

```
> date
------+-------+-----+------+--------+--------+----------
 year | month | day | hour | minute | second | timezone 
------+-------+-----+------+--------+--------+----------
 2019 | 8     | 17  | 19   | 20     | 50     | +12:00 
------+-------+-----+------+--------+--------+----------
```

Ejecutando `sys` devuelve información sobre el sistema en el que se ejecuta Nu:

```
> sys
----------+----------+-----------+----------+-----------+-----------
 host     | cpu      | disks     | mem      | temp      | net 
----------+----------+-----------+----------+-----------+-----------
 [object] | [object] | [3 items] | [object] | [3 items] | [3 items] 
----------+----------+-----------+----------+-----------+-----------
```

Esto es un poco diferente ante las tablas que hemos visto. El comando `sys` nos proporciona una tabla que contiene tablas estructuradas en las celdas en vez de valores simples. Para mirar estos datos necesitamos seleccionar una columa para mostrar:

```
> sys | get host
-------+------------------+----------+--------+----------+----------
 name  | release          | hostname | arch   | uptime   | users 
-------+------------------+----------+--------+----------+----------
 Linux | 5.0.0-21-generic | pop-os   | x86_64 | [object] | [1 item] 
-------+------------------+----------+--------+----------+----------
```

El comando `get` nos permite saltar directo al contenido de una columa de la tabla. Aquí estamos mirando la columna "host" que contiene información del host dónde se está ejecutando Nu. El nombre del sistema operativo, hostanme, CPU, y más. Miremos los nombres de los usuarios en el sistema:

```
> sys | get host.users
jonathan   
```

En este momento, solo hay un usuario en el sistema llamado "jonathan". Notarás que podemos pasar una ruta y no únicamente el nombre de una columna. Nu tomará esta ruta e irá a los datos correspondientes en la tabla.

Es posible que hayas notado algo más que es diferente. En lugar de tener una tabla de datos, tenemos solo un elemento individual: la cadena "jonathan". Nu trabaja tanto con tabla de datos así como cadenas. Cadenas son una parte importante de trabajar con comandos fuera de Nu.

Miremos en acción cómo funcionan las cadenas fuera de Nu. Tomaremos el ejemplo anterior y ejecutaremos el comando externo `echo`, que se encuentra instalado en la mayoría de los sitemas operativos:

```
> sys | get host.users | echo $it
jonathan
```

Si esto se parece mucho a lo que teníamos antes, ¡tienes buen ojo! Es similar, pero con una diferencia importante: hemos llamado `echo` con el valor que vimos antes. Esto nos permite pasar datos fuera de Nu a `echo` (o cualquier comando fuera de Nu, como `git` por ejemplo)

*Nota: El texto de ayuda para cualquiera de los comandos incorporados de Nu se pueden observar con el comando `help`*:

```
> help config
Configuration management.

Usage:
  > config {flags}

flags:
  --load <Path>
  --set <Any>
  --get <Any>
  --remove <Any>
  --clear
  --path
```