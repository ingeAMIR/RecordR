import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EspnPlayersService, EspnPlayer, SPORT_LEAGUES } from '../../services/espn-players.service';

interface SportTab { sport: string; sportLabel: string; icon: string; }

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.html',
  styleUrl: './players.scss'
})
export class PlayersComponent implements OnInit, OnDestroy {

  allPlayers:      EspnPlayer[] = [];
  filteredPlayers: EspnPlayer[] = [];
  displayedPlayers:EspnPlayer[] = [];

  loading = true;
  fromCache = false;

  // Modo búsqueda global ESPN
  searchMode    = false;
  searchResults: EspnPlayer[] = [];
  searchLoading = false;
  private searchInput$ = new Subject<string>();

  sportTabs: SportTab[] = [
    { sport:'soccer',     sportLabel:'Fútbol', icon:'bi-dribbble'    },
    { sport:'basketball', sportLabel:'NBA',    icon:'bi-trophy-fill' },
    { sport:'football',   sportLabel:'NFL',    icon:'bi-shield-fill' },
    { sport:'baseball',   sportLabel:'MLB',    icon:'bi-circle-fill' },
  ];

  activeSport   = 'soccer';
  activeLeague  = 'all';
  selectedPos   = 'all';
  selectedTeam  = 'all';
  searchQuery   = '';

  readonly pageSize = 48;
  currentPage = 0;
  get hasMore(): boolean { return (this.currentPage + 1) * this.pageSize < this.filteredPlayers.length; }

  // Opciones derivadas del sport/liga activos
  get leagueOptions(): { slug: string; name: string }[] {
    const seen = new Map<string, string>();
    this.allPlayers.filter(p => p.sport === this.activeSport)
      .forEach(p => { if (!seen.has(p.leagueSlug)) seen.set(p.leagueSlug, p.league); });
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }

  get teamOptions(): { id: string; name: string }[] {
    const slugs = this.activeLeague === 'all'
      ? SPORT_LEAGUES.filter(l => l.sport === this.activeSport).map(l => l.espnLeague)
      : [this.activeLeague];
    const seen = new Map<string, string>();
    this.allPlayers.filter(p => slugs.includes(p.leagueSlug))
      .forEach(p => { if (!seen.has(p.teamId)) seen.set(p.teamId, p.team); });
    return [...seen.entries()].map(([id, name]) => ({ id, name })).sort((a,b) => a.name.localeCompare(b.name));
  }

  get positionOptions(): string[] {
    const pool = this.getBasePool();
    const set = new Set<string>();
    pool.forEach(p => { if (p.positionGroup) set.add(p.positionGroup); });
    return [...set].sort();
  }

  get currentSeason(): string {
    const now = new Date(); const y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    return `${y}–${String(y+1).slice(-2)}`;
  }

  get skeletons(): number[] { return Array(24).fill(0); }
  get hasActiveFilters(): boolean {
    return !!this.searchQuery || this.activeLeague !== 'all' || this.selectedPos !== 'all' || this.selectedTeam !== 'all';
  }

  private destroy$ = new Subject<void>();

  constructor(private espnService: EspnPlayersService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.espnService.getAllPlayers().pipe(takeUntil(this.destroy$)).subscribe({
      next: players => {
        this.allPlayers = players;
        this.loading    = false;
        this.fromCache  = true;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
    this.initSearch();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private initSearch(): void {
    this.searchInput$.pipe(
      debounceTime(350), distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          this.searchMode = false; this.searchLoading = false;
          this.applyFilters(); this.cdr.detectChanges(); return of([] as EspnPlayer[]);
        }
        this.searchMode = true; this.searchLoading = true; this.cdr.detectChanges();
        return this.espnService.searchPlayers(query, 30).pipe(
          catchError(() => of([] as EspnPlayer[])),
          takeUntil(this.destroy$)
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults = results; this.searchLoading = false; this.cdr.detectChanges();
    });
  }

  selectSport(sport: string): void {
    this.activeSport = sport; this.activeLeague = 'all';
    this.selectedPos = 'all'; this.selectedTeam = 'all'; this.applyFilters();
  }

  onSearchInput(): void {
    this.searchInput$.next(this.searchQuery);
    if (!this.searchQuery) { this.searchMode = false; this.applyFilters(); }
  }

  onFilterChange(): void { if (!this.searchMode) this.applyFilters(); }
  onLeagueChange(): void { this.selectedPos = 'all'; this.selectedTeam = 'all'; this.applyFilters(); }

  clearFilters(): void {
    this.searchQuery = ''; this.searchMode = false; this.searchResults = [];
    this.activeLeague = 'all'; this.selectedPos = 'all'; this.selectedTeam = 'all'; this.applyFilters();
  }

  private getBasePool(): EspnPlayer[] {
    let pool = this.allPlayers.filter(p => p.sport === this.activeSport);
    if (this.activeLeague !== 'all') pool = pool.filter(p => p.leagueSlug === this.activeLeague);
    return pool;
  }

  private applyFilters(): void {
    let result = this.getBasePool();
    if (this.selectedTeam !== 'all') result = result.filter(p => p.teamId === this.selectedTeam);
    if (this.selectedPos  !== 'all') result = result.filter(p => p.positionGroup === this.selectedPos);
    this.filteredPlayers = result;
    this.currentPage = 0;
    this.displayedPlayers = this.filteredPlayers.slice(0, this.pageSize);
  }

  loadMore(): void {
    this.currentPage++;
    this.displayedPlayers = this.filteredPlayers.slice(0, (this.currentPage + 1) * this.pageSize);
  }

  openEspnProfile(p: EspnPlayer): void { if (p.espnUrl) window.open(p.espnUrl, '_blank'); }

  getPositionColor(g: string): string {
    const m: Record<string,string> = {
      'Portero':'#f59e0b','Defensa':'#3b82f6','Mediocampista':'#8b5cf6','Delantero':'#ef4444',
      'Base / Escolta':'#f59e0b','Alero / Ala-Pívot':'#3b82f6','Pívot':'#14b8a6',
      'QB':'#ef4444','RB':'#f59e0b','WR':'#3b82f6','TE':'#8b5cf6','OL':'#6b7280','DL':'#dc2626','LB':'#059669','DB':'#0ea5e9','K/P':'#94a3b8',
      'Lanzador':'#ef4444','Receptor':'#f59e0b','Cuadro':'#3b82f6','Outfield':'#8b5cf6','DH':'#14b8a6',
    };
    return m[g] || '#6b7280';
  }

  getInitials(name: string): string { return name.split(' ').filter(w=>w).slice(0,2).map(w=>w[0].toUpperCase()).join(''); }
  getInitialsBg(color: string): string { const h=color.replace('#',''); return `linear-gradient(135deg,#${h}44,#${h}11)`; }

  trackById(_: number, p: EspnPlayer): string { return p.id; }
  onImgError(e: Event): void { (e.target as HTMLImageElement).style.display='none'; }
  onPhotoError(e: Event, p: EspnPlayer): void { p.photo=''; (e.target as HTMLImageElement).style.display='none'; }
}
