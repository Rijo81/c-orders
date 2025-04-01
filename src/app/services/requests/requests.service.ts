import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { RequestsI } from 'src/app/models/requests.models';
// import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
// import { from, Observable } from 'rxjs';
// import { RequestsI } from 'src/app/models/requests.models';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private table = 'requestss';

  getRequests(): Observable<RequestsI[]> {
    return from(
      supabase
        .from(this.table)
        .select('*, group_destine(*), group_origin(*)')
    ).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return res.data;
      })
    );
  }

  addRequests(req: RequestsI): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .insert([req])
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  updateRequests(id: string, req: Partial<RequestsI>): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .update(req)
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  deleteRequests(id: string): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  //  private requestsCollection = collection(this.firestore, 'requests');
  //       constructor(private firestore: Firestore) {}

  //       // Obtener todos los usuarios
  //       getRequests(): Observable<RequestsI[]> {
  //         return from(getDocs(this.requestsCollection).then(snapshot =>
  //           snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequestsI))
  //         ));
  //       }

  //       // Agregar usuario
  //       addRequests(req: RequestsI): Observable<void> {
  //         return from(addDoc(this.requestsCollection, req).then(() => {}));
  //       }

  //       // Editar usuario
  //       updateRequests(id: string, req: Partial<RequestsI>): Observable<void> {
  //         const reqDoc = doc(this.firestore, `requests/${id}`);
  //         return from(updateDoc(reqDoc, req));
  //       }

  //       // Eliminar usuario
  //       deleteRequests(id: string): Observable<void> {
  //         const reqDoc = doc(this.firestore, `requests/${id}`);
  //         return from(deleteDoc(reqDoc));
  //       }
}
