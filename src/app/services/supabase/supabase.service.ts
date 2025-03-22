import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Método para registrar un usuario
  async signUp(name: string, email: string, password: string, rol: string, group_id: string, photo: File) {
    try {
      // Crear usuario en Supabase Auth
      const { data, error } = await this.supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (!photo) {
        return console.error("Error: No se seleccionó ninguna imagen.");;
      }
      // Subir la imagen al Storage
      const photoPath = `users/${data.user?.id}/${photo.name}`;
      console.log('Datos a insertar: ', photoPath);

      const { error: uploadError } = await this.supabase.storage.from('devsoftimg').upload(photoPath, photo);

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError.message);
        throw uploadError;
      }

      const photoUrl = `${environment.supabaseUrl}/storage/v1/object/public/devsoftimg/${photoPath}`;

      // Guardar los datos en la tabla `usuarios`
      console.log('ID: ', data.user.id);

      const { error: dbError } = await this.supabase.from('usersapp').insert([
        { id: data.user?.id, name, email, rol, group_id, photo: photoUrl }
      ]);

      if (dbError) {
        console.error("Error al insertar en usersapp:", dbError.message);
        throw dbError;
      }
      return data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  }

  // Método para iniciar sesión
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    }
  }

  // Obtener datos del usuario actual
  async getUserProfile() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await this.supabase.from('usuarios').select('*').eq('id', user.id).single();
    if (error) throw error;

    return data;
  }

  // Método para cerrar sesión
  async signOut() {
    await this.supabase.auth.signOut();
  }
}
