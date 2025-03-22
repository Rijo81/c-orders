import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstoreService {

  constructor() {}

  // Guardar un valor en LocalStorage
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener un valor de LocalStorage
  get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  // Eliminar un valor de LocalStorage
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Obtener todos los valores de LocalStorage
  getAll(): Record<string, any> {
    const items: Record<string, any> = {};
    Object.keys(localStorage).forEach((key) => {
      items[key] = this.get(key);
    });
    return items;
  }
}
