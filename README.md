# 💼 Patrimoine360

> Modern Angular 21 application for patrimony visualization - Private Banking POC

[![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Material](https://img.shields.io/badge/Material-21.0-purple.svg)](https://material.angular.io)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-yellow.svg)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌐 Live Application

**View the deployed application:**
[https://zeffyr-000.github.io/patrimoine360/](https://zeffyr-000.github.io/patrimoine360/)

Patrimony visualization application for the Private Banking sector. This POC demonstrates Angular 21's zoneless architecture with signals for optimal performance.

### 🎯 Specifications

| Criteria           | Value                                                   |
| ------------------ | ------------------------------------------------------- |
| **Domain**         | Private Banking / Wealth Management                     |
| **Target**         | Desktop only (1280px+)                                  |
| **UI Language**    | French only                                             |
| **UX Inspiration** | [Google Flights](https://www.google.com/travel/flights) |

## ✨ Features

### 📊 Patrimony Overview

- **Asset Visualization**: Consolidated view of all assets
- **Category Breakdown**: Real estate, stocks, cash, crypto, etc.
- **Value Tracking**: Current values with acquisition costs

### 🎨 Private Banking 2026 Design

- **Material Design 3**: Elegant interface with smooth animations
- **Elegant Palette**: Muted tones (navy, gold accents, white space)
- **Card-based Layout**: Inspired by Google Flights
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

Inspired by [Google Flights](https://www.google.com/travel/flights) - clean, data-rich, card-based layouts.

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

### Testing Framework: Vitest

This project uses **Vitest** (NOT Jasmine/Karma) for unit testing.

#### Vitest API Reference

```typescript
import { vi } from 'vitest';

// Create mocks
const mockFn = vi.fn();
mockFn.mockReturnValue(42);

// Timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.restoreAllMocks();
```

### Run Tests

```bash
npm test                    # Run all unit tests
npm run test:ci             # Run tests with coverage report
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

- **Standalone Components**: Using `standalone: true` API instead of NgModules
- **Modern Control Flow**: `@if`, `@for`, `@switch` syntax
- **Signals API**: Reactive state management
- **TypeScript 5.9 Strict**: Enhanced type safety

### Performance Optimizations

- **Zoneless**: No Zone.js for optimal change detection
- **Local Fonts**: @fontsource/roboto
- **Code Splitting**: Lazy loading by route
- **OnPush**: Change detection strategy

---

**Modern Angular 21 POC - Private Banking - TypeScript 5.9, Material Design 3, Vitest 3.0.**

## 📄 License

MIT
