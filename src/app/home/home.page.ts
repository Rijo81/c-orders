import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonLabel } from '@ionic/angular/standalone';
import { IoniconsService } from '../services/ionicons.service';
import { InteractionService } from '../services/interaction.service';
import { FirestoreService } from '../firebase/firestore.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule],
})
export class HomePage implements OnInit {

  private iconService: IoniconsService = inject(IoniconsService);
  private interationService: InteractionService = inject(InteractionService);
  private firestoreService: FirestoreService = inject(FirestoreService);

  user$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.iconService.loadAllIcons();
    this.text();
  }

  ngOnInit() {
    this.user$ = this.authService.getUser();
    console.log('Esto: ', this.user$);

  }
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth']);
  }

  async text(){
    console.log('text() en funcionamiento');
    await this.firestoreService.createDocument('text prueba', {hola: 'prueba nada'});
  }

  async save(){
    const response = await this.interationService.presentAlert('Importante',`Seguro que deseas <strong>guardar</strong>`, 'Cancelar', 'Aceptar');
    console.log('Response -> ', response);
    if (response) {
      await this.interationService.showLoading('Cargando...');
      setTimeout(() => {
        this.interationService.dismissLoading();
        this.interationService.showToast('Guardado con exito');
      }, 2000);
    }
  }

  listUser(){
    this.router.navigate(['/user']);
  }
}
