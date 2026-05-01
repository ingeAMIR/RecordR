import { Component, HostListener, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('frontend');
  
  private mouseX = 0;
  private mouseY = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    // Update ambient background light tracking
    document.body.style.setProperty('--mouse-x', `${this.mouseX}px`);
    document.body.style.setProperty('--mouse-y', `${this.mouseY}px`);
    
    // Update the hard dot immediately
    const dot = document.getElementById('cursorDot');
    if (dot) {
      dot.style.left = `${this.mouseX}px`;
      dot.style.top = `${this.mouseY}px`;
    }

    // Update the trail position (CSS transition handles the smooth delay)
    const trail = document.getElementById('cursorTrail');
    if (trail) {
      trail.style.left = `${this.mouseX}px`;
      trail.style.top = `${this.mouseY}px`;
    }
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const isClickable = target.closest('a') || target.closest('button') || target.closest('.brand-glow') || target.closest('[routerLink]');
    
    const dot = document.getElementById('cursorDot');
    if (dot) {
      if (isClickable) {
        dot.classList.add('cursor-hovering');
      } else {
        dot.classList.remove('cursor-hovering');
      }
    }
  }

  ngAfterViewInit() {
    // Hide default cursor gracefully
    document.body.classList.add('custom-cursor-enabled');
  }
}
