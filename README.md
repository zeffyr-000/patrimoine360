# 💼 Patrimoine360

> Application moderne Angular 21 de visualisation de patrimoine - POC

[![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Material](https://img.shields.io/badge/Material-21.0-purple.svg)](https://material.angular.io)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-yellow.svg)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 18.19+ ou 20.9+
- **npm** 9+

### Installation

```bash
# Cloner le projet
cd patrimoine360

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

L'application sera disponible sur `http://localhost:4200`.

## 📦 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance le serveur de développement |
| `npm run build` | Build de développement |
| `npm run build:prod` | Build de production |
| `npm run test` | Lance les tests unitaires (Vitest) |
| `npm run test:ci` | Tests avec couverture de code |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs ESLint |
| `npm run e2e` | Lance les tests E2E (Playwright) |

## 🏗️ Stack technique

### Frontend

- **Angular 21** - Framework principal avec standalone components
- **TypeScript 5.9** - Typage strict
- **Angular Material 21** - Composants UI Material Design 3
- **RxJS 7.8** - Programmation réactive
- **Signals** - API de réactivité Angular
- **Transloco** - Internationalisation

### Outils de développement

- **Angular CLI 21** - Scaffolding et build
- **ESLint** - Linting strict
- **Prettier** - Formatage du code
- **Vitest** - Tests unitaires
- **Playwright** - Tests E2E

## 📁 Structure du projet

```
src/
├── app/
│   ├── home/                 # Page d'accueil
│   ├── i18n/                 # Traductions
│   ├── interceptors/         # Intercepteurs HTTP
│   ├── testing/              # Utilitaires de test
│   ├── app.ts                # Composant racine
│   ├── app.config.ts         # Configuration Angular
│   └── app.routes.ts         # Routes
├── environments/             # Configuration par environnement
├── styles.scss               # Styles globaux
└── main.ts                   # Point d'entrée
```

## 🎨 Architecture

### Bonnes pratiques appliquées

- **Standalone Components** - Migration complète depuis NgModules
- **Signals API** - Gestion d'état réactive moderne
- **Control Flow Syntax** - Nouvelle syntaxe `@if`, `@for`, `@switch`
- **Zoneless** - Architecture sans Zone.js pour de meilleures performances
- **OnPush Change Detection** - Détection de changement optimisée
- **Lazy Loading** - Chargement différé des routes

### Patterns utilisés

- **Injection de dépendances** avec `inject()`
- **Reactive state management** avec Signals
- **HTTP Interceptors** pour l'authentification
- **Route Guards** pour la protection des routes

## 🧪 Tests

### Tests unitaires (Vitest)

```bash
# Lancer les tests en mode watch
npm run test

# Lancer les tests avec couverture
npm run test:ci
```

### Tests E2E (Playwright)

```bash
# Lancer les tests E2E
npm run e2e

# Lancer les tests E2E avec UI
npm run e2e:ui
```

## 📄 License

MIT
