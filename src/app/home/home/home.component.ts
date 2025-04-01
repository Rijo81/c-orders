import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton ]
})
export class HomeComponent  implements OnInit {

  constructor() { }

  ngOnInit() { console.log('Inicio');
  }

}
