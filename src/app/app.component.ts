// Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Translate
import { TranslateModule, TranslateService } from "@ngx-translate/core";
// Components
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /**
   * constructor
   * @param translate
   */
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
