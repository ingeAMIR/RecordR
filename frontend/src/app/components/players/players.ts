import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EspnPlayersService, EspnPlayer } from '../../services/espn-players.service';

interface SportTab {
  sport: string;
  sportLabel: string;
  icon: string;
}

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.html',
  styleUrl: './players.scss'
})
export class PlayersComponent implements OnInit, OnDestroy {

  // ── Datos ──────────────────────────────────
  allPlayers: EspnPlayer[] = [];
  filteredPlayers: EspnPlayer[] = [];
  displayedPlayers: EspnPlayer[] = [];

  // Estado de carga por liga
  leagueStatus: Record<string, 'loading' | 'done' | 'error'> = {};

  get isLoading(): boolean {
    return Object.values(this.leagueStatus).some(s => s === 'loading');
  }
  get anyLoaded(): boolean {
    return this.allPlayers.length > 0;
  }

  // ── Sport tabs ──────────────────────────────
  sportTabs: SportTab[] = [
    { sport: 'all',        sportLabel: 'Todos',  icon: 'bi-grid-fill' },
    { sport: 'soccer',     sportLabel: 'Fútbol', icon: 'bi-dribbble' },
    { sport: 'basketball', sportLabel: 'NBA',    icon: 'bi-trophy-fill' },
    { sport: 'football',   sportLabel: 'NFL',    icon: 'bi-shield-fill' },
    { sport: 'baseball',   sportLabel: 'MLB',    icon: 'bi-circle-fill' },
  ];

  // ── Filtros ─────────────────────────────────
  activeSport = 'all';
  activeLeague = 'all';
  selectedPosition = 'all';
  selectedTeam = 'all';
  searchQuery = '';

  // ── Paginación ──────────────────────────────
  pageSize = 48;
  currentPage = 0;

  get hasMore(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.filteredPlayers.length;
  }

