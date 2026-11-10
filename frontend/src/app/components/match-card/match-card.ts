import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchInfo } from '../../services/espn.service';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-card.html',
  styleUrl: './match-card.scss',
  host: {
    '[class.is-deep]': 'deep',
    '[class.is-foil]': 'foil',
    '[style.--home]': 'match.homeColor',
    '[style.--away]': 'match.awayColor'
  }
})
export class MatchCard implements OnChanges {
  @Input({ required: true }) match!: MatchInfo;
  @Input() deep = false;

  day = '';
  kickoff = '';

  ngOnChanges(): void {
    const d = new Date(this.match.date);
    if (isNaN(d.getTime())) {
      this.day = '';
      this.kickoff = '';
      return;
    }
    this.day = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    this.kickoff = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  get live(): boolean {
    return this.match.status === 'in';
  }

  get hasScore(): boolean {
    return this.match.completed || this.live;
  }

  get foil(): boolean {
    return this.match.completed && this.match.rating >= 4.5;
  }

  get statusText(): string {
    if (this.live) return this.match.statusDetail || 'En vivo';
    if (this.match.completed) return this.match.statusDetail || 'Final';
    return 'Próximo';
  }
}
