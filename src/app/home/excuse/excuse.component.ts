import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonMenuButton, IonButton } from "@ionic/angular/standalone";
import { ConfigScreenExcuseService } from 'src/app/services/supabase/config/config-screen-excuse.service';

@Component({
  selector: 'app-excuse',
  templateUrl: './excuse.component.html',
  styleUrls: ['./excuse.component.scss'],
  standalone: true,
  imports: [ IonContent, IonButtons, IonToolbar, IonTitle, IonHeader, IonMenuButton ]
})
export class ExcuseComponent  implements OnInit {

  datos = {
    image: 'assets/logo.png',
    title: '',
    text: ''
  }

  constructor(private imagenTitleTextService: ConfigScreenExcuseService ) {}

  ngOnInit() {
    this.imagenTitleTextService.imagenActual$.subscribe((url) => {
      this.datos.image = url;
    });
    this.imagenTitleTextService.title$.subscribe(title => this.datos.title = title);
    this.imagenTitleTextService.text$.subscribe(text => this.datos.text = text);
  }

  async seleccionarImagen() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      this.imagenTitleTextService.changeImagenBase64(image.base64String!);
    } catch (err) {
      console.error('No se seleccionó imagen:', err);
    }
  }
}
