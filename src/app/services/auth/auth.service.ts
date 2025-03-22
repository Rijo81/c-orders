import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // async register(email: string, password: string) {
  //   console.log('Email: ', email, 'Password: ', password);

  //   email = email.trim(); // Elimina espacios en blanco
  //   if (!this.isValidEmail(email)) {
  //     console.error("El formato del email es inválido");
  //     return alert('El formato del email es inválido');
  //   }
  //   // 1. Crear usuario en Supabase Auth
  //   const { data, error } = await this.supabase.auth.signUp({ email, password });
  //   console.log('datos: ', data);

  //   if (error) throw error;

  //   // Si el usuario se creó correctamente, agregarlo a la tabla profiles
  //   const { error: profileError } = await this.supabase
  //   .from('usersapp')
  //   .insert([{ id: data.user?.id, email }]);

  //   if (profileError) throw profileError;


  //   // // 2. Subir imagen de perfil si se proporcionó
  //   // if (file) {
  //   //   const filePath = `profiles/${data.user?.id}.jpg`;
  //   //   const { error: uploadError } = await this.supabase.storage.from('devsoftimg').upload(filePath, file);
  //   //   if (uploadError) throw uploadError;
  //   // }

  //   return data;
  // }

  async signUp(email: string, password: string) {

    email = email.trim(); // Elimina espacios en blanco
    if (!this.isValidEmail(email)) {
      console.error("El formato del email es inválido");
      return alert('El formato del email es inválido');
    }
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

      // Si el usuario se creó correctamente, agregarlo a la tabla profiles
    // const { error: profileError } = await this.supabase
    // .from('usersapp')
    // .insert([{ id: data.user?.id, email }]);

    // if (profileError) throw profileError;

    if (error) {
      console.error('Error al registrar usuario:', error.message);
      throw error;
    }

    console.log('Usuario registrado:', data);
    return data;
  }
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getUserProfile() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;

    // Obtener la URL de la imagen de perfil
    const filePath = `profiles/${data.user?.id}.jpg`;
    const { data: fileData } = this.supabase.storage.from('devsoftimg').getPublicUrl(filePath);

    return { user: data.user, profilePic: fileData.publicUrl };
  }

  async logout() {
    await this.supabase.auth.signOut();
  }
}
