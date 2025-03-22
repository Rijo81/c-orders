import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { Models } from 'src/app/models/models';
import { environment } from 'src/environments/environment';
// import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
// import { from, Observable } from 'rxjs';
// import { Models } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtener todos los usuarios
  getUsers(): Observable<Models.User.UsersI[]> {
    return from(this.fetchUsers());
    //   this.supabase
    //     .from('usersapp') // tu tabla debe llamarse 'users'
    //     .select('*')
    //     .then(({ data, error }) => {
    //       console.log(data);

    //       if (error) throw error;
    //       return data as Models.User.UsersI[];
    //     })
    // );
  }
  private async fetchUsers(): Promise<Models.User.UsersI[]> {
    const { data, error } = await this.supabase
      .from('usersapp')  // Asegúrate que este es el nombre correcto
      .select('*');

    if (error) throw error;

    console.log('[Supabase] Data cargada:', data);
    return data as Models.User.UsersI[];
  }

  // Agregar usuario
  addUser(user: Models.User.UsersI): Observable<void> {
    return from(
      this.supabase
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
      this.supabase
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
      this.supabase
        .from('usersapp')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
  // private usersCollection = collection(this.firestore, 'users');
  // constructor(private firestore: Firestore) {}

  // // Obtener todos los usuarios
  // getUsers(): Observable<Models.User.UserI[]> {
  //   return from(getDocs(this.usersCollection).then(snapshot =>
  //     snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Models.User.UserI))
  //   ));
  // }

  // // Agregar usuario
  // addUser(user: Models.User.UserI): Observable<void> {
  //   return from(addDoc(this.usersCollection, user).then(() => {}));
  // }

  // // Editar usuario
  // updateUser(id: string, user: Partial<Models.User.UserI>): Observable<void> {
  //   const userDoc = doc(this.firestore, `users/${id}`);
  //   return from(updateDoc(userDoc, user));
  // }

  // // Eliminar usuario
  // deleteUser(id: string): Observable<void> {
  //   const userDoc = doc(this.firestore, `users/${id}`);
  //   return from(deleteDoc(userDoc));
  // }
}
