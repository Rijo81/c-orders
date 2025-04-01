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

  name = '';
  email = '';
  password = '';
  rol = '';
  group_id = '';
  photo: File | null = null;
  rols: RolsI[] = [];
  groups: GroupsI[] = [];

  constructor(private supabaseService: SupabaseService, private interactionService: InteractionService,
        private groupService: GroupService,
      private rolService: RolsService) {}

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
            this.loadRols();
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

        loadRols() {
          console.log('Estamos a dentro del metodo de Roles');

             this.rolService.getRols().subscribe({
              next: (rol) => {
                console.log(rol);
                this.rols = rol;
              },
              error: (err) => {
                console.error("Error al cargar los roles:", err);
                this.interactionService.showToast('Error al cargar Rol.');
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
      await this.supabaseService.signUp(this.name, this.email, this.password, this.rol, this.group_id, this.photo);
      console.log("Registro exitoso");
    } catch (error) {
      console.error(error);
    }
  }

}
