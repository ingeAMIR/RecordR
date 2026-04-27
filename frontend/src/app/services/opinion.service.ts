import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Opinion {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  likedByMe?: boolean;
  time: string;
  parentId?: number;
  replies?: Opinion[];
  showReplyInput?: boolean;
  newReplyText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpinionService {
  private readonly BASE_URL = `${environment.apiUrl}/api/opinions`;

  constructor(private http: HttpClient) {}

  getOpinionsByMatch(matchId: string, user: string): Observable<Opinion[]> {
    return this.http.get<Opinion[]>(`${this.BASE_URL}/${matchId}?user=${encodeURIComponent(user)}`);
  }

  addOpinion(matchId: string, userName: string, avatarUrl: string, content: string, parentId?: number): Observable<Opinion> {
    return this.http.post<Opinion>(this.BASE_URL, {
      espn_match_id: matchId,
      user_name: userName,
      avatar_url: avatarUrl,
      content: content,
      parent_id: parentId
    });
  }

  likeOpinion(opinionId: number, user: string): Observable<{ liked: boolean }> {
    return this.http.put<{ liked: boolean }>(`${this.BASE_URL}/${opinionId}/like`, { user });
  }
}
