import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserList {
  id: number;
  name: string;
  description: string;
  icon: string;
  match_count: number;
}

export interface ListItem {
  espn_match_id: string;
  match_name: string;
  match_date: string;
  league_name: string;
}

@Injectable({ providedIn: 'root' })
export class ListsService {
  private base = `${environment.apiUrl}/api/lists`;

  constructor(private http: HttpClient) {}

  getLists(): Observable<UserList[]> {
    return this.http.get<UserList[]>(this.base)
      .pipe(catchError(() => of([])));
  }

  createList(name: string, description: string, icon = 'bi-collection'): Observable<UserList> {
    return this.http.post<UserList>(this.base, { name, description, icon });
  }

  deleteList(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  addMatch(listId: number, item: ListItem): Observable<any> {
    return this.http.post(`${this.base}/${listId}/items`, item);
  }

  removeMatch(listId: number, matchId: string): Observable<any> {
    return this.http.delete(`${this.base}/${listId}/items/${matchId}`);
  }
}
