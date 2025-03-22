import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { IonHeader, IonLabel, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton,
  IonSelect, IonSelectOption
 } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonItem, IonContent, IonTitle, IonToolbar, IonLabel, IonHeader, IonSelect,
    IonSelectOption, FormsModule
   ]
})
export class RegisterComponent  {

  name = '';
  email = '';
  password = '';
  rol = '';
  group_id = '';
  photo: File | null = null;

  constructor(private supabaseService: SupabaseService) {}

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
