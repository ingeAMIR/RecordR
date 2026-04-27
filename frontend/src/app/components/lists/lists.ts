import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PlayList {
  id: string;
  title: string;
  author: string;
  description: string;
  itemsCount: number;
  likes: number;
  colorPrimary: string;
  colorSecondary: string;
  createdAt: number;
}

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lists.html',
  styleUrl: './lists.scss'
})
export class ListsComponent implements OnInit {
  lists: PlayList[] = [];
  showModal = false;

  // New list model
  newList = {
    title: '',
    description: ''
  };

  private readonly STORAGE_KEY = 'recordr_collections';

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.lists = JSON.parse(saved);
      } catch (e) {
        this.initializeDefaultLists();
      }
    } else {
      this.initializeDefaultLists();
    }
    
    // Sort logic: newest first
    this.sortLists();
  }

  initializeDefaultLists(): void {
    this.lists = [
      {
        id: '1',
        title: 'Grandes Remontadas',
        author: 'AlexSport',
        description: 'Todos los partidos donde el equipo pequeño dio la vuelta en los últimos 10 minutos.',
        itemsCount: 15,
        likes: 324,
        colorPrimary: '#2c3440',
        colorSecondary: '#14181c',
        createdAt: Date.now() - 1000000
      },
      {
        id: '2',
        title: 'Finales de Champions Clásicas',
        author: 'FutbolTotal',
        description: 'Las finales más emocionantes de la UEFA Champions League desde el 2000.',
        itemsCount: 8,
        likes: 512,
        colorPrimary: '#1a365d',
        colorSecondary: '#0f172a',
        createdAt: Date.now() - 2000000
      },
      {
        id: '3',
        title: 'Derbis Calientes',
        author: 'UltrasWorld',
        description: 'Partidos con más de 5 tarjetas rojas y muchísima tensión en la cancha.',
        itemsCount: 12,
        likes: 89,
        colorPrimary: '#450a0a',
        colorSecondary: '#1c1917',
        createdAt: Date.now() - 3000000
      }
    ];
    this.saveLists();
  }

  saveLists(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.lists));
    this.sortLists();
  }

  sortLists(): void {
    this.lists.sort((a, b) => b.createdAt - a.createdAt);
  }

  openModal(): void {
    this.newList = { title: '', description: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  createList(): void {
    if (!this.newList.title.trim()) return;

    // Generate random deep premium colors for the card
    const colors = [
      { p: '#064e3b', s: '#022c22' }, // Emerald
      { p: '#312e81', s: '#1e1b4b' }, // Indigo
      { p: '#701a75', s: '#4a044e' }, // Fuchsia
      { p: '#1e3a8a', s: '#172554' }, // Blue
      { p: '#831843', s: '#500724' }, // Pink/Rose
      { p: '#3b2f2f', s: '#1e1a1a' }  // Dark Brown/Gray
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newListObj: PlayList = {
      id: Date.now().toString(),
      title: this.newList.title.trim(),
      author: 'Usuario', // Mock author since there is no actual user logged in
      description: this.newList.description.trim(),
      itemsCount: 0,
      likes: 0,
      colorPrimary: randomColor.p,
      colorSecondary: randomColor.s,
      createdAt: Date.now()
    };

    this.lists.unshift(newListObj);
    this.saveLists();
    this.closeModal();
  }

  deleteList(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      this.lists = this.lists.filter(l => l.id !== id);
      this.saveLists();
    }
  }
}
