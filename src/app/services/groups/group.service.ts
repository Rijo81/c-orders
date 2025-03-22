import { Injectable } from '@angular/core';
import { GroupsI } from 'src/app/models/groups.models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

    countId: number = 0;
    private storageKey = 'groups';

    constructor() {}

    async getGrops(): Promise<Array<GroupsI>> {
      const groups = localStorage.getItem(this.storageKey);
      return groups ? JSON.parse(groups) : [];
    }

    async createGroup(group: GroupsI): Promise<GroupsI> {

      const groups = await this.getGrops();
      //generar el ID del category
      const newId = groups.length > 0
      ? Math.max(...groups.map(cat => cat.id || 0)) + 1
      : 1;
      group.id = newId; // Generar un ID único
      groups.push(group);
      this.saveToStorage(groups);
      return group;
    }

    async editGroup(id: number, updateGroup: GroupsI): Promise<GroupsI> {
      console.log('Entra al metodo');
      const groups = await this.getGrops();
      const index = groups.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        groups[index] = { ...groups[index], ...updateGroup };
        this.saveToStorage(groups);
        return groups[index];
      }
      throw new Error('Grupo no encontrado...');
    }

    async deleteGroup(id: number): Promise<void> {
      const groups = (await this.getGrops()).filter((cat) => cat.id !== id);
      this.saveToStorage(groups);
    }

    private saveToStorage(groups: Array<GroupsI>): void {
      localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }
}
