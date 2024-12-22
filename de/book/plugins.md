# Plugins

Die Funktionen von Nushell können mittels Plugins erweitert werden. Diese Plugins können einen Großteil der selben Operationen ausführen, wie die internen Befehle. Noch dazu haben Plugins den Vorteil, dass sie separat und flexibel zu Nushell hinzugefügt werden können.

Um ein Plugin hinzuzufügen, muss es erstellt werden und dann der Befehl `plugin add` auf dieses Plugin aufgerufen werden. Wenn das getan wird, muss Nushell auch mitgeteilt werden, welches Protokoll vom Plugin verwendet wird.

Ein Beispiel:

```
plugin add ./my_plugins/nu-plugin-inc -e capnp
```

Wenn der Befehl registriert wurde, kann er als Teil der internen Befehle verwendet werden.

```
inc --help
```
