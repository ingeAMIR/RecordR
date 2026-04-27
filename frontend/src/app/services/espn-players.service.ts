import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface EspnPlayer {
  id: string;
  name: string;
  shortName: string;
  jersey: string;
  position: string;
  positionRaw: string;
  age: number;
  height: string;
  weight: string;
  nationality: string;
  nationalityFlag: string;
  team: string;
  teamId: string;
  teamLogo: string;
  teamColor: string;
  league: string;
  leagueSlug: string;
  photo: string;
  espnUrl: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    shots: number;
    yellowCards: number;
    redCards: number;
    saves: number;
  };
  isTrending: boolean;
}

interface TeamInfo {
  id: string;
  name: string;
  color: string;
}

interface LeagueConfig {
  slug: string;
  name: string;
}

const LEAGUES: LeagueConfig[] = [
  { slug: 'esp.1', name: 'LaLiga' },
  { slug: 'eng.1', name: 'Premier League' },
  { slug: 'ger.1', name: 'Bundesliga' },
  { slug: 'fra.1', name: 'Ligue 1' },
  { slug: 'ita.1', name: 'Serie A' },
];

@Injectable({ providedIn: 'root' })
export class EspnPlayersService {
  private readonly BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

  constructor(private http: HttpClient) {}

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Fetch all leagues metadata */
  getLeagues(): LeagueConfig[] {
    return LEAGUES;
  }

  /** Fetch ALL players from ALL teams in a given league */
  getPlayersByLeague(leagueSlug: string): Observable<EspnPlayer[]> {
    const league = LEAGUES.find(l => l.slug === leagueSlug);
    if (!league) return of([]);

    return this.fetchTeams(leagueSlug).pipe(
      switchMap(teams => {
        if (!teams.length) return of([]);
        const rosterRequests = teams.map(t =>
          this.fetchTeamRoster(leagueSlug, league.name, t.id, t.name, t.color)
        );
        return forkJoin(rosterRequests);
      }),
      map(results => this.sortByRelevance(results.flat())),
      catchError(() => of([]))
    );
  }

  /** Fetch ALL players across ALL leagues */
  getAllPlayers(): Observable<EspnPlayer[]> {
    const leagueRequests = LEAGUES.map(l => this.getPlayersByLeague(l.slug));
    return forkJoin(leagueRequests).pipe(
      map(results => this.sortByRelevance(results.flat())),
      catchError(() => of([]))
    );
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private fetchTeams(leagueSlug: string): Observable<TeamInfo[]> {
    return this.http.get<any>(`${this.BASE}/${leagueSlug}/teams?limit=30`).pipe(
      map(data => {
        const teams: any[] = data?.sports?.[0]?.leagues?.[0]?.teams ?? [];
        return teams.map((t: any) => ({
          id: t.team.id,
          name: t.team.displayName,
          color: t.team.color || '333333',
        }));
      }),
      catchError(() => of([]))
    );
  }

  private fetchTeamRoster(
    leagueSlug: string,
    leagueName: string,
    teamId: string,
    teamName: string,
    teamColor: string
  ): Observable<EspnPlayer[]> {
    const teamLogo = `https://a.espncdn.com/i/teamlogos/soccer/500/${teamId}.png`;
    return this.http.get<any>(`${this.BASE}/${leagueSlug}/teams/${teamId}/roster`).pipe(
      map(data => {
        if (!data?.athletes) return [];
        return (data.athletes as any[]).map(a =>
          this.parseAthlete(a, teamName, teamId, teamLogo, `#${teamColor}`, leagueName, leagueSlug)
        );
      }),
      catchError(() => of([]))
    );
  }

  private parseAthlete(
    a: any,
    teamName: string,
    teamId: string,
    teamLogo: string,
    teamColor: string,
    leagueName: string,
    leagueSlug: string
  ): EspnPlayer {
    const cats = a.statistics?.splits?.categories ?? [];
    const gen = cats.find((c: any) => c.name === 'general');
    const off = cats.find((c: any) => c.name === 'offensive');
    const gk  = cats.find((c: any) => c.name === 'goalKeeping');
    const stat = (cat: any, name: string): number =>
      cat?.stats?.find((s: any) => s.name === name)?.value ?? 0;

    const espnUrl =
      a.links?.find((l: any) => l.rel?.includes('playercard') && l.rel?.includes('desktop'))?.href ?? '';

    const posRaw: string = a.position?.displayName ?? '';

    return {
      id: a.id,
      name: a.displayName || a.fullName || '',
      shortName: a.shortName || '',
      jersey: a.jersey || '?',
      position: this.translatePosition(posRaw),
      positionRaw: posRaw,
      age: a.age || 0,
      height: a.displayHeight || '',
      weight: a.displayWeight || '',
      nationality: a.citizenship || '',
      nationalityFlag: a.flag?.href || '',
      team: teamName,
      teamId,
      teamLogo,
      teamColor,
      league: leagueName,
      leagueSlug,
      // ESPN headshots don't work publicly for soccer — blank until enriched
      photo: '',
      espnUrl,
      stats: {
        appearances: stat(gen, 'appearances'),
        goals: stat(off, 'totalGoals'),
        assists: stat(off, 'goalAssists'),
        shots: stat(off, 'totalShots'),
        yellowCards: stat(gen, 'yellowCards'),
        redCards: stat(gen, 'redCards'),
        saves: stat(gk, 'saves'),
      },
      isTrending: a.profiled === true,
    };
  }

  private sortByRelevance(players: EspnPlayer[]): EspnPlayer[] {
    return players.sort((a, b) => {
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      const score = (p: EspnPlayer) =>
        p.stats.goals * 3 + p.stats.assists * 2 + p.stats.appearances;
      return score(b) - score(a);
    });
  }

  private translatePosition(pos: string): string {
    const map: Record<string, string> = {
      'Goalkeeper': 'Portero',
      'Defender': 'Defensa',
      'Midfielder': 'Mediocampista',
      'Forward': 'Delantero',
      'Attacker': 'Delantero',
    };
    return map[pos] || pos || 'Jugador';
  }
}
