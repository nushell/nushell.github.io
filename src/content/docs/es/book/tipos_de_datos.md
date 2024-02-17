# Tipos de datos

Tradicionalmente, comandos shell de Unix se han comunidado entre ellos usando cadenas de texto. Un comando generaría de salida texto a través de la salida estándar (comúnmente abreviada 'stdout') y el otro leer texto a través de la entrada estándar (o 'stdin').

Podemos pensar de este tipo de comunicación como basada en cadenas.

Nu adopta este enfoque para sus comandos y lo hacer crecer para incluir otro tipos de datos. Actualmente, Nu incluye soporte para dos tipos de datos: simple y estructurada.

## Datos simples

Al igual que muchos lenguajes de programación, Nu modela los datos usando un conjunto de tipos de datos simples y estructurados. Tipos de dato simple incluye enteros, decimales, cadenas, booleanos, fechas, y rutas. También incluye un tipo especial para tamaños de archivos.

### Enteros

Enteros (o redondos). Ejemplos incluye 1, 5, y 100.

### Decimales

Números decimales son números con algún component fraccional. Ejemplos incluye 1.5, 2.0, y 15.333.

### Cadenas

Las cadenas son la manera fundamental de representar texto. Se indican con doble comillas. Ejemplos incluye "Pedro", "minombre.txt", and "Lynchburg, VA".

Cadenas en Nu son compatibles con Unicode de manera predeterminada, por lo que puedes pasar texto UTF-8 con facilidad.

### Booleanos

Booleanos son el estado de verdadero o falso. En vez de escribir el valor directamente, comúnmente es el resultado de una comparación.

### Fechas

Fechas y horas se mantienen juntas en el valor tipo de dato Date. Valores Date usados por el sistema reconocen la zona horaria y de manera predeterminada usa la zona horaria UTC.

### Rutas

Las rutas son una forma independiente de la plataforma para representar rutas de archivos en el sistema operativo dado. Ejemplos incluyen: /usr/bin y C:\Users\archivo.txt.

### Bytes

Tamaños de archivos se mantienen dentro de un tipo especial de entero llamado bytes. Ejemplos incluye 100, 15kb, y 100mb.

## Datos estructurados

Los datos estructurados se construyen a partir de los datos simples. Por ejemplo, en lugar de un solo entero, datos estructurados nos ofrece una manera de representar múltiples enteros en el mismo valor. Esta es una lista actual de los tipos de dato estructurados soportadas: objetos, datos binarios, listas, y bloques.

### Objetos

El tipo de dato object representa lo que observarías en una fila de datos de una tabla. Tiene diferentes elementos de datos y cada elemento de dato se le asigna un nombre de columna.

### Datos binarios

Datos binarios como los datos de un archivo de imagen, es un grupo de bytes sin formato.

### Listas

Las listas pueden tener más de un valor. Esto les permite ser un buen contenedor de filas de datos de una tabla.

### Bloques

Bloques representan bloques de código en Nu. Por ejemplo, en el comando `where { $it.size > 10kb }` el bloque es la porción contenida en las llaves, `{ $it.size > 10kb }`. Los bloques son una manera útil de representar código que puede ser ejecutado para cada fila de datos.
