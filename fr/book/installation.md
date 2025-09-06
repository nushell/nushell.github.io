# Installer Nu

Il existe de nombreuses façons de démarrer avec Nu. Vous pouvez télécharger des binaires précompilés depuis notre [page de release](https://github.com/nushell/nushell/releases), [utiliser votre gestionnaire de paquets préféré](https://repology.org/project/nushell/versions), ou compiler à partir des sources.

Le binaire principal de Nushell est nommé `nu` (ou `nu.exe` sous Windows). Après installation, vous pouvez le lancer en tapant `nu`.

@[code](@snippets/installation/run_nu.sh)

## Binaires précompilés

Les binaires de Nu sont publiés pour Linux, macOS et Windows [avec chaque release sur GitHub](https://github.com/nushell/nushell/releases). Il vous suffit de les télécharger, d'extraire les binaires, puis de les copier à un emplacement sur votre PATH.

## Gestionnaires de paquets

Nu est disponible via plusieurs gestionnaires de paquets :

[![Statut du packaging](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

Pour macOS et Linux, [Homebrew](https://brew.sh/) est un choix populaire (`brew install nushell`).

Pour Windows :

- [Winget](https://docs.microsoft.com/fr-fr/windows/package-manager/winget/) (`winget install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

Installation multiplateforme :

- [npm](https://www.npmjs.com/) (`npm install -g nushell` Notez que les plugins Nu ne sont pas inclus si vous installez de cette manière)

## Compiler à partir des sources

Vous pouvez également compiler Nu à partir des sources. Tout d'abord, vous devrez configurer la toolchain Rust et ses dépendances.

### Installation d'une suite de compilateurs

Pour que Rust fonctionne correctement, vous devrez avoir une suite de compilateurs compatible installée sur votre système. Les suites de compilateurs recommandées sont :

- Linux : GCC ou Clang
- macOS : Clang (installez Xcode)
- Windows : MSVC (installez [Visual Studio](https://visualstudio.microsoft.com/vs/community/) ou les [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022))
  - Assurez-vous d'installer le workload "Desktop development with C++"
  - Toute édition de Visual Studio fonctionnera (Community est gratuite)

### Installation de Rust

Si vous n'avez pas encore Rust sur votre système, la meilleure façon de l'installer est via [rustup](https://rustup.rs/). Rustup est un outil de gestion des installations de Rust, y compris la gestion de l'utilisation de différentes versions de Rust.

Nu nécessite actuellement la **dernière version stable (1.66.1 ou plus récente)** de Rust. Le mieux est de laisser `rustup` trouver la version correcte pour vous. Lorsque vous ouvrez `rustup` pour la première fois, il vous demandera quelle version de Rust vous souhaitez installer :

@[code](@snippets/installation/rustup_choose_rust_version.sh)

Une fois prêt, appuyez sur 1 puis sur Entrée.

Si vous préférez ne pas installer Rust via `rustup`, vous pouvez également l'installer via d'autres méthodes (par exemple, depuis un paquet dans une distro Linux). Assurez-vous simplement d'installer une version de Rust qui soit 1.66.1 ou plus récente.

### Dépendances

#### Debian/Ubuntu

Vous devrez installer les paquets "pkg-config", "build-essential" et "libssl-dev" :

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

#### Distros basées sur RHEL

Vous devrez installer "libxcb", "openssl-devel" et "libX11-devel" :

@[code](@snippets/installation/install_rhel_dependencies.sh)

#### macOS

En utilisant [Homebrew](https://brew.sh/), vous devrez installer "openssl" et "cmake" en utilisant :

@[code](@snippets/installation/macos_deps.sh)

### Compiler en utilisant [crates.io](https://crates.io)

Les releases de Nu sont publiées sur le populaire gestionnaire de paquet de Rust [crates.io](https://crates.io/). Cela facilite la compilation et l'installation de la dernière release de Nu avec `cargo`:

@[code](@snippets/installation/cargo_install_nu.sh)

C'est tout ! L'outil `cargo` se chargera de télécharger les sources de Nu et de ses dépendances, de les compiler, et d'installer Nu à l'emplacement des binaires de cargo.

### Compiler à partir du dépôt GitHub

Vous pouvez également compiler Nu à partir des dernières sources sur GitHub. Cela vous donne un accès immédiat aux dernières fonctionnalités et corrections de bugs. Tout d'abord, clonez le dépôt :

@[code](@snippets/installation/git_clone_nu.sh)

Nous pouvons à présent compiler et exécuter Nu avec :

@[code](@snippets/installation/build_nu_from_source.sh)

Vous pouvez également compiler et exécuter Nu en mode release, ce qui active plus d'optimisations :

@[code](@snippets/installation/build_nu_from_source_release.sh)

Les personnes familières avec Rust pourraient se demander pourquoi nous faisons une étape de "build" et une étape de "run" séparément alors que "run" effectue une compilation par défaut. Cela permet de contourner une limitation de la nouvelle option `default-run` dans Cargo, et de s'assurer que tous les plugins sont bien compilés, bien que cela ne soit peut-être plus nécessaire à l'avenir.
