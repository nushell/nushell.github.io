# Instalando Nu

La mejor manera actualmente para poner en marcha Nu es instalándolo a través de [crates.io](https://crates.io), descargando desde [nuestra página](https://github.com/nushell/nushell/releases), y compilar desde la fuente.

## Binarios

Puedes descargar Nu compilado desde [nuestra página](https://github.com/nushell/nushell/releases). Alternativamente, si usas [Homebrew](https://brew.sh/) para macOS, puedes instalar el binario ejecutando `brew install nushell`.

### Windows

**nota:** Nu trabaja con Windows 10 y no soporta Windows 7/8.1

Descarga el archivo actual `.zip` [de la página de releases](https://github.com/nushell/nushell/releases) y extráelo por ejemplo a:

```
 C:\Program Files
```

y posteriormente agrega Nu a la variable de entorno `PATH`. Una vez que hagamos eso, podemos ejecutar Nu usando el comando `nu`:

```
 > nu
 C:\Users\user>
```

Si te encuentras usando [Windows Terminal](https://github.com/microsoft/terminal) puedes establecer `nu` como la shell por defecto añadiendo:

```
{
 "guid": "{2b372ca1-1ee2-403d-a839-6d63077ad871}",
 "hidden": false,
 "name": "Nu Shell",
 "commandline": "nu.exe"
}
```

a `"profiles"` en las preferencias de tu Terminal (archivo JSON). Lo último que tienes que hacer es cambiar `"defaultProfile"` a:

```
"defaultProfile": "{2b372ca1-1ee2-403d-a839-6d63077ad871}",
```

Ahora `nu` debería cargar al inicio de la Terminal de Windows.

## Preparación

Antes de que podamos instalar Nu, necesitamos asegurarnos de que nuestro sistema tenga los requerimientos necesarios. Actualmente significa que debemos verificar tener instalado tanto el Rust toolchain así como las dependencias locales. Estás son las suites de compilación recomendadas:

- Linux: GCC or Clang
- macOS: Clang (install Xcode)
- Windows: [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/)

Para Linux y macOS, una vez que hayas instalado la suite de compilación, todo estará listo para instalar Rust a través de `rustup` (ver más abajo).

For Windows, when you install Visual Studio Community Edition, make sure to install the "C++ build tools" as what we need is `link.exe` which is provided as part of that optional install. With that, we're ready to move to the next step.

Para Windows, cuando instalas Visual Studio Community Edition, asegúrate de instalar las herramientas "C++ build tools" ya que lo que necesitamos es `link.exe`, que es proporcionado como parte de esa instalación optcional. Con eso, estamos listos para el siguiente paso.

### Instalando un suite de compilación

Para que Rust funcione correctamente, necesitarás tener un suite de compilación compatible instalado en el sistema.

### Instalando Rust

En el caso de que no dispongamos de Rust en nuestro sistema la mejor manera de instalarlo es mediante [rustup](https://rustup.rs/). Rustup es una manera de manejar instalaciones de Rust incluyendo distintas versiones de Rust.

Nu actualmente requiere la versión **estable más reciente (1.55 o posterior)** de Rust. La mejor manera de `rustup` inferir la versión correcta para ti. En el momento de abrir `rustup` te solicitará qué versión de Rust deseas instalar:

```
Current installation options:

   default host triple: x86_64-unknown-linux-gnu
     default toolchain: stable
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
```

Una vez que estamos listos, presionamos 1 y luego enter.

Si prefieres no instalar Rust mediante `rustup`, también puedes instalar a través de otros métodos (Ej. un paquete en alguna distribución de Linux). Solo asegúrate de instalar una versión que sea Rust 1.55 o posterior.

## Dependencias

### Debian/Ubuntu

Vas a necesitar instalar "pkg-config" y "libssl-dev":

<<< @/snippets/installation/install_pkg_config_libssl_dev.sh

Usuarios de Linux que desean usar las funcionalidades opcionales `rawkey` o `clipboard` necesitarán instalar los paquetes "libx11-dev" y "libxcb-composite0-dev":

<<< @/snippets/installation/use_rawkey_and_clipboard.sh

### Distribuciones basadas en RHEL

Vas a necesitar instalar "libxcb", "openssl-devel" and "libX11-devel":

<<< @/snippets/installation/install_rhel_dependencies.sh

### macOS

Usando [homebrew](https://brew.sh/), vas a necesitar instalar la fórmula "openssl":

```
brew install openssl cmake
```

## Instalando desde [crates.io](https://crates.io)

Una vez instaladas las depependencias que Nu necesita, podemos instalarla usando el comando `cargo` que viene con el compilador Rust.

```
> cargo install nu
```

¡Eso es todo! Cargo hará el trabajo de descarga Nu junto con sus dependencias, construirla e instalarla en el bin path de cargo para que podamos arrancarlo.

Si deseas instalar con más funcionalidades, puedes hacer:

```
> cargo install nu --features=stable
```

Para todas las funcionalidades disponibles, la manera más fácil es descargar la fuente de Nu y construírlo usted mismo usando las herramientas de Rust:

```
> git clone https://github.com/nushell/nushell.git
> cd nushell
nushell> cargo install --path . --force --features=stable

Para que esto funcione, asegúrate de tener todas las dependencias instaladas (que se muestran arriba) en el sistema.

Finalizada la instalación podemos ejecutar Nu usando el comando `nu`:

```

$ nu
/home/sophia/Source>

```

## Construyendo desde la fuente

También podemos contruir nuestro propio Nu directamente desde github. Esto nos da acceso inmediato a las últimas funcionalidades y corrección de bugs.

```

> git clone https://github.com/nushell/nushell.git

```

Git nos clonará el repositorio principal de Nu. Partiendo de ahí podemos contruir y arrancar Nu si estamos usando `rustup` con:

```

> cd nushell
> nushell> cargo build --workspace --features=stable; cargo run --features=stable

```

También puedes construir y arrancar Nu en modo release:

```

nushell> cargo build --release --workspace --features=stable; cargo run --release --features=stable

```
Gente familiarizada con Rust se preguntará la razón por la que hacemos un paso "build" y otro paso "run" si "run" construye por defecto. Esto es para evitar una deficiencia de la nueva opción `default-run` en Cargo y asegurar que todos los plugins se construyan aunque puede que esto no sea necesario en el futuro.

**Nota:** Si te encuentras trabajando tanto en modo debug y release, asegúrate de ejecutar `cargo clean` cuando cambies entre ellas. Nu buscará plugins en los directorios tanto de debug así como release y puede suceder que cargue versiones de un plugin que no tienes intenciones de usar.

## Establecer como shell de inicio de sesión

**!!! Nu todavía está en desarrollo y puede no ser estable para uso diario. !!!**

Para configurar la shell de inicio de sesión, puedes usra el comando [`chsh`](https://linux.die.net/man/1/chsh).
En algunas distribuciones de Linux se encuentra una lista válida de shells en `/etc/shells` y no permitirá cambiar la shell hasta que Nu esté en la lista blanca. Es posible que vea un error similar al siguiente si no ha actualizado el archivo `shells`:

```

chsh: /home/username/.cargo/bin/nu is an invalid shell

```

Puedes agregar Nu a la lista de shells válidas añadiendo el binario al archivo `shells`. La ruta para agregar puedes encontrarla con el comando `which nu`, usualmente es `$HOME/.cargo/bin/nu`.
```
