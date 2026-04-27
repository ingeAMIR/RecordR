import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface EspnPlayer {
  id: string;
  name: string;
  shortName: string;
  jersey: string;
  position: string;
  positionGroup: string; // agrupación para filtro
  age: number;
  nationality: string;
  team: string;
  teamId: string;
  teamLogo: string;
  teamColor: string;
  league: string;
  leagueSlug: string;
  sport: string;         // 'soccer' | 'basketball' | 'football' | 'baseball'
  sportLabel: string;    // 'Fútbol' | 'NBA' | 'NFL' | 'MLB'
  photo: string;
  espnUrl: string;
  stats: Record<string, number>;
  isTrending: boolean;
}

interface SportLeague {
  sport: string;
  sportLabel: string;
  espnSport: string;
  espnLeague: string;
  leagueName: string;
  teamsLimit: number;
  headshotKey: string; // vacío = sin headshot ESPN
}

const SPORT_LEAGUES: SportLeague[] = [
  { sport: 'soccer', sportLabel: 'Fútbol', espnSport: 'soccer', espnLeague: 'esp.1',    leagueName: 'LaLiga',         teamsLimit: 20, headshotKey: '' },
  { sport: 'soccer', sportLabel: 'Fútbol', espnSport: 'soccer', espnLeague: 'eng.1',    leagueName: 'Premier League', teamsLimit: 20, headshotKey: '' },
  { sport: 'soccer', sportLabel: 'Fútbol', espnSport: 'soccer', espnLeague: 'ger.1',    leagueName: 'Bundesliga',     teamsLimit: 18, headshotKey: '' },
  { sport: 'soccer', sportLabel: 'Fútbol', espnSport: 'soccer', espnLeague: 'ita.1',    leagueName: 'Serie A',        teamsLimit: 20, headshotKey: '' },
  { sport: 'soccer', sportLabel: 'Fútbol', espnSport: 'soccer', espnLeague: 'fra.1',    leagueName: 'Ligue 1',        teamsLimit: 18, headshotKey: '' },
  { sport: 'basketball', sportLabel: 'NBA', espnSport: 'basketball', espnLeague: 'nba', leagueName: 'NBA',            teamsLimit: 30, headshotKey: 'nba' },
  { sport: 'football',   sportLabel: 'NFL', espnSport: 'football',   espnLeague: 'nfl', leagueName: 'NFL',            teamsLimit: 32, headshotKey: 'nfl' },
  { sport: 'baseball',   sportLabel: 'MLB', espnSport: 'baseball',   espnLeague: 'mlb', leagueName: 'MLB',            teamsLimit: 30, headshotKey: 'mlb' },
];

// Agrupaciones de posición por deporte para el filtro
const POSITION_MAP: Record<string, Record<string, string>> = {
  soccer: {
    'Goalkeeper': 'Portero', 'Defender': 'Defensa',
    'Midfielder': 'Mediocampista', 'Forward': 'Delantero', 'Attacker': 'Delantero',
  },
  basketball: {
    'Point Guard': 'Base', 'PG': 'Base',
    'Shooting Guard': 'Escolta', 'SG': 'Escolta',
    'Small Forward': 'Alero', 'SF': 'Alero',
    'Power Forward': 'Ala-Pívot', 'PF': 'Ala-Pívot',
    'Center': 'Pívot', 'C': 'Pívot',
  },
  football: {
    'Quarterback': 'QB', 'QB': 'QB',
    'Running Back': 'RB', 'Fullback': 'RB', 'RB': 'RB', 'FB': 'RB',
    'Wide Receiver': 'WR', 'WR': 'WR',
    'Tight End': 'TE', 'TE': 'TE',
    'Offensive Tackle': 'OL', 'Offensive Guard': 'OL', 'Center': 'OL',
    'OT': 'OL', 'OG': 'OL', 'G': 'OL', 'T': 'OL', 'C': 'OL',
    'Defensive Tackle': 'DL', 'Defensive End': 'DL',
    'DT': 'DL', 'DE': 'DL', 'NT': 'DL',
    'Linebacker': 'LB', 'LB': 'LB', 'ILB': 'LB', 'OLB': 'LB', 'MLB': 'LB',
    'Cornerback': 'DB', 'Safety': 'DB',
    'CB': 'DB', 'S': 'DB', 'SS': 'DB', 'FS': 'DB', 'DB': 'DB',
    'Kicker': 'K/P', 'Punter': 'K/P', 'Long Snapper': 'K/P',
    'K': 'K/P', 'P': 'K/P', 'LS': 'K/P',
  },
  baseball: {
    'Starting Pitcher': 'Lanzador', 'Relief Pitcher': 'Lanzador', 'Closing Pitcher': 'Lanzador',
    'SP': 'Lanzador', 'RP': 'Lanzador', 'CP': 'Lanzador',
    'Catcher': 'Receptor', 'C': 'Receptor',
    'First Base': 'Cuadro', 'Second Base': 'Cuadro',
    'Third Base': 'Cuadro', 'Shortstop': 'Cuadro',
    '1B': 'Cuadro', '2B': 'Cuadro', '3B': 'Cuadro', 'SS': 'Cuadro',
    'Left Field': 'Outfield', 'Center Field': 'Outfield', 'Right Field': 'Outfield',
    'LF': 'Outfield', 'CF': 'Outfield', 'RF': 'Outfield', 'OF': 'Outfield',
    'Designated Hitter': 'DH', 'DH': 'DH',
  },
};

