import { Injectable } from '@angular/core';
import { supabase } from 'src/app/core/supabase.client';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';
import type { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class AccessReqtService {

  private table = 'access_requests';

  async saveRequest(data: any): Promise<void> {
    const { error } = await supabase.from(this.table).insert([data]);
    if (error) throw error;
  }

  sendMailToUser(data: any, message: string, institute: string): Promise<EmailJSResponseStatus> {
    return emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateIdUser,
      {
        to_name: data.fullname,
        to_email: data.email,
        message,
        institute
      },
      environment.emailjs.publicKey
    );
  }

  sendMailToAdmin(data: any): Promise<EmailJSResponseStatus> {
    const time = Date.now();

    return emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateIdAdmin,
      {
        user_name: data.fullname,
        user_email: data.email,
        user_phone: data.phone,
        user_group: data.group,
        time
      },
      environment.emailjs.publicKey
    );
  }

   // ✉️ Enviar correo al admin
  //  async sendAdminNotification(data: any): Promise<void> {
  //   const payload = {
  //     service_id: environment.emailjsServiceId,
  //     template_id: environment.emailjsTemplateId,
  //     user_id: environment.emailjsUserId,
  //     template_params: {
  //       to_name: 'Administrador',
  //       from_name: data.fullname,
  //       email: data.email,
  //       phone: data.phone,
  //       occupation: data.occupation,
  //     },
  //   };

  //   const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!res.ok) throw new Error('Error al notificar al administrador');
  // }

  // // ✉️ Enviar confirmación al solicitante
  // async sendUserConfirmation(data: any): Promise<void> {
  //   const payload = {
  //     service_id: 'tu_service_id',
  //     template_id: 'user_template_id',
  //     user_id: 'tu_user_id_publico',
  //     template_params: {
  //       user_name: data.fullname,
  //       user_email: data.email
  //     },
  //   };

  //   const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!res.ok) throw new Error('Error al notificar al usuario');
  // }
}
