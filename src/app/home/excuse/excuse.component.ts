import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonMenuButton, PopoverController, IonAvatar, IonPopover, IonList, IonItem } from '@ionic/angular/standalone';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';
import { ConfigScreenExcuseService } from 'src/app/services/supabase/config/config-screen-excuse.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Component({
  selector: 'app-excuse',
  templateUrl: './excuse.component.html',
  styleUrls: ['./excuse.component.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonPopover, IonAvatar,  IonContent, IonButtons, IonToolbar, IonTitle,
    IonHeader, IonMenuButton, CommonModule ]
})
export class ExcuseComponent  implements OnInit {

  datos = {
    image: 'assets/logo.png',
    title: '',
    text: ''
  };
  userPhoto: string = '';
  showUserMenu = false;

  constructor(private imagenTitleTextService: ConfigScreenExcuseService,
              private supabaseService: SupabaseService,
              private router: Router,
              private popoverCtrl: PopoverController
   ) {}

  async ngOnInit() {
    this.imagenTitleTextService.imagenActual$.subscribe((url) => {
      this.datos.image = url;
    });
    this.imagenTitleTextService.title$.subscribe(title => this.datos.title = title);
    this.imagenTitleTextService.text$.subscribe(text => this.datos.text = text);

    this.userPhoto =  await this.supabaseService.loadPhoto();
  }

  async openUserMenu(ev: Event) {
      const popover = await this.popoverCtrl.create({
        component: UserMenuComponent,
        event: ev,
        translucent: true,
        showBackdrop: true,
      });
      await popover.present();
    }

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    }

    logout() {
      this.supabaseService.signOut();
      this.router.navigate(['/auth']);
    }
  async seleccionarImagen() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      this.imagenTitleTextService.changeImagenBase64(image.base64String!);
    } catch (err) {
      console.error('No se seleccionó imagen:', err);
    }
  }
}
