import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { PopoverController, IonHeader, IonToolbar, IonTitle, IonButtons, IonAvatar, IonPopover, IonList,
  IonItem, IonContent, IonMenuButton, IonLabel, IonIcon, IonCheckbox } from '@ionic/angular/standalone';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';
import { Models } from 'src/app/models/models';
import { AccessReqtService } from 'src/app/services/supabase/access-requests/access-reqt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-access-requests',
  templateUrl: './show-access-requests.component.html',
  styleUrls: ['./show-access-requests.component.scss'],
  standalone: true,
  imports: [IonCheckbox,  IonIcon, IonLabel, IonContent, IonItem, IonList, IonPopover, IonAvatar, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonMenuButton, CommonModule ]
})
export class ShowAccessRequestsComponent  implements OnInit {

  access : Models.AccessReq.AccessRequestsI[] = [];
  userPhoto: string = '';
  showUserMenu = false;
  status = {accepted: 'Aprobado', rejected: 'Rechazado'};
  constructor(private supabaseService: SupabaseService,
                private interactionService: InteractionService,
                private accessService: AccessReqtService,
                private router: Router,
                private popoverCtrl: PopoverController) { }

  async ngOnInit() {
    //this.loadAccessRequest();
    this.userPhoto =  await this.supabaseService.loadPhoto();
  }

  ionViewWillEnter() {
    this.loadAccessRequest();
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

    goToDetails(id: string) {
      console.log('Id de item: ', id);

      this.router.navigate(['/details-access', id]);
    }

    loadAccessRequest() {
      this.accessService.getAccessRequest().subscribe(access => {
        this.access = access;
      });
    }

}
