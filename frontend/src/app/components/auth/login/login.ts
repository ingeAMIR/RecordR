import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'google' in window) {
      google.accounts.id.initialize({
        client_id: 'TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com', // Replace with real ID
        callback: this.handleGoogleLogin.bind(this)
      });
      google.accounts.id.renderButton(
        document.getElementById('google-btn-container'), // Note: In case we want native button
        { theme: 'outline', size: 'large' }
      );
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']); // Redirect to home on success
      },
      error: (err) => {
        this.error = err.error?.error || 'Inicio de sesión fallido';
        this.loading = false;
      }
    });
  }

  onGoogleLogin() {
    if (typeof window !== 'undefined' && 'google' in window) {
      google.accounts.id.prompt(); // shows OneTap prompt
    } else {
      console.log('Google Identity Services script not available');
    }
  }

  handleGoogleLogin(response: any) {
    if (response.credential) {
      // Decode JWT token without library
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      const googleData = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture
      };

      this.loading = true;
      this.authService.googleLogin(googleData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'No se pudo iniciar sesión con Google';
          this.loading = false;
        }
      });
    }
  }
}
