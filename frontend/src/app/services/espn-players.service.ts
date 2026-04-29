import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { map, catchError, tap, switchMap, mergeMap, toArray } from 'rxjs/operators';

export interface EspnPlayer {
  id: string;
  name: string;
  shortName: string;
  jersey: string;
  position: string;
  positionGroup: string;
  age: number;
  nationality: string;
  team: string;
  teamId: string;
  teamLogo: string;
  teamColor: string;
  league: string;
  leagueSlug: string;
  sport: string;
  sportLabel: string;
  photo: string;
  espnUrl: string;
  stats: Record<string, number>;
  isTrending: boolean;
}

export interface SportLeague {
  sport: string;
  sportLabel: string;
  espnSport: string;
  espnLeague: string;
  leagueName: string;
  teamsLimit: number;
}

export const SPORT_LEAGUES: SportLeague[] = [
  { sport: 'soccer',     sportLabel: 'Fútbol', espnSport: 'soccer',     espnLeague: 'esp.1', leagueName: 'LaLiga',         teamsLimit: 20 },
  { sport: 'soccer',     sportLabel: 'Fútbol', espnSport: 'soccer',     espnLeague: 'eng.1', leagueName: 'Premier League', teamsLimit: 20 },
  { sport: 'soccer',     sportLabel: 'Fútbol', espnSport: 'soccer',     espnLeague: 'ger.1', leagueName: 'Bundesliga',     teamsLimit: 18 },
  { sport: 'soccer',     sportLabel: 'Fútbol', espnSport: 'soccer',     espnLeague: 'ita.1', leagueName: 'Serie A',        teamsLimit: 20 },
  { sport: 'soccer',     sportLabel: 'Fútbol', espnSport: 'soccer',     espnLeague: 'fra.1', leagueName: 'Ligue 1',        teamsLimit: 18 },
  { sport: 'soccer',     sportLabel: 'Fútbol', espnSport: 'soccer',     espnLeague: 'mex.1', leagueName: 'Liga MX',        teamsLimit: 18 },
  { sport: 'basketball', sportLabel: 'NBA',    espnSport: 'basketball', espnLeague: 'nba',   leagueName: 'NBA',            teamsLimit: 30 },
  { sport: 'football',   sportLabel: 'NFL',    espnSport: 'football',   espnLeague: 'nfl',   leagueName: 'NFL',            teamsLimit: 32 },
  { sport: 'baseball',   sportLabel: 'MLB',    espnSport: 'baseball',   espnLeague: 'mlb',   leagueName: 'MLB',            teamsLimit: 30 },
];

const CACHE_KEY   = 'recordr_all_players_v1';
const CACHE_TTL   = 7 * 24 * 60 * 60 * 1000; // 7 días (datos pre-generados no cambian tan seguido)
const STATIC_JSON = '/data/players.json';

@Injectable({ providedIn: 'root' })
export class EspnPlayersService {

  constructor(private http: HttpClient) {}

  getSportLeagues(): SportLeague[] { return SPORT_LEAGUES; }

  getSports(): { sport: string; sportLabel: string }[] {
    const seen = new Set<string>();
    return SPORT_LEAGUES.filter(l => !seen.has(l.sport) && seen.add(l.sport))
      .map(l => ({ sport: l.sport, sportLabel: l.sportLabel }));
  }

  getLeaguesForSport(sport: string): SportLeague[] {
    return SPORT_LEAGUES.filter(l => l.sport === sport);
  }

  /**
   * Carga TODOS los jugadores:
   * 1. localStorage (instantáneo, válido 7 días)
   * 2. /data/players.json (archivo estático, ~700KB gzipped)
   */
  getAllPlayers(): Observable<EspnPlayer[]> {
    const cached = this.readCache();
    if (cached) return of(cached);

    return this.http.get<{ players: EspnPlayer[] }>(STATIC_JSON).pipe(
      map(data => data.players ?? []),
      tap(players => this.writeCache(players)),
      catchError(() => of([] as EspnPlayer[]))
    );
  }

  /** Solo nombres de equipos para el filtro */
  getTeamsList(cfg: SportLeague): Observable<{ id: string; name: string; leagueSlug: string }[]> {
    return this.getAllPlayers().pipe(
      map(players => {
        const seen = new Map<string, string>();
        players.filter(p => p.leagueSlug === cfg.espnLeague)
               .forEach(p => { if (!seen.has(p.teamId)) seen.set(p.teamId, p.team); });
        return [...seen.entries()].map(([id, name]) => ({ id, name, leagueSlug: cfg.espnLeague }));
      })
    );
  }

  /** Búsqueda global ESPN — soporta CORS *, no requiere proxy */
  searchPlayers(query: string, limit = 20): Observable<EspnPlayer[]> {
    if (!query.trim()) return of([]);
    const url = `https://site.api.espn.com/apis/search/v2?query=${encodeURIComponent(query)}&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map(data => {
        const group = (data.results ?? []).find((r: any) => r.type === 'player');
        return (group?.contents ?? []).map((c: any) => this.searchResultToPlayer(c));
      }),
      catchError(() => of([]))
    );
  }

  // ── Cache ────────────────────────────────────────────────────────────────

  private readCache(): EspnPlayer[] | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { players, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) return null;
      return players as EspnPlayer[];
    } catch { return null; }
  }

  private writeCache(players: EspnPlayer[]): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ players, ts: Date.now() }));
    } catch { /* localStorage lleno */ }
  }

  clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    Object.keys(localStorage)
      .filter(k => k.startsWith('recordr_players_'))
      .forEach(k => localStorage.removeItem(k));
  }

  // ── Search helper ────────────────────────────────────────────────────────

  private searchResultToPlayer(c: any): EspnPlayer {
    const sport = c.sport ?? 'soccer';
    const sportLabel = SPORT_LEAGUES.find(l => l.espnSport === sport || l.sport === sport)?.sportLabel ?? sport;
    const athleteIdMatch = (c.uid ?? '').match(/~a:(\d+)$/);
    const athleteId = athleteIdMatch ? athleteIdMatch[1] : c.id ?? '';
    return {
      id: athleteId, name: c.displayName ?? '', shortName: c.displayName ?? '',
      jersey: '?', position: '', positionGroup: '', age: 0, nationality: '',
      team: c.subtitle ?? '', teamId: '', teamLogo: '', teamColor: '#333333',
      league: c.description ?? '', leagueSlug: c.defaultLeagueSlug ?? '',
      sport, sportLabel,
      photo: c.image?.default ?? c.image?.defaultDark ?? '',
      espnUrl: c.link?.web ?? '',
      stats: {}, isTrending: false,
    };
  }
}
