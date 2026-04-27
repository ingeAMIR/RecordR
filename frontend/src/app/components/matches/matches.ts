import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EspnService, MatchInfo } from '../../services/espn.service';

interface SportTab {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './matches.html',
  styleUrl: './matches.scss'
})
export class MatchesComponent implements OnInit {
  matches: MatchInfo[] = [];
  filteredMatches: MatchInfo[] = [];
  activeFilter: string = 'all';
  activeLeague: string = 'all';
  activeSport: string = 'all';
  loading = true;
  error = false;

  leagues: string[] = [];

  showRatingInputFor: string | null = null;
  hoverRating: number = 0;
  userRatings: { [id: string]: number } = {};

  sportTabs: SportTab[] = [
    { key: 'all',        label: 'Todos',   icon: 'bi-grid-fill' },
    { key: 'soccer',     label: 'Fútbol',  icon: 'bi-circle' },
    { key: 'basketball', label: 'NBA',     icon: 'bi-dribbble' },
    { key: 'football',   label: 'NFL',     icon: 'bi-trophy-fill' },
    { key: 'baseball',   label: 'MLB',     icon: 'bi-circle-fill' },
  ];

  constructor(private espnService: EspnService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.espnService.getAllMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
        this.updateLeagues();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching matches:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterBySport(sport: string): void {
    this.activeSport = sport;
    this.activeLeague = 'all';
    this.updateLeagues();
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.activeFilter = status;
    this.applyFilters();
  }

  filterByLeague(league: string): void {
    this.activeLeague = league;
    this.applyFilters();
  }

  private updateLeagues(): void {
    const pool = this.activeSport === 'all'
      ? this.matches
      : this.matches.filter(m => m.sport === this.activeSport);
    this.leagues = [...new Set(pool.map(m => m.league))];
  }

  private applyFilters(): void {
    let filtered = [...this.matches];

    if (this.activeSport !== 'all') {
      filtered = filtered.filter(m => m.sport === this.activeSport);
    }

    if (this.activeLeague !== 'all') {
      filtered = filtered.filter(m => m.league === this.activeLeague);
    }

    if (this.activeFilter === 'completed') {
      filtered = filtered.filter(m => m.completed);
    } else if (this.activeFilter === 'live') {
      filtered = filtered.filter(m => m.status === 'in');
    } else if (this.activeFilter === 'upcoming') {
      filtered = filtered.filter(m => m.status === 'pre');
    }

    this.filteredMatches = filtered;
  }

  getStars(rating: number): string {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3;
    let stars = '★'.repeat(full);
    if (hasHalf) stars += '½';
    const empty = 5 - full - (hasHalf ? 1 : 0);
    stars += '☆'.repeat(Math.max(0, empty));
    return stars;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(match: MatchInfo): string {
    if (match.status === 'in') return 'status-live';
    if (match.completed) return 'status-ft';
    return 'status-upcoming';
  }

  getStatusText(match: MatchInfo): string {
    if (match.status === 'in') return '🔴 EN VIVO';
    if (match.completed) return match.statusDetail || 'Final';
    return 'PRÓXIMO';
  }

  openRating(event: Event, matchId: string) {
    event.preventDefault();
    event.stopPropagation();
    this.showRatingInputFor = matchId;
    this.hoverRating = 0;
  }

  cancelRating(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showRatingInputFor = null;
  }

  setHoverRating(event: Event, star: number) {
    this.hoverRating = star;
  }

  rateMatch(event: Event, match: MatchInfo, star: number) {
    event.preventDefault();
    event.stopPropagation();
    this.userRatings[match.id] = star;

    const fakeTotalVotes = 10;
    match.rating = ((match.rating * fakeTotalVotes) + star) / (fakeTotalVotes + 1);
    match.rating = Math.round(match.rating * 10) / 10;

    this.showRatingInputFor = null;
  }
}
