import { Injectable, Input } from '@angular/core';
import { RolsI } from 'src/app/models/rols.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RolsService {

  private storageKey = 'rols';

  constructor() {}

  async getRols(): Promise<Array<RolsI>> {
    const rols = localStorage.getItem(this.storageKey);
    return rols ? JSON.parse(rols) : [];
  }

  async createRol(rol: RolsI): Promise<RolsI> {
    const rols = await this.getRols();
    rol.id = uuidv4(); // Generar un ID único
    rols.push(rol);
    this.saveToStorage(rols);
    return rol;
  }

  async editRol(id: string, updatedRol: RolsI): Promise<RolsI> {
    console.log('Entra al metodo');
    const rols = await this.getRols();

    const index = rols.findIndex((stat) => stat.id === id);
    if (index !== -1) {
      rols[index] = { ...rols[index], ...updatedRol };
      this.saveToStorage(rols);
      return rols[index];
    }
    throw new Error('Estado no encontrado');
  }

  async deleteRol(id: string): Promise<void> {
    const rols = (await this.getRols()).filter((stat) => stat.id !== id);
    this.saveToStorage(rols);
  }

  private saveToStorage(rols: Array<RolsI>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(rols));
  }
}
