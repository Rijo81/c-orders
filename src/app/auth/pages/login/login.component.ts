import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonInput, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton,
  IonToggle
 } from "@ionic/angular/standalone";
import { InteractionService } from 'src/app/services/interaction.service';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonTitle, IonToolbar, IonInput, IonHeader, FormsModule,
    IonToggle, FormsModule, ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  error: string | null = null;



  constructor(private supabaseService: SupabaseService,
              private router: Router,
              private interactionService: InteractionService,
              private fb: FormBuilder) {
                this.loginForm = this.fb.group({
                  email: ['', [Validators.required, Validators.email]],
                  password: ['', Validators.required],
                  rememberMe: [false, Validators.required]
                });
              }

  ngOnInit() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPass = localStorage.getItem('rememberedPassword');
    const remember = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && savedPass && remember) {
      this.loginForm.setValue({
        email: savedEmail,
        password: savedPass,
        rememberMe: true
      });
    }

  }

  async login() {
    try {
      if (this.loginForm.invalid) return;

      const { email, password, rememberMe } = this.loginForm.value;


      await this.supabaseService.signIn(email, password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.setItem('rememberMe', 'false');
      }
      this.interactionService.showToast('Sesión iniciada');
      this.router.navigate(['/user-supabase']);
    } catch (error) {
      this.error = "Hay un problema con su credenciales: " + error;
      this.interactionService.showToast('Error al iniciar sesión');
      console.error(error);
    }finally{
      this.interactionService.dismissLoading();
    }
  }

}
