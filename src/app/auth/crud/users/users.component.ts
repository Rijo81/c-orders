import { Component, OnInit, ViewChild } from '@angular/core';
import { Models } from 'src/app/models/models';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonList, IonItem, IonAvatar,
  IonIcon, IonFab, IonFabButton, IonMenuButton, IonButton, IonModal, IonSearchbar, IonInput, IonText,
  IonSelect, IonSelectOption, IonPopover, PopoverController } from "@ionic/angular/standalone";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { create, trash, add, createOutline, trashOutline } from 'ionicons/icons';
import { InteractionService } from 'src/app/services/interaction.service';
import { GroupsI } from 'src/app/models/groups.models';
import { GroupService } from 'src/app/services/crud/group.service';
import { UserService } from 'src/app/services/crud/user.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { Router } from '@angular/router';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [ IonPopover, IonText, IonInput, IonSearchbar, IonModal, IonButton,  IonIcon, IonItem, IonList, IonLabel, IonContent, IonButtons,
    IonTitle, IonToolbar, IonHeader, IonMenuButton, FormsModule, CommonModule, IonFab, IonFabButton,
  ReactiveFormsModule, IonSelectOption, IonAvatar, IonSelect ]
})
export class UsersComponent  implements OnInit {

  users: Models.User.UsersI[] = [];
  groups: GroupsI[] = [];
  newUser: Models.User.UsersI = this.getDefaultUsers();
  photo: File | null = null
  isEditing = false;
  editingUserId: string | null = null;
  //BUSQUEDA // Lista original de usuarios
  filteredUsers: Models.User.UsersI[] = []; // Lista filtrada de usuarios
  searchForm!: FormGroup;
  selectedPhoto: File | null = null;

