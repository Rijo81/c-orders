import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestI, RequestsI } from 'src/app/models/requests.models';

@Injectable({
  providedIn: 'root'
})
export class ViewreceivedService {

  private req: RequestI[] = [];

  private selectedReq = new BehaviorSubject<RequestI | null>(null);
  selectedReq$ = this.selectedReq.asObservable();


  // addClient(reqData: { name: string; formData: Record<string, any>; group_origin: { id: number; name: string; parentId?: number };
  //   group_destine: { id: number; name: string; parentId?: number };
  //   typeName: string; }) {
  //   const formData = new FormData();
  //   formData.append('name', reqData.name);
  //   formData.append('direction', reqData.direction);
  //   formData.append('phone', reqData.phone);
  //   formData.append('photo', reqData.photo);

  //   const newReq: RequestI = { id: (this.req.length + 1), formData };
  //   this.req.push(newReq);
  // }
  getReq(): RequestI[] {
    return this.req;
  }

  selectClient(req: RequestI) {
    this.selectedReq.next(req);
  }
}
