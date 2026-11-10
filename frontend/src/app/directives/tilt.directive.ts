import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

type Axis = 'x' | 'y' | 'g';

@Directive({
  selector: '[appTilt]',
  standalone: true,
  host: { class: 'tilt' }
})
export class TiltDirective implements OnInit, OnDestroy {
  @Input() tiltMax = 12;

  private el: HTMLElement = inject(ElementRef).nativeElement;
  private zone = inject(NgZone);
  private target: Record<Axis, number> = { x: 0, y: 0, g: 0 };
  private pos: Record<Axis, number> = { x: 0, y: 0, g: 0 };
  private vel: Record<Axis, number> = { x: 0, y: 0, g: 0 };
  private frame = 0;
  private cleanup: Array<() => void> = [];

  ngOnInit() {
    if (typeof matchMedia !== 'function') return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.zone.runOutsideAngular(() => {
      const move = (e: PointerEvent) => {
        const r = this.el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        this.target.x = nx * 2 - 1;
        this.target.y = ny * 2 - 1;
        this.target.g = 1;
        this.el.style.setProperty('--px', `${(nx * 100).toFixed(1)}%`);
        this.el.style.setProperty('--py', `${(ny * 100).toFixed(1)}%`);
        this.start();
      };
      const leave = () => {
        this.target.x = 0;
        this.target.y = 0;
        this.target.g = 0;
        this.start();
      };
      this.el.addEventListener('pointermove', move);
      this.el.addEventListener('pointerleave', leave);
      this.cleanup.push(
        () => this.el.removeEventListener('pointermove', move),
        () => this.el.removeEventListener('pointerleave', leave)
      );
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.cleanup.forEach(fn => fn());
  }

  private start() {
    if (!this.frame) this.frame = requestAnimationFrame(this.tick);
  }

  private tick = () => {
    let moving = false;
    for (const k of ['x', 'y', 'g'] as Axis[]) {
      this.vel[k] = (this.vel[k] + (this.target[k] - this.pos[k]) * 0.14) * 0.72;
      this.pos[k] += this.vel[k];
      if (Math.abs(this.vel[k]) > 0.0005 || Math.abs(this.target[k] - this.pos[k]) > 0.0005) moving = true;
    }
    const s = this.el.style;
    s.setProperty('--ry', `${(this.pos.x * this.tiltMax).toFixed(2)}deg`);
    s.setProperty('--rx', `${(-this.pos.y * this.tiltMax).toFixed(2)}deg`);
    s.setProperty('--tx', this.pos.x.toFixed(3));
    s.setProperty('--ty', this.pos.y.toFixed(3));
    s.setProperty('--glare', Math.max(0, this.pos.g).toFixed(3));
    this.frame = moving ? requestAnimationFrame(this.tick) : 0;
  };
}
