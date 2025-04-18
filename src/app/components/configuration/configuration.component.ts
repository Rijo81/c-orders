import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonButton, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonToggle, PopoverController, IonAvatar, IonPopover, IonList } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource  } from '@capacitor/camera';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigScreenRequestsService } from 'src/app/services/supabase/config/config-screen-requests.service';
import { ConfigScreenExcuseService } from 'src/app/services/supabase/config/config-screen-excuse.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  standalone: true,
  imports: [IonList, IonPopover, IonAvatar, IonToggle, IonInput, IonLabel, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton,
    IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton, FormsModule, CommonModule ]
})
export class ConfigurationComponent  implements OnInit {

  showForm = {
    formSolict: false,
    formExcuse: false,
    isDarkMode: false
  }
  userPhoto: string = '';
  showUserMenu = false;
  newTitle: string = '';
  newText: string = '';
  constructor(private imageTitleTextService: ConfigScreenRequestsService,
    private imageTitleTextExcuseService: ConfigScreenExcuseService,
    private supabaseService: SupabaseService,
    private popoverCtrl: PopoverController,
    private router: Router
  ) {}
  async ngOnInit() {
    console.log('config');
    const storedTheme = localStorage.getItem('theme');
    this.showForm.isDarkMode = storedTheme === 'dark';
    this.applyTheme();
    this.userPhoto =  await this.supabaseService.loadPhoto();
  }

    async openUserMenu(ev: Event) {
      const popover = await this.popoverCtrl.create({
        component: UserMenuComponent,
        event: ev,
        translucent: true,
        showBackdrop: true
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

  toggleDarkMode(event: any) {
    //this.showForm.isDarkMode = !this.showForm.isDarkMode;
    this.showForm.isDarkMode = event.detail.checked;
    const theme = this.showForm.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  applyTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark', isDark);
  }
  updateDataTitleText() {
    if (this.newTitle.trim()) {
      this.imageTitleTextService.changeTitle(this.newTitle);
    }
    if (this.newText.trim()) {
      this.imageTitleTextService.changeText(this.newText);
      }
    this.newTitle = '';
    this.newText = '';
  }
  async selectImageFromGaleriy() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      const base64Data = image.base64String;
      if (base64Data) {
        this.imageTitleTextService.changeImagenBase64(base64Data);
      }
    } catch (error) {
      console.error('❌ Error al seleccionar imagen:', error);
    }
  }

  updateDataTitleTextExcuse() {
    if (this.newTitle.trim()) {
      this.imageTitleTextExcuseService.changeTitle(this.newTitle);
    }
    if (this.newText.trim()) {
      this.imageTitleTextExcuseService.changeText(this.newText);
      }
    this.newTitle = '';
    this.newText = '';
  }
  async selectImageFromGaleriyExcusa() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      const base64Data = image.base64String;
      if (base64Data) {
        this.imageTitleTextExcuseService.changeImagenBase64(base64Data);
      }
    } catch (error) {
      console.error('❌ Error al seleccionar imagen:', error);
    }
  }

}
