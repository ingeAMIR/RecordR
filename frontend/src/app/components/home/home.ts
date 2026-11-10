import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { PlayerService, PlayerData } from '../../services/player.service';
import { EspnService, MatchInfo } from '../../services/espn.service';
import { ActivityService, ActivityItem as ApiActivityItem } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { TiltDirective } from '../../directives/tilt.directive';
import { MatchCard } from '../match-card/match-card';

interface HowItWorksStep {
  title: string;
  description: string;
}

interface ActivityItem {
  user: string;
  action: string;
  match: string;
  matchId: string | null;
  rating: number;
  time: string;
}

interface ListIdea {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TiltDirective, MatchCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  topPlayers: PlayerData[] = [];
  playersLoading = true;

  trendingMatches: MatchInfo[] = [];
  trendingLoading = true;

  top = 0;
  private dragStart: number | null = null;

  private subs = new Subscription();

  constructor(
    private playerService: PlayerService,
    private espnService: EspnService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.playerService.getPopularPlayers().subscribe({
        next: (players) => {
          this.topPlayers = players;
          this.playersLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.playersLoading = false;
          this.cdr.detectChanges();
        }
      })
    );

    this.subs.add(
      combineLatest([
        this.espnService.getAllMatches(),
        this.activityService.getRecentActivity()
      ]).subscribe({
        next: ([matches, activities]: [MatchInfo[], ApiActivityItem[]]) => {
          this.trendingMatches = this.pickTrending(matches);
          this.trendingLoading = false;
          this.top = 0;

          this.recentActivity = activities.map((a: ApiActivityItem) => {
            const match = matches.find((m: MatchInfo) => m.id === a.matchId);
            return {
              user: a.user,
              action: a.action,
              match: match ? `${match.homeTeam} vs ${match.awayTeam}` : 'Partido',
              matchId: match ? match.id : null,
              rating: this.parseStars(a.stars),
              time: this.formatTime(a.time)
            };
          });

          this.cdr.detectChanges();
        },
        error: () => {
          this.trendingLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  pos(i: number): number {
    const n = this.trendingMatches.length;
    return n ? (i - this.top + n) % n : 0;
  }

  next(): void {
    const n = this.trendingMatches.length;
    if (n) this.top = (this.top + 1) % n;
  }

  prev(): void {
    const n = this.trendingMatches.length;
    if (n) this.top = (this.top - 1 + n) % n;
  }

  bringToFront(i: number): void {
    this.top = i;
  }

  onDeckDown(e: PointerEvent): void {
    this.dragStart = e.clientX;
  }

  onDeckUp(e: PointerEvent): void {
    if (this.dragStart === null) return;
    const dx = e.clientX - this.dragStart;
    this.dragStart = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) this.next();
    else this.prev();
  }

  onDeckCancel(): void {
    this.dragStart = null;
  }

  trackMatch(_: number, m: MatchInfo): string {
    return m.id;
  }

  private parseStars(raw: string): number {
    const n = Number(raw);
    if (!isNaN(n) && n > 0) return Math.min(5, n);
    return Math.min(5, (String(raw || '').match(/★/g) || []).length);
  }

  // Un partido por deporte si es posible; se prefieren los terminados
  private pickTrending(matches: MatchInfo[]): MatchInfo[] {
    const completed = matches.filter(m => m.completed);
    const upcoming = matches.filter(m => !m.completed);
    const pool = completed.length >= 4 ? completed : [...completed, ...upcoming];

    const sportOrder = ['basketball', 'football', 'baseball', 'soccer'];
    const picked: MatchInfo[] = [];

    for (const sport of sportOrder) {
      const m = pool.find(x => x.sport === sport && !picked.includes(x));
      if (m) picked.push(m);
      if (picked.length >= 4) break;
    }

    if (picked.length < 4) {
      const rest = pool
        .filter(x => !picked.includes(x))
        .sort((a, b) => b.rating - a.rating);
      picked.push(...rest.slice(0, 4 - picked.length));
    }

    return picked.slice(0, 4);
  }

  getSportIcon(sport: string): string {
    const icons: Record<string, string> = {
      basketball: 'bi-dribbble',
      football: 'bi-trophy-fill',
      baseball: 'bi-circle-fill',
      soccer: 'bi-circle',
    };
    return icons[sport] || 'bi-trophy';
  }

  howItWorks: HowItWorksStep[] = [
    {
      title: 'Ve el partido',
      description: 'Marcadores y calendario de fútbol, NBA, NFL y MLB, con datos de ESPN.'
    },
    {
      title: 'Ponle estrellas',
      description: 'Califícalo de 1 a 5 y deja tu opinión. Otros aficionados pueden responderte.'
    },
    {
      title: 'Guárdalo en una lista',
      description: 'Arma listas con los partidos que quieres recordar y vuelve a ellos cuando quieras.'
    }
  ];

  recentActivity: ActivityItem[] = [];

  formatTime(isoString: string): string {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'hace instantes';
    if (diffMins < 60) return `hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `hace ${diffHours} h`;
    return `hace ${Math.floor(diffHours / 24)} d`;
  }

  listIdeas: ListIdea[] = [
    {
      title: 'Finales que no se olvidan',
      description: 'Las que viste completas y volverías a ver mañana.'
    },
    {
      title: 'Clásicos y derbis',
      description: 'Rivalidades que se juegan distinto a todo lo demás.'
    },
    {
      title: 'Mis cinco estrellas',
      description: 'Solo los partidos a los que les diste la calificación perfecta.'
    }
  ];

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}
