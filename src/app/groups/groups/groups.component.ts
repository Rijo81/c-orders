import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonModal, IonButton, IonItem,
  IonInput, IonSearchbar, IonList, IonIcon, IonFab, IonFabButton, IonMenuButton, IonSelectOption, IonSelect } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { GroupsI } from 'src/app/models/groups.models';
import { GroupService } from 'src/app/services/crud/group.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { CrudGroupsService } from 'src/app/services/supabase/crud-groups.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonList, IonSearchbar, IonInput, IonItem, IonButton, IonModal,
    IonLabel, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton, ReactiveFormsModule,
    FormsModule, IonSelectOption, CommonModule, IonSelect ]
})
export class GroupsComponent  implements OnInit {


  groups: GroupsI[] = [];
  filteredGroups: GroupsI[] = [];
  newGroup: GroupsI = { name: '', parentId: '' };
  isEditing = false;
  editingGroupId: string | null = null;
  selectedGroup: string = '';
  searchForm!: FormGroup;

  @ViewChild('modalCreate') modal!: IonModal;
  @ViewChild('modalUpdate') modalEdit!: IonModal;

  constructor(
    private groupService: GroupService,
    private interactionService: InteractionService
  ) {
    addIcons({ trash, create, add });
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.loadGroup();

    this.searchForm.get('search')?.valueChanges.subscribe(value => {
      this.filterGroup(value);
    });
  }

  filterGroup(searchTerm: string) {
    if (!searchTerm) {
      this.filteredGroups = this.groups;
      return;
    }

    const lower = searchTerm.toLowerCase();
    this.filteredGroups = this.groups.filter(group =>
      group.name.toLowerCase().includes(lower)
    );
  }

  openModalCreate() {
    this.modal.present();
  }

  openModalEdit() {
    this.modalEdit.present();
  }

  cancelModalCreate() {
    this.modal.dismiss(null, 'cancel');
  }

  cancelModalUpdate() {
    this.modalEdit.dismiss(null, 'cancel');
  }

  loadGroup() {
    this.groupService.getGroups().subscribe({
      next: (group) => {
        console.log(group);

        this.groups = group;
        this.filteredGroups = group;
      },
      error: (err) => {
        console.error("Error al cargar grupos:", err);
        this.interactionService.showToast('Error al cargar grupos.');
      }
    });
  }

  async addGroup() {
    if (!this.newGroup.name.trim()) {
      this.interactionService.showToast('El nombre es obligatorio');
      return;
    }
    this.newGroup.parentId = this.selectedGroup;
    await this.interactionService.showLoading('Guardando...');
    this.groupService.addGroup(this.newGroup).subscribe({
      next: () => {
        console.log('datos padres: ',this.newGroup, this.selectedGroup);
        //this.newGroup = { name: '', parentId: this.selectedGroup };
        this.loadGroup();
        this.interactionService.dismissLoading();
        this.modal.dismiss(null, 'confirm');
        this.interactionService.showToast('Grupo creado con éxito');
      },
      error: (err) => {
        this.interactionService.dismissLoading();
        console.error("Error al agregar grupo:", err);
        this.interactionService.showToast('Error al crear grupo.');
      }
    });
  }

  editGroup(group: GroupsI) {
    this.isEditing = true;
    this.editingGroupId = group.id!;
    this.newGroup = { ...group };
    this.modalEdit.present();
  }

  async updateGroup() {
    if (!this.editingGroupId) return;

    if (!this.newGroup.name.trim()) {
      this.interactionService.showToast('El nombre es obligatorio');
      return;
    }

    await this.interactionService.showLoading('Actualizando...');
    this.groupService.updateGroup(this.editingGroupId, this.newGroup).subscribe({
      next: () => {
        this.isEditing = false;
        this.editingGroupId = null;
        this.newGroup = { name: '', parentId: this.selectedGroup };
        this.loadGroup();
        this.interactionService.dismissLoading();
        this.modalEdit.dismiss(null, 'confirm');
        this.interactionService.showToast('Grupo actualizado');
      },
      error: (err) => {
        this.interactionService.dismissLoading();
        console.error("Error al actualizar grupo:", err);
        this.interactionService.showToast('Error al actualizar grupo.');
      }
    });
  }

  async deleteGroup(id: string) {
    const confirmed = await this.interactionService.presentAlert(
      'Eliminar Grupo',
      '¿Estás seguro de que deseas eliminar este grupo?',
      'Cancelar'
    );

    if (!confirmed) return;

    await this.interactionService.showLoading('Eliminando...');
    this.groupService.deleteGroup(id).subscribe({
      next: () => {
        this.loadGroup();
        this.interactionService.dismissLoading();
        this.interactionService.showToast('Grupo eliminado');
      },
      error: (err) => {
        this.interactionService.dismissLoading();
        console.error("Error al eliminar grupo:", err);
        this.interactionService.showToast('Error al eliminar grupo.');
      }
    });
  }
    //   groups: GroupsI[] = [];
    //   newGroup:  GroupsI = { name: '', parentId: '' };
    //   isEditing = false;
    //   editingGroupId: string | null = null;
    //   selectedGroup: string = '';

