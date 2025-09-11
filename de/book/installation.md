# Nu installieren

Der aktuell beste Weg Nu zu bekommen ist, es von [crates.io](https://crates.io) zu installieren, Binärdateien von unserer [Release-Seite](https://github.com/nushell/nushell/releases) herunterzuladen oder es selbst zu kompilieren.

## Binärdatei

Von der [Release-Seite](https://github.com/nushell/nushell/releases) kann Nushell bereits kompiliert heruntergeladen werden. Alternativ kann Nushell, wenn [Homebrew](https://brew.sh/) verwendet wird, mit dem Befehl `brew install nushell` installiert werden. Unter Windows kann [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) zur Installation verwendet werden: `winget install nushell`.

### Windows

**Achtung:** Nu funtioniert aktuell auf Windows 10 und hat keine Unterstützung für Windows 7/8.1.

Die aktuelle, veröffentlichte `.zip`-Datei von der [Release-Seite](https://github.com/nushell/nushell/releases) herunterladen und den Inhalt extrahieren nach:

@[code](@snippets/installation/windows_example_extraction_location.sh)

Danach den `nu` beinhaltenden Ordner der Umgebungsvariable PATH hinzufügen. Wenn das passiert ist, kann `nu` wie folgt gestartet werden:

@[code](@snippets/installation/windows_run_nu.sh)

Für Nutzer des [Windows Terminal](https://github.com/microsoft/terminal) kann `nu` als Standard-Shell gesetzt werden, indem:

@[code](@snippets/installation/windows_terminal_default_shell.sh)

zu `"profiles"` in den Terminal Einstellungen (JSON-Datei) hinzufügt wird. Zu guter Letzt, muss nur noch `"defaultProfile"` angepasst werden:

@[code](@snippets/installation/windows_change_default_profile.sh)

Jetzt sollte sich `nu` beim Start von Windows Terminal öffnen.

## Vorbereitungen

Bevor Nu installiert werden kann, muss sichergestellt werden, dass das System die nötigen Anforderungen erfüllt. Aktuell bedeutet das sicherzustellen, dass die Rust-Toolchain und lokale Abhängigkeiten installiert sind.

### Installieren einer Compiler-Suite

Damit Rust richtig funktioniert, muss eine kompatible Compiler-Suite auf dem System installiert sein. Die empfohlenen Compiler-Suites sind:

- Linux: GCC oder Clang
- macOS: Clang (Xcode installieren)
- Windows: MSVC (installieren von [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/) oder der [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022))
  - Sicherstellen, dass "Desktop development with C++" installiert wird
  - Jede Visual Studio Edition sollte funktionieren (Community ist gratis)

### Rust installieren

Wenn Rust noch nicht auf dem System installiert ist, ist [rustup](https://rustup.rs/) der beste Weg es zu bekommen. Rustup ist ein Programm um Rust-Installationen zu managen wie beispielsweise verschiedene Rust-Versionen.

Nu benötigt aktuell die **latest stable (1.55 oder neuer)** Version von Rust. Der einfachste Weg ist es, `rustup` die korrekte Version für finden zu lassen. Wenn `rustup` zum ersten Mal gestartet wird, wird nachgefragt, welche Version installiert werden soll:

@[code](@snippets/installation/rustup_choose_rust_version.sh)

Wenn Sie bereit sind, drücken Sie `1` und dann `Enter`.

Wenn Rust nicht via `rustup` installiert werden soll, können auch andere Methoden verwendet werden um es zu installieren (z.B. vom Paketmanager der Linux-Distro). Dabei muss sichergestellt werden, dass es sich um Rust-Version 1.55 oder neuer handelt.

## Abhängigkeiten

### Debian/Ubuntu

Es müssen die Pakete `pkg-config` und `libssl-dev` installiert werden:

@[code](@snippets/installation/install_pkg_config_libssl_dev.sh)

Linux-Nutzer die die optionalen Funktionen `rawkey` und `clipboard` verwenden möchten, müssen außerdem die Pakete `libx11-dev` und `libxcb-composite0-dev` installieren:

@[code](@snippets/installation/use_rawkey_and_clipboard.sh)

### RHEL basierte Distributionen

Für RHEL basierte Distributionen müssen die Pakete `libxcb`, `openssl-devel` und `libX11-devel` installiert werden:

@[code](@snippets/installation/install_rhel_dependencies.sh)

### macOS

Mittels [Homebrew](https://brew.sh/), müssen die Pakete `openssl` und `cmake` über folgenden Befehl installiert werden:

@[code](@snippets/installation/macos_deps.sh)

## Installieren von [crates.io](https://crates.io)

Wenn alle die Abhängigkeitenn, die für Nu benötigt werden, installiert sind, kann `cargo` verwendet werden um Nu zu installieren.

@[code](@snippets/installation/cargo_install_nu.sh)

Das war's! Cargo wird Nu und seine anderen Abhängigkeiten herunterladen, kompilieren und schließlich im cargo `bin` Pfad installieren, damit es benutzt werden kann.

## Kompilieren von Quelldateien

Nu kann auch direkt aus den Quelldateien, die auf GitHub verfügbar sind, kompiliert werden. Das stellt unmittelbar die neuesten Funktionen und Fehlerbehebungen von Nu zur Verfügung.

@[code](@snippets/installation/git_clone_nu.sh)

Git clont das main nushell Repo. Von da aus, kann Nu, wenn `rustup` verwendet wird, wie folgt kompiliert und gestartet werden:

@[code](@snippets/installation/build_nu_from_source.sh)

Nu kann auch in "release" Modus kompiliert und gestartet werden:

@[code](@snippets/installation/build_nu_from_source_release.sh)

Leute, die sich mit Rust auskennen, wundern sich womöglich, warum hier sowohl ein `build` als auch ein `run` durchgeführt wird, obwohl `run` standardmäßig auch einen Build durchführt. Das ist nötig, um ein Problem mit der neuen `default-run`-Option von Cargo zu umgehen, damit alle Plugins kompiliert werden. Dies wird unter Umständen in Zukunft nicht mehr nötig sein.

## Als Login-Shell verwenden

**!!! Nu befindet sich noch in der Entwicklung und ist unter Umständen nicht stabil genug für die tägliche Nutzung. !!!**

Um die Login-Shell festzulegen, kann der Befehl [`chsh`](https://linux.die.net/man/1/chsh) verwendet werden.
Manche Linux-Distributionen haben eine Liste von erlaubten Shells in `/etc/shells` und verbieten es die Shell zu ändern, bis Nu in der Whitelist ist. Wenn die `shells`-Datei nicht abgeändert wurde, erscheint vielleicht einen ähnlichen Fehler, wie:

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

Nu kann zur Liste der erlaubte Shells hinzugefügt werden, indem der Pfad von `nu` der `shells`-Datei angefügt wird.
Der Pfad, der hinzugefügt werden muss, kann mit dem Befehl `which nu` herausgefunden werden. Normalerweise ist es `$HOME/.cargo/bin/nu`.
