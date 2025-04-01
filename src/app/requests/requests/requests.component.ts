import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonToolbar, IonHeader, IonTitle, IonButtons, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonItem, IonLabel, IonList, IonInput, IonRadioGroup, IonRadio, IonIcon, IonButton,
  IonCheckbox, IonSelect, IonSelectOption, IonMenuButton } from "@ionic/angular/standalone";
import { RequestsI, TypeRI } from 'src/app/models/requests.models';
import { RequestsService } from 'src/app/services/requests/requests.service';
import { TRequestsService } from 'src/app/services/type-requests/t-requests.service';
import { supabase } from 'src/app/core/supabase.client';
import { environment } from 'src/environments/environment';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { delay, filter, retry, take, tap } from 'rxjs';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  standalone: true,
  imports: [IonCheckbox, IonButton, IonIcon, IonRadio, IonRadioGroup, IonInput, IonList, IonLabel, IonItem,
    IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonButtons, IonTitle, IonHeader,
    IonToolbar, IonMenuButton, IonSelect, IonSelectOption, ReactiveFormsModule, FormsModule, CommonModule ]
})
export class RequestsComponent  implements OnInit {

  typeRequests: TypeRI[] = [];
  selectedTypeId: string | null = null;
  selectedType: TypeRI | null = null;
  formData: { [key: string]: any } = {};
  requests: any[] = [];
  fields: any[] = [];

  constructor(private typeService: TRequestsService,
              private requestService: RequestsService,
              private authSupabaseService: SupabaseService) {

  }
  ngOnInit() {

    this.authSupabaseService.sessionChanged
    .pipe(
      filter(session => !!session),        // Espera a que la sesión esté lista
      take(1),                              // Solo la primera vez
      tap(() => console.log('Sesión lista')),
      delay(100),                           // Le das un respiro por si Supabase se toma su tiempo
      retry({ count: 3, delay: 1000 })      // Si falla, reintenta hasta 3 veces
    )
    .subscribe(() => {
      this.loadTypeRequests();
      this.loadRequests();
    });
    console.log('No esta pasando nada.... que eeee');
    console.log('Loaded Solicitudes:', this.requests);
    console.log('Loaded Tipo Solicitudes:', this.typeRequests);

  }

  addField(type: string) {
    const newField = {
      name: '',
      type: type,
      photo: '', // Almacenará la ruta de la foto si es de tipo "document"
    };

    this.fields.push(newField);
  }
  loadTypeRequests() {
    this.typeService.getTypeRequests().subscribe(type => {
      this.typeRequests = type;
    });
  }

  loadRequests() {
    this.requestService.getRequests().subscribe(req => {
      this.requests = req;
    });
  }

  onTypeChange() {
    this.selectedType = this.typeRequests.find(type => type.id === this.selectedTypeId) || null;
    this.formData = {};
  }

  clearLocalStorage(){
    localStorage.removeItem('requests');
  }

  onFileChange(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData[fieldName] = reader.result; // Guardamos la base64 del archivo.
      };
      reader.readAsDataURL(file);
    }
  }

  async capturePhoto(index: number) {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // Ruta de la imagen
        source: CameraSource.Camera, // Cámara del dispositivo
        quality: 90, // Calidad de la imagen
      });

      // Guardar la ruta de la foto en el campo correspondiente
      this.fields[index].photo = photo.webPath;
    } catch (error) {
      console.error('Error al capturar la foto', error);
    }
  }

  async saveRequest() {
    if (!this.selectedType) {
      alert('Debe seleccionar un tipo de solicitud.');
      return;
    }

    try {
      // 1. Subir imágenes a Supabase Storage si existen
      for (const key of Object.keys(this.formData)) {
        const value = this.formData[key];

        // Verifica si el valor es una imagen en base64
        if (typeof value === 'string' && value.startsWith('data:image')) {
          const base64Data = value.split(',')[1];
          const contentType = value.split(';')[0].split(':')[1];
          const fileName = `${crypto.randomUUID()}.png`;

          const fileBlob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {
            type: contentType
          });

          const filePath = `requests/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('requests-file').upload(filePath, fileBlob);

          if (uploadError) {
            console.error('Error al subir imagen:', uploadError.message);
            alert('Error al subir imagen.');
            return;
          }

          const publicUrl = `${environment.supabaseUrl}/storage/v1/object/public/requests-file/${filePath}`;
          this.formData[key] = publicUrl;
        }
      }

      // 2. Guardar el request en Supabase DB
      const newRequest: RequestsI = {
        id: crypto.randomUUID(),
        typeName: this.selectedType.name,
        group_origin: this.selectedType.group_origin,
        group_destine: this.selectedType.group_destine,
        formData: { ...this.formData }
      };

      this.requestService.addRequests(newRequest).subscribe({
        next: () => {
          this.loadRequests();
          this.formData = {};
          this.selectedTypeId = null;
          alert('Solicitud guardada correctamente');
        },
        error: (err) => {
          console.error('Error al guardar solicitud:', err);
          alert('Error al guardar solicitud.');
        }
      });

    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Ocurrió un error inesperado al guardar la solicitud.');
    }
  }
  saveToLocalStorage() {
    this.requestService.getRequests().subscribe(type => {
      this.requests = type;
    });

  }
}
