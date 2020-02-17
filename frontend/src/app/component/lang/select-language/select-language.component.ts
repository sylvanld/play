import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {
  private _lang: 'EN' | 'FR' = 'EN';
  selectedLanguage = {
    code: 'EN',
    name: 'English',
    flag: '/assets/flags/EN.svg'
  };

  @Input()
  set lang(lang: 'EN' | 'FR') {
    // TODO: use a subject instead of this
    this._lang = lang;

    this.selectedLanguage = this.languages.filter(
      language => language.code === this.lang
    )[0];

    this.langChange.next(this._lang);
  }
  get lang() {
    return this._lang;
  }

  @Output() langChange = new EventEmitter();

  languages = [
    {
      code: 'EN',
      name: 'English',
      flag: '/assets/flags/EN.svg'
    },
    {
      code: 'FR',
      name: 'Français',
      flag: '/assets/flags/FR.svg'
    }
  ];

  constructor() { }

  ngOnInit() {
    //this.lang = 'EN';
  }
}
