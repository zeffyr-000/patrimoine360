import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        title: 'pages.overview',
        loadComponent: () =>
          import('./features/patrimoine/views/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'performance',
        title: 'pages.performance',
        loadComponent: () =>
          import('./features/patrimoine/views/performance/performance.component').then(m => m.PerformanceComponent),
      },
      {
        path: 'assets',
        title: 'pages.assets',
        loadComponent: () => import('./features/patrimoine/views/assets/assets.component').then(m => m.AssetsComponent),
      },
      {
        path: 'actions',
        title: 'pages.actions',
        loadComponent: () =>
          import('./features/patrimoine/views/actions/actions.component').then(m => m.ActionsComponent),
      },
    ],
  },
  {
    path: 'contact',
    title: 'pages.contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'documents',
    title: 'pages.documents',
    loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
