import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, val: any) {
    if (!!val) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  }

  get(key: string) {
    let value = localStorage.getItem(key);
    if (!!value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  del(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
