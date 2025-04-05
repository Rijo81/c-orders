import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { Models } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationappService {
  private table = 'notifications';

  getUnreadNotifications(userId: string): Observable<Models.Notifications.NotificationI[]> {
    return from(
      supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Models.Notifications.NotificationI[];
      })
    );
  }
}
