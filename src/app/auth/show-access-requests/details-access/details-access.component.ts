import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Models } from 'src/app/models/models';
import { InteractionService } from 'src/app/services/interaction.service';
import { AccessReqtService } from 'src/app/services/supabase/access-requests/access-reqt.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { PopoverController, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonAvatar, IonPopover, IonList, IonItem, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonIcon, IonButton } from '@ionic/angular/standalone';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-access',
  templateUrl: './details-access.component.html',
  styleUrls: ['./details-access.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonCardContent, IonCardTitle, IonCardHeader, IonCard,
    IonContent, IonItem, IonList, IonPopover, IonAvatar, IonTitle, IonBackButton, IonButtons,
    IonToolbar, IonHeader, CommonModule ]
})
export class DetailsAccessComponent  implements OnInit {

    access!: Models.AccessReq.AccessRequestsI;
    isLoading = true;
    status = {accepted: 'Aprobado', rejected: 'Rechazado'};
    userPhoto: string = '';
    showUserMenu = false;
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private accessService: AccessReqtService,
      private supabaseService: SupabaseService,
      private interactionService: InteractionService,
      private popoverCtrl: PopoverController
    ) {}
    async ngOnInit() {

      const accessId = this.route.snapshot.paramMap.get('id');
      if (!accessId) {
        this.router.navigate(['/show-access']);
        return;
      }
      this.loadAccessData(accessId);
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
    async loadAccessData(accessId: string) {
      try {
        // 2. Cargar solicitud
        const accessReq = await this.accessService.getAccessById(accessId);
        if (!accessReq) {
          this.router.navigate(['/show-access']);
          return;
        }

        this.access = accessReq;
        //this.selectedStateId = typeof request.state_id === 'object' ? request.state_id?.id : request.state_id
        console.log('que tiene: ' + this.access);
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        this.interactionService.showToast('Error al cargar los datos');
      } finally {
        this.isLoading = false;
      }
    }
    isStringOrNumber(value: any): boolean {
      return typeof value === 'string' || typeof value === 'number';
    }
    goBack() {
      this.router.navigate(['/show-access']);
    }
    //Envio de Mensaje via Whatsapp
    async acceptedRequestAccess(name: string, phone: string) {
      const msg = `Saludos, ${name} su solicitud de acceso a sido aprobada.
      Favor de dirigirse al siguiente enlace para que realice su registro con nosotros:
      https//www.google.com/register`;
      try {
        const url = `https://wa.me/${'1' + phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        await this.accessService.updateStatusAccessRequest(this.access.id!, this.status.accepted);
        this.access.status = this.status.accepted;
        this.interactionService.showToast('✅ Solicitud aprobada y actualizada correctamente.');
        this.goBack();

      } catch (error) {
        console.error('❌ Error al aprobar solicitud:', error);
        this.interactionService.showToast('Error al enviar mensaje: ' + error);
      }
    }
    async rejectedRequestAccess(name: string, phone: string) {
      const msg = `Hola ${name}, lamentamos informarte que tu solicitud de acceso fue rechazada.
      Cualquier pregunta contactenos al Telefono: 809-902-8301. Gracias`;
      try {
        const url = `https://wa.me/1${'1' + phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        await this.accessService.updateStatusAccessRequest(this.access.id!, this.status.rejected);
        this.access.status = this.status.rejected;
        this.interactionService.showToast('🚫 Solicitud rechazada y actualizada correctamente.');
        this.goBack();
      } catch (error) {
        console.error('❌ Error al rechazar solicitud:', error);
        this.interactionService.showToast('Error al enviar mensaje: ' + error);
      }
    }

}