    //   //BUSQUEDA // Lista original de usuarios
    //   filteredGroups: GroupsI[] = []; // Lista filtrada de usuarios
    //   searchForm!: FormGroup;


    //   @ViewChild('modalCreate') modal!: IonModal;
    //   @ViewChild('modalUpdate') modalEdit!: IonModal;


    //   constructor(//private groupService: GroupService,
    //               private groupService: GroupService,
    //               private interactionService: InteractionService,
    //               ) {
    //     addIcons({ trash, create, add });
    //   }

    //   ngOnInit() {

    //     this.searchForm = new FormGroup({
    //       search: new FormControl('')
    //     });
    //     this.loadGroup();
    //       this.groupService.getGroups().subscribe(group => {
    //       //this.groupService.getGroups();
    //       this.groups = group;
    //       this.filteredGroups = group; // Al inicio, la lista filtrada es igual a la original

    //       });
    //     // Detectar cambios en el campo de búsqueda y filtrar usuarios
    //     this.searchForm.get('search')?.valueChanges.subscribe(value => {
    //       this.filterGroup(value);
    //       console.log(value);
    //       console.log(this.filterGroup(value));

    //     });
    //   }
    //   // Función para filtrar los usuarios
    //   filterGroup(searchTerm: string) {
    //     console.log('Dentro del metodo: ', searchTerm);

    //     if (!searchTerm) return [];

    //     const lowerCaseSearch = searchTerm.toLowerCase();
    //       this.filteredGroups = this.groups.filter(group =>{
    //         group.name.toLowerCase().includes(lowerCaseSearch)
    //       });

    //     return this.filteredGroups;
    //     // query = query.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
    //     // this.filteredUsers = this.users.filter(user =>
    //     //   user.name.toLowerCase().includes(query) || // Filtra por nombre
    //     //   user.email.toLowerCase().includes(query)   // Filtra por email
    //     // );
    //   }

    //   openModalEdit() {
    //     this.modalEdit.present(); // Muestra el primer modal
    //   }

    //   openModalCreate() {
    //     this.modal.present(); // Muestra el primer modal
    //   }

    //   cancelModalCreate() {
    //     this.modal.dismiss(null, 'cancel');
    //   }
    //   cancelModalUpdate() {
    //     this.modalEdit.dismiss(null, 'cancel');
    //   }

    //   loadGroup() {
    //     //this.groupService.getGroups().subscribe(group => {
    //     this.groupService.getGroups().subscribe(group => {
    //       this.groups = group;
    //     });
    //   }
    //  async addGroup() {
    //     if (this.newGroup.name) {
    //         await this.interactionService.showLoading('Procesando...');
    //         this.groupService.addGroup(this.newGroup).subscribe(() => {
    //         //this.groupService.addGroup(this.newGroup);
    //         this.newGroup = { name: '', parentId: this.selectedGroup };
    //         this.loadGroup();
    //         });
    //     }
    //     this.interactionService.dismissLoading();
    //     this.modal.dismiss(this.newGroup, 'confirm');
    //     this.interactionService.showToast('Grupo creado con éxito');
    //     console.log('Agregado');
    //   }

    //   editGroup(group: GroupsI) {
    //     this.isEditing = true;
    //     this.editingGroupId = group.id!;
    //     this.newGroup = { ...group };
    //     console.log('estamos dentro', this.newGroup);
    //     this.modalEdit.present();

    //   }

    //   async updateGroup() {
    //     if (this.editingGroupId) {
    //       await this.interactionService.showLoading('Actualizado...')
    //       this.groupService.updateGroup(this.editingGroupId, this.newGroup).subscribe(() => {
    //       // this.groupService.updateGroup(this.editingGroupId, this.newGroup).then(() => {
    //           this.isEditing = false;
    //         this.isEditing = false;
    //         this.editingGroupId = null;
    //         this.newGroup = { name: '', parentId:  this.selectedGroup };
    //         this.loadGroup();
    //       });
    //     }
    //     this.interactionService.dismissLoading();
    //     this.modalEdit.dismiss(this.newGroup, 'confirm');
    //     this.interactionService.showToast('Estado actualizado');
    //   }

    //   async deleteGroup(id: string) {
    //     const responseAlert = await this.interactionService.presentAlert('Eliminar Usuario',
    //       `Esta seguro de eliminar el <strong>Usuario</strong>`,
    //     'Cancelar');

    //     if( responseAlert){
    //       try {
    //         this.groupService.deleteGroup(id).subscribe(() => {
    //         //this.groupService.deleteGroup(id).then(() => {
    //           this.loadGroup();
    //         });
    //         this.interactionService.dismissLoading();
    //         this.interactionService.showToast('Usuario eliminado');
    //       }
    //       catch(err){
    //         this.interactionService.showToast('Error: ' + err);
    //       }
    //     }
    //   }
}
