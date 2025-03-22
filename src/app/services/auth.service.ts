import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState, sendEmailVerification } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  constructor() { }

  // Registrar usuario
  async register(email: string, password: string) {
    const user =  await createUserWithEmailAndPassword(this.auth, email, password);
    await this.sendEmailVerification();
    return user;
  }

  // Iniciar sesión
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Cerrar sesión
  async logout() {
    return await signOut(this.auth);
  }
  sendEmailVerification() {
    return sendEmailVerification(this.auth.currentUser)
  }
  // Obtener usuario autenticado
  getUser() {
    return authState(this.auth);
  }
}
