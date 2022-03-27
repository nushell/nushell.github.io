# Introducción

Hola, y bienvenido al proyecto Nushell. El objetivo de este proyecto es tomar la filosofía Unix de shells, dónde tuberías _-pipes-_ conectan comandos simples juntos y llevarlos al estilo moderno de desarrollo.

Nu toma ideas de muchos territorios familiares: shells tradicionales como bash, shells basadas en objetos como PowerShell, programación funcional, programación de sistemas, y más. Pero, en lugar de ser un "Todo en uno", Nu enfoca su energía en hacer algunas cosas bien:

- Crear una multiplataforma shell flexible con un toque moderno.
- Permitir mezclar y combinar aplicaciones de línea de comandos con una shell que entiende la estructura de sus datos.
- Tenga el brillo UX que proporcionan las aplicaciones modernas CLI.

La manera más facil de ver qué puede hacer Nu es con ejemplos, iniciemos.

Lo primero que notarás al ejercutar un comando como `ls` es que en lugar de un bloque de texto que regresa, recibirás una tabla estructurada.

<<< @/snippets/introduction/ls_example.sh

La tabla no solamente muestra lo que hay en el directorio de una manera distinta sino algo más. Como las tablas de una hoja de cálculo *-*spreadsheet*-*, esta tabla te permite trabajar con los datos más interactivamente.

Lo primero que vamos hacer es ordenar nuestra tabla por tamaño. Para poder hacerlo tomaremos la salida de `ls` y la alimentaremos al comando que ordena tablas basado en los valores de una columna (para este ejemplo sería la columna `size`).

<<< @/snippets/introduction/ls_sort_by_reverse_example.sh

Puedes observar que para lograrlo no tuvimos que pasar argumentos al comando `ls`. En cambio, nosotros usamos el comando `sort-by` que proporciona Nu para ordenar la salida del comando `ls`. Para ver los archivos más grandes en las primeras filas usamos el comando `reverse`.

Nu proporciona muchos comandos que trabajan con tablas. Por ejemplo, podemos filtrar los contenidos de la tabla de `ls` para únicamente mostrar archivos superiores a 1 kilobytes:

<<< @/snippets/introduction/ls_where_example.sh

Al igual que en la filosofía Unix, poder hacer que los comandos hablen entre ellos nos da maneras de mezclar y combinar de formas distintas. Miremos otro ejemplo:

<<< @/snippets/introduction/ps_example.sh

Es posible que estés familiarizado con el comando `ps` si has utilizado Linux. Con dicho comando, podemos tener una lista de los procesos actuales que ejecuta el sistema, qué estado tienen y sus nombres. También podemos ver la carga CPU del proceso.

¿Qué tal si quisiéramos mostrar los procesos que activamente usan el CPU? Así como hicimos con el comando `ls` previamente, también podemos trabajar con la tabla que nos devuelve `ps`:

<<< @/snippets/introduction/ps_where_example.sh

Hasta ahora, hemos visto el uso de `ls` y `ps` para enumerar archivos y procesos. Nu también ofrece otros comandos que pueden crear tablas con información de gran utilidad. Exploremos `date` y `sys`.

Ejecutando `date now` nos proporciona información del día y tiempo:

<<< @/snippets/introduction/date_example.sh

Para obtener una tabla podemos alimentar la salida a `date to-table`

<<< @/snippets/introduction/date_table_example.sh

Ejecutando `sys` devuelve información sobre el sistema en el que se ejecuta Nu:

<<< @/snippets/introduction/sys_example.sh

Esta tabla se ve un poco diferente con las que ya hemos trabajado. El comando `sys` nos regresa una tabla que también contiene tablas estructuradas en las celdas en vez de valores simples. Para explorar esos datos, necesitamos _obtener_ la columna deseada para mostrar:

<<< @/snippets/introduction/sys_get_example.sh

El comando `get` nos permite ir directo al valor de una columa de la tabla. Aquí estamos mirando la columna "host" que contiene información del host dónde se está ejecutando Nu. El nombre del sistema operativo, hostname, CPU, y más. Miremos los nombres de los usuarios en el sistema:

<<< @/snippets/introduction/sys_get_nested_example.sh

En este momento, solo hay un usuario en el sistema llamado "jt". Notarás que podemos pasar una ruta de columna *-*column path*-* y no únicamente el nombre de una columna. Nu tomará esta ruta de columna e irá a los datos correspondientes en la tabla.

Es posible que hayas notado algo más diferente también. En lugar de tener una tabla de datos, tenemos solo un elemento individual: la cadena "jt". Nu trabaja tanto con tabla de datos así como cadenas. Cadenas son una parte importante de trabajar con comandos fuera de Nu.

Miremos en acción cómo funcionan las cadenas fuera de Nu. Tomaremos el ejemplo anterior y ejecutaremos el comando externo `echo` (el carácter `^` le informa a Nu que no se desea usar el comando _interno_ también llamado `echo`):

<<< @/snippets/introduction/sys_get_external_echo_example.sh

Si esto se parece mucho a lo que teníamos antes, ¡tienes buen ojo! Es similar, pero con una diferencia importante: hemos llamado `echo` con el valor que vimos antes. Esto nos permite pasar datos fuera de Nu a `echo` (o cualquier comando fuera de Nu, como `git` por ejemplo)

_Nota: Para texto de ayuda de los comandos internos de Nu, puedes descubrirlos con el comando `help`_:

<<< @/snippets/introduction/help_example.sh