  userPhoto: string = '';
  showUserMenu = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedPhoto = file;
  }

  @ViewChild('modalCreate') modal!: IonModal;
  @ViewChild('modalUpdate') modalEdit!: IonModal;


  constructor(private userService: UserService,
              private groupService: GroupService,
              private supabaseService: SupabaseService,
              private interactionService: InteractionService,
              private router: Router,
              private popoverCtrl: PopoverController
              ) {
    addIcons({createOutline,trashOutline,add,trash,create});
  }

  async ngOnInit() {

    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.groupService.getGroups().subscribe(group => {
      this.groups = group;
    });
    this.loadUsers();
    console.log(this.loadUsers());
    // Detectar cambios en el campo de búsqueda y filtrar usuarios
    this.searchForm.get('search')?.valueChanges.subscribe(value => {
      this.filterUsers(value);
      console.log(value);
      console.log(this.filterUsers(value));

    });
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
  // Función para filtrar los usuarios
  filterUsers(searchTerm: string) {
    console.log('Dentro del metodo: ', searchTerm);

    if (!searchTerm) return [];

    const lowerCaseSearch = searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>{
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.email.toLowerCase().includes(lowerCaseSearch)
      });

    return this.filteredUsers;
  }

  openModalEdit() {
    this.modalEdit.present(); // Muestra el primer modal
  }

  openModalCreate() {
    this.resetForm();
    this.modal.present(); // Muestra el primer modal
  }

  cancelModalCreate() {
    this.modal.dismiss(null, 'cancel');
  }
  cancelModalUpdate() {
    this.modal.dismiss(null, 'cancel');
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.interactionService.showToast('Error al cargar usuarios');
      }
    });
  }

  getDefaultUsers(): Models.User.UsersI {
    return { name: '', email: '', phone: '', password: '', group_id: { id: '',
      name: '',
      parentId: '',
      permition_states: false,
      permition_groups: false,
      permition_users: false,
      permition_typerequests: false,
      permition_requests: false,
      permition_viewsolic: false,}, photo: '' };
  }

  uploadPhoto(event: any) {
    this.photo = event.target.files[0];
  }

  resetForm() {
    this.newUser = {
      id: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      group_id: { id: '',
        name: '',
        parentId: '',
        permition_states: false,
        permition_groups: false,
        permition_users: false,
        permition_typerequests: false,
        permition_requests: false,
        permition_viewsolic: false,}, photo: '' };
    this.photo = null;
    this.selectedPhoto = null;
  }

  getGroupNameById(id: string): string {
    const group = this.groups.find(g => g.id === id);
    return group ? group.name : 'Sin grupo';
  }
  async addUser() {
    if (!this.photo) {
      console.error("Selecciona una foto");
      return;
    }
    try {
      this.interactionService.showLoading();
      await this.supabaseService.signUp(this.newUser.name, this.newUser.email, this.newUser.phone, this.newUser.password, this.newUser.group_id, this.photo);
      this.interactionService.dismissLoading();
      this.loadUsers();
      this.modal.dismiss(); // 🔒 Cierra el modal
      this.resetForm(); // 🔄 Limpia el formulario
      this.interactionService.showToast("Usuario registrado con éxito ✅");
      console.log("Registro exitoso");
    } catch (error) {
      console.error(error);
      this.interactionService.showToast("Error al registrar usuario ❌");
    }
  }

  editUser(user: Models.User.UsersI) {
    this.isEditing = true;
    this.editingUserId = user.id!;

    const group = typeof user.group_id === 'string'
      ? this.groups.find(g => g.id === user.group_id.id)
      : user.group_id;

    this.newUser = {
      ...user,
      group_id: group || this.getDefaultUsers().group_id
    };

    this.modalEdit.present();
  }

  async updateUser() {
    if (this.editingUserId) {
      await this.interactionService.showLoading('Actualizando...');

      const groupId = typeof this.newUser.group_id === 'object'
        ? this.newUser.group_id.id
        : this.newUser.group_id;

      const userToUpdate = {
        ...this.newUser,
        group_id: groupId
      };

      this.userService.updateUser(this.editingUserId, userToUpdate as any).subscribe({
        next: () => {
          this.isEditing = false;
          this.editingUserId = null;
          this.newUser = this.getDefaultUsers();
          this.loadUsers();
          this.modalEdit.dismiss(this.newUser, 'confirm');
          this.interactionService.showToast('Usuario actualizado');
        },
        error: (err) => {
          this.interactionService.showToast('Error al actualizar usuario');
          console.error(err);
        },
        complete: () => this.interactionService.dismissLoading()
      });
    }
  }

  // Usado en ion-select para evitar errores de comparación
  compareWithFn = (o1: any, o2: any) => {
    return typeof o1 === 'object' && typeof o2 === 'object'
      ? o1.id === o2.id
      : o1 === o2;
  };

  // editUser(user: Models.User.UsersI) {
  //   this.isEditing = true;
  //   this.editingUserId = user.id!;
  //   this.newUser = { ...user };
  //   console.log('estamos dentro');
  //   this.modalEdit.present();
  // }

  // async updateUser() {

  //   if (this.editingUserId) {
  //     await this.interactionService.showLoading('Actualizando...');
  //     const userToUpdate = {
  //       ...this.newUser,
  //       group_id: this.newUser.group_id.id // Extrae solo el ID del grupo
  //     } as any;

  //     console.log('envia un string', userToUpdate);

  //     this.userService.updateUser(this.editingUserId, userToUpdate).subscribe({
  //       next: () => {
  //         this.isEditing = false;
  //         this.editingUserId = null;
  //         this.newUser = this.getDefaultUsers();
  //         this.loadUsers();
  //         this.modalEdit.dismiss(this.newUser, 'confirm');
  //         this.modal.dismiss();
  //         this.interactionService.showToast('Usuario actualizado');
  //       },
  //       error: (err) => {
  //         this.interactionService.showToast('Error al actualizar usuario');
  //         console.error(err);
  //       },
  //       complete: () => this.interactionService.dismissLoading()
  //     });
  //   }
  // }

  async deleteUser(id: string) {

    const confirm = await this.interactionService.presentAlert(
      'Eliminar Usuario',
      '¿Estás seguro de eliminar este usuario?',
      'Cancelar'
    );

    if (confirm) {
      await this.interactionService.showLoading('Eliminando...');
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.interactionService.showToast('Usuario eliminado');
        },
        error: (err) => {
          this.interactionService.showToast('Error al eliminar usuario');
          console.error(err);
        },
        complete: () => this.interactionService.dismissLoading()
      });
    }
  }
}
