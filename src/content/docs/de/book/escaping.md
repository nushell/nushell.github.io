---
title: Aufruf von Systembefehlen
---

Nushell stellt einen identischen Satz an Befehlen für verschiedene Systeme zur Verfügung, die überall dieselbe Syntax und Funktionalität haben. Manchmal ist es jedoch nötig, den gleichnamigen, vom System selbst bereitgestellten, Befehl aufzurufen. Um beispielsweise den `ls` oder `date` Befehl des Systems auszuführen, wird das Zirkumflex (`^`) dem Befehl vorangestellt:

Nushell Befehl:

```
> ls
```

Aufruf des Systembefehls:

```
> ^ls
```
