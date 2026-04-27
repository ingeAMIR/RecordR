import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { EspnPlayersService, EspnPlayer } from '../../services/espn-players.service';

interface EspnPlayerEx extends EspnPlayer {
  _photoChecked?: boolean;
}

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.html',
  styleUrl: './players.scss'
})
export class PlayersComponent implements OnInit, OnDestroy {

  // Data
  allPlayers: EspnPlayerEx[] = [];
  filteredPlayers: EspnPlayerEx[] = [];
  displayedPlayers: EspnPlayerEx[] = [];

  // Loading state: track each league independently
  leagueStatus: Record<string, 'loading' | 'done' | 'error'> = {};
  get isLoading(): boolean {
    return Object.values(this.leagueStatus).some(s => s === 'loading');
  }
  get loadedCount(): number {
    return this.allPlayers.length;
  }

  // Filters
  searchQuery = '';
  selectedLeague = 'all';
  selectedPosition = 'all';
  selectedTeam = 'all';

  // Pagination
  pageSize = 48;
  currentPage = 0;
  get totalPages(): number {
    return Math.ceil(this.filteredPlayers.length / this.pageSize);
  }
  get hasMore(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.filteredPlayers.length;
  }

  leagues: { slug: string; name: string }[] = [];

  positions = [
    { key: 'all', label: 'Todas' },
    { key: 'Portero', label: 'Porteros' },
    { key: 'Defensa', label: 'Defensas' },
    { key: 'Mediocampista', label: 'Mediocampistas' },
    { key: 'Delantero', label: 'Delanteros' },
  ];

  get availableTeams(): { id: string, name: string }[] {
    const seen = new Set<string>();
    const teams: { id: string, name: string }[] = [];
    const source = this.selectedLeague === 'all'
      ? this.allPlayers
      : this.allPlayers.filter(p => p.leagueSlug === this.selectedLeague);
    for (const p of source) {
      if (!seen.has(p.teamId)) {
        seen.add(p.teamId);
        teams.push({ id: p.teamId, name: p.team });
      }
    }
    return teams.sort((a, b) => a.name.localeCompare(b.name));
  }

  get currentSeason(): string {
    const now = new Date();
    const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-${String(year + 1).slice(-2)}`;
  }

  private destroy$ = new Subject<void>();

  constructor(
    private espnService: EspnPlayersService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.leagues = this.espnService.getLeagues();
  }

  ngOnInit(): void {
    this.loadAllLeagues();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllLeagues(): void {
    this.allPlayers = [];
    this.filteredPlayers = [];
    this.displayedPlayers = [];

    // Load each league independently and stream results as they arrive
    for (const league of this.leagues) {
      this.leagueStatus[league.slug] = 'loading';

      this.espnService.getPlayersByLeague(league.slug).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: players => {
          this.allPlayers = [...this.allPlayers, ...players];
          this.leagueStatus[league.slug] = 'done';
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: () => {
          this.leagueStatus[league.slug] = 'error';
          this.cdr.detectChanges();
        }
      });
    }
  }

  applyFilters(): void {
    let result = [...this.allPlayers];

    if (this.selectedLeague !== 'all') {
      result = result.filter(p => p.leagueSlug === this.selectedLeague);
    }
    if (this.selectedTeam !== 'all') {
      result = result.filter(p => p.teamId === this.selectedTeam);
    }
    if (this.selectedPosition !== 'all') {
      result = result.filter(p => p.position === this.selectedPosition);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q)
      );
    }

    this.filteredPlayers = result;
    this.currentPage = 0;
    this.updateDisplayed();
  }

  private updateDisplayed(): void {
    const end = (this.currentPage + 1) * this.pageSize;
    this.displayedPlayers = this.filteredPlayers.slice(0, end);
    // Defer enrichment to break synchronous change-detection chain
    setTimeout(() => this.enrichVisiblePhotos(), 0);
  }

  private enrichVisiblePhotos(): void {
    const toEnrich = this.displayedPlayers.filter(p => !p.photo && !p._photoChecked);
    if (!toEnrich.length) return;

    // Mark immediately to avoid duplicate requests
    toEnrich.forEach(p => (p._photoChecked = true));

    toEnrich.forEach(player => {
      this.http.get<any>(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(player.name)}`
      ).pipe(
        takeUntil(this.destroy$),
        catchError(() => of(null))
      ).subscribe((res: any) => {
        if (!res?.player?.[0]) return;
        const match = res.player[0];
        const photoUrl: string = match.strCutout || match.strThumb || '';
        if (photoUrl) {
          player.photo = photoUrl;
          // markForCheck is safe inside async callbacks — won't cause infinite loop
          this.cdr.markForCheck();
        }
      });
    });
  }


  loadMore(): void {
    this.currentPage++;
    this.updateDisplayed();
  }

  onLeagueChange(slug: string): void {
    this.selectedLeague = slug;
    this.selectedTeam = 'all'; // reset team filter when league changes
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openEspnProfile(player: EspnPlayer): void {
    if (player.espnUrl) window.open(player.espnUrl, '_blank');
  }

  getPositionColor(position: string): string {
    const map: Record<string, string> = {
      'Portero': '#f59e0b',
      'Defensa': '#3b82f6',
      'Mediocampista': '#8b5cf6',
      'Delantero': '#ef4444',
    };
    return map[position] || '#6b7280';
  }

  getPositionAbbrev(position: string): string {
    const map: Record<string, string> = {
      'Portero': 'POR',
      'Defensa': 'DEF',
      'Mediocampista': 'MED',
      'Delantero': 'DEL',
    };
    return map[position] || '?';
  }

  getLeagueLabel(slug: string): string {
    return this.leagues.find(l => l.slug === slug)?.name ?? slug;
  }

  get skeletonCount(): number[] {
    return Array(24).fill(0);
  }

  private bgCache = new Map<string, string>();

  getInitialsBg(color: string): string {
    if (!this.bgCache.has(color)) {
      const hex = color.replace('#', '');
      this.bgCache.set(color, `linear-gradient(135deg, #${hex}44, #${hex}11)`);
    }
    return this.bgCache.get(color)!;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(w => w.length > 0)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  onPhotoError(event: Event, player: EspnPlayerEx): void {
    // Clear the broken photo so initials fallback renders
    player.photo = '';
    (event.target as HTMLImageElement).style.display = 'none';
  }

  trackById(_: number, p: EspnPlayerEx): string {
    return p.id;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
