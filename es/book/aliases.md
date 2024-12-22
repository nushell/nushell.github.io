# Aliases

La habilidad de Nu para componer tuberías largas permite tener bastante control de su sistema y datos, pero a costas de tipear mucho. Sería ideal que puedas grabar las tuberías bien elaboradas para hacer uso de esas las veces que quieras.

Aquí es donde aparecen los aliases.

Un alias te permite crear un nombre corto para un bloque de comandos. Cuando se ejecuta el alias, es lo equivalente como si hayas tipeado el bloque de comandos.

Ejemplo:

```
alias ls-nombres [] { ls | select name }
ls-nombres
# => ────┬────────────────────
# =>  #  │ name
# => ────┼────────────────────
# =>   0 │ 404.html
# =>   1 │ CONTRIBUTING.md
# =>   2 │ Gemfile
# =>   3 │ Gemfile.lock
# =>   4 │ LICENSE
```

## Parámetros

También pueden tomar parámetros opcionales que son pasadas al bloque. Cada parámetro se convierte en una variable en el bloque.

```
alias decir [mensaje] { echo $mensaje }
decir "¡hola!"
# => ¡hola!
```

Puedes tener un número arbitrario de estos argumentos. Cuando el usuario no proporciona un valor, la variable en el bloque evaulara a `Nothing` y será eliminada.
