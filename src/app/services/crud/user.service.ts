import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { Models } from 'src/app/models/models';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Obtener todos los usuarios
  getUsers(): Observable<Models.User.UserssI[]> {
    return from(this.fetchUsers());
  }
  private async fetchUsers(): Promise<Models.User.UserssI[]> {
    const { data, error } = await supabase
      .from('usersapp')  // Asegúrate que este es el nombre correcto
      .select('*');

    if (error) throw error;

    console.log('[Supabase] Data cargada:', data);
    return data as Models.User.UserssI[];
  }

  // Agregar usuario
  addUser(user: Models.User.UserssI): Observable<void> {
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
  updateUser(id: string, user: Partial<Models.User.UserssI>): Observable<void> {
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
