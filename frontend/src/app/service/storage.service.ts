import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  del(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
