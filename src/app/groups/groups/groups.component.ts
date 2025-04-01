import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonModal, IonButton, IonItem,
  IonInput, IonSearchbar, IonList, IonIcon, IonFab, IonFabButton, IonMenuButton, IonSelectOption, IonSelect,
  IonCheckbox } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { GroupsI } from 'src/app/models/groups.models';
import { GroupService } from 'src/app/services/crud/group.service';
import { InteractionService } from 'src/app/services/interaction.service';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  standalone: true,
  imports: [ IonFabButton, IonFab, IonIcon, IonList, IonSearchbar, IonInput, IonItem, IonButton, IonModal,
    IonLabel, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton, ReactiveFormsModule,
    FormsModule, IonSelectOption, CommonModule, IonSelect, IonCheckbox ]
})
export class GroupsComponent  implements OnInit {


  groups: GroupsI[] = [];
  filteredGroups: GroupsI[] = [];
  newGroup: GroupsI = {
    name: '',
    parentid: '',
    permition_states: false,
    permition_groups: false,
    permition_users: false,
    permition_typerequests: false,
    permition_requests: false,
    permition_viewsolic: false
   };
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

    this.groupService.getGroups().subscribe(group => {
      this.groups = group;
    });

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
    this.newGroup.parentid = this.selectedGroup;
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
        this.newGroup = { name: '', parentid: this.selectedGroup };
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
}
