import { Component, OnInit } from '@angular/core';
import { RequestsI } from 'src/app/models/requests.models';
import { InteractionService } from 'src/app/services/interaction.service';
import { RequestsService } from 'src/app/services/requests/requests.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonText,
  IonButtons, IonMenuButton, IonImg } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { StateI } from 'src/app/models/state.models';
import { StatesService } from 'src/app/services/crud/states.service';

@Component({
  selector: 'app-states-requests',
  templateUrl: './states-requests.component.html',
  styleUrls: ['./states-requests.component.scss'],
  standalone: true,
  imports: [IonImg, IonButtons, IonText, IonLabel, IonAvatar, IonItem, IonList, IonContent, IonTitle, IonToolbar, IonHeader,
    CommonModule, IonMenuButton
  ]
})
export class StatesRequestsComponent  implements OnInit {

  requests: RequestsI[] = [];
  states: StateI[] = [];
  isLoading = true;

  constructor(
    private requestsService: RequestsService,
    private statesService: StatesService,
    private authSupabaseService: SupabaseService,
    private interactionService: InteractionService
  ) {}

  async ngOnInit() {
    const user = await this.authSupabaseService.getCurrentUser();
    console.log('Que tiene el user: ' + user.data.user.id);

    if (!user) {
      this.interactionService.showToast('Usuario no autenticado');
      return;
    }
    this.loadState();
    console.log('Cargar Estados', this.loadStates());

    this.loadRequests(user.data.user.id);
    this.isLoading = false;
  }

  loadStates() {
     this.statesService.getStates().subscribe({
      next: (data) => this.states = data,
      error: () => console.error('❌ Error al cargar estados')
    });
  }

  loadState() {
    this.statesService.getStates().subscribe(state => {
      this.states = state;
    });
  }

  loadRequests(userId: string) {
    this.requestsService.getRequestsByUserForState(userId).then(data => {
      this.requests = data;
      console.log('Solicitudes cargadas', this.requests);

    }).catch(error => {
      console.error('❌ Error al cargar solicitudes', error);
    });
  }
  getStateNameById(stateId: string): string {
    const state = this.states.find(s => s.id === stateId);
    console.log('Nombre del state', state);
    return state?.name || 'Desconocido';
  }
  getStateImage(stateName: string): string {
    console.log('NOmbre de Imagen', stateName);

    switch (stateName) {
      case 'Activo':
        return 'assets/state/done.png';
      case 'En proceso':
        return 'assets/state/inprocess.png';
      case 'Inactivo':
        return 'assets/state/waiting.png';
      default:
        return 'assets/states/default.png';
    }
  }

}



  // async getStatesFull(){
  //   try {
  //     const user = this.authSupabaseService.getCurrentUser(); // Ajusta según cómo guardes el usuario
  //     if (!user) {
  //       this.interactionService.showToast('Usuario no autenticado');
  //       return;
  //     }
  //     this.states = await this.statesService.getStates();
  //     this.requests = await this.requestsService.getRequestsByUser(user.id);
  //   } catch (error) {
  //     console.error('Error al cargar datos', error);
  //   }
  // }
