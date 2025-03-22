import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {  GroupsI } from 'src/app/models/groups.models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudGroupsService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtener todos los grupos
  async getGroups() {
    const { data, error } = await this.supabase.from('groups').select('*');
    if (error) throw error;
    return data;
  }

  // Obtener un grupo por ID
  async getGroupById(id: string) {
    const { data, error } = await this.supabase.from('groups').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  // Crear un nuevo grupo
  async addGroup(groups: GroupsI) {
    const { data, error } = await this.supabase.from('groups').insert([{ groups }]);
    console.log(groups);

    console.log(data);

    if (error) throw error;
    return data;
  }

  // Actualizar un grupo
  //async updateGroup(id: string, name: string, parentId?: string) {
  async updateGroup(id: string, group: GroupsI) {
    const { data, error } = await this.supabase.from('groups').update({ group }).eq('id', id);
    if (error) throw error;
    return data;
  }

  // Eliminar un grupo
  async deleteGroup(id: string) {
    const { data, error } = await this.supabase.from('groups').delete().eq('id', id);
    if (error) throw error;
    return data;
  }
}
