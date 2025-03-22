import { Component, OnInit } from '@angular/core';
import { RequestI } from 'src/app/models/requests.models';
import { ViewreceivedService } from 'src/app/services/recevied/viewreceived.service';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonContent, IonTitle } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewreceived',
  templateUrl: './viewreceived.component.html',
  styleUrls: ['./viewreceived.component.scss'],
  standalone: true,
  imports: [IonTitle, IonContent, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonBackButton,
    IonButtons, IonToolbar, IonHeader, FormsModule, CommonModule]
})
export class ViewreceivedComponent  implements OnInit {

  req: RequestI | null = null;
  constructor( private reqViewService: ViewreceivedService) { }

  ngOnInit() {
    console.log('En constructor');
    this.reqViewService.selectedReq$.subscribe(res => {
      this.req = res;
      console.log('Recibido: ', this.req);
      // TODO: Obtener los datos del request y mostrarlos en la vista
    })
  }

}
