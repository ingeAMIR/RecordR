import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EspnService, MatchInfo } from '../../services/espn.service';
import { OpinionService, Opinion } from '../../services/opinion.service';
import { AuthService, User } from '../../services/auth.service';
import { RatingService } from '../../services/rating.service';
import { ListsService, UserList } from '../../services/lists.service';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.scss'
})
export class MatchDetailComponent implements OnInit, OnDestroy {
  matchId: string | null = null;
  match: MatchInfo | null = null;
  loading = true;

  showRatingInput = false;
  hoverRating = 0;
  userRated = false;
  userRatingModel = 0;

  newOpinion = '';
  opinions: Opinion[] = [];
  loadingOpinions = true;

  userLists: UserList[] = [];
  showListsModal = false;

  currentUser: User | null = null;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private espnService: EspnService,
    private opinionService: OpinionService,
    private authService: AuthService,
    private ratingService: RatingService,
    private listsService: ListsService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.authService.currentUser$.subscribe(u => {
        this.currentUser = u;
        if (this.isLoggedIn) {
          this.loadUserLists();
        }
      })
    );

    this.route.paramMap.subscribe(params => {
      this.matchId = params.get('id');
      if (this.matchId) {
        this.espnService.getMatchById(this.matchId).subscribe(m => {
          if (m) {
            this.match = m;
            this.loadUserRating();
          }
          this.loading = false;
        });
        this.loadOpinions();
      } else {
        this.loading = false;
        this.loadingOpinions = false;
      }
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  // ── Listas ───────────────────────────────────────────────────────────────

  loadUserLists(): void {
    this.listsService.getLists().subscribe(lists => {
      this.userLists = lists;
    });
  }

  openListsModal(): void {
    if (!this.isLoggedIn) return;
    this.showListsModal = true;
  }

  closeListsModal(): void {
    this.showListsModal = false;
  }

  addToList(list: UserList): void {
    if (!this.match || !this.isLoggedIn) return;
    const item = {
      matchId: this.match.id,
      matchName: `${this.match.homeTeam} vs ${this.match.awayTeam}`,
      matchDate: this.match.date,
      leagueName: this.match.league
    };
    this.listsService.addMatch(list.id, item).subscribe({
      next: () => {
        alert(`Añadido a la lista "${list.name}"`);
        this.closeListsModal();
      },
      error: () => {
        // Asume que si falla es porque ya está en la lista (basado en el unique constraint)
        alert('Este partido ya está en la lista.');
        this.closeListsModal();
      }
    });
  }

  // ── Datos del usuario actual ─────────────────────────────────────────────

  get userName(): string {
    return this.currentUser?.username || 'Anónimo';
  }

  get avatarUrl(): string {
    if (this.currentUser?.avatar) return this.currentUser.avatar;
    const name = encodeURIComponent(this.userName);
    return `https://ui-avatars.com/api/?name=${name}&background=00e054&color=000`;
  }

  get isLoggedIn(): boolean { return !!this.currentUser; }

  // ── Opiniones ─────────────────────────────────────────────────────────────

  loadOpinions(): void {
    if (!this.matchId) return;
    this.loadingOpinions = true;
    this.opinionService.getOpinionsByMatch(this.matchId, this.userName).subscribe({
      next: data => {
        const top = data.filter(o => !o.parentId);
        top.forEach(t => {
          t.replies = data.filter(r => r.parentId === t.id).reverse();
          t.showReplyInput = false;
          t.newReplyText = '';
        });
        this.opinions = top;
        this.loadingOpinions = false;
      },
      error: () => { this.loadingOpinions = false; }
    });
  }

  addOpinion(): void {
    if (!this.newOpinion.trim() || !this.matchId) return;
    if (!this.isLoggedIn) return;

    const content = this.newOpinion;
    const temp: Opinion = {
      id: Date.now(), user: this.userName, avatar: this.avatarUrl,
      text: content, likes: 0, time: 'Enviando...'
    };
    this.opinions.unshift(temp);
    this.newOpinion = '';

    this.opinionService.addOpinion(this.matchId, this.userName, this.avatarUrl, content).subscribe({
      next: saved => {
        const idx = this.opinions.findIndex(o => o.id === temp.id);
        if (idx !== -1) this.opinions[idx] = saved;
      },
      error: () => { this.opinions = this.opinions.filter(o => o.id !== temp.id); }
    });
  }

  likeOpinion(o: Opinion): void {
    if (!this.isLoggedIn) return;
    const wasLiked = o.likedByMe;
    o.likedByMe = !wasLiked;
    o.likes += wasLiked ? -1 : 1;

    this.opinionService.likeOpinion(o.id, this.userName).subscribe({
      next: res => {
        if (o.likedByMe !== res.liked) {
          o.likedByMe = res.liked;
          o.likes += res.liked ? 1 : -1;
        }
      },
      error: () => { o.likedByMe = wasLiked; o.likes += wasLiked ? 1 : -1; }
    });
  }

  toggleReplyInput(opinion: Opinion): void {
    opinion.showReplyInput = !opinion.showReplyInput;
  }

  submitReply(parent: Opinion): void {
    if (!parent.newReplyText?.trim() || !this.matchId || !this.isLoggedIn) return;
    const content = parent.newReplyText;

    const temp: Opinion = {
      id: Date.now(), user: this.userName, avatar: this.avatarUrl,
      text: content, likes: 0, time: 'Enviando...', parentId: parent.id
    };
    if (!parent.replies) parent.replies = [];
    parent.replies.push(temp);
    parent.newReplyText = '';
    parent.showReplyInput = false;

    this.opinionService.addOpinion(this.matchId, this.userName, this.avatarUrl, content, parent.id).subscribe({
      next: saved => {
        const idx = parent.replies!.findIndex(o => o.id === temp.id);
        if (idx !== -1) parent.replies![idx] = saved;
      },
      error: () => { parent.replies = parent.replies!.filter(o => o.id !== temp.id); }
    });
  }

  // ── Calificación ──────────────────────────────────────────────────────────

  loadUserRating(): void {
    if (!this.matchId || !this.isLoggedIn) return;
    this.ratingService.getUserRating(this.matchId, this.currentUser!.id).subscribe(r => {
      if (r) { this.userRatingModel = r; this.userRated = true; }
    });
  }

  rateMatch(star: number): void {
    if (!this.matchId || !this.isLoggedIn) return;
    this.userRatingModel = star;
    this.userRated = true;
    this.showRatingInput = false;

    this.ratingService.saveRating(this.matchId, this.currentUser!.id, star).subscribe(res => {
      if (this.match && res.avgRating) {
        this.match.rating = Math.round(res.avgRating * 10) / 10;
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getStars(rating: number): string {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3;
    let s = '★'.repeat(full);
    if (hasHalf) s += '½';
    s += '☆'.repeat(Math.max(0, 5 - full - (hasHalf ? 1 : 0)));
    return s;
  }
}
