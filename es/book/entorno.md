# Entorno

Una tarea común al usar una shell es controlar el ambiente de entorno que aplicaciones externas usarán. Comúnmente esto sucede automáticamente, a medida que el entorno se empaqueta y se entrega a la aplicación externa cuando se inicia. Sin embargo, hay veces que vamos a desear tener control más preciso sobre qué variables de entorno una aplicación pueda ver.

Puedes ver las variables de entorno actuales que se enviarán a las aplicaciones explorando `#nu.env`:

```
echo $nu.env
# => ──────────────────────────┬──────────────────────────────
# =>  COLORTERM                │ truecolor
# =>  DBUS_SESSION_BUS_ADDRESS │ unix:path=/run/user/1000/bus
# =>  DESKTOP_SESSION          │ gnome
# =>  DISPLAY                  │ :1
```

El ambiente es creador a través de los ajustes en la configuración de Nu y a partir del entorno en el que se ejecuta Nu. Puedes actualizar el ambiente permanentement usando técnicas enumeradas en el capítulo de [configuración](configuracion.md).

También puedes temporalmente actualizar una variable de entorno cuando ejecutas un comando o tubería de comandos.

```
with-env [MI_VARIABLE VALOR] { echo $nu.env.MI_VARIABLE }
# => VALOR
```

El comando `with-env` establecerá temporalmente la variable de entorno dada (aquí: la variable "MI_VARIABLE" es dada el valor "VALOR"). Una vez hecho esto, el bloque se ejecutará con esta nueva variable de entorno establecida.

A common shorthand, inspired by Bash and others, is also available. You can write the above example as:

Una atajo común, inspirada en Bash y otros, también está disponible. Puedes escribir el ejemplo anterior como:

```
MI_VARIABLE=VALOR echo $nu.env.MI_VARIABLE
# => VALOR
```
