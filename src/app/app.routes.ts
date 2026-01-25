import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/patrimoine/views/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'performance',
        loadComponent: () =>
          import('./features/patrimoine/views/performance/performance.component').then(m => m.PerformanceComponent),
      },
      {
        path: 'assets',
        loadComponent: () => import('./features/patrimoine/views/assets/assets.component').then(m => m.AssetsComponent),
      },
      {
        path: 'actions',
        loadComponent: () =>
          import('./features/patrimoine/views/actions/actions.component').then(m => m.ActionsComponent),
      },
    ],
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
