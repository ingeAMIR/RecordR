import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  profileForm!: FormGroup;
  isEditing = false;
  loading = false;
  error = '';
  success = '';
  selectedFile: File | null = null;

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  toggleEdit(user: User) {
    this.isEditing = !this.isEditing;
    this.error = '';
    this.success = '';
    this.selectedFile = null;
    if (this.isEditing) {
      this.profileForm.patchValue({
        username: user.username,
        email: user.email
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveProfile(user: User) {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = new FormData();
    formData.append('username', this.profileForm.get('username')?.value);
    formData.append('email', this.profileForm.get('email')?.value);
    
    if (this.selectedFile) {
      formData.append('avatarFile', this.selectedFile);
    } else if (user.avatar) {
      formData.append('avatar', user.avatar); // keep existing URL if no new file
    }

    this.authService.updateProfile(user.id, formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.isEditing = false;
        this.success = 'Perfil actualizado con éxito.';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'No se pudo actualizar el perfil.';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

