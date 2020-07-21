---
layout: content
title: El pipeline
prev: Tablas
next: Configuración
link_prev: /es/trabajando_con_tablas.html
link_next: /es/configuracion.html
---

Uno de los diseños centrales de Nu es la tubería (pipeline), una idea de diseño que rastrea sus raíces décadas atrás hasta parte de la filosofía original detrás de Unix. Así como Nu extiende desde un solo dato tipo de cadena de Unix, Nu también extiende la idea de tuberías (pipelines) para incluir más que solo texto.

## Fundamentos

Una tubería (pipeline) es construída con tres partes: la entrada, el filtro, y la salida.

```
> open "Cargo.toml" | inc package.version | save "Cargo_new.toml"
```

El primer comando, `open "Cargo.toml"`, es una entrada (a veces también llamada "fuente" o "productor"). Esto crea o carga datos y lo canaliza en la tubería. Es de entrada para la tubería tener valores y poder trabajarlas. Comandos como `ls` también son entradas ya que toman datos desde el sistema de archivos y lo canalizan a través de las tuberías para que puedan ser usadas.

El segundo comando, `inc package.version`, es un filtro. Filtros toman los datos que se les entrega y comúnmente hacen algo con la misma. Puede que la cambien (tal como el comando `inc` en nuestro ejemplo), o pueden hacer otra operación, como registrar, mientras pasan los valores.

El último comando, `save "Cargo_new.toml"`, es una salida (a veces llamado un "sink"). Una salida toma la entrada de la tubería y realiza alguna operación final. En nuestro ejemplo, grabamos lo que viene a través de la tubería hacia un archivo como paso final. Otros tipos de comandos de salida pueda que tomen valores y lo muestren para el usuario.

## Trabajando con comandos externos

Los comandos en Nu se comunican entre ellos usando los tipos de datos de Nu (mirar [tipos de datos](tipos_de_datos.md)) pero, ¿qué hay de comandos fuera de Nu? Miremos algunos ejemplos trabajando con comandos externos:

`commando_interno | comando_externo`

Los datos fluirán desde comando_interno al comando_externo. Estos datos se esperan que sean cadenas para que puedan ser enviadas a entrada estándar `stdin` del comando_externo.

`comando_externo | comando_interno`

Los datos que vienen de un comando externo a Nu se coleccionará a una sola cadena y luego serán pasadas a comando_interno. Comandos como `lines` ayudan a facilitar datos provenientes de comandos externos de manera que sea más facil trabajarlas.

`comando_externo_1 | comando_externo_2`

Nu trabaja con datos canalizados entre dos comandos externos de la misma forma como en otras shells, como Bash lo haría. La salida estándar `stdout` de comando_externo_1 es conectada a la entrada estándar `stdin` de comando_externo_2. Esto permite que los datos fluyan naturalmente entre dos comandos.

## Detrás de escenas

Es posible que te hayas preguntado como miramos una tabla si `ls` es una entrada y no una salida. Nu agrega esta salida por nosotros automáticamente usando otro comando llamado `autoview`. El comando `autoview` es añadido a cualquier tubería que no tenga una salida permitiéndonos ver el resultado.

En efecto, el comando:

```
> ls
```

y la tubería:

```
> ls | autoview
```

Son uno y lo mismo.

