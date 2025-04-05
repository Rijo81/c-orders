import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsI } from 'src/app/models/requests.models';
import { StateI } from 'src/app/models/state.models';
import { StatesService } from 'src/app/services/crud/states.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { RequestsService } from 'src/app/services/requests/requests.service';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonCardHeader,
  IonCardTitle, IonCard, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonCardSubtitle, IonImg, IonBackButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageViewModalComponent } from './image-view-modal/image-view-modal.component';
import { supabase } from 'src/app/core/supabase.client';
import { ModalController } from '@ionic/angular';

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
  modalController = inject(ModalController);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private statesService: StatesService,
    private interactionService: InteractionService,
  ) {}

  objectKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }
  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get('id');
    if (!requestId) {
      this.router.navigate(['/view-excuse']);
      return;
    }

    this.loadRequestData(requestId);
  }

  async loadRequestData(requestId: string) {
    try {
      // Obtener la solicitud
      const request = await this.requestsService.getRequestById(requestId);

      if (!request) {
        this.router.navigate(['/view-excuse']);
        return;
      }

      this.request = request;
      this.selectedStateId = request.state_id || null;

      // Obtener los estados
      this.statesService.getStates().subscribe({
        next: (states) => this.states = states,
        error: () => this.interactionService.showToast('Error al cargar estados')
      });

    } catch (err) {
      this.interactionService.showToast('Error al cargar los datos');
    } finally {
      this.isLoading = false;
    }
    // try {
    //   const [request, states] = await Promise.all([
    //     this.requestsService.getRequestById(requestId),
    //     this.statesService.getStates().subscribe({
    //       next: (states) => this.states = states,
    //       error: (err) => this.interactionService.showToast('Error al cargar estados')
    //     })
    //   ]);

    //   if (!request) {
    //     this.router.navigate(['/view-excuse']);
    //     return;
    //   }

    //   this.request = request;
    //   this.selectedStateId = request.state_id || null;
    // } catch (err) {
    //   this.interactionService.showToast('Error al cargar los datos');
    // } finally {
    //   this.isLoading = false;
    // }
  }

  async updateState() {
    if (!this.selectedStateId) {
      this.interactionService.showToast('Selecciona un estado válido');
      return;
    }

    try {
      await this.requestsService.updateRequestState(this.request.id!, this.selectedStateId);
      this.interactionService.showToast('✅ Estado actualizado correctamente');

      // Opcional: actualizar el objeto local si lo usas en pantalla
      this.request.state_id = this.selectedStateId;
    } catch (error) {
      console.error(error);
      this.interactionService.showToast('❌ Error al actualizar estado');
    }
    // if (!this.selectedStateId) return;

    // try {
    //   await this.requestsService.updateRequestState(this.request.id!, this.selectedStateId);
    //   this.interactionService.showToast('Estado actualizado correctamente');
    // } catch (error) {
    //   this.interactionService.showToast('Error al actualizar estado');
    // }
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
}
