# 🎯 Next Steps - Phase 2 & 3

> Feuille de route pour atteindre 18-19/20

## 📋 Phase 2 : Optimisation SCSS et Composants (4-6h)

### 1. Organisation SCSS Modulaire

#### Créer structure styles/

```
src/styles/
├── _variables.scss       # Variables CSS personnalisées
├── _mixins.scss         # Mixins réutilisables
├── _utilities.scss      # Classes utilitaires
└── components/
    ├── _cards.scss      # Styles cards
    ├── _badges.scss     # Styles badges
    └── _grid.scss       # Grilles responsive
```

#### Extraire mixins communs

```scss
// styles/_mixins.scss
@mixin card-hover {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

@mixin gradient-background($color1, $color2) {
  background: linear-gradient(135deg, $color1 0%, $color2 100%);
}

@mixin responsive-grid($min-width, $columns-large: 3) {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax($min-width, 1fr));

  @media (min-width: 1600px) {
    grid-template-columns: repeat($columns-large, 1fr);
  }
}
```

#### Réduire home.component.scss

**Objectif :** 790 lignes → < 200 lignes

Stratégie :

- Extraire styles cards dans `styles/components/_cards.scss`
- Extraire styles grid dans `styles/components/_grid.scss`
- Garder uniquement layout et spacing spécifiques

### 2. Extraction Composants Feature

#### ClientHeaderComponent

```typescript
// features/patrimoine/components/client-header/
@Component({
  selector: 'app-client-header',
  standalone: true,
  inputs: ['client'],
  template: `
    <div class="client-header">
      <div class="client-avatar">
        <mat-icon>account_circle</mat-icon>
      </div>
      <div class="client-details">
        <h1>{{ client().name }}</h1>
        <p>{{ client().profession }}</p>
      </div>
    </div>
  `,
})
export class ClientHeaderComponent {
  readonly client = input.required<ClientProfile>();
}
```

#### HeroSummaryComponent

```typescript
// features/patrimoine/components/hero-summary/
@Component({
  selector: 'app-hero-summary',
  standalone: true,
  inputs: ['totalValue', 'performance'],
  imports: [PerformanceBadgeComponent],
})
export class HeroSummaryComponent {
  readonly totalValue = input.required<number>();
  readonly performance = input.required<PerformanceData>();
}
```

#### AssetListComponent

```typescript
// features/patrimoine/components/asset-list/
@Component({
  selector: 'app-asset-list',
  standalone: true,
  inputs: ['assets'],
})
export class AssetListComponent {
  readonly assets = input.required<Asset[]>();
}
```

#### ActionTimelineComponent

```typescript
// features/patrimoine/components/action-timeline/
@Component({
  selector: 'app-action-timeline',
  standalone: true,
  inputs: ['actions'],
})
export class ActionTimelineComponent {
  readonly actions = input.required<ManagerAction[]>();
}
```

### 3. HomeComponent Simplifié Final

**Objectif :** Container orchestration uniquement

```typescript
// home/home.component.ts (< 50 lignes)
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslocoModule,
    MatTabsModule,
    ClientHeaderComponent,
    HeroSummaryComponent,
    AssetListComponent,
    ActionTimelineComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss', // < 150 lignes
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly patrimoineService = inject(PatrimoineService);

  // Expose signals only
  protected readonly loading = this.patrimoineService.loading;
  protected readonly error = this.patrimoineService.error;
  protected readonly client = this.patrimoineService.client;
  protected readonly assets = this.patrimoineService.assets;
  protected readonly performance = this.patrimoineService.performance;
  protected readonly recentActions = this.patrimoineService.recentActions;
  protected readonly summary = this.patrimoineService.summary;

  ngOnInit(): void {
    this.patrimoineService.loadPatrimoine().subscribe();
  }
}
```

```html
<!-- home/home.component.html (simplifié) -->
<div class="home-container">
  @if (loading()) {
  <div class="loading-container">
    <mat-spinner />
  </div>
  } @else if (error(); as errorMsg) {
  <mat-card class="error-card">
    <mat-card-content>
      <mat-icon>error</mat-icon>
      <p>{{ errorMsg }}</p>
    </mat-card-content>
  </mat-card>
  } @else {
  <app-client-header [client]="client()" />
  <app-hero-summary [totalValue]="summary().total" [performance]="performance()" />

  <mat-tab-group class="content-tabs">
    <mat-tab>
      <ng-template mat-tab-label>
        <span class="tab-label-content">
          <mat-icon>dashboard</mat-icon>
          {{ t('home.tab_overview') }}
        </span>
      </ng-template>
      <div class="tab-content">
        <!-- Breakdown grid -->
      </div>
    </mat-tab>

    <mat-tab>
      <ng-template mat-tab-label>
        <span class="tab-label-content">
          <mat-icon>folder_open</mat-icon>
          {{ t('home.tab_assets') }}
        </span>
      </ng-template>
      <div class="tab-content">
        <app-asset-list [assets]="assets()" />
      </div>
    </mat-tab>

    <mat-tab>
      <ng-template mat-tab-label>
        <span class="tab-label-content">
          <mat-icon>history</mat-icon>
          {{ t('home.tab_actions') }}
        </span>
      </ng-template>
      <div class="tab-content">
        <app-action-timeline [actions]="recentActions()" />
      </div>
    </mat-tab>
  </mat-tab-group>
  }
</div>
```

