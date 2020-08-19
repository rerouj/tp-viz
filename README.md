# Projet *tpviz* : API et visualisations de données

Dans ce dossier se trouve le code qui a servi a produire l'interface de programmation et les visualisations de données qui ont servi dans le cadre du travail de mémoire **La couverture géographique des reportages de Temps Présent : apport des archives numériques et des visualisations de données à une histoire des magazines de grands reportages**. Ce projet porte le nom de code tpviz.

tp-viz est une application web qui comporte un backend (API) et un frontend. Le backend a été créé en Express.js et peut être déployé sur un serveur Node.js. Le frontend quant à lui a été créé avec des fichier .pug. L'ensemble des éléments qui entrent dans le front end sont accessible dans les dossiers : publics (javascripts) et views (pugs). Les autres dossiers comportent le code de l'API. Les dossiers particulièrement intéressants sont les dossiers *routes*, *controllers* et *model*. tp-viz repose sur une base de données Mongodb. La db est accessible dans le dossier Github suivant : https://github.com/rerouj/apptp-db. 

Toutes la méthode concernant cette interphace est abordée dans le mémoire au chapitre 4.3.

# Comment ?

tp-viz est une application express.js. Elle tourne actuellement sur une version 12.16.1 de Node.js. Pour installer l'application, il faut :

1. télécharger et installer localement node.js : https://nodejs.org/en/download/
2. télécharger le dossier Github tp-viz et le déployer dans un dossier local
3. depuis un fenêtre de Terminal atteindre le dossier qui contient l'application. Depuis le dossier lancer

```javascript
npm install express
```

puis

```javascript
npm install
```

La première commande installe express.js, la seconde install les librairies nécessaires (dependencies) pour faire fonctionner les programme.

Si la db est correctement installée, on peut lancer l'application avec la commande suivante :

```javascript
nodemon start
```

L'application est visible sur un navigateur à l'adresse : http://localhost:3000

Pour explorer l'API via le navigateur, veuillez consulter le chapitre 4.3. du mémoire.

# Qui ?

L'ensemble du code tp-viz a été produit par l'auteur du mémoire (Renato Diaz). N'hésitez pas à forker et n'oubliez pas d'ajouter une étoile ⭐️ ;)

Contact renato.diaz@outlook.com