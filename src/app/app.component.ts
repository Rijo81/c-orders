import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonHeader, IonToolbar, IonNote, IonButtons, IonListHeader,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuButton, IonMenu, IonMenuToggle } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
 import * as all from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, IonList, IonContent, IonListHeader, IonButtons, IonNote, IonToolbar,
    IonHeader, IonSplitPane, IonApp, IonRouterOutlet, IonMenu, IonMenuButton, IonMenuToggle, RouterLink ],
})
export class AppComponent {
  public appPages = [
    {title: 'Inicio', url: '/segments', icon: 'home'},
    {title: 'Estados', url: '/state', icon: 'list'},
    {title: 'Grupos', url: '/group', icon: 'grid'},
    {title: 'Tipos de Solicitudes', url: '/typerequests', icon: 'keypad'},
    {title: 'Tipos Solicitudes Fire', url: '/trequests', icon: 'keypad'},
    {title: 'Solicitudes', url: '/requests', icon: 'send'},
    {title: 'Solicitudes Fire', url: '/requestsfire', icon: 'send'},
    {title: 'Roles', url: '/auth/rols', icon: 'settings'},
    {title: 'Usuarios', url: '/auth/users', icon: 'people'},
    {title: 'Usuarios-Supabase', url: '/user-supabase', icon: 'people'},
    {title: 'Ver Solicitudes', url: '/received', icon: 'eye'},
    {title: 'Login', url: '/auth', icon: 'people-circle'},
    {title: 'Login Supabase', url: '/auth-supabase', icon: 'people-circle'},
    {title: 'Register Supabase', url: '/register-supabase', icon: 'people-circle'},
  ];
  constructor() {
    addIcons(all);
  }
}
