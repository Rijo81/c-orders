import { Component, OnInit, ViewChild } from '@angular/core';
import { Models } from 'src/app/models/models';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonList, IonItem, IonAvatar,
  IonIcon, IonFab, IonFabButton, IonMenuButton, IonButton, IonModal, IonSearchbar, IonInput, IonText,
  IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { create, trash, add } from 'ionicons/icons';
import { InteractionService } from 'src/app/services/interaction.service';
import { RolsI } from 'src/app/models/rols.models';
import { GroupsI } from 'src/app/models/groups.models';
import { GroupService } from 'src/app/services/crud/group.service';
import { RolsService } from 'src/app/services/crud/rols.service';
import { UserService } from 'src/app/services/crud/user.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonSearchbar, IonModal, IonButton,  IonIcon, IonItem, IonList, IonLabel, IonContent, IonButtons,
    IonTitle, IonToolbar, IonHeader, IonMenuButton, FormsModule, CommonModule, IonFab, IonFabButton,
  ReactiveFormsModule, IonSelectOption, IonAvatar, IonSelect ]
})
export class UsersComponent  implements OnInit {

  users: Models.User.UserssI[] = [];
  rols: RolsI[] = [];
  groups: GroupsI[] = [];
  newUser: Models.User.UserssI = { name: '', email: '', password: '', rol: '', group_id: '' };
  objectUsers = {name: '',  email: '', password: '', rol: '', group_id: ''};
  photo: File | null = null
  isEditing = false;
  editingUserId: string | null = null;
  //BUSQUEDA // Lista original de usuarios
  filteredUsers: Models.User.UserssI[] = []; // Lista filtrada de usuarios
  searchForm!: FormGroup;
  selectedPhoto: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedPhoto = file;
  }


  @ViewChild('modalCreate') modal!: IonModal;
  @ViewChild('modalUpdate') modalEdit!: IonModal;


  constructor(private userService: UserService,
              private groupService: GroupService,
              private rolService: RolsService,
              private supabaseService: SupabaseService,
              private interactionService: InteractionService,
              ) {
    addIcons({trash,create,add});
  }

  ngOnInit() {

    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.rolService.getRols().subscribe(rol => {
      this.rols = rol;
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

  getDefaultUsers(): Models.User.UserssI {
    return { name: '', email: '', password: '',  rol: '', group_id: '', photo: '' };
  }

  uploadPhoto(event: any) {
    this.photo = event.target.files[0];
  }
  async addUser() {
    if (!this.photo) {
      console.error("Selecciona una foto");
      return;
    }

    try {
      await this.supabaseService.signUp(this.newUser.name, this.newUser.email, this.newUser.password, this.newUser.rol, this.newUser.group_id, this.photo);
      this.loadUsers();
      console.log("Registro exitoso");
    } catch (error) {
      console.error(error);
    }
  }
//  async addUser() {
//   if (this.newUser.name && this.newUser.email) {
//     await this.interactionService.showLoading('Procesando...');
//     this.userService.addUser(this.newUser).subscribe({
//       next: () => {
//         this.newUser = this.getDefaultUsers();
//         this.loadUsers();
//         this.modal.dismiss(this.newUser, 'confirm');
//         this.interactionService.showToast('Usuario creado con éxito');
//       },
//       error: (err) => {
//         this.interactionService.showToast('Error al agregar usuario');
//         console.error(err);
//       },
//       complete: () => this.interactionService.dismissLoading()
//     });
//   }
//   }

  editUser(user: Models.User.UserssI) {
    this.isEditing = true;
    this.editingUserId = user.id!;
    this.newUser = { ...user };
    console.log('estamos dentro');
    this.modalEdit.present();

  }

  async updateUser() {

    if (this.editingUserId) {
      await this.interactionService.showLoading('Actualizando...');
      this.userService.updateUser(this.editingUserId, this.newUser).subscribe({
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
