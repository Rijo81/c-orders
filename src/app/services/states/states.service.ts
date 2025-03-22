
import { Injectable } from '@angular/core';
import { AppointmentStateModelI } from 'src/app/models/state.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  private storageKey = 'states';

  constructor() {}

  async getState(): Promise<Array<AppointmentStateModelI>> {
    const states = localStorage.getItem(this.storageKey);
    return states ? JSON.parse(states) : [];
  }

  async createState(state: AppointmentStateModelI): Promise<AppointmentStateModelI> {
    const states = await this.getState();
    state.id = uuidv4(); // Generar un ID único
    states.push(state);
    this.saveToStorage(states);
    return state;
  }

  probarDatos(id: string, dataState: AppointmentStateModelI){
    console.log('Datos recibidos: ');
    console.log("ID: ", id);
    console.log('Nombre: ', dataState);
  }

  async editState(id: string, updatedState: AppointmentStateModelI): Promise<AppointmentStateModelI> {
    console.log('Entra al metodo');
    const states = await this.getState();

    const index = states.findIndex((stat) => stat.id === id);
    if (index !== -1) {
      states[index] = { ...states[index], ...updatedState };
      this.saveToStorage(states);
      return states[index];
    }
    throw new Error('Estado no encontrado');
  }

  async deleteState(id: string): Promise<void> {
    const states = (await this.getState()).filter((stat) => stat.id !== id);
    this.saveToStorage(states);
  }

  private saveToStorage(states: Array<AppointmentStateModelI>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(states));
  }
}


