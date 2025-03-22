import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { StateI } from 'src/app/models/state.models';
import { environment } from 'src/environments/environment';
// import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
// import { from, Observable } from 'rxjs';
// import { StateI } from 'src/app/models/state.models';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtener todos los estados
  getStates(): Observable<StateI[]> {
    return from(this.supabase.from('states').select('*').then(({ data }) => data as StateI[]));
  }

  // Agregar un estado
  addState(state: StateI): Observable<any> {
    return from(this.supabase.from('states').insert([state]));
  }

  // Actualizar un estado
  updateState(id: string, state: Partial<StateI>): Observable<any> {
    return from(this.supabase.from('states').update(state).eq('id', id));
  }

  // Eliminar un estado
  deleteUser(id: string): Observable<any> {
    return from(this.supabase.from('states').delete().eq('id', id));
  }
  //  private statesCollection = collection(this.firestore, 'states');
  //   constructor(private firestore: Firestore) {}

  //   // Obtener todos los usuarios
  //   getStates(): Observable<StateI[]> {
  //     return from(getDocs(this.statesCollection).then(snapshot =>
  //       snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StateI))
  //     ));
  //   }

  //   // Agregar usuario
  //   addState(user: StateI): Observable<void> {
  //     return from(addDoc(this.statesCollection, user).then(() => {}));
  //   }

  //   // Editar usuario
  //   updateState(id: string, state: Partial<StateI>): Observable<void> {
  //     const stateDoc = doc(this.firestore, `states/${id}`);
  //     return from(updateDoc(stateDoc, state));
  //   }

  //   // Eliminar usuario
  //   deleteUser(id: string): Observable<void> {
  //     const stateDoc = doc(this.firestore, `states/${id}`);
  //     return from(deleteDoc(stateDoc));
  //   }
}
