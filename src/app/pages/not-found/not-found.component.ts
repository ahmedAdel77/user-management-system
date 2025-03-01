// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// PrimeNg
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [ButtonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  /**
   * constructor
   * @param router
   */
  constructor(private router: Router) { }

  /** goHome */
  goHome() {
    this.router.navigate(['/']);
  }
}
