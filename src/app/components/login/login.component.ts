// Angular
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Rxjs
import { Subject, takeUntil } from 'rxjs';
//PrimeNg
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
// Translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Services
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, ToastModule, CardModule, TranslateModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  /** loginForm */
  loginForm: FormGroup = this.fb.group({
    email: ['admin@test.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(7)]]
  });

  /** wrongCredentials */
  wrongCredentials: boolean = false;
  /** destroy$ */
  private destroy$ = new Subject<void>(); // Subject for unsubscribing

  /**
   * Constructor
   * @param authService
   * @param messageService
   * @param translate
   */
  constructor(private authService: AuthService, private messageService: MessageService, private translate: TranslateService) { }

  /** login */
  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password);
    this.authService.isAuthenticated().pipe(takeUntil(this.destroy$)).subscribe((isAuth) => {
      if (isAuth) {
        this.wrongCredentials = false;
        this.router.navigate(['/users']);
      } else {
        this.wrongCredentials = true;
        this.messageService.add({ severity: 'error', summary: this.translate.instant('ErrorOccurred'), detail: this.translate.instant('WrongCredentials') });
      }
    });
  }
}
