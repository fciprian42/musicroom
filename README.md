# MusicRoom

Voilà un petit tutoriel de comment lancer l'application et le serveur.

## API

Le back est codé en `nodejs` utilisant la technologie `graphql` pour tout ce qui est requêtes à la base de données etc..

La base de données est en `postgresql`.

Personellement j'utilise le logiciel `datagrip` de chez jetbrains pour me servir de la base de données (créer des tables, insérer, etc..)

Il te faudra une application tierce pour lancer un serveur local en postgresql, moi sur windows j'utilise [pgAdmin](https://www.postgresql.org/download/windows/) sinon pour [mac](https://www.postgresql.org/download/macosx/).

Voici les identifiants que j'utilise dans le code pour me connecter à la base de données

- user: 'postgres'
- host: 'localhost'
- database: 'musicroom'
- password: 'test'
- port: 5432

Veille à ce que tes identifiants correspondent.

Une fois ton serveur local démarré suit ces étapes.

1) npm i
2) npm start

Si "Database connected ✅" c'est tout bon !

Tu peux ensuite accéder à l'interface graphql sur localhost:4000/graphql et voir comment la documentation est faite etc, si tu connais pas du tout je conseille d'aller sur le [site officiel](https://graphql.org/) ou de regarder des vidéos youtube sur le sujet.
> N'hésite pas à venir vers moi si t'a une question !

## Application

Pour l'application en elle même c'est du `react-native`, `graphql` et `apollo`.

Sur ce projet j'utilise `expo` qui permet de tester son application sur n'importe quelle plateforme donc tu peux très bien coder pour ios sur windows.

Pour t'en servir il suffit d'installer l'application expo sur ton mobile.

1) npm i
2) indique ton IPv4 dans le fichier App.js à la racine
3) npm start
4) Une interface web s'ouvre, c'est là où tu verra toutes les outputs de l'app et dont un QRCode qui s'utilise avec l'app expo que tu peux scan avec ton appareil photo.

## Avancement

Comme dit j'ai fait toute la partie connexion, inscription (oauth compris), reset de password etc, et j'avais pour idée de m'attaquer à la page profil.

Pour toutes autres questions hésite pas !

