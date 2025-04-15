import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonHeader, IonToolbar, IonNote, IonButtons, IonListHeader,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuButton, IonMenu, IonMenuToggle, IonButton,
  IonAvatar, IonPopover, PopoverController } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
 import * as all from 'ionicons/icons';
import { SupabaseService } from './services/supabase/supabase.service';
import { MenuController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GroupsI } from './models/groups.models';
import { interval, Subscription } from 'rxjs';
import { NotificationappService } from './services/supabase/notification/notificationapp.service';
import { supabase } from 'src/app/core/supabase.client';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { Session } from '@supabase/supabase-js';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [ IonButton, IonIcon, IonLabel, IonItem, IonList, IonContent, IonListHeader, IonButtons, IonNote, IonToolbar,
    IonHeader, IonSplitPane, IonApp, IonRouterOutlet, IonMenu, IonMenuButton, IonMenuToggle, RouterLink,
  CommonModule],
})
export class AppComponent implements OnInit {

  showMenu: boolean = true;
  public appPages: any[] = [];
  public notificationCount = 0;
  constructor(
    private authSupabaseService: SupabaseService,
    private router: Router,
    private menuCtrl:  MenuController,
    private notificationService: NotificationappService) {
    addIcons(all);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenMenuRoutes = ['/auth', '/access'];
        this.showMenu = !hiddenMenuRoutes.includes(event.url);
        // 👇 Aquí desactivamos el swipe si estás en login
        if (event.url.includes('auth') || event.url.includes('access')) {
          this.menuCtrl.enable(false);  // 🔒 Desactiva swipe
        } else {
          this.menuCtrl.enable(true);   // ✅ Activa swipe en otras vistas
        }
      }
    });
  }
  private async loadMenu() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('access')) return; // ❌ Evita esta ruta

    const user = await this.authSupabaseService.getUserAppData();

    if (user && user.group_id) {
      const group = user.group_id;
      this.appPages = this.getMenuForGroup(group);
      console.log('🎯 Menú actualizado para el grupo:', group.name);
    } else {
      console.warn('⚠️ Usuario sin grupo o no autenticado aún.');
    }
  }
  getMenuForGroup(group: GroupsI): any[] {
    const fullMenu = [
      { title: 'Inicio', url: '/home', icon: 'home', permission: '' },
      { title: 'Inicio', url: '/screen-excuse', icon: 'home', permission: '' },
      { title: 'Estados', url: '/state', icon: 'list', permission: 'permition_states' },
      { title: 'Grupos', url: '/group', icon: 'grid', permission: 'permition_groups' },
      { title: 'Tipos Solicitudes', url: '/trequests', icon: 'keypad', permission: 'permition_typerequests' },
      { title: 'Solicitudes', url: '/requestsfire', icon: 'send', permission: 'permition_requests' },
      { title: 'Estado Solicitud', url: '/state-requests', icon: 'send', permission: 'permition_state_requests' },
      { title: 'Usuarios', url: '/user-supabase', icon: 'people', permission: 'permition_users' },
      { title: 'Ver Solicitudes', url: '/view-excuse', icon: 'eye', permission: 'permition_viewsolic' },
      { title: 'Solicitudes Accesso', url: '/show-access', icon: 'key', permission: '' },
      { title: 'Configuracion', url: '/config', icon: 'settings', permission: '' },
    ];
    return fullMenu.filter(
      item => !item.permission || group[item.permission as keyof GroupsI]
    );
  }
  async ngOnInit() {
    this.authSupabaseService.getSessionObservable().subscribe(async (session: Session | null) => {
      if (session) {
        await this.loadMenu();
      }
    });
    this.notificationService.registerPush();
    this.setInitialTheme();
  }
  setInitialTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
  }
  logout() {
    this.authSupabaseService.signOut();
    this.router.navigate(['/auth']);
  }
  openNotifications() {
    this.router.navigate(['/notificaciones']); // o abre un modal
  }
}
