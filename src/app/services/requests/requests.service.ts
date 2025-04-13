import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { RequestsI } from 'src/app/models/requests.models';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private table = 'requests';

  getRequests(): Observable<RequestsI[]> {
    return from(
      supabase
        .from(this.table)
        .select('*, group_destine(*), group_origin(*)')
    ).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return res.data;
      })
    );
  }

  addRequests(req: RequestsI): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .insert([req])
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  updateRequests(id: string, req: Partial<RequestsI>): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .update(req)
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  deleteRequests(id: string): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
  getRequestsByUser(userId: string): Observable<RequestsI[]> {
    return from(
      supabase
        .from(this.table) // 👈 Cambia por el nombre de tu tabla
        .select('*')
        .eq('user_id', userId) // 👈 Asume que hay un campo user_id
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as RequestsI[];
      })
    );
  }

  async getRequestsByUserForState(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('id, typeName, created_at, state_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener solicitudes:', error.message);
      return [];
    }

    return data || [];
  }

  async getRequestById(id: string): Promise<RequestsI | null> {
    return await supabase
      .from('requests')
      .select('*, state_id(*)') // incluye relación
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        return data as RequestsI;
      });
  }

  async updateRequestState(id: string, state_id: string): Promise<void> {
    return await supabase
      .from('requests')
      .update({ state_id })
      .eq('id', id)
      .select('user_id')
      .then(({ error }) => {
        if (error) throw error;
      });
  }
}
