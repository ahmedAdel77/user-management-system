// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Rxjs
import { Subject, takeUntil } from 'rxjs';
// Translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// PrimeNg
import { MenubarModule } from "primeng/menubar";
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
// Services
import { AuthService } from '../../services/auth.service';
// Models
import { AuthUser } from '../../models/authUser.model';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, FormsModule, ButtonModule, TranslateModule, SelectModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  /** languages
   * @type Array
   */
  languages: { code: string, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];
  /** currentLang */
  currentLang!: { code: string, name: string } | undefined;
  /** userName */
  userName!: string;
  /** user */
  user!: AuthUser | null;
  /** menuOpen */
  menuOpen = false;
  /** destroy$ */
  private destroy$ = new Subject<void>(); // Subject for unsubscribing

  /** Constructor
   * @param authService
   * @param translate
   * @param router
   */
  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) { }
  /** ngOnInit lifecycle hook */
  ngOnInit(): void {
    this.currentLang = this.languages.find(lang => this.translate.currentLang === lang.code);
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
    });
  }

  /** changeLanguage */
  changeLanguage({ code, name }: { code: string, name: string }) {
    this.translate.use(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  }

  /** logout */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** toggleMenu */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /** ngOnDestroy lifecycle hook */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
