import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonModal, IonButton, IonItem,
  IonInput, IonSearchbar, IonList, IonIcon, IonFab, IonFabButton, IonMenuButton } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { StateI } from 'src/app/models/state.models';
import { StatesService } from 'src/app/services/crud/states.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonList, IonSearchbar, IonInput, IonItem, IonButton, IonModal,
    IonLabel, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton, FormsModule, CommonModule,
  ReactiveFormsModule ]
})
export class StateComponent  implements OnInit {

    state: StateI[] = [];
    newState:  StateI = { name: '' };
    isEditing = false;
    editingStateId: string | null = null;
    //BUSQUEDA // Lista original de usuarios
    filteredStates: StateI[] = []; // Lista filtrada de usuarios
    searchForm!: FormGroup;


    @ViewChild('modalCreate') modal!: IonModal;
    @ViewChild('modalUpdate') modalEdit!: IonModal;


    constructor(private stateService: StatesService,
                private interactionService: InteractionService,
                ) {
      addIcons({trash, create, add});
    }

    ngOnInit() {

      this.searchForm = new FormGroup({
        search: new FormControl('')
      });
      //this.loadUsers();
        this.stateService.getStates().subscribe(state => {
        this.state = state;
        this.filteredStates = state; // Al inicio, la lista filtrada es igual a la original
      });

      // Detectar cambios en el campo de búsqueda y filtrar usuarios
      this.searchForm.get('search')?.valueChanges.subscribe(value => {
        this.filterState(value);
        console.log(value);
        console.log(this.filterState(value));

      });
    }
    // Función para filtrar los usuarios
    filterState(searchTerm: string) {
      console.log('Dentro del metodo: ', searchTerm);

      if (!searchTerm) return [];

      const lowerCaseSearch = searchTerm.toLowerCase();
        this.filteredStates = this.state.filter(user =>{
          user.name.toLowerCase().includes(lowerCaseSearch)
        });

      return this.filteredStates;
      // query = query.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
      // this.filteredUsers = this.users.filter(user =>
      //   user.name.toLowerCase().includes(query) || // Filtra por nombre
      //   user.email.toLowerCase().includes(query)   // Filtra por email
      // );
    }

    openModalEdit() {
      this.modalEdit.present(); // Muestra el primer modal
    }

    openModalCreate() {
      this.modal.present(); // Muestra el primer modal
    }

    cancelModalCreate() {
      this.modal.dismiss(null, 'cancel');
    }
    cancelModalUpdate() {
      this.modalEdit.dismiss(null, 'cancel');
    }

    loadState() {
      this.stateService.getStates().subscribe(state => {
        this.state = state;
      });
    }
   async addState() {

    this.stateService.addState(this.newState).subscribe({
      next: () => {
        this.newState = { name: '' };
        this.loadState();
        this.interactionService.dismissLoading();
        this.modal.dismiss(this.newState, 'confirm');
        this.interactionService.showToast('Estado creado con éxito');
      },
      error: (err) => {
        this.interactionService.dismissLoading();
        this.interactionService.showToast('Error al crear estado: ' + err.message);
      }
    });


      // if (this.newState.name) {
      //     await this.interactionService.showLoading('Procesando...')
      //     this.stateService.addState(this.newState).subscribe(() => {
      //     this.newState = { name: '' };
      //     this.loadState();
      //   });
      // }
      // this.interactionService.dismissLoading();
      // this.modal.dismiss(this.newState, 'confirm');
      // this.interactionService.showToast('Estado creado con éxito');
      // console.log('Agregado');

    }

    editState(state: StateI) {
      this.isEditing = true;
      this.editingStateId = state.id!;
      this.newState = { ...state };
      console.log('estamos dentro', this.newState);
      this.modalEdit.present();

    }

    async updateState() {

      this.stateService.updateState(this.editingStateId, this.newState).subscribe({
        next: () => {
          this.isEditing = false;
          this.editingStateId = null;
          this.newState = { name: '' };
          this.loadState();
          this.interactionService.dismissLoading();
          this.modalEdit.dismiss(this.newState, 'confirm');
          this.interactionService.showToast('Estado actualizado');
        },
        error: (err) => {
          this.interactionService.dismissLoading();
          this.interactionService.showToast('Error al actualizar estado: ' + err.message);
        }
      });
      // if (this.editingStateId) {
      //   await this.interactionService.showLoading('Actualizado...')
      //   this.stateService.updateState(this.editingStateId, this.newState).subscribe(() => {
      //     this.isEditing = false;
      //     this.editingStateId = null;
      //     this.newState = { name: '' };
      //     this.loadState();
      //   });
      // }
      // this.interactionService.dismissLoading();
      // this.modalEdit.dismiss(this.newState, 'confirm');
      // this.interactionService.showToast('Estado actualizado');
    }

    async deleteState(id: string) {
      const responseAlert = await this.interactionService.presentAlert('Eliminar Usuario',
        `Esta seguro de eliminar el <strong>Usuario</strong>`,
      'Cancelar');

      if( responseAlert){
        try {
          this.stateService.deleteUser(id).subscribe(() => {
            this.loadState();
          });
          this.interactionService.dismissLoading();
          this.interactionService.showToast('Usuario eliminado');
        }
        catch(err){
          this.interactionService.showToast('Error: ' + err);
        }
      }
    }


}
