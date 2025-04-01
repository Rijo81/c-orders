import { Injectable } from '@angular/core';
// import { supabase } from 'src/app/core/supabase.client';
import { BehaviorSubject, from, map, Observable, retry } from 'rxjs';
import { RequestI } from 'src/app/models/requests.models';
// import { RequestsI } from 'src/app/models/requests.models';
// import { tick } from '@angular/core/testing';
// import { Models } from 'src/app/models/models';
// import { GroupsI } from 'src/app/models/groups.models';

@Injectable({
  providedIn: 'root'
})
export class ViewreceivedService {

  //private table = { requests: 'requests', users: 'usersapp', group: 'groups' };

    constructor() {}

    // getTypeRequests(): Observable<TypeRI[]> {
    //   return from(
    //     supabase.from(this.table.requests)
    //       .select('*')).pipe(
    //         map(res => {
    //           if (res.error) throw res.error;
    //           return res.data;
    //         }),
    //         retry({ count: 3, delay: 1000 })
    //       );
    // }

    // getRequests(): Observable<RequestsI[]> {
    //   return from(
    //     supabase.from(this.table.requests).select('*')
    //       .then(({ data, error }) => {
    //         if (error) throw error;
    //         return data as RequestsI[];
    //       })
    //   );
    // }

    // getUsers(): Observable<Models.User.UsersI[]> {
    //   return from(
    //     supabase.from(this.table.users).select('*')
    //       .then(({ data, error }) => {
    //         if (error) throw error;
    //         return data as Models.User.UsersI[];
    //       })
    //   );
    // }

    // getGroups(): Observable<GroupsI[]> {
    //   return from(
    //     supabase.from(this.table.group).select('*')
    //       .then(({ data, error }) => {
    //         if (error) throw error;
    //         return data as GroupsI[];
    //       })
    //   );
    // }

    // // Método auxiliar para seleccionar una solicitud
    // private selectedReq: RequestsI | null = null;

    // selectClient(req: RequestsI) {
    //   this.selectedReq = req;
    // }

    // getReq(): RequestsI | null {
    //   return this.selectedReq;
    // }

  // private req: RequestI[] = [];

  // private selectedReq = new BehaviorSubject<RequestI | null>(null);
  // selectedReq$ = this.selectedReq.asObservable();


  // addClient(reqData: { name: string; formData: Record<string, any>; group_origin: { id: number; name: string; parentId?: number };
  //   group_destine: { id: number; name: string; parentId?: number };
  //   typeName: string; }) {
  //   const formData = new FormData();
  //   formData.append('name', reqData.name);
  //   formData.append('direction', reqData.typeName);
  //   formData.append('phone', reqData.group_origin);
  //   formData.append('photo', reqData.photo);

  //   const newReq: RequestI = { id: (this.req.length + 1), formData };
  //   this.req.push(newReq);
  // }
  // getReq(): RequestI[] {
  //   return this.req;
  // }

  // selectClient(req: RequestI) {
  //   this.selectedReq.next(req);
  // }
}
