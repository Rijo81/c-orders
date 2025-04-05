import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { IonHeader, IonLabel, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton,
  IonSelect, IonSelectOption
 } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { delay, filter, retry, take, tap } from 'rxjs';
import { InteractionService } from 'src/app/services/interaction.service';
import { GroupService } from 'src/app/services/crud/group.service';
import { GroupsI } from 'src/app/models/groups.models';
import { RolsI } from 'src/app/models/rols.models';
import { RolsService } from 'src/app/services/crud/rols.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonItem, IonContent, IonTitle, IonToolbar, IonLabel, IonHeader, IonSelect,
    IonSelectOption, FormsModule, CommonModule
   ]
})
export class RegisterComponent implements OnInit {


  newUser = { name: '', email: '', password: '', group_id: { id: '',
    name: '',
    parentId: '',
    permition_states: false,
    permition_groups: false,
    permition_users: false,
    permition_typerequests: false,
    permition_requests: false,
    permition_viewsolic: false,}, photo: '' };
  photo: File | null = null;
  groups: GroupsI[] = [];

  constructor(private supabaseService: SupabaseService, private interactionService: InteractionService,
        private groupService: GroupService ) {}

  ngOnInit() {
      this.supabaseService.sessionChanged
          .pipe(
            filter(session => !!session),        // Espera a que la sesión esté lista
            take(1),                              // Solo la primera vez
            tap(() => console.log('Sesión lista')),
            delay(100),                           // Le das un respiro por si Supabase se toma su tiempo
            retry({ count: 3, delay: 1000 })      // Si falla, reintenta hasta 3 veces
          )
          .subscribe(() => {
            this.loadGroup();
          });
      }

      loadGroup() {
        console.log('Estamos a dentro del metodo');

           this.groupService.getGroups().subscribe({
            next: (group) => {
              console.log(group);
              this.groups = group;
            },
            error: (err) => {
              console.error("Error al cargar grupos:", err);
              this.interactionService.showToast('Error al cargar grupos.');
            }
          });
        }
  uploadPhoto(event: any) {
    this.photo = event.target.files[0];
  }

  async register() {
    if (!this.photo) {
      console.error("Selecciona una foto");
      return;
    }

    try {
      await this.supabaseService.signUp(this.newUser.name, this.newUser.email, this.newUser.password, this.newUser.group_id, this.photo);
      console.log("Registro exitoso");
    } catch (error) {
      console.error(error);
    }
  }

}
