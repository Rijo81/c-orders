import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonToolbar, IonHeader, IonTitle, IonButtons, IonContent, IonLabel, IonModal, IonButton, IonItem,
  IonInput, IonSearchbar, IonList, IonIcon, IonFab, IonFabButton, IonMenuButton, IonCheckbox } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { RolsI } from 'src/app/models/rols.models';
import { RolsService } from 'src/app/services/crud/rols.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
  standalone: true,
  imports: [IonCheckbox, IonFabButton, IonFab, IonIcon, IonList, IonSearchbar, IonItem, IonInput, IonButton, IonModal,
    IonLabel, IonContent, IonButtons, IonTitle, IonHeader, IonToolbar, IonMenuButton, ReactiveFormsModule,
    FormsModule  ]
})
export class RolComponent  implements OnInit {

      rols: RolsI[] = [];
      newRol:  RolsI = {  name: '',
                          permition_states: false,
                          permition_users: false,
                          permition_requests: false,
                          permition_viewsolic: false };
      isEditing = false;
      editingRolId: string | null = null;
      //BUSQUEDA // Lista original de usuarios
      filteredRols: RolsI[] = []; // Lista filtrada de usuarios
      searchForm!: FormGroup;

      @ViewChild('modalCreate') modal!: IonModal;
      @ViewChild('modalUpdate') modalEdit!: IonModal;

      constructor(private rolService: RolsService,
                  private interactionService: InteractionService) {
        addIcons({trash, create, add});
      }

      ngOnInit() {

        this.searchForm = new FormGroup({
          search: new FormControl('')
        });
        //this.loadUsers();
          this.rolService.getRols().subscribe(rol => {
          this.rols = rol;
          this.filteredRols = rol;
        });

        // Detectar cambios en el campo de búsqueda y filtrar usuarios
        this.searchForm.get('search')?.valueChanges.subscribe(value => {
          this.filterRol(value);
          console.log(value);
          console.log(this.filterRol(value));

        });
      }
      // Función para filtrar los usuarios
      filterRol(searchTerm: string) {
        console.log('Dentro del metodo: ', searchTerm);

        if (!searchTerm) return [];

        const lowerCaseSearch = searchTerm.toLowerCase();
          this.filteredRols = this.rols.filter(rol =>{
            rol.name.toLowerCase().includes(lowerCaseSearch)
          });

        return this.filteredRols;
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

      loadRol() {
        this.rolService.getRols().subscribe(rol => {
          this.rols = rol;
        });
      }

      getDefaultRol(): RolsI {
        return {
          name: '',
          permition_states: false,
          permition_users: false,
          permition_requests: false,
          permition_viewsolic: false
        };
      }
     async addRol() {

      this.rolService.addRol(this.newRol).subscribe({
        next: () => {
          this.newRol = this.getDefaultRol();
          this.loadRol();
          this.interactionService.dismissLoading();
          this.modal.dismiss(null, 'confirm');
          this.interactionService.showToast('Rol creado con éxito');
        },
        error: err => {
          console.error(err);
          this.interactionService.dismissLoading();
          this.interactionService.showToast('Error al crear rol');
        }
      });

        // if (this.newRol.name) {
        //     await this.interactionService.showLoading('Procesando...')
        //     this.rolService.addRol(this.newRol).subscribe(() => {
        //     this.newRol = { name: '',
        //                     permition_states: false,
        //                     permition_users: false,
        //                     permition_requests: false,
        //                     permition_viewsolic: false };
        //     this.loadRol();
        //   });
        // }
        // this.interactionService.dismissLoading();
        // this.modal.dismiss(this.newRol, 'confirm');
        // this.interactionService.showToast('Rol creado con éxito');
        // console.log('Agregado');

      }

      editRol(rol: RolsI) {
        this.isEditing = true;
        this.editingRolId = rol.id!;
        this.newRol = { ...rol };
        console.log('estamos dentro', this.newRol);
        this.openModalEdit()

      }

      async updateRol() {
        if (this.editingRolId) {
          await this.interactionService.showLoading('Actualizando...');

          this.rolService.updateRol(this.editingRolId, this.newRol).subscribe({
            next: () => {
              this.isEditing = false;
              this.editingRolId = null;
              this.newRol = this.getDefaultRol();
              this.loadRol();
              this.interactionService.dismissLoading();
              this.modalEdit.dismiss(null, 'confirm');
              this.interactionService.showToast('Rol actualizado con éxito');
            },
            error: (err) => {
              console.error('Error al actualizar rol:', err);
              this.interactionService.dismissLoading();
              this.interactionService.showToast('Error al actualizar rol');
            }
          });
        }
        // if (this.editingRolId) {
        //   await this.interactionService.showLoading('Actualizado...')
        //   this.rolService.updateRol(this.editingRolId, this.newRol).subscribe(() => {
        //     this.isEditing = false;
        //     this.editingRolId = null;
        //     this.newRol = { name: '',
        //                     permition_states: false,
        //                     permition_users: false,
        //                     permition_requests: false,
        //                     permition_viewsolic: false
        //      };
        //     this.loadRol();
        //   });
        // }
        // this.interactionService.dismissLoading();
        // this.modalEdit.dismiss(this.newRol, 'confirm');
        // this.interactionService.showToast('Rol actualizado');
      }

      async deleteRol(id: string) {
        const responseAlert = await this.interactionService.presentAlert(
          'Eliminar Rol',
          `¿Está seguro de eliminar este <strong>Rol</strong>?`,
          'Cancelar'
        );

        if (responseAlert) {
          await this.interactionService.showLoading('Eliminando...');

          this.rolService.deleteRol(id).subscribe({
            next: () => {
              this.loadRol();
              this.interactionService.dismissLoading();
              this.interactionService.showToast('Rol eliminado correctamente');
            },
            error: (err) => {
              console.error('Error al eliminar rol:', err);
              this.interactionService.dismissLoading();
              this.interactionService.showToast('Error al eliminar rol');
            }
          });
        }

      //   const responseAlert = await this.interactionService.presentAlert('Eliminar Rol',
      //     `Esta seguro de eliminar el <strong>Rol</strong>`,
      //   'Cancelar');

      //   if( responseAlert){
      //     try {
      //       this.rolService.deleteRol(id).subscribe(() => {
      //         this.loadRol();
      //       });
      //       this.interactionService.dismissLoading();
      //       this.interactionService.showToast('Rol eliminado');
      //     }
      //     catch(err){
      //       this.interactionService.showToast('Error: ' + err);
      //     }
      //   }
      }
}
