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
  activeTab = 'opinions';

  // Mock data for V2 Redesign
  reviews = [
    {date:'12 MAY',m:'Real Madrid 2-3 Barcelona',l:'LALIGA',r:9.4,t:'Una noche para el recuerdo. El medio del Barça desarmó completamente al Madrid en la segunda parte. Pedri estuvo magistral y Yamal sigue siendo de otro planeta.',l_:84,c:23},
    {date:'08 MAY',m:'Arsenal 2-1 Tottenham',l:'PREMIER',r:8.6,t:'Saka decidió el derbi del norte. Atmósfera espectacular en el Emirates. Postecoglou tiene mucho que pensar.',l_:42,c:11},
    {date:'04 MAY',m:'Bayern 4-2 Dortmund',l:'BUNDESLIGA',r:7.9,t:'Goleada y festival ofensivo. Kane sigue facturando como si jugara en Anfield.',l_:67,c:18},
    {date:'01 MAY',m:'Inter 2-4 Juventus',l:'SERIE A',r:8.8,t:'Vlahovic firmó un triplete para enmarcar. La defensa del Inter, ausente.',l_:54,c:14},
  ];

  favoritePlayers = [
    {n:'Jude Bellingham',v:9.4},
    {n:'Vinicius Jr.',v:9.0},
    {n:'Kylian Mbappé',v:8.6},
    {n:'Federico Valverde',v:8.4},
  ];

  ratingDist = [
    {r:'9-10',c:24,p:90},
    {r:'7-8',c:42,p:75},
    {r:'5-6',c:18,p:30},
    {r:'1-4',c:5,p:8}
  ];

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

