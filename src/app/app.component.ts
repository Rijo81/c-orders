import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonHeader, IonToolbar, IonNote, IonButtons, IonListHeader,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuButton, IonMenu, IonMenuToggle, IonButton, IonTitle, IonBadge, IonAvatar } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
 import * as all from 'ionicons/icons';
import { SupabaseService } from './services/supabase/supabase.service';
import { MenuController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GroupsI } from './models/groups.models';
import { interval, Subscription } from 'rxjs';
import { NotificationappService } from './services/supabase/notification/notificationapp.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonButton, IonIcon, IonLabel, IonItem, IonList, IonContent, IonListHeader, IonButtons, IonNote, IonToolbar,
    IonHeader, IonSplitPane, IonApp, IonRouterOutlet, IonMenu, IonMenuButton, IonMenuToggle, RouterLink,
  CommonModule ],
})
export class AppComponent implements OnInit, OnDestroy {

  showMenu: boolean = true;
  private refreshSub!: Subscription;
  private refreshCount: number = 0;
  private maxAttempts: number = 100;
  public appPages: any[] = [];
  public notificationCount = 0;

  constructor(
    private authSupabaseService: SupabaseService,
    private router: Router,
    private menuCtrl:  MenuController,
    private alertController: AlertController,
    private notificationService: NotificationappService) {
    addIcons(all);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !event.url.includes('auth')  && !event.url.includes('access');
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
    this.refreshSub = interval(1000).subscribe(async () => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('access')) {
        return; // ❌ No ejecutar en esta ruta
      }
      this.refreshCount++;

      const user = await this.authSupabaseService.getUserAppData();

      if (user && user.group_id) {
        const group = user.group_id;

        this.appPages = this.getMenuForGroup(group);

        console.log('🎯 Menú actualizado para el grupo:', group.name);

        // 🔁 ¡Detenemos la verificación!
        this.refreshSub.unsubscribe();
      } else if (this.refreshCount >= this.maxAttempts) {
        console.warn('⛔ Se alcanzó el límite de intentos de refresco sin encontrar usuario.');
        this.refreshSub.unsubscribe(); // 🔒 Stop si pasamos el máximo de intentos
        this.showReloadAlert();
      } else {
        console.log(`🔄 Intento ${this.refreshCount} de ${this.maxAttempts}...`);
      }
    });
  }
  getMenuForGroup(group: GroupsI): any[] {
    const fullMenu = [
      { title: 'Inicio', url: '/home', icon: 'home', permission: '' },
      { title: 'Estados', url: '/state', icon: 'list', permission: 'permition_states' },
      { title: 'Grupos', url: '/group', icon: 'grid', permission: 'permition_groups' },
      { title: 'Tipos Solicitudes', url: '/trequests', icon: 'keypad', permission: 'permition_typerequests' },
      { title: 'Solicitudes', url: '/requestsfire', icon: 'send', permission: 'permition_requests' },
      { title: 'Estado Solicitud', url: '/state-requests', icon: 'send', permission: 'permition_state_requests' },
      { title: 'Usuarios', url: '/user-supabase', icon: 'people', permission: 'permition_users' },
      { title: 'Ver Solicitudes', url: '/view-excuse', icon: 'eye', permission: 'permition_viewsolic' },
      { title: 'Solicitudes Accesso', url: '/view-excuse', icon: 'eye', permission: 'permition_viewsolic' },
    ];

    return fullMenu.filter(
      item => !item.permission || group[item.permission as keyof GroupsI]
    );
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }
  async ngOnInit() {
    await this.loadMenu();
  }

  async showReloadAlert() {
    const alert = await this.alertController.create({
      header: 'Sin sesión activa',
      message: 'No se pudo obtener la sesión del usuario. ¿Deseas recargar la aplicación?',
      buttons: [
        {
          text: 'Recargar',
          handler: async () => {
            this.refreshCount = 0;
            this.maxAttempts = 10;
            await this.loadMenu();
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }
  async logout() {
    await this.authSupabaseService.signOut().then(() => {
      this.router.navigate(['/auth']).then(() => {
        location.reload();
      })
    });
  }

  private async checkNotifications() {
    const user = await this.authSupabaseService.getUserAppData();

    if (!user?.id) return;

    this.notificationService.getUnreadNotifications(user.id).subscribe(notifs => {
      this.notificationCount = notifs.length;
    });
  }

  openNotifications() {
    this.router.navigate(['/notificaciones']); // o abre un modal
  }
}
