import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { GroupsI } from 'src/app/models/groups.models';
import { TypeRequestsI } from 'src/app/models/requests.models';
@Component({
  selector: 'app-typerequests',
  templateUrl: './typerequests.component.html',
  styleUrls: ['./typerequests.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCard,
    IonCardHeader,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    FormsModule,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    IonMenuButton,
    CommonModule,
  ], // import the necessary components here
})
export class TyperequestsComponent implements OnInit {
  typeRequestForm: FormGroup;
  typeRequests: TypeRequestsI[] = [];
  groups: GroupsI[] = [];

  constructor(private fb: FormBuilder) {
    // Inicialización del formulario reactivo
    this.typeRequestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      group_origin: [null, Validators.required],
      group_destine: [null, Validators.required],
      fields: this.fb.array([]),
    });
    this.loadTypeRequests();
  }

  ngOnInit() {
    const savedGroups = localStorage.getItem('groups');

    if (savedGroups) {
      this.groups = JSON.parse(savedGroups);
    }
  }

  // Getter para el array de campos
  get fields(): FormArray {
    return this.typeRequestForm.get('fields') as FormArray;
  }

  getString(obj: any) {
    console.log(obj.value);
    return JSON.stringify(obj.value);
  }
  // Añadir un nuevo campo dinámico
  addField() {
    const fieldGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      options: this.fb.array([]), // Agregar FormArray para opciones si es necesario
    });

    this.fields.push(fieldGroup);
  }

  // Eliminar un campo dinámico
  removeField(index: number) {
    this.fields.removeAt(index);
  }

  // Manejo del cambio de tipo de campo
  onFieldTypeChange(index: number) {
    const fields = this.typeRequestForm.get('fields') as FormArray;
    const field = fields.at(index) as FormGroup;

    if (
      ['radiobutton', 'lista', 'checkbox'].includes(field.get('type')?.value)
    ) {
      if (!field.get('options')) {
        field.addControl('options', this.fb.array([])); // Agregar FormArray de opciones
      }
    } else {
      if (field.get('options')) {
        field.removeControl('options'); // Eliminar FormArray de opciones
      }
    }
  }

  // Añadir una opción a un campo específico
  addOption(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    // options.push(this.fb.control('')); // Agrega una nueva opción vacía
    // options.push(this.fb.control('', Validators.required));
    options.push(this.fb.group({
      name: ['', Validators.required]
    }))

  }

  // Eliminar una opción de un campo específico
  removeOption(fieldIndex: number, optionIndex: number) {
    const fields = this.typeRequestForm.get('fields') as FormArray;
    const options = fields.at(fieldIndex).get('options') as FormArray;
    options.removeAt(optionIndex); // Elimina la opción seleccionada
    // const options = this.getOptions(fieldIndex);
    // options.removeAt(optionIndex);
  }

  // Obtener el array de opciones para un campo
  getOptions(fieldIndex: number): FormArray {
    return this.fields.at(fieldIndex).get('options') as FormArray;
  }

  // Guardar el tipo de solicitud

  addTypeRequest() {
    console.log('saveTypeRequest: ', this.typeRequestForm);

    if (this.typeRequestForm.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const newTypeRequest: TypeRequestsI = {
      id: Date.now(),
      ...this.typeRequestForm.value,
    };
    console.log(newTypeRequest);

    // Verificar unicidad de nombres de campos
    const fieldNames = newTypeRequest.fields.map(
      (field) => field.name?.trim() || ''
    );
    console.log('ver valores: ', fieldNames);

    if (new Set(fieldNames).size !== fieldNames.length) {
      alert('Los nombres de los campos deben ser únicos.');
      return;
    }

    this.typeRequests.push(newTypeRequest);
    this.saveToLocalStorage();
    this.typeRequestForm.reset();
    this.fields.clear();
  }

  saveTypeRequest() {
    console.log('saveTypeRequest: ', this.typeRequestForm);

    if (this.typeRequestForm.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const newTypeRequest: TypeRequestsI = {
      id: Date.now(),
      ...this.typeRequestForm.value,
    };
    console.log(newTypeRequest);

    // Verificar unicidad de nombres de campos
    const fieldNames = newTypeRequest.fields.map(
      (field) => field.name?.trim() || ''
    );
    console.log('ver valores: ', fieldNames);

    if (new Set(fieldNames).size !== fieldNames.length) {
      alert('Los nombres de los campos deben ser únicos.');
      return;
    }

    this.typeRequests.push(newTypeRequest);
    this.saveToLocalStorage();
    this.typeRequestForm.reset();
    this.fields.clear();
  }

  // Cargar tipos de solicitudes desde LocalStorage
  loadTypeRequests() {
    const stored = localStorage.getItem('requestTypes');
    if (stored) {
      this.typeRequests = JSON.parse(stored);
    }
  }

  // Guardar tipos de solicitudes en LocalStorage
  saveToLocalStorage() {
    localStorage.setItem('requestTypes', JSON.stringify(this.typeRequests));
  }
}
