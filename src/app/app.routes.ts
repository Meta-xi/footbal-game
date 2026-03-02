import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () => import('./views/auth/welcome.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login.component'),
  },
  {
    path: 'main',
    loadChildren: () => import('./views/game/main.routes').then((m) => m.MAIN_ROUTES),
  },
  {
    path: 'mining',
    loadComponent: () =>
      import('./views/invest/invest-layout.component').then((c) => c.InvestLayoutComponent),
  },
  {
    path: 'social',
    loadComponent: () => import('./views/social/social'),
  },
  {
    path: 'wallet',
    loadComponent: () => import('./views/wallet/wallet'),
  },
  {
    path: 'mociones',
    loadComponent: () => import('./views/motions/motions'),
  },
  {
    path: 'transaccion',
    loadComponent: () => import('./views/wallet/transaction/transaction.component'),
  },
];