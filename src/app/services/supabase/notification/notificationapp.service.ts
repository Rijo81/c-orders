import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { from, map, Observable } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { Models } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationappService {
  private table = 'push_tokens';
  private readonly firebaseKey = 'AAAAXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // 🔐 Tu Server Key de FCM

  async registerPush() {
    const permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive !== 'granted') {
      throw new Error('Permiso de notificación denegado');
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token: Token) => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (userId) {
        await supabase.from(this.table).insert({
          user_id: userId,
          token: token.value
        });
      }
    });

    PushNotifications.addListener('registrationError', err => {
      console.error('Error en registro de push:', err);
    });
  }

  async sendPushToUser(token: string, title: string, body: string): Promise<void> {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          Authorization: `key=${this.firebaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title,
            body,
            sound: 'default' // 📢 sonido opcional
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al enviar la notificación:', errorText);
      } else {
        console.log('✅ Notificación enviada con éxito');
      }
    } catch (error) {
      console.error('❗ Error inesperado:', error);
    }
  }

  async updateRequestStatus(requestId: string, newStateId: string, newStateName: string) {
    // 1. Actualizar estado
    const { data: updated, error: updateError } = await supabase
      .from('requests')
      .update({ state_id: newStateId })
      .eq('id', requestId)
      .select('user_id') // 👈 Aquí es clave
      .single();

    if (updateError || !updated) {
      console.error('Error al actualizar la solicitud:', updateError);
      return;
    }

    const userId = updated.user_id;

    // 2. Buscar el token de ese usuario
    const { data: tokenData, error: tokenError } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData) {
      console.warn('No se encontró token para notificar');
      return;
    }

    // 3. Enviar notificación (usando función segura de Supabase o tu servicio)
    await this.sendPushToUser(
      tokenData.token,
      'Estado actualizado',
      `Tu solicitud ha sido actualizada a: ${newStateName}`
    );
  }

//   async sendNotification(){
//     // const { data: session } = await supabase.auth.getSession();
//     // const userId = session?.session?.user?.id;

//     const { data: tokenData } = await supabase
//     .from('push_tokens')
//     .select('token')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false })
//     .limit(1)
//     .single();

//     if (tokenData) {
//       await this.sendPushToUser(tokenData.token, 'Solicitud Aprobada', 'Tu acceso ha sido autorizado');
//     }
// }
  // getUnreadNotifications(userId: string): Observable<Models.Notifications.NotificationI[]> {
  //   return from(
  //     supabase
  //       .from(this.table)
  //       .select('*')
  //       .eq('user_id', userId)
  //       .eq('is_read', false)
  //       .order('created_at', { ascending: false })
  //   ).pipe(
  //     map(({ data, error }) => {
  //       if (error) throw error;
  //       return data as Models.Notifications.NotificationI[];
  //     })
  //   );
  // }
}
