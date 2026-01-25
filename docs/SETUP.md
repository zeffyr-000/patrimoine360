# Installation Setup - Patrimoine360

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.19+ or 20.9+
- **npm** 9+ or **yarn** 1.22+
- **Git** 2.34+

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/zeffyr-000/patrimoine360.git
cd patrimoine360

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

## 🔧 Development Environment

### VS Code Setup

Install recommended extensions:

```bash
# Angular Language Service
ext install Angular.ng-template

# TypeScript
ext install ms-vscode.vscode-typescript-next

# ESLint
ext install dbaeumer.vscode-eslint

# Prettier
ext install esbenp.prettier-vscode
```

### Recommended VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 📦 Available Scripts

### Development

```bash
# Start development server
npm start

# Start on specific port
ng serve --port 4201
```

### Build

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### Testing

```bash
ng test                     # Mode watch
ng test --no-watch          # Exécution unique
ng test --code-coverage     # Avec couverture
```

### Code Quality

```bash
# Lint TypeScript
npm run lint

# Lint and fix
npm run lint:fix
```

## 🗄️ Mock Data

This POC uses static JSON files instead of a backend API.

### Data Location

Mock data files are located in `public/data/`:

- `patrimoine.json` - Main patrimoine data with assets

### Adding Mock Data

1. Create a new JSON file in `public/data/`
2. Create a service method to load it:

```typescript
import { environment } from '../environments/environment';

loadData(): Observable<Data[]> {
  return this.http.get<Data[]>(`${environment.dataPath}/your-file.json`).pipe(
    tap((data) => this._data.set(data)),
    catchError((err) => {
      console.error('Error loading data:', err);
      this._error.set('Error loading data');
      return of([]);
    })
  );
}
```

## 🐛 Troubleshooting

### Common Issues

#### Node/npm version issues

```bash
# Check versions
node --version  # Should be 18.19+ or 20.9+
npm --version   # Should be 9+

# Use nvm for version management
nvm install 20
nvm use 20
```

#### Build cache issues

```bash
# Clear Angular cache
rm -rf .angular/cache

# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Port already in use

```bash
# Find process on port 4200
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use a different port
ng serve --port 4201
```

### Performance Issues

- Clear browser cache
- Disable browser extensions
- Use Chrome DevTools Performance tab for profiling

## 🚢 Deployment

The project is configured for GitHub Pages deployment.

### Automatic Deployment

Push to `main` branch triggers automatic deployment via GitHub Actions.

### Manual Build

```bash
# Build for production
npm run build:prod

# Output will be in dist/patrimoine360/browser/
```

---

For additional help, check the [Contributing Guide](CONTRIBUTING.md) or open an issue on GitHub.
