import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonInput, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton } from "@ionic/angular/standalone";
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonTitle, IonToolbar, IonInput, IonHeader, FormsModule]
})
export class LoginComponent {

  email = '';
  password = '';
  error: string = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async login() {
    try {
      await this.supabaseService.signIn(this.email, this.password);
      this.router.navigate(['/user-supabase']);
      alert('Usuario autorizado....')
    } catch (error) {
      this.error = "Hay un problema con su credenciales: " + error;
      console.error(error);
    }
  }

}
