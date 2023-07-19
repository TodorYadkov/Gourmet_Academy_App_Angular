import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Check if in the localStorage has theme variable or get default
  private _theme: string = localStorage.getItem('theme') || 'light';
  
  constructor() { }

  // return theme
  get theme(): string {
    return localStorage.getItem('theme') || this._theme;
  }

  // save new theme
  set theme(newThemeType: string) {
    this._theme = newThemeType;
    localStorage.setItem('theme', this._theme);
  }
}
