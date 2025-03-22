import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  // email: string = '';
  // password: string = '';

  // constructor(private authService: AuthService, private router: Router) {}

  // async login() {
  //   try {
  //     await this.authService.login(this.email, this.password);
  //     alert('Inicio de sesión exitoso');
  //     this.router.navigate(['/home']);
  //   } catch (error) {
  //     alert('Error en el inicio de sesión: ' + error);
  //   }
  // }

  email: string = '';
  password: string = '';
  file: File | null = null;
  profilePicUrl: string = '';

  constructor(private authSupaService: AuthService, private router: Router) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  async register() {
    try {
      await this.authSupaService.signUp(this.email, this.password);
      alert('Registro exitoso. Ahora inicia sesión.');
    } catch (error) {
      alert(error);
    }
  }

  async login() {
    try {
      await this.authSupaService.login(this.email, this.password);
      //this.loadUserProfile();
      alert("Usuario activo");
    } catch (error) {
      alert(error);
    }
  }

  async loadUserProfile() {
    try {
      const profile = await this.authSupaService.getUserProfile();
      this.profilePicUrl = profile.profilePic;
    } catch (error) {
      alert(error);
    }
  }

  async logout() {
    await this.authSupaService.logout();
    this.profilePicUrl = '';
    alert('Sesión cerrada');
  }
  goRegister(){
    this.router.navigate(['/auth/register']);
  }
}
