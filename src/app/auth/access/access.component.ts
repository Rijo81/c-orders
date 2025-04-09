import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonModal, IonButton, IonItem,
  IonInput, IonSearchbar, IonList, IonIcon, IonFabButton, IonFab, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon, IonList, IonSearchbar, IonInput, IonItem, IonButton, IonModal,
    IonLabel, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, ReactiveFormsModule, CommonModule,
  IonMenuButton ]
})
export class AccessComponent  implements OnInit {

  constructor() { }

  ngOnInit() {console.log('Work');
  }

}
