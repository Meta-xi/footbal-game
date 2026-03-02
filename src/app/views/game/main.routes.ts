import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./game-layout.component').then((c) => c.GameLayoutComponent),
    },
    {
        path: 'boost',
        loadComponent: () =>
            import('./components/energy-boost/boost/boost.component').then((c) => c.BoostComponent),
    },
    {
        path: 'lucky-wheel',
        loadComponent: () =>
            import('./components/lucky-wheel/lucky-wheel.component').then((c) => c.LuckyWheelComponent),
    },
    {
        path: 'rank',
        loadComponent: () =>
            import('./components/rank/rank.component'),
    },
];