## 📋 Phase 3 : Tests et Types (2-4h)

### 1. Réactiver Tests Vitest

#### vitest.config.ts

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    exclude: [], // ❌ Ne plus exclure !
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/testing/**',
        'src/app/**/*.model.ts', // Models exclus (pas de logique)
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
```

#### Tests à créer

1. **Utils Tests**

```typescript
// core/utils/format.utils.spec.ts
describe('formatCurrency', () => {
  it('should format number as EUR currency', () => {
    expect(formatCurrency(1000)).toBe('1 000 €');
  });
});

// core/utils/patrimoine.utils.spec.ts
describe('getActionStatusIcon', () => {
  it('should return correct icon for status', () => {
    expect(getActionStatusIcon('completed')).toBe('check_circle');
  });

  it('should return default icon for unknown status', () => {
    expect(getActionStatusIcon('unknown')).toBe('help');
  });
});
```

2. **Service Tests**

```typescript
// services/patrimoine.service.spec.ts
describe('PatrimoineService', () => {
  it('should load patrimoine data', () => {
    const service = TestBed.inject(PatrimoineService);
    service.loadPatrimoine().subscribe();
    expect(service.assets()).toHaveLength(12);
  });
});
```

3. **Component Tests**

```typescript
// shared/components/stat-card/stat-card.component.spec.ts
describe('StatCardComponent', () => {
  it('should display stat data', () => {
    const fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentRef.setInput('icon', 'home');
    fixture.componentRef.setInput('label', 'Test');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Test');
  });
});
```

### 2. Types Stricts

#### patrimoine.types.ts

```typescript
// Strict union types
export type ActionStatus = 'completed' | 'in_progress' | 'planned';
export type ActionType = 'buy' | 'sell' | 'rebalance' | 'advice' | 'tax_optimization';
export type AssetType =
  | 'real_estate'
  | 'real_estate_rental'
  | 'private_company'
  | 'stocks'
  | 'bonds'
  | 'life_insurance'
  | 'savings'
  | 'retirement'
  | 'art'
  | 'wine'
  | 'crypto'
  | 'cash';

// Configuration interfaces
export interface ActionConfig {
  icon: string;
  label: string;
  color: string;
}

export const ACTION_STATUS_CONFIG: Record<ActionStatus, ActionConfig> = {
  completed: { icon: 'check_circle', label: 'Complété', color: '#4caf50' },
  in_progress: { icon: 'schedule', label: 'En cours', color: '#ff9800' },
  planned: { icon: 'event', label: 'Planifié', color: '#9e9e9e' },
};

// Type guards
export function isValidActionStatus(status: string): status is ActionStatus {
  return ['completed', 'in_progress', 'planned'].includes(status);
}
```

## 🎯 Objectifs Phase 2 & 3

| Objectif                   | Métrique Actuelle | Métrique Cible | Priorité   |
| -------------------------- | ----------------- | -------------- | ---------- |
| Lignes SCSS home.component | 790               | < 200          | 🔴 HAUTE   |
| Composants feature         | 0                 | 4              | 🟠 MOYENNE |
| Tests coverage             | 0%                | 70%+           | 🟠 MOYENNE |
| Types stricts              | 85%               | 95%            | 🟡 BASSE   |
| Build warnings             | 3                 | 0              | 🟡 BASSE   |

## 📊 Roadmap Complète

### ✅ Phase 1 - COMPLÉTÉE (24 janvier 2026)

- [x] Core structure (constants, utils)
- [x] Shared components (StatCard, PerformanceBadge)
- [x] HomeComponent refactoring (60 lignes)
- [x] ESLint 0 errors
- [x] Build successful
- [x] Documentation

### 🔄 Phase 2 - Organisation Avancée (2-3 jours)

- [ ] SCSS modulaire (mixins, variables)
- [ ] Extraction 4 composants feature
- [ ] Réduction home.component.scss < 200 lignes
- [ ] Barrel exports features/

### 🔄 Phase 3 - Qualité & Tests (1-2 jours)

- [ ] Tests utils (100% coverage)
- [ ] Tests services (70% coverage)
- [ ] Tests composants (60% coverage)
- [ ] Types stricts avancés
- [ ] Éliminer tous warnings build

## 🏆 Niveau Qualité Cible

| Phase      | Niveau | Caractéristiques                          |
| ---------- | ------ | ----------------------------------------- |
| Phase 1 ✅ | 17/20  | Architecture organisée, code propre       |
| Phase 2 🔄 | 18/20  | Composants modulaires, SCSS optimisé      |
| Phase 3 🔄 | 19/20  | Tests complets, types stricts, 0 warnings |

**Temps estimé total :** 6-12 heures supplémentaires  
**Focus :** Qualité professionnelle > Features
