import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ActivityItem {
  user: string;
  action: string;
  matchId: string;
  stars: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly BASE_URL = `${environment.apiUrl}/api/activity`;

  constructor(private http: HttpClient) {}

  getRecentActivity(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(this.BASE_URL).pipe(
      catchError(() => of([]))
    );
  }
}
