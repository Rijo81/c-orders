import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsI } from 'src/app/models/requests.models';
import { StateI } from 'src/app/models/state.models';
import { StatesService } from 'src/app/services/crud/states.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { RequestsService } from 'src/app/services/requests/requests.service';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonCardHeader,
  IonCardTitle, IonCard, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonCardSubtitle, IonImg, IonBackButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageViewModalComponent } from './image-view-modal/image-view-modal.component';
import { ModalController } from '@ionic/angular';
import { filter, firstValueFrom, throwError } from 'rxjs';
import { getIdFromMaybeObject } from 'src/app/helper/utils';
import { environment } from 'src/environments/environment';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { NotificationappService } from 'src/app/services/supabase/notification/notificationapp.service';


@Component({
  selector: 'app-detail-requests',
  templateUrl: './detail-requests.component.html',
  styleUrls: ['./detail-requests.component.scss'],
  providers: [ModalController],
  standalone: true,
  imports: [IonBackButton, IonImg, IonCardSubtitle, IonLabel, IonItem, IonCardContent, IonCard, IonCardTitle, IonCardHeader,
    IonContent, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonSelect, IonSelectOption,
  FormsModule, CommonModule ]
})
export class DetailRequestsComponent  implements OnInit {

  request!: RequestsI;
  states: StateI[] = [];
  selectedStateId: string | null = null;
  isLoading = true;
  userData = {userName: '', userPhone: ''};

  modalController = inject(ModalController);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private supabaseNameService: SupabaseService,
    private statesService: StatesService,
    private notificationPushService: NotificationappService,
    private interactionService: InteractionService,
  ) {}

  objectKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }
  async ngOnInit() {

    try {
      const user = await this.supabaseNameService.getUserDataName();
      this.userData.userName = user.name;
      this.userData.userPhone = user.phone;
    } catch (error) {
        this.interactionService.showToast('Nombre de usuario no encontrado');
    }
    const requestId = this.route.snapshot.paramMap.get('id');
    if (!requestId) {
      this.router.navigate(['/view-excuse']);
      return;
    }
    this.loadRequestData(requestId);
  }

  async loadRequestData(requestId: string) {
    try {
      // 1. Cargar estados primero
      await firstValueFrom(this.statesService.getStates()).then(states => {
        this.states = states;
      });

      // 2. Cargar solicitud
      const request = await this.requestsService.getRequestById(requestId);
      if (!request) {
        this.router.navigate(['/view-excuse']);
        return;
      }

      this.request = request;
      //this.selectedStateId = typeof request.state_id === 'object' ? request.state_id?.id : request.state_id
      this.selectedStateId = getIdFromMaybeObject(request.state_id);
      console.log('que tiene: ' + this.selectedStateId);


    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      this.interactionService.showToast('Error al cargar los datos');
    } finally {
      this.isLoading = false;
    }
  }

  async updateState() {
    if (!this.selectedStateId) {
      this.interactionService.showToast('Selecciona un estado válido');
      return;
    }
    try {
      await this.requestsService.updateRequestState(this.request.id!, this.selectedStateId);
      this.request.state_id = this.selectedStateId;
      this.notificationPushService.updateRequestStatus(this.request.id, this.request.state_id, this.selectedStateId)
      this.goToWhatsApp(this.userData.userName, this.userData.userPhone);
      this.interactionService.showToast('✅ Estado actualizado correctamente');
      this.router.navigate(['/view-excuse']);
    } catch (error) {
      console.error(error);
      this.interactionService.showToast('❌ Error al actualizar estado');
    }
  }

  isImage(value: string): boolean {
    return typeof value === 'string' && (value.startsWith('data:image') || value.startsWith('http'));
  }

  isStringOrNumber(value: any): boolean {
    return typeof value === 'string' || typeof value === 'number';
  }

  goBack() {
    this.router.navigate(['/view-excuse']);
  }

  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageViewModalComponent, // Asegúrate de tener este componente creado
      componentProps: {
        image: imageUrl
      },
      cssClass: 'image-modal'
    });

    return await modal.present();
  }

  //Envio de Mensaje via Whatsapp
  goToWhatsApp(name: string, phone: string) {
    const msg = `Hola, soy ${name} del grupo. Solicito acceso al sistema.`;
    try {
      const url = `https://wa.me/${'1' + phone}?text=${encodeURIComponent(msg)}`;
      console.log(url);

      window.open(url, '_blank');

    } catch (error) {
      this.interactionService.showToast('Error al enviar mensaje: ' + error);
    }
  }
}
