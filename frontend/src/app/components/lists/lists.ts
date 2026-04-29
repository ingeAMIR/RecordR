import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ListsService, UserList } from '../../services/lists.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lists.html',
  styleUrl: './lists.scss'
})
export class ListsComponent implements OnInit {
  lists: UserList[] = [];
  loading = true;
  showModal = false;
  isLoggedIn = false;

  newList = { title: '', description: '' };

  readonly ICONS = [
    'bi-collection', 'bi-trophy-fill', 'bi-star-fill',
    'bi-lightning-fill', 'bi-heart-fill', 'bi-fire',
    'bi-bookmark-fill', 'bi-flag-fill'
  ];
  selectedIcon = 'bi-collection';

  constructor(
    private listsService: ListsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.currentUserValue;
    if (this.isLoggedIn) this.loadLists();
    else this.loading = false;
  }

  loadLists(): void {
    this.loading = true;
    this.listsService.getLists().subscribe({
      next: lists => { this.lists = lists; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  openModal(): void {
    this.newList = { title: '', description: '' };
    this.selectedIcon = 'bi-collection';
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  createList(): void {
    if (!this.newList.title.trim()) return;
    this.listsService.createList(
      this.newList.title.trim(),
      this.newList.description.trim(),
      this.selectedIcon
    ).subscribe({
      next: list => {
        this.lists.unshift(list);
        this.closeModal();
      }
    });
  }

  deleteList(id: number): void {
    if (!confirm('¿Eliminar esta lista?')) return;
    this.listsService.deleteList(id).subscribe({
      next: () => { this.lists = this.lists.filter(l => l.id !== id); }
    });
  }
}
