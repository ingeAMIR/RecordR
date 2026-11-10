import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VtService {
  matchId: string | null = null;

  nameFor(id: string): string | null {
    return this.matchId === id ? 'partido' : null;
  }
}
