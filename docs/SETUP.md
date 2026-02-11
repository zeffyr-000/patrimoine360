# Installation Setup - Patrimoine360

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.19+ or 20.9+
- **npm** 9+

### Clone and Install

```bash
git clone https://github.com/zeffyr-000/patrimoine360.git
cd patrimoine360
npm install
npm start
```

The application will be available at `http://localhost:4200`.

## 🔧 Development Environment

### VS Code Extensions

- **Angular Language Service** (`Angular.ng-template`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

### VS Code Settings

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

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm start`          | Dev server                 |
| `npm run build`      | Development build          |
| `npm run build:prod` | Optimized production build |
| `npm run lint`       | ESLint                     |
| `npm run lint:fix`   | ESLint with auto-fix       |
| `ng test`            | Vitest (watch mode)        |
| `ng test --no-watch` | Vitest (single run)        |
| `npm run test:ci`    | Tests with coverage        |

## 📊 Mock Data

This POC uses static JSON files instead of a backend API.

### Location

Files are in `public/data/`:

| File               | Content                        |
| ------------------ | ------------------------------ |
| `client.json`      | Client profile (Pierre Dubois) |
| `overview.json`    | Patrimony overview + breakdown |
| `performance.json` | Performance by category        |
| `actions.json`     | Manager actions                |
| `assets.json`      | 12 detailed assets             |
| `contact.json`     | Advisor + agency information   |
| `documents.json`   | Document list                  |
| `ai-analysis.json` | Simulated AI analysis          |

### Adding New Data

1. Create the JSON file in `public/data/`
2. Add the URL in `core/data-urls.ts`
3. Create a service with `lazyHttpResource`:

```typescript
import { lazyHttpResource } from '../core/lazy-http-resource';
import { DATA_URLS } from '../core/data-urls';

@Injectable({ providedIn: 'root' })
export class NewService {
  private readonly _data = lazyHttpResource<DataType>(DATA_URLS.newEndpoint);
  readonly dataResource = this._data.resource;
  load(): void {
    this._data.load();
  }
}
```

## 🐛 Troubleshooting

### Node/npm Version Issues

```bash
node --version  # >= 18.19 or >= 20.9
npm --version   # >= 9

# With nvm
nvm install 20 && nvm use 20
```

### Angular Cache Issues

```bash
rm -rf .angular/cache
rm -rf node_modules package-lock.json && npm install
```

### Port Already in Use

```bash
lsof -i :4200
kill -9 <PID>
# or
ng serve --port 4201
```

## 🚢 Deployment

The project is configured for GitHub Pages. Pushing to `main` triggers automatic deployment via GitHub Actions.

```bash
npm run build:prod
# Output in dist/patrimoine360/browser/
```
