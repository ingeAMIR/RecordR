import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EspnService, MatchInfo } from '../../services/espn.service';
import { FormsModule } from '@angular/forms';
import { OpinionService, Opinion } from '../../services/opinion.service';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.scss'
})
export class MatchDetailComponent implements OnInit {
  matchId: string | null = null;
  match: MatchInfo | null = null;
  loading = true;

  showRatingInput = false;
  hoverRating = 0;
  userRated = false;
  userRatingModel = 0;

  newOpinion: string = '';
  opinions: Opinion[] = [];
  loadingOpinions = true;

  constructor(
    private route: ActivatedRoute,
    private espnService: EspnService,
    private opinionService: OpinionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.matchId = params.get('id');
      if (this.matchId) {
        this.espnService.getMatchById(this.matchId).subscribe(m => {
          if (m) {
            this.match = m;
          }
          this.loading = false;
        });
        
        // Load opinions from backend
        this.loadOpinions();
      } else {
        this.loading = false;
        this.loadingOpinions = false;
      }
    });
  }

  loadOpinions() {
    if (!this.matchId) return;
    this.loadingOpinions = true;
    const currentUser = 'Tú';
    this.opinionService.getOpinionsByMatch(this.matchId, currentUser).subscribe({
      next: (data) => {
        const topLevel = data.filter(o => !o.parentId);
        topLevel.forEach(t => {
          t.replies = data.filter(r => r.parentId === t.id).reverse(); // oldest first
          t.showReplyInput = false;
          t.newReplyText = '';
        });
        this.opinions = topLevel;
        this.loadingOpinions = false;
      },
      error: (err) => {
        console.error('Error loading opinions', err);
        this.loadingOpinions = false;
      }
    });
  }

  addOpinion() {
    if (this.newOpinion.trim() && this.matchId) {
      const content = this.newOpinion;
      const userName = 'Tú';
      const avatarUrl = 'https://ui-avatars.com/api/?name=Tu&background=0d6efd&color=fff';
      
      // Optimizacion: añadir optimísticamente
      const tempOpinion: Opinion = {
        id: Date.now(),
        user: userName,
        avatar: avatarUrl,
        text: content,
        likes: 0,
        time: 'Enviando...'
      };
      
      this.opinions.unshift(tempOpinion);
      this.newOpinion = '';

      this.opinionService.addOpinion(this.matchId, userName, avatarUrl, content).subscribe({
        next: (savedOpinion) => {
          // Reemplazar la opinion temporal con la guardada que tiene id y fecha real
          const index = this.opinions.findIndex(o => o.id === tempOpinion.id);
          if (index !== -1) {
            this.opinions[index] = savedOpinion;
          }
        },
        error: (err) => {
          console.error('Error saving opinion', err);
          // Quitar en caso de error o mostrar mensaje
          this.opinions = this.opinions.filter(o => o.id !== tempOpinion.id);
        }
      });
    }
  }

  likeOpinion(o: Opinion) {
    const currentUser = 'Tú';
    const wasLiked = o.likedByMe;
    
    // Optimistic UI update
    o.likedByMe = !wasLiked;
    o.likes += wasLiked ? -1 : 1;

    this.opinionService.likeOpinion(o.id, currentUser).subscribe({
      next: (res) => {
        // Enforce the server's exact state if it didn't match the toggle
        if (o.likedByMe !== res.liked) {
          o.likedByMe = res.liked;
          o.likes += res.liked ? 1 : -1;
        }
      },
      error: (err) => {
        console.error('Error liking opinion', err);
        // Revert optimistic update on failure
        o.likedByMe = wasLiked;
        o.likes += wasLiked ? 1 : -1;
      }
    });
  }

  toggleReplyInput(opinion: Opinion) {
    opinion.showReplyInput = !opinion.showReplyInput;
  }

  submitReply(parent: Opinion) {
    if (parent.newReplyText && parent.newReplyText.trim() && this.matchId) {
      const content = parent.newReplyText;
      const userName = 'Tú';
      const avatarUrl = 'https://ui-avatars.com/api/?name=Tu&background=0d6efd&color=fff';

      const tempReply: Opinion = {
        id: Date.now(),
        user: userName,
        avatar: avatarUrl,
        text: content,
        likes: 0,
        time: 'Enviando...',
        parentId: parent.id
      };

      if (!parent.replies) parent.replies = [];
      parent.replies.push(tempReply);
      parent.newReplyText = '';
      parent.showReplyInput = false;

      this.opinionService.addOpinion(this.matchId, userName, avatarUrl, content, parent.id).subscribe({
        next: (savedOp) => {
          const idx = parent.replies!.findIndex(o => o.id === tempReply.id);
          if (idx !== -1) parent.replies![idx] = savedOp;
        },
        error: (err) => {
          console.error(err);
          parent.replies = parent.replies!.filter(o => o.id !== tempReply.id);
        }
      });
    }
  }

  getStars(rating: number): string {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3;
    let stars = '★'.repeat(full);
    if (hasHalf) stars += '½';
    const empty = 5 - full - (hasHalf ? 1 : 0);
    stars += '☆'.repeat(Math.max(0, empty));
    return stars;
  }

  rateMatch(star: number) {
    this.userRatingModel = star;
    if (this.match) {
      // Simulate an update to the match rating. 
      // For a real app, this would be an API call.
      const currentRating = this.match.rating;
      const fakeTotalVotes = 10; 
      this.match.rating = ((currentRating * fakeTotalVotes) + star) / (fakeTotalVotes + 1);
      
      // Round to 1 decimal
      this.match.rating = Math.round(this.match.rating * 10) / 10;
    }
    this.userRated = true;
    this.showRatingInput = false;
  }
}
