import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { Models } from 'src/app/models/models';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Obtener todos los usuarios
  getUsers(): Observable<Models.User.UsersI[]> {
    return from(this.fetchUsers());
  }
  private async fetchUsers(): Promise<Models.User.UsersI[]> {
    const { data, error } = await supabase
      .from('usersapp')  // Asegúrate que este es el nombre correcto
      .select('*');

    if (error) throw error;

    console.log('[Supabase] Data cargada:', data);
    return data as Models.User.UsersI[];
  }

  // Agregar usuario
  addUser(user: Models.User.UsersI): Observable<void> {
    return from(
      supabase
        .from('usersapp')
        .insert([user])
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  // Editar usuario
  updateUser(id: string, user: Partial<Models.User.UsersI>): Observable<void> {
    return from(
      supabase
        .from('usersapp')
        .update(user)
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<void> {
    return from(
      supabase
        .from('usersapp')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
}
