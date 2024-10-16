---
home: true
heroImage: null
heroText: Nushell
tagline: Un nuevo tipo de shell
actionText: Get Started →
actionLink: /es/book/
features:
  - title: *Pipelines* para controlar cualquier sistema operativo
    details: Nu funciona en Linux, macOS, BSD, y Windows. Aprende una vez, y úsalo en cualquier parte.
  - title: Todo son datos
    details: Los *pipelines* de Nu utilizan datos estructurados para que puedas seleccionar, filtrar y ordenar de forma segura de la misma manera cada vez. Deja de analizar cadenas y comienza a resolver problemas.
  - title: Complementos potentes
    details: Es fácil ampliar Nu usando un potente sistema de complementos.
---

<img src="https://www.nushell.sh/frontpage/ls-example.png" alt="Captura de pantalla utilizando el comando ls" class="hero"/>

### Nu trabaja con datos existentes

Nu admite [JSON, YAML, SQLite, Excel, y mucho más](/book/loading_data.html) de serie. Es fácil introducir datos en un *pipeline* de Nu, ya sea en un archivo, una base de datos o una API web.:

<img src="https://www.nushell.sh/frontpage/fetch-example.png" alt="Captura de pantalla mostrando fetch con una web API" class="hero"/>

### Nu tiene unos fabulosos mensajes de error

Nu opera con datos tipificados, por lo que detecta errores que otros shells no detectan. Y cuando algo falla, Nu te dice exactamente dónde y por qué:

<img src="https://www.nushell.sh/frontpage/miette-example.png" alt="Captura de pantalla mostrando un tipo de error en Nu" class="hero"/>

## Obtener Nu

Nushell está disponible como [binarios descargables](https://github.com/nushell/nushell/releases), [mediante tu gestor de paquetes preferido](https://repology.org/project/nushell/versions), en [una acción de GitHub](https://github.com/marketplace/actions/setup-nu), y como [código fuente](https://github.com/nushell/nushell). Lee [las intrucciones detalladas de instalación](/book/installation.html) o lánzate directamente en:

#### macOS / Linux:

##### Homebrew

```shell
$ brew install nushell
```

##### Nix profile

```shell
$ nix profile install nixpkgs#nushell
```

#### Windows:

```powershell
winget install nushell
```

Después de la instalación, puedes ejecutar Nu escribiendo `nu`.

## Comunidad

¡Únete a nosotros [en Discord](https://discord.gg/NtAbbGn) si tienes alguna pregunta relacionada con Nu!

Puedes ayudar a mejorar este sitio web [compartiendo tu opinión](https://github.com/nushell/nushell.github.io/issues) o [enviando un PR](https://github.com/nushell/nushell.github.io/pulls).
