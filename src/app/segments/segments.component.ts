import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild} from '@angular/core';

import {  IonTitle, IonButtons, IonToolbar, IonHeader, IonPopover, IonAvatar, IonIcon,
  IonFab, IonFabButton, IonContent, IonLabel, IonSegment, IonSegmentButton, IonMenuButton } from '@ionic/angular/standalone';
import { AlertController, ItemReorderEventDetail } from '@ionic/angular';
import { Router } from '@angular/router';
//import { UserService } from '../services/user/user.service';
import { AppointmentStateModelI } from '../models/state.models';
import { CategoriesI } from '../models/category.models';
import { FirestoreService } from '../firebase/firestore.service';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
  standalone: true,
  imports: [ IonTitle, IonButtons, IonToolbar, IonHeader, IonPopover, IonAvatar, IonIcon,
    IonFab, IonFabButton, IonContent, IonLabel, IonSegment, IonSegmentButton, CommonModule,
    FormsModule, IonMenuButton ]
})

export class SegmentsComponent  implements OnInit {

  constructor() {}

  ngOnInit() { console.log('Principal');
   }
}

