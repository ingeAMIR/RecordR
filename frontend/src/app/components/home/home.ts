import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService, PlayerData } from '../../services/player.service';
import { EspnService, MatchInfo } from '../../services/espn.service';

interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
}

interface ActivityItem {
  user: string;
  action: string;
  match: string;
  stars: string;
  time: string;
}

interface ListItem {
  icon: string;
  title: string;
  author: string;
  description: string;
  likes: number;
  views: string;
  items: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  topPlayers: PlayerData[] = [];
  playersLoading = true;

  trendingMatches: MatchInfo[] = [];
  trendingLoading = true;

  private subs = new Subscription();

  constructor(
    private playerService: PlayerService,
    private espnService: EspnService,
    private cdr: ChangeDetectorRef
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
      this.espnService.getAllMatches().subscribe({
        next: (matches) => {
          this.trendingMatches = this.pickTrending(matches);
          this.trendingLoading = false;
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

  // Pick 4 interesting matches: one per sport if possible, prefer completed
  private pickTrending(matches: MatchInfo[]): MatchInfo[] {
    const completed = matches.filter(m => m.completed);
    const upcoming = matches.filter(m => !m.completed);
    const pool = completed.length >= 4 ? completed : [...completed, ...upcoming];

    const sportOrder = ['basketball', 'football', 'baseball', 'soccer'];
    const picked: MatchInfo[] = [];
    const usedSports = new Set<string>();

    for (const sport of sportOrder) {
      const m = pool.find(x => x.sport === sport && !picked.includes(x));
      if (m) {
        picked.push(m);
        usedSports.add(sport);
      }
      if (picked.length >= 4) break;
    }

    // Fill remaining slots with any sport, highest-rated first
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
      icon: 'bi-person-plus',
      title: 'Crea tu perfil',
      description: 'Regístrate gratis y personaliza tu perfil con tus deportes y equipos favoritos.'
    },
    {
      icon: 'bi-star',
      title: 'Califica partidos',
      description: 'Registra los partidos que ves, deja reseñas y calificaciones con estrellas.'
    },
    {
      icon: 'bi-people',
      title: 'Únete a la comunidad',
      description: 'Sigue a otros fans, comparte listas y compite en predicciones deportivas.'
    }
  ];

  recentActivity: ActivityItem[] = [
    {
      user: 'Carlos M.',
      action: 'calificó un partido',
      match: 'Arsenal vs Liverpool',
      stars: '★★★★★',
      time: 'hace 2m'
    },
    {
      user: 'Ana R.',
      action: 'escribió una reseña',
      match: 'Real Madrid vs Barcelona',
      stars: '★★★★☆',
      time: 'hace 5m'
    },
    {
      user: 'Diego L.',
      action: 'creó una lista',
      match: 'Mejores Finales UCL',
      stars: '',
      time: 'hace 8m'
    },
    {
      user: 'Sofia P.',
      action: 'calificó un partido',
      match: 'Lakers vs Celtics',
      stars: '★★★★★',
      time: 'hace 12m'
    }
  ];

  popularLists: ListItem[] = [
    {
      icon: 'bi-trophy-fill',
      title: 'Mejores Finales de Champions',
      author: 'CarlosUCL',
      description: 'Las finales de Champions League más emocionantes de la historia.',
      likes: 1243,
      views: '8.2k',
      items: 25
    },
    {
      icon: 'bi-lightning-fill',
      title: 'Derbis Más Intensos',
      author: 'DerbiMaster',
      description: 'Los derbis locales que definieron rivalidades legendarias.',
      likes: 876,
      views: '5.6k',
      items: 18
    },
    {
      icon: 'bi-star-fill',
      title: 'Actuaciones de 5 Estrellas',
      author: 'TopReviewer',
      description: 'Partidos con calificación perfecta según la comunidad.',
      likes: 2105,
      views: '12.1k',
      items: 42
    }
  ];

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}
