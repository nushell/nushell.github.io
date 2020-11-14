---
title: Comandos
---

# Comandos

Los comandos son los bloques de construcción para las tuberías (pipeline) en Nu. Realizan la acción de la tubería, ya sea creando datos, cambiando datos mientras fluye desde entradas y salidas, o viendo los datos una vez que salen de la tubería. Hay dos tipos de comandos: comandos internos, son aquellos contruídos para ejecución interna de Nu, y comandos externos, comandos que se encuentra fuera de Nu y se comunican con `stdin` / `stdout` de estilo Unix estándar.

## Comandos internos

Todos los comandos dentro de Nu, incluyendo complementos (plugins), son comandos internos. Comandos internos se comunican entre ellos usando streams de `Tagged<Value>` y ShellError (TODO: Enlace a tipos de datos)

### Firma

Los comandos utilizan verificación de tipado ligero para garantizar que los argumentos pasados puedan ser manejados correctamente. Para habilitar esto, cada comando proporciona una firma que le dice a Nu:

* El nombre del comando
* Los argumentos posicionales (ej, en `start x y` la `x` y la `y` son argumentos posicionales)
* Si el comando 
* Si el comando toma un número adicional ilimitado de argumentos posicionales (ej, `start a1 a2 a3 ... a99 a100`)
* Los argumentos nombrados (ej, `start --now`)
* Si el comando es un filtro o sink

Con esta información, se puede verificar problemas potenciales antes de la ejecución de la tubería.

## Comandos externos

Un comando externo es cualquier comando que no forma parte de los comandos o complementos (plugins) integrados de Nu. Si se llama un comando que Nu desconoce, llamará al entorno subyacente con los argumentos suministrados para intentar el comando como un programa externo.

## Comunicación entre comandos internos y externos

### Interno a interno

Los comandos internos se comunican entre ellos usando el stream completo que proporciona Nu, que incluye todos los tipos de archivos integrados. Esto incluye la comunicación entre comandos internos y complementos (en ambas direcciones).

### Intero a externo

Los comandos internos que envían texto a comandos externos necesitan tener cadenas de texto preparadas con anticipación. Si un objeto es enviado directamente a un comando externo, se considerará como un error ya que no hay forma de inferir cómo los datos estructurados serán representados para el programa externo. Se espera que el usuario se limite a una simple celda de datos o usar uno de los convertidores (como `to-json`) para convertir la tabla en una representación de cadena.

El comando externo se abre para que si entrada estándar `stdin` sea redireccionada, de modo que los datos se puedan enviar a él.

### Externo a interno

Los comandos externos envían una serie de cadenas a través de su salida estándar `stdout`. Estas cadenas se leen en la tubería y se ponen a disposición al comando interno que sigue en la tubería, o se muestran al usuario si el comando externo es el último paso en la tubería.

### Externo a externo

Los comandos externos se comunican entre sí a través de estándar `stdin`/`stdout`. Como Nu detectará esta situación, redirigirá la salida estándar `stdout` del primer comando a la entrada estándar `stdin` del siguiente comando externo. De esta forma, se mantiene el comportamiento esperado de una tubería de shell entre comandos externos.
