# Hintergrund-Tasks in Nu

Aktuell besitzt Nushell kein eingebautes Hintergrund-Task Feature.
Mit einigen Werkzeugen kann sie jedoch Hintergrund-Tasks unterstützen.
Hier einige Beispiele:

1. Verwenden eines externen Task Werkzeugs wie [pueue](https://github.com/Nukesor/pueue)
2. Verwenden eines Terminal Multiplexers wie [tmux](https://github.com/tmux/tmux/wiki) or [zellij](https://zellij.dev/)

## Nu mit pueu verwenden

Dank [pueue](https://github.com/Nukesor/pueue) ist es möglich Hintergrund-Tasks zu planen und zu verwalten (wie Logs ansehen, Tasks beenden, den status aller Tasks einsehen)

Anders als bei einem Terminal Multiplexer, ist es nicht notwendig, mehrere Sitzungen zu verbinden.
Den Status von Tasks erhält man sehr einfach.

Hier ein einfaches Beispiel wie ein [nushell module](https://github.com/nushell/nu_scripts/tree/main/background_task) mit pueu zusammenarbeitet.

Das Setup umfasst:

1. installiere pueue
2. führe `pueued` mit der default Konfiguration aus. Siehe unter [start-the-daemon page](https://github.com/Nukesor/pueue/wiki/Get-started#start-the-daemon) für mehr Informationen.
3. speichere die [job.nu](https://github.com/nushell/nu_scripts/blob/main/modules/background_task/job.nu) Datei unter `$env.NU_LIB_DIRS`.
4. Füge die Zeile: `use job.nu` zur `$nu.config-path` Datei hinzu.
5. starte Nu neu.

Nun stehen einige Befehle zur Verarbeitung von Hintergrund-Tasks zur Verfügung. (e.g: `job spawn`, `job status`, `job log`)

Nachteil: Es wird eine frische Nushell zusammen mit dem gewünschten Befehl ausgeführt. Diese erbt nicht die Variablen, eigenen Befehle oder Aliase, vom aktuellen Gültigkeitsbereich. Mit Ausnahme von Umgebungsvariablen, welche den Wert in Text umwandeln können. Sollen eigene Befehle oder Variablen im Hintergrund-Task verwendet werden, müssen sie mit [`use`](/commands/docs/use.md) oder [`def`](/commands/docs/def.md) im entsprechenden Block definiert werden.

## Nu mit einem Terminal Multiplexer verwenden

Es kann ein Terminal Multiplexer installiert und mit Nu verwendet werden.

Diese erlauben es auf einfache Weise zwischen mehreren Programmen in einem Terminal zu wechseln.
Sie können abgekoppelt werden (und im Hintergrund weiterlaufen) und mit einem anderen Terminal wieder verbunden werden.
Dies ist sehr flexibel und nützlich.
