import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonHeader, IonToolbar, IonNote, IonButtons, IonListHeader,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuButton, IonMenu, IonMenuToggle, IonButton } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
 import * as all from 'ionicons/icons';
import { SupabaseService } from './services/supabase/supabase.service';
import { MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Models } from './models/models';
import { RolsI } from './models/rols.models';
import { GroupsI } from './models/groups.models';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonButton, IonIcon, IonLabel, IonItem, IonList, IonContent, IonListHeader, IonButtons, IonNote, IonToolbar,
    IonHeader, IonSplitPane, IonApp, IonRouterOutlet, IonMenu, IonMenuButton, IonMenuToggle, RouterLink,
  CommonModule ],
})
export class AppComponent implements OnInit {

  showMenu: boolean = true;
  selectedUser: Models.User.UsersI | null = null;
  appsPages: any[] = [];

  // public fullMenu = [
  //   { title: 'Inicio', url: '/home', icon: 'home', permission: '' },
  //   { title: 'Estados', url: '/state', icon: 'list', permission: 'permition_states' },
  //   { title: 'Grupos', url: '/group', icon: 'grid', permission: 'permition_groups' },
  //   { title: 'Tipos Solicitudes', url: '/trequests', icon: 'keypad', permission: 'permition_typerequests' },
  //   { title: 'Solicitudes', url: '/requestsfire', icon: 'send', permission: 'permition_requests' },
  //   { title: 'Usuarios', url: '/user-supabase', icon: 'people', permission: 'permition_users' },
  //   { title: 'Ver Solicitudes', url: '/view-excuse', icon: 'eye', permission: 'permition_viewsolic' },
  //   { title: 'Register Supabase', url: '/register-supabase', icon: 'people-circle', permission: '' }
  // ];

  // public appPages: any[] = [];

    public appPages = [
    {title: 'Inicio', url: '/home', icon: 'home'},
    {title: 'Estados', url: '/state', icon: 'list'},
    {title: 'Grupos', url: '/group', icon: 'grid'},
    {title: 'Tipos Solicitudes', url: '/trequests', icon: 'keypad'},
    {title: 'Solicitudes', url: '/requestsfire', icon: 'send'},
    {title: 'Usuarios', url: '/user-supabase', icon: 'people'},
    {title: 'Ver Solicitudes', url: '/view-excuse', icon: 'eye'},
    {title: 'Register Supabase', url: '/register-supabase', icon: 'people-circle'},
  ];

  constructor(
    private authSupabaseService: SupabaseService,
    private router: Router,
    private menuCtrl:  MenuController) {
    addIcons(all);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !event.url.includes('auth');
        // 👇 Aquí desactivamos el swipe si estás en login
        if (event.url.includes('auth')) {
          this.menuCtrl.enable(false);  // 🔒 Desactiva swipe
        } else {
          this.menuCtrl.enable(true);   // ✅ Activa swipe en otras vistas
        }
      }
    });
  }
  async ngOnInit() {
    console.log('ngOnInit');
    // const user = await this.authSupabaseService.getUserAppDataRol(); // debe incluir el group
    // const group: GroupsI = user?.group_id;

    // console.log('Grupo del Usuario: ', group);
    // if (!group) {
    //   this.appPages = this.fullMenu.filter(item => !item.permission); // Solo los públicos
    //   return;
    // }

    // this.appPages = this.fullMenu.filter(item => {
    //   return !item.permission || group[item.permission as keyof GroupsI];
    // });

  }


    // this.selectedUser = await this.authSupabaseService.getUserAppDataRol();

    // if (this.selectedUser && this.selectedUser.rol) {
    //   this.setupMenu(this.selectedUser.rol); // rol ya debe ser el objeto completo, no solo el ID
    // }


  // setupMenu(rol: RolsI) {
  //   this.appsPages = [
  //     { title: 'Inicio', url: '/home', icon: 'home' },

  //     rol.permition_states && {
  //       title: 'Estados', url: '/state', icon: 'list'
  //     },

  //     rol.permition_groups && {
  //       title: 'Grupos', url: '/group', icon: 'grid'
  //     },

  //     rol.permition_rol && {
  //       title: 'Roles', url: '/auth/rols', icon: 'settings'
  //     },

  //     rol.permition_users && {
  //       title: 'Usuarios', url: '/user-supabase', icon: 'people'
  //     },

  //     rol.permition_typereqs && {
  //       title: 'Tipos Solicitudes', url: '/trequests', icon: 'keypad'
  //     },

  //     rol.permition_requests && {
  //       title: 'Solicitudes', url: '/requestsfire', icon: 'send'
  //     },

  //     rol.permition_viewsolic && {
  //       title: 'Ver Solicitudes', url: '/view-excuse', icon: 'eye'
  //     },
  //     {
  //       title: 'Register Supabase', url: '/register-supabase', icon: 'people-circle'
  //     }
  //   ].filter(Boolean);
  // }
  async logout() {
    await this.authSupabaseService.signOut().then(() => {
      //this.menuCtrl.close('first');
      //this.auth.clearSession();
      this.router.navigate(['/auth']).then(() => {
        location.reload();
      })
    });
  }
}
