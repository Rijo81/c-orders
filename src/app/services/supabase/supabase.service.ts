import { Injectable } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';
import { BehaviorSubject, catchError, from, map, Observable, throwError } from 'rxjs';
import { supabase } from 'src/app/core/supabase.client';
import { Models } from 'src/app/models/models';
import { RolsI } from 'src/app/models/rols.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  sessionChanged = new BehaviorSubject<Session | null>(null);

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      this.sessionChanged.next(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionChanged.next(session);
    });
  }

  getSupabase() {
    return supabase;
  }

  // Método para registrar un usuario
  async signUp(name: string, email: string, password: string, rol: string, group_id: string, photo: File) {
    try {
      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (!photo) {
        return console.error("Error: No se seleccionó ninguna imagen.");;
      }
      // Subir la imagen al Storage
      const photoPath = `users/${data.user?.id}/${photo.name}`;
      console.log('Datos a insertar: ', photoPath);

      const { error: uploadError } = await supabase.storage.from('devsoftimg').upload(photoPath, photo);

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError.message);
        throw uploadError;
      }

      const photoUrl = `${environment.supabaseUrl}/storage/v1/object/public/devsoftimg/${photoPath}`;

      // Guardar los datos en la tabla `usuarios`
      console.log('ID: ', data.user.id);
      //const groupIdFinal = Array.isArray(group_id) ? group_id[0] : group_id;
      group_id = group_id.toString();
      const { error: dbError } = await supabase.from('usersapp').insert([
        { id: data.user?.id, name, email, rol, group_id, photo: photoUrl }
      ]);

      if (dbError) {
        console.error("Error al insertar en usersapp:", dbError.message);
        throw dbError;
      }
      return data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  }

  // Método para iniciar sesión
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    }
  }

  async startSession(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<{ data: { user: User | null }, error: any }> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error obteniendo usuario actual:', error);
        return { data: { user: null }, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Excepción al obtener usuario:', error);
      return { data: { user: null }, error };
    }
  }

  // getAllUsers(): Observable<Models.User.UsersI[]> {
  //   return from(
  //     supabase
  //       .from('usersapp')
  //       .select('*') // Puedes poner campos específicos si quieres limitar los datos
  //   ).pipe(
  //     catchError((error) => {
  //       console.error('Error al obtener los usuarios:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  getUserByGroupId(group_id: string): Observable<any> {
    return from(
      supabase
        .from('usersapp')
        .select('*') // puedes limitarlo si solo quieres: 'id, name, group_id'
        .eq('group_id', group_id)
        .single()
    ).pipe(
      catchError((error) => {
        console.error('Error al obtener el usuario:', error);
        return throwError(() => error);
      })
    );
  }
  getAllUsers1(): Observable<any> {
    return from(
      supabase
        .from('usersapp')
        .select('*')
    ).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as Models.User.UsersI[];
      }),
      catchError((error) => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(() => error);
      })
    );
  }
  async getUserAppData(): Promise<Models.User.UsersI | null> {
    const { data: sessionData, error } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) return null;

    const { data, error: err } = await supabase
      .from('usersapp')
      .select('*')
      .eq('id', userId) // o como sea que hayas llamado ese campo relacionado
      .single();

    return data ?? null;
  }

  async getUserAppDataRol(): Promise<Models.User.UsersI | null>{

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return null;

    const { data, error } = await supabase
      .from('usersapp')
      .select('*, group_id(*)') // 👈 esto es clave
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }

    return data ?? null;
  }
  getUserData(): Observable<Models.User.UsersI | null> {
    return from(
      supabase.auth.getUser().then(async ({ data, error }) => {
        if (error || !data.user) return null;

        const { data: userData, error: fetchError } = await supabase
          .from('usersapp')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (fetchError) throw fetchError;
        return userData as Models.User.UsersI;
      })
    );
  }

  // Obtener datos del usuario actual
  async getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
    if (error) throw error;

    return data;
  }
  //Metodo para mantener la session.
  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  }

  // Método para cerrar sesión
  async signOut() {
    await supabase.auth.signOut();
  }
  clearSession() {
    this.sessionChanged.next(null);
  }


  getSessionObservable() {
    return this.sessionChanged.asObservable();
  }

  getCurrentSession() {
    return this.sessionChanged.value;
  }
}
