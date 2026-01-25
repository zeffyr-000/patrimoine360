# 💼 Patrimoine360

> POC de compte rendu patrimonial pour la Banque Privée - Angular 21

[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Material](https://img.shields.io/badge/Material-21-purple.svg)](https://material.angular.io)
[![Vitest](https://img.shields.io/badge/Vitest-4-yellow.svg)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌐 Live Application

**View the deployed application:**
[https://zeffyr-000.github.io/patrimoine360/](https://zeffyr-000.github.io/patrimoine360/)

**POC de compte rendu patrimonial** pour la Banque Privée. Application de visualisation et de suivi du patrimoine d'un client type, avec affichage des performances et des actions prises par les gestionnaires.

### 🎯 Spécifications du POC

| Critère         | Valeur                                             |
| --------------- | -------------------------------------------------- |
| **Domaine**     | Banque Privée / Gestion de patrimoine              |
| **Client type** | Entrepreneur français (52 ans) - Patrimoine 5,75M€ |
| **Cible**       | Desktop uniquement (1280px+)                       |
| **Langue**      | Français uniquement                                |
| **Design**      | Private Banking 2026 - Élégant et data-driven      |

### 👤 Profil client POC

**Pierre Dubois** - Entrepreneur, 52 ans

- **Profession** : Dirigeant de société (TechSolutions SAS)
- **Patrimoine total** : 5 753 000 €
- **Performance annuelle** : +333 000 € (+6,14%)
- **Profil de risque** : Équilibré
- **Gestionnaire** : Sophie Martin

## ✨ Fonctionnalités

### 📊 Vue d'ensemble du patrimoine

- **Carte hero** : Patrimoine total avec performance annuelle en temps réel
- **Profil client** : Informations du client et de son gestionnaire
- **Répartition graphique** : Distribution par catégorie d'actifs (12 types)

### 📈 Performances détaillées

- **Performance globale** : +6,14% sur 12 mois (+333 000 €)
- **Performance par catégorie** :
  - Société non cotée : +7,69% (2,8M€)
  - Actions cotées : +12,0% (280k€)
  - Immobilier : +4,17% et +2,44%
  - Assurance-vie : +5,56% (380k€)
  - Art et vin : +11,76% et +12,5%
  - Crypto : -20,0% (28k€)

### 🎯 Actions des gestionnaires

**7 actions tracées** (réalisées, en cours, planifiées) :

- ✅ Rééquilibrage portefeuille actions (réduction risque US tech)
- ✅ Optimisation fiscale PER (9 000€ d'économie d'impôt)
- ✅ Acquisition obligations corporate (rendement 4,2%)
- ✅ Allégement position crypto (sécurisation +8 000€)
- ✅ Conseil transmission patrimoniale (25 000€ d'économie future)
- 📅 Révision allocation assurance-vie (planifiée)
- 🔄 Analyse investissement locatif (en cours)

### 💼 Détail des actifs (12 actifs)

1. **Immobilier** (1,67M€ - 29%)
   - Résidence principale Neuilly (1,25M€)
   - Appartement locatif Lyon (420k€, rendement 3,8%)

2. **Société non cotée** (2,8M€ - 48,7%)
   - TechSolutions SAS (75% des parts)

3. **Placements financiers** (1,16M€ - 20%)
   - Actions PEA + CTO (280k€)
   - Assurance-vie (380k€)
   - PER (125k€)
   - Obligations (150k€)
   - Liquidités (180k€)

4. **Actifs alternatifs** (168k€ - 2,3%)
   - Collection art contemporain (95k€)
   - Cave à vin (45k€)
   - Crypto-actifs (28k€)

### 🎨 Design Private Banking 2026

- **Material Design 3**: Elegant interface with smooth animations
- **Elegant Palette**: Muted tones (navy, gold accents, white space)
- **Card-based Layout**: Clean data cards with generous whitespace
- **Desktop only**: Optimized for 1280px+ screens

### 🚀 Performance

- **Zoneless Architecture**: No Zone.js for optimal change detection
- **Signals**: Angular's reactivity API
- **Lazy Loading**: On-demand route loading
- **Local Fonts**: @fontsource/roboto

## 📚 Documentation

- 📖 **[Installation Guide](docs/SETUP.md)** - Complete project setup
- 🏗️ **[Technical Architecture](docs/ARCHITECTURE.md)** - Code patterns and structure
- 🧪 **[Testing Guide](docs/TESTING.md)** - Vitest best practices
- 🤝 **[Contributing Guide](docs/CONTRIBUTING.md)** - Development standards
- 📋 **[Improvement Plan](docs/IMPROVEMENT_PLAN.md)** - Roadmap and architecture improvements
- ✅ **[Refactoring Summary](docs/REFACTORING_SUMMARY.md)** - Phase 1 improvements
- 🎉 **[Phases 2 & 3 Complete](docs/PHASES_2_3_COMPLETE.md)** - Final implementation (18/20)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.19+ or 20.9+
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/zeffyr-000/patrimoine360.git
cd patrimoine360

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`.

## 🔧 Available Scripts

### Development

```bash
npm start                   # Start dev server (port 4200)
npm run build               # Development build
npm run build:prod          # Production build with optimizations
```

### Code Quality

```bash
npm run lint                # ESLint with strict rules
npm run lint:fix            # Auto-fix ESLint issues
npm test                    # Unit tests with Vitest
npm run test:ci             # Tests with coverage report
```

## 🏗️ Technical Architecture

### Core Stack

- **Angular 21** with standalone components and modern control flow (`@if`, `@for`)
- **Angular Material 21** with Material Design 3
- **TypeScript 5.9** with strict ESLint configuration
- **RxJS 7.8** for reactive programming
- **Signals** for reactive state management

### Project Structure

```
src/app/
├── core/             # Core utilities and constants
│   ├── constants/    # Business constants and icon mappings
│   └── utils/        # Utility functions and formatters
├── shared/           # Shared reusable components
│   └── components/   # StatCard, PerformanceBadge, etc.
├── home/             # Home page with patrimoine overview
├── services/         # Services (patrimoine)
├── models/           # TypeScript types and interfaces
├── i18n/             # Transloco translations
└── testing/          # Test helpers
```

### Data Flow

```
Static JSON files → PatrimoineService → Signals → Components
```

This POC uses static JSON files in `public/data/` instead of a backend API.

## 🎨 Design System

### Private Banking 2026 Design

Modern Private Banking design with clean, data-rich, card-based layouts.

- **Color Palette**: Elegant, muted tones (navy, gold accents, generous white space)
- **Typography**: Roboto - professional fonts with clear hierarchy
- **Layout**: Card-based design, data visualization focus
- **Components**: Large data cards, interactive charts, clear CTAs
- **Target Resolution**: 1280px+ (desktop only)

### Material Design 3 Theme

- **Primary Color**: Navy / Professional Blue
- **Accent Color**: Gold accents
- **Typography**: Roboto (300, 400, 500, 700)

### Performance Optimizations

- **Roboto**: Installed locally via `@fontsource/roboto`
- **Zoneless**: No Zone.js for optimal change detection
- **Lazy Loading**: On-demand route loading

## 🧪 Testing

### Vitest (natif Angular 21)

Ce projet utilise **Vitest** avec le support natif Angular via `@angular/build:unit-test`.

```bash
ng test                     # Mode watch
ng test --no-watch          # Exécution unique
ng test --code-coverage     # Avec couverture
```

### Coverage Goals

- **Overall Target**: 80% coverage
- **Services**: 70%+ (critical business logic)

## 🌐 Internationalization

The application uses **Transloco** for translations - **French UI only**.

### Usage Example

```typescript
// i18n/fr.ts
"home": {
  "title": "Mon Patrimoine",
  "total_value": "Valeur totale"
}

// Component template
<h1>{{ 'home.title' | transloco }}</h1>
```

## 🏗️ Technical Highlights

### Modern Angular 21 Architecture

- **Standalone Components**: Default in Angular 21 (no `standalone: true` needed)
- **Modern Control Flow**: `@if`, `@for`, `@switch` syntax
- **Signals API**: Reactive state management
- **TypeScript 5.9 Strict**: Enhanced type safety

### Performance Optimizations

- **Zoneless**: No Zone.js for optimal change detection
- **Local Fonts**: @fontsource/roboto
- **Code Splitting**: Lazy loading by route
- **OnPush**: Change detection strategy

---

**POC Angular 21 - Private Banking - Material Design 3, Vitest.**

## 📄 License

MIT
