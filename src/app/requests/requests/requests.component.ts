import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonToolbar, IonHeader, IonTitle, IonButtons, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonItem, IonLabel, IonList, IonInput, IonRadioGroup, IonRadio, IonIcon, IonButton,
  IonCheckbox, IonSelect, IonSelectOption, IonMenuButton } from "@ionic/angular/standalone";
import { TypeRI } from 'src/app/models/requests.models';
import { RequestsService } from 'src/app/services/requests/requests.service';
import { TRequestsService } from 'src/app/services/type-requests/t-requests.service';

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

  constructor(private typeService: TRequestsService, private requestService: RequestsService) {

  }
  ngOnInit() {
    this.loadTypeRequests();
    this.loadRequests();
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

  saveRequest() {
    const newRequest = {
      typeName: this.selectedType?.name,
      group_origin: this.selectedType.group_origin,
      group_destine: this.selectedType.group_destine,
      formData: { ...this.formData }
    };
    this.requestService.addRequests(newRequest);
    //this.requests.push(newRequest);
    this.saveToLocalStorage();
    this.formData = {};
    this.selectedTypeId = null;
  }

  saveToLocalStorage() {
    this.requestService.getRequests().subscribe(type => {
      this.requests = type;
    });

  }

}
