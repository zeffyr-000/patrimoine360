# 🏦 Patrimoine360

> Modern Angular 21 POC for Private Banking patrimony visualization

[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Material](https://img.shields.io/badge/Material-21-purple.svg)](https://material.angular.io)
[![Vitest](https://img.shields.io/badge/Vitest-4-yellow.svg)](https://vitest.dev)

## 🌐 Live Application

**Try the production application:**
[https://zeffyr-000.github.io/patrimoine360/](https://zeffyr-000.github.io/patrimoine360/)

Wealth visualization and tracking dashboard for Private Banking clients. This POC demonstrates a modern Angular 21 architecture with `httpResource`, signals, and zoneless change detection.

| Criteria     | Value                                          |
| ------------ | ---------------------------------------------- |
| **Domain**   | Private Banking / Wealth Management            |
| **Client**   | French entrepreneur (52 yo) — €5.75M portfolio |
| **Target**   | Desktop only (1280px+)                         |
| **Language** | French only (single locale)                    |
| **Design**   | Private Banking 2026 — Navy & Gold             |

## ✨ Features

- **Overview**: Total wealth, category breakdown (doughnut chart), simulated AI analysis with streaming
- **Performance**: +6.14% annual (+€333k), detailed by category (12 asset types)
- **Assets**: 12 detailed assets (real estate, company, investments, art, wine, crypto)
- **Manager Actions**: Timeline of 7 actions with statuses and financial impacts
- **Contact**: Advisor and agency information
- **Documents**: Document center

## 🚀 Quick Start

```bash
git clone https://github.com/zeffyr-000/patrimoine360.git
cd patrimoine360
npm install
npm start
```

Navigate to `http://localhost:4200/`.

## 🔧 Available Scripts

| Command              | Description            |
| -------------------- | ---------------------- |
| `npm start`          | Dev server (port 4200) |
| `npm run build:prod` | Production build       |
| `npm run lint`       | ESLint                 |
| `ng test`            | Vitest (watch mode)    |
| `ng test --no-watch` | Vitest (single run)    |
| `npm run test:ci`    | Tests with coverage    |

## 🎨 Technical Architecture

### Core Stack

- **Angular 21** — Standalone components, zoneless (`provideZonelessChangeDetection`), OnPush
- **httpResource / rxResource** — Angular 21 data loading APIs (zero `.subscribe()`)
- **Signals** — Reactive state with `signal()`, `computed()`, `effect()`
- **Angular Material 21** — Material Design 3
- **Transloco** — i18n with MessageFormat
- **Vitest 4.0** — Unit testing with native Angular support

### Key Patterns

| Pattern                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `lazyHttpResource`     | Factory for httpResource with lazy activation       |
| `ResourceErrorHandler` | Centralized error handling via MatSnackBar          |
| `DATA_URLS`            | Single source of truth for all data endpoint URLs   |
| `retryInterceptor`     | Automatic retry for failed GET requests (2 retries) |
| `AssetCategoryPipe`    | Pipe mapping asset type to category                 |

### Project Structure

```
src/app/
├── core/               # Infrastructure (interceptors, factory, utils, pipes)
├── features/           # Pages (patrimoine/views, contact, documents)
├── home/               # Shell (toolbar + sidenav + router-outlet)
├── shared/             # Reusable components and pipes
├── services/           # PatrimoineService, ContactService, DocumentsService
├── models/             # TypeScript interfaces (8 domain model files)
├── i18n/               # French translations
└── testing/            # Transloco test helpers
```

### Data Flow

```
Static JSON (public/data/) → httpResource/rxResource → Services → Signals → Components
```

## 🎨 Design System

**Private Banking 2026** design:

- Navy / gold / white palette with generous whitespace
- Roboto typography (local fonts via @fontsource)
- Card-based layouts, CSS Grid, data visualization
- Desktop only (1280px+)

## 📚 Documentation

- 📖 **[Installation Guide](docs/SETUP.md)** — Prerequisites, scripts, troubleshooting
- 🏗️ **[Technical Architecture](docs/ARCHITECTURE.md)** — Patterns, structure, data flow
- 🧪 **[Testing Guide](docs/TESTING.md)** — Vitest, httpResource, coverage
- 🤝 **[Contributing Guide](docs/CONTRIBUTING.md)** — Code standards, conventions
- 📊 **[Mock Data](docs/DATA.md)** — Client profile, assets, figures
- 🎯 **[Demo Presentation](docs/DEMO.md)** — Demo scenarios, key messages