  // ── Opciones derivadas de datos cargados ────
  get leaguesForSport(): { slug: string; name: string }[] {
    const pool = this.activeSport === 'all'
      ? this.allPlayers
      : this.allPlayers.filter(p => p.sport === this.activeSport);
    const seen = new Map<string, string>();
    pool.forEach(p => { if (!seen.has(p.leagueSlug)) seen.set(p.leagueSlug, p.league); });
    return [...seen.entries()].map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name));
  }

  get availablePositions(): string[] {
    const pool = this.getBasePool();
    const pos = new Set<string>();
    pool.forEach(p => { if (p.positionGroup) pos.add(p.positionGroup); });
    return [...pos].sort();
  }

  get availableTeams(): { id: string; name: string }[] {
    const pool = this.getBasePool();
    const seen = new Map<string, string>();
    pool.forEach(p => { if (!seen.has(p.teamId)) seen.set(p.teamId, p.team); });
    return [...seen.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }

  get currentSeason(): string {
    const y = new Date().getFullYear();
    return `${new Date().getMonth() >= 7 ? y : y - 1}-${String((new Date().getMonth() >= 7 ? y : y - 1) + 1).slice(-2)}`;
  }

  get skeletonCount(): number[] { return Array(24).fill(0); }

  private destroy$ = new Subject<void>();

  constructor(
    private espnService: EspnPlayersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAll(): void {
    const leagues = this.espnService.getSportLeagues();

    for (const cfg of leagues) {
      const key = `${cfg.sport}__${cfg.espnLeague}`;
      this.leagueStatus[key] = 'loading';

      this.espnService.getPlayersByLeague(cfg).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: players => {
          this.allPlayers = [...this.allPlayers, ...players];
          this.leagueStatus[key] = 'done';
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: () => {
          this.leagueStatus[key] = 'error';
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ── Filtros ─────────────────────────────────

  selectSport(sport: string): void {
    this.activeSport = sport;
    this.activeLeague = 'all';
    this.selectedPosition = 'all';
    this.selectedTeam = 'all';
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private getBasePool(): EspnPlayer[] {
    let pool = [...this.allPlayers];
    if (this.activeSport !== 'all') pool = pool.filter(p => p.sport === this.activeSport);
    if (this.activeLeague !== 'all') pool = pool.filter(p => p.leagueSlug === this.activeLeague);
    return pool;
  }

  private applyFilters(): void {
    let result = this.getBasePool();

    if (this.selectedTeam !== 'all') {
      result = result.filter(p => p.teamId === this.selectedTeam);
    }
    if (this.selectedPosition !== 'all') {
      result = result.filter(p => p.positionGroup === this.selectedPosition);
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
  }

  loadMore(): void {
    this.currentPage++;
    this.updateDisplayed();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeLeague = 'all';
    this.selectedPosition = 'all';
    this.selectedTeam = 'all';
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery !== '' || this.activeLeague !== 'all' ||
           this.selectedPosition !== 'all' || this.selectedTeam !== 'all';
  }

  // ── Helpers visuales ─────────────────────────

  getStatLabels(player: EspnPlayer): { label: string; value: number; highlight?: boolean }[] {
    const s = player.stats;
    switch (player.sport) {
      case 'basketball':
        return [
          { label: 'PTS', value: Math.round(s['avgPoints'] ?? s['points'] ?? 0), highlight: true },
          { label: 'AST', value: Math.round(s['avgAssists'] ?? s['assists'] ?? 0) },
          { label: 'REB', value: Math.round(s['avgRebounds'] ?? s['rebounds'] ?? 0) },
        ];
      case 'football':
        if (['QB'].includes(player.position))
          return [
            { label: 'YDS', value: s['passingYards'] ?? 0, highlight: true },
            { label: 'TD', value: s['passingTouchdowns'] ?? 0 },
          ];
        if (['RB'].includes(player.positionGroup))
          return [
            { label: 'YDS', value: s['rushingYards'] ?? 0, highlight: true },
            { label: 'TD', value: s['rushingTouchdowns'] ?? 0 },
          ];
        return [{ label: 'G', value: s['gamesPlayed'] ?? 0 }];
      case 'baseball':
        if (player.positionGroup === 'Lanzador')
          return [
            { label: 'ERA', value: +(s['ERA'] ?? s['era'] ?? 0).toFixed(2), highlight: true },
            { label: 'K', value: s['strikeouts'] ?? 0 },
          ];
        return [
          { label: 'AVG', value: +(s['battingAverage'] ?? s['avg'] ?? 0).toFixed(3), highlight: true },
          { label: 'HR', value: s['homeRuns'] ?? 0 },
          { label: 'RBI', value: s['RBI'] ?? s['rbi'] ?? 0 },
        ];
      default: // soccer
        return [
          { label: 'PJ', value: s['appearances'] ?? 0 },
          { label: 'G', value: s['totalGoals'] ?? s['goals'] ?? 0, highlight: true },
          { label: 'A', value: s['goalAssists'] ?? s['assists'] ?? 0 },
        ];
    }
  }

  getPositionColor(group: string): string {
    const map: Record<string, string> = {
      'Portero': '#f59e0b', 'Defensa': '#3b82f6',
      'Mediocampista': '#8b5cf6', 'Delantero': '#ef4444',
      'Base': '#f59e0b', 'Escolta': '#3b82f6',
      'Alero': '#8b5cf6', 'Ala-Pívot': '#ec4899', 'Pívot': '#14b8a6',
      'QB': '#ef4444', 'RB': '#f59e0b', 'WR': '#3b82f6',
      'TE': '#8b5cf6', 'OL': '#6b7280', 'DL': '#dc2626',
      'LB': '#059669', 'DB': '#0ea5e9', 'K/P': '#94a3b8',
      'Lanzador': '#ef4444', 'Receptor': '#f59e0b',
      'Cuadro': '#3b82f6', 'Outfield': '#8b5cf6', 'DH': '#14b8a6',
    };
    return map[group] || '#6b7280';
  }

  getSportLoadingStatus(sport: string): 'loading' | 'done' | 'partial' | 'idle' {
    const keys = Object.keys(this.leagueStatus).filter(k => k.startsWith(sport + '__'));
    if (!keys.length) return 'idle';
    const statuses = keys.map(k => this.leagueStatus[k]);
    if (statuses.every(s => s === 'done')) return 'done';
    if (statuses.some(s => s === 'loading')) return 'loading';
    return 'partial';
  }

  getInitials(name: string): string {
    return name.split(' ').filter(w => w.length > 0).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  getInitialsBg(color: string): string {
    const hex = color.replace('#', '');
    return `linear-gradient(135deg, #${hex}55, #${hex}11)`;
  }

  openEspnProfile(player: EspnPlayer): void {
    if (player.espnUrl) window.open(player.espnUrl, '_blank');
  }

  trackById(_: number, p: EspnPlayer): string { return p.id; }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onPhotoError(event: Event, player: EspnPlayer): void {
    player.photo = '';
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
