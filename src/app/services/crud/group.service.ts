import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { GroupsI } from 'src/app/models/groups.models';
import { environment } from 'src/environments/environment';
// import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
// import { from, Observable } from 'rxjs';
// import { GroupsI } from 'src/app/models/groups.models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtener todos los grupos
  getGroups(): Observable<GroupsI[]> {
    return from(
      this.supabase
        .from('groups')
        .select('*')
        .order('name', { ascending: true }) // opcional
        .then(({ data, error }) => {
          if (error) throw error;
          return data as GroupsI[];
        })
    );
  }

  // Agregar grupo
  addGroup(group: GroupsI): Observable<any> {
    return from(
      this.supabase
        .from('groups')
        .insert([{ name: group.name, parentid: group.parentId || null }])
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  // Actualizar grupo
  updateGroup(id: string, group: Partial<GroupsI>): Observable<any> {
    return from(
      this.supabase
        .from('groups')
        .update({ name: group.name, parentid: group.parentId || null })
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  // Eliminar grupo
  deleteGroup(id: string): Observable<any> {
    return from(
      this.supabase
        .from('groups')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  // private groupsCollection = collection(this.firestore, 'groups');
  //     constructor(private firestore: Firestore) {}

  //     // Obtener todos los usuarios
  //     getGroups(): Observable<GroupsI[]> {
  //       return from(getDocs(this.groupsCollection).then(snapshot =>
  //         snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupsI))
  //       ));
  //     }

  //     // Agregar usuario
  //     addGroup(group: GroupsI): Observable<void> {
  //       return from(addDoc(this.groupsCollection, group).then(() => {}));
  //     }

  //     // Editar usuario
  //     updateGroup(id: string, group: Partial<GroupsI>): Observable<void> {
  //       const groupDoc = doc(this.firestore, `groups/${id}`);
  //       return from(updateDoc(groupDoc, group));
  //     }

  //     // Eliminar usuario
  //     deleteGroup(id: string): Observable<void> {
  //       const groupDoc = doc(this.firestore, `groups/${id}`);
  //       return from(deleteDoc(groupDoc));
  //     }
}
