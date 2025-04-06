import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InteractionService } from 'src/app/services/interaction.service';
import { AccessReqtService } from 'src/app/services/supabase/access-requests/access-reqt.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonInput, IonButton, IonButtons,
  IonBackButton, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GroupsI } from 'src/app/models/groups.models';
import { GroupService } from 'src/app/services/crud/group.service';

@Component({
  selector: 'app-access-reqt',
  templateUrl: './access-reqt.component.html',
  styleUrls: ['./access-reqt.component.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonButton, IonInput, IonItem, IonLabel, IonContent, IonTitle, IonToolbar, IonHeader,
    ReactiveFormsModule, CommonModule, IonSelect, IonSelectOption  ]
})
export class AccessReqtComponent implements OnInit {

  accessForm: FormGroup;
  groups: GroupsI[] = [];

  constructor(
    private fb: FormBuilder,
    private accessService: AccessReqtService,
    private router: Router,
    private groupService: GroupService,
    private interaction: InteractionService
  ) {
    this.accessForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      group: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.loadGroups();
  }
  async submitRequest() {
    if (this.accessForm.invalid) return;

    const formData = this.accessForm.value;

    try {
      await this.accessService.saveRequest(formData);
      // await this.accessService.sendAdminNotification(formData);
      // await this.accessService.sendUserConfirmation(formData); // 👈 correo al solicitante

      this.interaction.showToast('✅ Solicitud enviada correctamente');
      this.goLogin();
      this.accessForm.reset();
    } catch (err) {
      console.error('❌ Error al enviar la solicitud:', err);
      this.interaction.showToast('❌ Error al enviar la solicitud');
    }
  }

  loadGroups(){
    this.groupService.getGroups().subscribe(group => {
      this.groups = group;
    });
  }
  goLogin(){
    this.router.navigate(['/auth']);
  }

}
