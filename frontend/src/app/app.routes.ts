import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home),
    title: 'Gold Coast Unhistorical Walking Tours'
  },
  {
    path: 'places',
    loadComponent: () => import('./components/places-list/places-list').then(m => m.PlacesList),
    title: 'All Places - Gold Coast Unhistorical Walking Tours'
  },
  {
    path: 'places/:id/:slug',
    loadComponent: () => import('./components/place-detail/place-detail').then(m => m.PlaceDetail),
    title: 'Place Details - Gold Coast Unhistorical Walking Tours'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
