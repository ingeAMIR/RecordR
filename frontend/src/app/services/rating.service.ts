import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private base = `${environment.apiUrl}/api/ratings`;

  constructor(private http: HttpClient) {}

  saveRating(matchId: string, userId: number, stars: number): Observable<{ avgRating: number }> {
    return this.http.post<{ avgRating: number }>(this.base, { matchId, userId, stars })
      .pipe(catchError(() => of({ avgRating: 0 })));
  }

  getUserRating(matchId: string, userId: number): Observable<number | null> {
    return this.http.get<{ stars: number | null }>(`${this.base}/${matchId}/user/${userId}`)
      .pipe(
        map(r => r.stars),
        catchError(() => of(null))
      );
  }

  getAvgRating(matchId: string): Observable<{ avgRating: number; count: number }> {
    return this.http.get<{ avgRating: number; count: number }>(`${this.base}/${matchId}`)
      .pipe(catchError(() => of({ avgRating: 0, count: 0 })));
  }
}
