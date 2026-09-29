# Suivi des déplacements - dashboard des vols d'affaires

Dashboard destiné à une équipe de gestion des voyages d'entreprise, pour suivre les dépenses en vols et les tendances de réservation à partir du jeu de données *Travel Dataset - Datathon 2019* (table des vols, 271 888 lignes).

![Capture du dashboard](docs/screenshot.png)

## Lancer le projet

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev       # http://localhost:5173
```

Version de production :

```bash
npm run build
npm run preview   # http://localhost:4173
```

Le fichier `flights.csv` (24,5 Mo) est inclus dans `public/data/`, aucune configuration n'est nécessaire.


## Fonctionnalités

| Demandé dans l'énoncé | Réalisation |
|---|---|
| KPI globaux | Dépenses totales, nombre de vols, prix moyen, distance moyenne |
| Classement des trajets les plus fréquents et/ou les plus chers | Les deux : top 5 en nombre d'allers-retours, top 5 en prix moyen par vol |
| Répartition par type de vol, comparant prix et distance | Tableau comparatif : vols, prix moyen, distance moyenne, prix au km |
| Volume et dépenses par agence | Graphique en barres avec bascule Dépenses / Vols |
| Tendance mensuelle du volume et des dépenses | Courbe avec bascule Dépenses / Nombre de vols |
| Filtres par période, agence et type de vol | Filtres globaux appliqués à tout le dashboard, avec bouton de réinitialisation |
| Tableau détaillé, triable et filtrable, à l'échelle | Tableau virtualisé, tri sur chaque colonne, suit les filtres globaux |

