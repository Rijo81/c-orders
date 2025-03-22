import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { TypeRequestsI, TypeRI } from 'src/app/models/requests.models';

@Injectable({
  providedIn: 'root'
})
export class TRequestsService {

  private typeRequestsCollection = collection(this.firestore, 'typerequests');
      constructor(private firestore: Firestore) {}

      // Obtener todos los usuarios
      getTypeRequests(): Observable<TypeRI[]> {
        return from(getDocs(this.typeRequestsCollection).then(snapshot =>
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TypeRI))
        ));
      }

      // Agregar usuario
      addTypeRequests(typeR: TypeRI): Observable<void> {
        return from(addDoc(this.typeRequestsCollection, typeR).then(() => {}));
      }

      // Editar usuario
      updateTypeRequests(id: string, typeR: Partial<TypeRequestsI>): Observable<void> {
        const typeRDoc = doc(this.firestore, `typerequests/${id}`);
        return from(updateDoc(typeRDoc, typeR));
      }

      // Eliminar usuario
      deleteTypeRequests(id: string): Observable<void> {
        const typeRDoc = doc(this.firestore, `typerequests/${id}`);
        return from(deleteDoc(typeRDoc));
      }
}
