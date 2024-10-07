# Rapide Tour d'Horizon

Le moyen le plus simple de découvrir ce que Nu peut faire est de commencer par quelques exemples, alors allons-y.

La première chose que vous remarquerez en exécutant une commande comme [`ls`](/commands/docs/ls.md) est qu'au lieu de recevoir un bloc de texte, vous obtenez un tableau structuré.

@[code](@snippets/introduction/ls_example.sh)

Ce tableau fait plus qu'afficher le répertoire d'une manière différente. Comme les tableaux dans un tableur, ce tableau nous permet de travailler avec les données de manière plus interactive.

La première chose que nous allons faire est de trier notre tableau par taille. Pour ce faire, nous allons prendre la sortie de la commande [`ls`](/commands/docs/ls.md) et l'injecter à une commande qui peut trier les tableaux en fonction du contenu d'une colonne.

@[code](@snippets/introduction/ls_sort_by_reverse_example.sh)

Vous pouvez voir que pour arriver à faire cela, nous n'avons pas passé d'arguments en ligne de commande à [`ls`](/commands/docs/ls.md). À la place, nous avons utilisé la commande [`sort-by`](/commands/docs/sort-by.md) fournit par Nu pour trier la sortie de la commande [`ls`](/commands/docs/ls.md). Pour afficher les fichiers les plus volumineux en haut, nous avons également utilisé [`reverse`](/commands/docs/reverse.md).

Nu fournit de nombreuses commandes qui peuvent fonctionner sur des tableaux. Par exemple, nous pourrions utiliser la commande [`where`](/commands/docs/where.md) pour filtrer le contenu du tableau [`ls`](/commands/docs/ls.md) afin qu'il n'affiche que les fichiers de plus de 1 kilo-octet :

@[code](@snippets/introduction/ls_where_example.sh)

Comme dans la philosophie Unix, le fait de pouvoir faire interagir les commandes entre elles nous permet de les combiner de nombreuses façons différentes. Voyons une autre commande :

@[code](@snippets/introduction/ps_example.sh)

Vous connaissez peut-être la commande [`ps`](/commands/docs/ps.md) si vous avez utilisé Linux. Avec cette dernière, nous pouvons obtenir une liste de tous les processus en cours d'exécution sur le système, leur statut et leur nom. Nous pouvons également voir la charge CPU des processus.

Que faire si nous voulions afficher uniquement les processus qui utilisent activement le CPU ? Tout comme nous l'avons fait précédemment avec la commande [`ls`](/commands/docs/ls.md), nous pouvons également travailler avec le tableau que la commande [`ps`](/commands/docs/ps.md) nous renvoie :

@[code](@snippets/introduction/ps_where_example.sh)

Jusqu'à présent, nous avons utilisé [`ls`](/commands/docs/ls.md) et [`ps`](/commands/docs/ps.md) pour lister des fichiers et des processus sous forme de tableau simple. Mais dans Nu, les données sont structurées et peuvent être imbriquées de manière arbitraire. Par exemple, explorons maintenant la commande [`help commands`](/commands/docs/help_commands.md).

Exécuter [`help commands`](/commands/docs/help_commands.md) nous donne des informations sur toutes les commandes de Nushell sous forme de tableau. Cependant, la sortie sera assez grande, alors récupérons seulement la ligne pour la commande `each`.

@[code](@snippets/introduction/help_commands_each_example.nu)

Ceci est un peu différent des tableaux que nous avons vus avant. Récupérer une seule ligne d'un tableau nous donne un [record](/book/types_of_data.html#records), qui est un ensemble de paires clé-valeur. Notez que les colonnes "params" et "input_output" contiennent en fait des tableaux plutôt que des valeurs simples. Pour afficher seulement l'une de ces colonnes, nous pouvons utiliser la commande [`get`](/commands/docs/get.md) :

@[code](@snippets/introduction/help_commands_get_example.nu)

La commande [`get`](/commands/docs/get.md) nous permet de plonger dans le contenu des données structurées (un tableau, un record ou une liste). Nous pouvons même lui passer des colonnes imbriquées pour accéder aux données à n'importe quelle profondeur.

@[code](@snippets/introduction/help_commands_get_nested_example.nu)

Ces colonnes imbriquées sont appelées [chemins de cellules](/book/types_of_data.html#cell-paths). Nu prendra le chemin de la cellule et ira à la donnée correspondante dans un tableau, un record ou une liste. Les chemins de cellules prennent également en charge les numéros de ligne, nous aurions donc pu réécrire le pipeline précédent ainsi :

@[code](@snippets/introduction/help_commands_get_cell_path_example.nu)

### Obtenir de l'aide

Vous pouvez voir le texte d'aide pour n'importe laquelle des commandes intégrées de Nu en utilisant la commande [`help`](/commands/docs/help.md) ou en passant l'option `--help` à une commande. Vous pouvez également rechercher un sujet en faisant `help -f <topic>`.

@[code](@snippets/introduction/help_example.sh)
