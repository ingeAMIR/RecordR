import { Component, inject, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EspnService, MatchInfo } from '../../services/espn.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  authService = inject(AuthService);
  espnService = inject(EspnService);
  private router = inject(Router);

  menuOpen = false;
  tickerMatches: MatchInfo[] = [];

  constructor() {
    // Cierra el menú al navegar
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.menuOpen = false;
    });
  }

  ngOnInit() {
    this.espnService.getAllMatches().subscribe(matches => {
      // Prioritize live matches, then recent completed, then upcoming
      const live = matches.filter(m => m.status === 'in');
      const upcoming = matches.filter(m => m.status === 'pre');
      const completed = matches.filter(m => m.completed);
      
      // Take up to 10 matches for the ticker
      let selected = [...live, ...completed.slice(0, 5), ...upcoming.slice(0, 5)];
      // Shuffle or just slice to 10
      this.tickerMatches = selected.slice(0, 10);
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  // Cierra si se hace clic fuera del navbar
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-header')) {
      this.menuOpen = false;
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  }
}
