import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigScreenExcuseService {

  private readonly STORAGE_KEYS = {
    image: 'imagenCentral',
    title: 'title',
    text: 'text'
  };

  private imageSubject = new BehaviorSubject<string>(
    localStorage.getItem(this.STORAGE_KEYS.image) || 'assets/logo.png'
  );

  private titleSubject = new BehaviorSubject<string>(
    localStorage.getItem(this.STORAGE_KEYS.title) || 'Bienvenido al Sistema'
  );
  private textSubject = new BehaviorSubject<string>(
    localStorage.getItem(this.STORAGE_KEYS.text) || 'Santo Domingo, RD'
  );

  imagenActual$ = this.imageSubject.asObservable();
  title$ = this.titleSubject.asObservable();
  text$ = this.textSubject.asObservable();

  changeImage(newUrl: string) {
    localStorage.setItem(this.STORAGE_KEYS.image, newUrl);
    this.imageSubject.next(newUrl);
  }

  getImagenActual(): string {
    return this.imageSubject.value;
  }

  changeImagenBase64(base64Data: string) {
    const base64Url = `data:image/jpeg;base64,${base64Data}`;
    localStorage.setItem(this.STORAGE_KEYS.image, base64Url);
    this.imageSubject.next(base64Url);
  }

  changeTitle(newTitle: string) {
    localStorage.setItem(this.STORAGE_KEYS.title, newTitle);
    this.titleSubject.next(newTitle);
  }

  changeText(newText: string) {
    localStorage.setItem(this.STORAGE_KEYS.text, newText);
    this.textSubject.next(newText);
  }
}
