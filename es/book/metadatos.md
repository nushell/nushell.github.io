# Metadatos

Al usar Nu es posible que hayan momentos que has encontrado como si algo extra sucediera detrás de escenas. Por ejemplo digamos que intentas abrir un archivo soportado por Nu para luego olvidarte e intentar convertir nuevamente:

```
> open Cargo.toml | from toml
error: Expected a string from pipeline
- shell:1:18
1 | open Cargo.toml | from toml
  |                   ^^^^^^^^^ requires string input
- shell:1:5
1 | open Cargo.toml | from toml
  |      ---------- object originates from here
```

El mensaje de error nos indica que hemos proporcionado a `from toml` algo distinto a una cadena pero también el origen del valor. ¿Cómo puede saberlo?

Valores que fluyen a través de la tubería en Nu comúnmente disponen de información adicional (o metadatos) adjuntadas en las mismas. Se conocen como etiquetas como las etiquetas en una tienda. Estas etiquetas no afecta los datos pero permiten a Nu mejorar la experiencia mientras se trabaja con esos datos.

Nuevamente ejecutemos el comando `open` pero esta vez observaremos las etiquetas que nos devuelve:

```
> open Cargo.toml | tags
----------+------------------------------------------
 span     | anchor
----------+------------------------------------------
 [object] | /home/jonathan/Source/nushell/Cargo.toml 
----------+------------------------------------------
```

Actualmente rastreamos dos pedazos de metadatos de los valores en la tubería. Puedes darte cuenta que disponemos del ancla que nos da la ubicación de dónde se cargaron los datos. Esto puede ayudar a Nu entender mejor como presentar datos.

También hay lapso (span). Miremos más de cerca a eso:

```
> open Cargo.toml | tags | get span
-------+-----
 start | end 
-------+-----
 5     | 15 
-------+-----
```

El lapso "start" y "end" aquí se refiere en dónde estará el subrayado en la línea. Si cuentas a partir de 5 y luego hasta 15 podrás observar que se alinea con el nombre de archivo "Cargo.toml". Así es como Nu sabía qué subrayar apropiadamente en el error que vimos previamente.