@Injectable({ providedIn: 'root' })
export class EspnPlayersService {

  constructor(private http: HttpClient) {}

  getSportLeagues(): SportLeague[] {
    return SPORT_LEAGUES;
  }

  getSportsAvailable(): { sport: string; sportLabel: string }[] {
    const seen = new Set<string>();
    return SPORT_LEAGUES.filter(l => {
      if (seen.has(l.sport)) return false;
      seen.add(l.sport);
      return true;
    }).map(l => ({ sport: l.sport, sportLabel: l.sportLabel }));
  }

  /** Carga jugadores de una liga específica */
  getPlayersByLeague(cfg: SportLeague): Observable<EspnPlayer[]> {
    const baseUrl = this.buildBaseUrl(cfg);
    return this.fetchTeams(baseUrl, cfg).pipe(
      switchMap(teams => {
        if (!teams.length) return of([]);
        const limited = teams.slice(0, cfg.teamsLimit);
        return forkJoin(
          limited.map(t => this.fetchRoster(baseUrl, cfg, t.id, t.name, t.color, t.logo))
        );
      }),
      map(results => results.flat().filter(p => !!p.name)),
      catchError(() => of([]))
    );
  }

  private buildBaseUrl(cfg: SportLeague): string {
    if (cfg.sport === 'soccer') {
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espnLeague}`;
    }
    return `https://site.api.espn.com/apis/site/v2/sports/${cfg.espnSport}/${cfg.espnLeague}`;
  }

  private fetchTeams(baseUrl: string, cfg: SportLeague): Observable<{ id: string; name: string; color: string; logo: string }[]> {
    return this.http.get<any>(`${baseUrl}/teams?limit=40`).pipe(
      map(data => {
        const teams: any[] =
          data?.sports?.[0]?.leagues?.[0]?.teams ??
          data?.teams ??
          [];
        return teams.map((t: any) => {
          const team = t.team ?? t;
          const id = team.id ?? '';
          const sport = cfg.headshotKey || 'soccer';
          const logo = team.logos?.[0]?.href
            || `https://a.espncdn.com/i/teamlogos/${sport}/500/${id}.png`;
          return {
            id,
            name: team.displayName ?? team.name ?? '',
            color: '#' + (team.color ?? '333333'),
            logo,
          };
        }).filter(t => !!t.id);
      }),
      catchError(() => of([]))
    );
  }

  private fetchRoster(
    baseUrl: string,
    cfg: SportLeague,
    teamId: string,
    teamName: string,
    teamColor: string,
    teamLogo: string
  ): Observable<EspnPlayer[]> {
    return this.http.get<any>(`${baseUrl}/teams/${teamId}/roster`).pipe(
      map(data => {
        const athletes: any[] = data?.athletes ?? [];
        // NFL / MLB roster: athletes can be grouped by position group
        const flat = athletes.flatMap((entry: any) =>
          Array.isArray(entry.items) ? entry.items : [entry]
        );
        return flat.map(a => this.parseAthlete(a, cfg, teamId, teamName, teamColor, teamLogo));
      }),
      catchError(() => of([]))
    );
  }

  private parseAthlete(
    a: any,
    cfg: SportLeague,
    teamId: string,
    teamName: string,
    teamColor: string,
    teamLogo: string
  ): EspnPlayer {
    const posRaw: string =
      a.position?.displayName ?? a.position?.abbreviation ?? a.position?.name ?? '';
    const posAbbrev: string = a.position?.abbreviation ?? posRaw;
    const posGroup = this.translatePosition(posRaw, posAbbrev, cfg.sport);

    // ESPN headshots funcionan públicamente para NBA/NFL/MLB
    let photo = '';
    if (cfg.headshotKey && a.id) {
      photo = `https://a.espncdn.com/i/headshots/${cfg.headshotKey}/players/full/${a.id}.png`;
    }

    const espnUrl =
      a.links?.find((l: any) => l.rel?.includes('playercard') || l.rel?.includes('athlete'))?.href ?? '';

    const stats: Record<string, number> = {};
    const cats: any[] = a.statistics?.splits?.categories ?? [];
    for (const cat of cats) {
      for (const s of (cat.stats ?? [])) {
        if (s.name && s.value !== undefined) stats[s.name] = s.value;
      }
    }

    return {
      id: a.id ?? '',
      name: a.displayName ?? a.fullName ?? '',
      shortName: a.shortName ?? '',
      jersey: a.jersey ?? '?',
      position: posAbbrev || posGroup,
      positionGroup: posGroup,
      age: a.age ?? 0,
      nationality: a.citizenship ?? a.birthPlace?.country ?? '',
      team: teamName,
      teamId,
      teamLogo,
      teamColor,
      league: cfg.leagueName,
      leagueSlug: cfg.espnLeague,
      sport: cfg.sport,
      sportLabel: cfg.sportLabel,
      photo,
      espnUrl,
      stats,
      isTrending: a.profiled === true,
    };
  }

  private translatePosition(displayName: string, abbrev: string, sport: string): string {
    const map = POSITION_MAP[sport] ?? {};
    return map[displayName] ?? map[abbrev] ?? displayName ?? abbrev ?? 'Jugador';
  }
}
