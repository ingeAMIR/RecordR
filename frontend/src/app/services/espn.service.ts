import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of, switchMap, startWith, shareReplay } from 'rxjs';

export interface MatchInfo {
  id: string;
  sport: string;
  sportLabel: string;
  league: string;
  leagueLogo: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  homeLogo: string;
  awayLogo: string;
  homeColor: string;
  awayColor: string;
  homeAbbrev: string;
  awayAbbrev: string;
  status: string;
  statusDetail: string;
  venue: string;
  date: string;
  headline: string;
  completed: boolean;
  rating: number;
  imageUrl: string;
}

interface LeagueEndpoint {
  sport: string;
  sportLabel: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspnService {
  private readonly endpoints: LeagueEndpoint[] = [
    // Soccer / Fútbol
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard' },
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard' },
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard' },
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/mex.1/scoreboard' },
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard' },
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard' },
    { sport: 'soccer', sportLabel: 'Fútbol', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard' },
    // Basketball
    { sport: 'basketball', sportLabel: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
    // American Football
    { sport: 'football', sportLabel: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' },
    // Baseball
    { sport: 'baseball', sportLabel: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
  ];

  constructor(private http: HttpClient) {}

  private matchesCache$: Observable<MatchInfo[]> | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  getAllMatches(forceRefresh = false): Observable<MatchInfo[]> {
    if (!forceRefresh && this.matchesCache$ && (Date.now() - this.cacheTimestamp < this.CACHE_DURATION)) {
      return this.matchesCache$;
    }

    const initialRequests = this.endpoints.map(ep =>
      this.http.get<any>(ep.url).pipe(
        map(data => ({
          endpoint: ep,
          todayMatches: this.parseEvents(data, ep),
          upcomingDates: this.extractUpcomingDates(data.leagues?.[0]?.calendar || [], 2)
        })),
        catchError(() => of({
          endpoint: ep,
          todayMatches: [] as MatchInfo[],
          upcomingDates: [] as string[]
        }))
      )
    );

    this.matchesCache$ = forkJoin(initialRequests).pipe(
      switchMap((results): Observable<MatchInfo[]> => {
        const todayMatches = results.flatMap(r => r.todayMatches);

        const upcomingRequests: Observable<MatchInfo[]>[] = [];
        for (const r of results) {
          for (const date of r.upcomingDates) {
            upcomingRequests.push(
              this.http.get<any>(`${r.endpoint.url}?dates=${date}`).pipe(
                map(data => this.parseEvents(data, r.endpoint)),
                catchError(() => of([] as MatchInfo[]))
              )
            );
          }
        }

        if (upcomingRequests.length === 0) {
          return of(todayMatches);
        }

        const fetchUpcoming: Observable<MatchInfo[]> = forkJoin(upcomingRequests).pipe(
          map(upcomingResults => {
            const all = [...todayMatches, ...upcomingResults.flat()];
            const seen = new Set<string>();
            return all.filter(m => {
              if (seen.has(m.id)) return false;
              seen.add(m.id);
              return true;
            }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          })
        );

        return fetchUpcoming.pipe(startWith(todayMatches));
      }),
      shareReplay(1)
    );

    this.cacheTimestamp = Date.now();
    return this.matchesCache$;
  }

  getMatchById(id: string): Observable<MatchInfo | undefined> {
    return this.getAllMatches().pipe(
      map(matches => matches.find(m => m.id === id))
    );
  }

  private extractUpcomingDates(calendar: any[], count: number): string[] {
    const now = new Date();
    const dates: string[] = [];

    for (const entry of calendar) {
      // Handle string dates, objects with `value`, or objects with `date`
      let d: Date | null = null;
      if (typeof entry === 'string') {
        d = new Date(entry);
      } else if (entry?.value) {
        // NFL-style: value is "YYYYMMDD"
        const v = String(entry.value);
        d = new Date(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`);
      } else if (entry?.date) {
        d = new Date(entry.date);
      }

      if (d && !isNaN(d.getTime()) && d > now) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}${mm}${dd}`;
        if (!dates.includes(key)) dates.push(key);
        if (dates.length >= count) break;
      }
    }

    return dates;
  }

  private parseEvents(data: any, endpoint: LeagueEndpoint): MatchInfo[] {
    if (!data?.events) return [];

    const leagueName = data.leagues?.[0]?.name || endpoint.sportLabel;
    const leagueLogo = data.leagues?.[0]?.logos?.[0]?.href || '';

    return data.events.map((event: any) => {
      const comp = event.competitions?.[0];
      const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
      const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
      const headline = comp?.headlines?.[0]?.shortLinkText || comp?.notes?.[0]?.headline || '';
      const isCompleted = comp?.status?.type?.completed || false;
      const state = comp?.status?.type?.state || 'pre';

      // Real match photo from ESPN headline if available
      const imageUrl = comp?.headlines?.[0]?.image?.href || '';

      const homeScore = parseInt(home?.score || '0', 10);
      const awayScore = parseInt(away?.score || '0', 10);
      const total = homeScore + awayScore;
      const diff = Math.abs(homeScore - awayScore);
      let rating = 3.5 + Math.min(total * 0.3, 1.2) - Math.min(diff * 0.2, 0.5);
      rating = Math.round(Math.min(Math.max(rating, 2.5), 5.0) * 10) / 10;

      return {
        id: event.id,
        sport: endpoint.sport,
        sportLabel: endpoint.sportLabel,
        league: leagueName,
        leagueLogo,
        homeTeam: home?.team?.displayName || 'TBD',
        awayTeam: away?.team?.displayName || 'TBD',
        homeScore: home?.score ?? '-',
        awayScore: away?.score ?? '-',
        homeLogo: home?.team?.logo || '',
        awayLogo: away?.team?.logo || '',
        homeColor: '#' + (home?.team?.color || '333333'),
        awayColor: '#' + (away?.team?.color || '333333'),
        homeAbbrev: home?.team?.abbreviation || home?.team?.shortDisplayName || '',
        awayAbbrev: away?.team?.abbreviation || away?.team?.shortDisplayName || '',
        status: state,
        statusDetail: comp?.status?.type?.shortDetail || '',
        venue: comp?.venue?.fullName || event.venue?.displayName || '',
        date: event.date,
        headline,
        completed: isCompleted,
        rating,
        imageUrl,
      } as MatchInfo;
    });
  }
}
