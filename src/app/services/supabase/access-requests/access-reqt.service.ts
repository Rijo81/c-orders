import { Injectable } from '@angular/core';
import { supabase } from 'src/app/core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AccessReqtService {

  private table = 'access_requests';

  async saveRequest(data: any): Promise<void> {
    const { error } = await supabase.from(this.table).insert([data]);
    if (error) throw error;
  }

   // ✉️ Enviar correo al admin
   async sendAdminNotification(data: any): Promise<void> {
    const payload = {
      service_id: 'tu_service_id',
      template_id: 'admin_template_id',
      user_id: 'tu_user_id_publico',
      template_params: {
        to_name: 'Administrador',
        from_name: data.fullname,
        email: data.email,
        phone: data.phone,
        occupation: data.occupation,
      },
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al notificar al administrador');
  }

  // ✉️ Enviar confirmación al solicitante
  async sendUserConfirmation(data: any): Promise<void> {
    const payload = {
      service_id: 'tu_service_id',
      template_id: 'user_template_id',
      user_id: 'tu_user_id_publico',
      template_params: {
        user_name: data.fullname,
        user_email: data.email
      },
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al notificar al usuario');
  }
  // async sendEmailNotification(data: any): Promise<void> {
  //   const emailPayload = {
  //     service_id: 'tu_service_id',
  //     template_id: 'tu_template_id',
  //     user_id: 'tu_user_id_publico',
  //     template_params: {
  //       to_name: 'Admin',
  //       from_name: data.fullname,
  //       email: data.email,
  //       phone: data.phone,
  //       occupation: data.occupation,
  //     },
  //   };

  //   const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(emailPayload)
  //   });

  //   if (!res.ok) {
  //     throw new Error('Error enviando el correo');
  //   }
  // }
}
