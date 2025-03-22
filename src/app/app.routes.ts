import { Routes } from '@angular/router';
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
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'user',
    loadComponent: () => import('./auth/crud/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'user-supabase',
    loadComponent: () => import('./auth/crud/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'segments',
    loadComponent: () => import('./segments/segments.component').then(m => m.SegmentsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'group',
    loadComponent: () => import('./groups/groups/groups.component').then(m => m.GroupsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'state',
    loadComponent: () => import('./states/state/state.component').then(m => m.StateComponent),
    // canMatch: [AuthGuard]
  },

  {
    path: 'requests',
    loadComponent: () => import('./requests/requestss/requestss.component').then(m => m.RequestssComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'requestsfire',
    loadComponent: () => import('./requests/requests/requests.component').then(m => m.RequestsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'typerequests',
    loadComponent: () => import('./requests/typerequests/typerequests.component').then(m => m.TyperequestsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'trequests',
    loadComponent: () => import('./requests/type-requests/typerequests/typerequests.component').then(m => m.TyperequestsComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'received',
    loadComponent: () => import('./requests/received/received.component').then(m => m.ReceivedComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'view-excuse',
    loadComponent: () => import('./requests/viewreceived/viewreceived.component').then(m => m.ViewreceivedComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: 'auth-supabase',
    loadComponent: () => import('./components/login/login/login.component').then(m => m.LoginComponent),
    // canMatch: [AuthGuard]
  },

  {
    path: 'register-supabase',
    loadComponent: () => import('./components/register/register/register.component').then(m => m.RegisterComponent),
    // canMatch: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'segments',
    pathMatch: 'full'
  },
];
