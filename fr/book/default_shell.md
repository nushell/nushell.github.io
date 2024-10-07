# Shell par défaut

## Définir Nu comme shell par défaut sur votre terminal

|     Terminal     | Plateforme   |                                                                                                                                                 Instructions                                                                                                                                                 |
| :--------------: | ------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  GNOME Terminal  | Linux & BSDs |                                       Ouvrez `Édition > Préférences`. Dans le panneau de droite, sélectionnez l'onglet `Commande`, cochez `Exécuter une commande personnalisée à la place de mon shell`, et définissez `Commande personnalisée` par le chemin vers Nu.                                       |
|  GNOME Console   | Linux & BSDs |                Tapez la commande `gsettings set org.gnome.Console shell "['/usr/bin/nu']"` (remplacez `/usr/bin/nu` par le chemin vers Nu). De manière équivalente, vous pouvez utiliser [dconf Editor](https://apps.gnome.org/DconfEditor/) pour modifier la clé `/org/gnome/Console/shell`.                |
|      Kitty       | Linux & BSDs |                                                                            Appuyez sur `Ctrl`+`Shift`+`F2` pour ouvrir `kitty.conf`. Allez à la variable `shell`, décommentez la ligne et remplacez le `.` par le chemin vers Nu.                                                                            |
|     Konsole      | Linux & BSDs |                                                                                                        Ouvrez `Paramètres > Modifier le profil actuel`. Définissez `Commande` sur le chemin vers Nu.                                                                                                         |
|  XFCE Terminal   | Linux & BSDs |                                                                     Ouvrez `Édition > Préférences`. Cochez `Exécuter une commande personnalisée à la place de mon shell`, et définissez `Commande personnalisée` sur le chemin vers Nu.                                                                      |
|   Terminal.app   | macOS        |     Ouvrez `Terminal > Préférences`. Assurez-vous d'être sur l'onglet `Profils`, qui devrait être l'onglet par défaut. Dans le panneau de droite, sélectionnez l'onglet `Shell`. Cochez `Exécuter une commande`, insérez le chemin vers Nu dans la zone de texte, et décochez `Exécuter dans le shell`.      |
|      iTerm2      | macOS        |                              Ouvrez `iTerm > Préférences`. Sélectionnez l'onglet `Profils`. Dans le panneau de droite sous `Commande`, changez la valeur du menu déroulant de `Shell de connexion` à `Shell personnalisé`, et insérez le chemin vers Nu dans la zone de texte.                               |
| Windows Terminal | Windows      | Appuyez sur `Ctrl`+`,` pour ouvrir `Paramètres`. Allez à `Ajouter un nouveau profil > Nouveau profil vide`. Remplissez le 'Nom' et entrez le chemin vers Nu dans la zone de texte 'Ligne de commande'. Allez à l'option `Démarrage` et sélectionnez Nu comme 'Profil par défaut'. Appuyez sur `Enregistrer`. |

## Définir Nu comme shell de connexion (Linux, BSD & macOS)

::: warning
Nu est encore en développement et n'est pas destiné à être compatible POSIX.
Soyez conscient que certains programmes sur votre système peuvent supposer que votre shell de connexion est compatible [POSIX](https://fr.wikipedia.org/wiki/POSIX).
Briser cette supposition peut entraîner des problèmes inattendus.
:::

Pour définir le shell de connexion, vous pouvez utiliser la commande [`chsh`](https://linux.die.net/man/1/chsh).
Certaines distributions Linux ont une liste de shells valides située dans `/etc/shells` et empêcheront le changement de shell jusqu'à ce que Nu figure sur la liste blanche.
Vous pourriez voir une erreur similaire à celle ci-dessous si vous n'avez pas mis à jour le fichier `shells` :

@[code](@snippets/installation/chsh_invalid_shell_error.sh)

Vous pouvez ajouter Nu à la liste des shells autorisés en ajoutant le binaire de Nu au fichier `shells`.
Le chemin à ajouter peut être trouvé avec la commande `which nu`, généralement il s'agit de `$HOME/.cargo/bin/nu`.
