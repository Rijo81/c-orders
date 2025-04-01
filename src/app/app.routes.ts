import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
// import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // {
  //   path: 'login',
  //   loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  // },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user-supabase',
    canActivate: [AuthGuard],
    loadComponent: () => import('./auth/crud/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./home/home/home.component').then(h => h.HomeComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'group',
    canActivate: [AuthGuard],
    loadComponent: () => import('./groups/groups/groups.component').then(m => m.GroupsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'state',
    canActivate: [AuthGuard],
    loadComponent: () => import('./states/state/state.component').then(m => m.StateComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'requestsfire',
    canActivate: [AuthGuard],
    loadComponent: () => import('./requests/requests/requests.component').then(m => m.RequestsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'trequests',
    canActivate: [AuthGuard],
    loadComponent: () => import('./requests/type-requests/typerequests/typerequests.component').then(m => m.TyperequestsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'view-excuse',
    canActivate: [AuthGuard],
    loadComponent: () => import('./requests/viewreceived/viewreceived.component').then(m => m.ViewreceivedComponent),
    // canMatch: [AuthGuard]
  },

  {
    path: 'register-supabase',
    loadComponent: () => import('./components/register/register/register.component').then(m => m.RegisterComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
];
