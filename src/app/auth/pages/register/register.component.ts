import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    try {
      console.log('Registrando');

      await this.authService.register(this.email, this.password);
      alert('Registro exitoso');
      this.router.navigate(['/auth']);
    } catch (error) {
      alert('Error en el registro: ' + error);
    }
  }

}
