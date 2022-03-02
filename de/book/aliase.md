# Aliase

Aliase in Nushell bieten eine einfache Möglichkeit, um Texte zur ersetzen. Damit ist es möglich, einen Kurznamen für längere Befehle zu definieren - inclusive der Argumente.

Beispielsweise kann ein Alias namens `ll` definiert werden, der den längeren Befehl `ls -l` ersetzt:

```
> alias ll = ls -l
```

Nun kann der Alias aufgerufen werden:

```
> ll
```

Wenn das getan wird, wirkt es, als sei `ls -l` aufgerufen worden. Das bietet auch die Möglichkeit weitere Parameter anzugeben. So kann auch geschrieben werden:

```
> ll -a
```

Das ist äquivalent zu `ls -l -a`. Deutlich kürzer.

## Persistenz

Für Informationen, um Aliase dauerhaft zu speichern, damit diese immer in Nushell nutzbar sind, kann ein Blick auf das [Konfigurationskapitel](configuration.md#startup-befehle) geworfen werden.
