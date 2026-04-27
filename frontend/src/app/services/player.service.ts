import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface PlayerData {
  name: string;
  team: string;
  position: string;
  nationality: string;
  image: string;
  followers: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiBase = 'https://www.thesportsdb.com/api/v1/json/3';

  // Diverse set of popular players across sports
  private playerQueries = [
    { search: 'Vinicius Junior', fallbackFollowers: '45.2k' },
    { search: 'Erling Haaland', fallbackFollowers: '38.7k' },
    { search: 'Kylian Mbappe', fallbackFollowers: '52.1k' },
    { search: 'Jude Bellingham', fallbackFollowers: '33.4k' },
    { search: 'Mohamed Salah', fallbackFollowers: '41.8k' },
    { search: 'Lamine Yamal', fallbackFollowers: '28.9k' },
  ];

  constructor(private http: HttpClient) {}

  getPopularPlayers(): Observable<PlayerData[]> {
    const requests: Observable<PlayerData | null>[] = this.playerQueries.map(pq =>
      this.http.get<any>(`${this.apiBase}/searchplayers.php?p=${encodeURIComponent(pq.search)}`).pipe(
        map((response: any) => {
          const player = response?.player?.[0];
          if (!player) return null;

          const playerData: PlayerData = {
            name: player.strPlayer || pq.search,
            team: player.strTeam || 'Desconocido',
            position: this.translatePosition(player.strPosition || ''),
            nationality: player.strNationality || '',
            image: player.strCutout || player.strThumb || '',
            followers: pq.fallbackFollowers
          };

          return playerData.image ? playerData : null;
        }),
        catchError(() => of(null as PlayerData | null))
      )
    );

    return forkJoin(requests).pipe(
      map((results: (PlayerData | null)[]) =>
        results.filter((p): p is PlayerData => p !== null)
      )
    );
  }

  private translatePosition(position: string): string {
    const positionMap: Record<string, string> = {
      'Left Wing': 'Extremo Izquierdo',
      'Right Wing': 'Extremo Derecho',
      'Right Winger': 'Extremo Derecho',
      'Left Winger': 'Extremo Izquierdo',
      'Centre-Forward': 'Delantero Centro',
      'Forward': 'Delantero',
      'Striker': 'Delantero',
      'Centre-Back': 'Defensa Central',
      'Left-Back': 'Lateral Izquierdo',
      'Right-Back': 'Lateral Derecho',
      'Goalkeeper': 'Portero',
      'Central Midfield': 'Mediocampista',
      'Central Midfielder': 'Mediocampista',
      'Attacking Midfield': 'Mediapunta',
      'Defensive Midfield': 'Mediocentro Defensivo',
      'Midfielder': 'Mediocampista',
      'Small Forward': 'Alero',
      'Point Guard': 'Base',
      'Shooting Guard': 'Escolta',
      'Power Forward': 'Ala-Pívot',
      'Center': 'Pívot',
    };
    return positionMap[position] || position;
  }
}
