import { Injectable } from '@angular/core';
import { CategoriesI } from 'src/app/models/category.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  countId: number = 0;
  private storageKey = 'categories';

  constructor() {}

  async getCategories(): Promise<Array<CategoriesI>> {
    const categories = localStorage.getItem(this.storageKey);
    return categories ? JSON.parse(categories) : [];
  }

  async createCategory(category: CategoriesI): Promise<CategoriesI> {

    const categories = await this.getCategories();
    //generar el ID del category
    console.log(categories);
    const newId = categories.length > 0
    ? Math.max(...categories.map(cat => cat.id || 0)) + 1
    : 1;
    category.id = newId; // Generar un ID único
    categories.push(category);
    this.saveToStorage(categories);
    return category;
  }

  async editCategory(id: number, updatedState: CategoriesI): Promise<CategoriesI> {
    console.log('Entra al metodo');
    const categories = await this.getCategories();
    const index = categories.findIndex((cat) => cat.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedState };
      this.saveToStorage(categories);
      return categories[index];
    }
    throw new Error('Categoria no encontrada');
  }

  async deleteCategory(id: number): Promise<void> {
    const categories = (await this.getCategories()).filter((cat) => cat.id !== id);
    this.saveToStorage(categories);
  }

  private saveToStorage(categories: Array<CategoriesI>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
  }
}
