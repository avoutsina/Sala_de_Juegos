import { Component, signal, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuentra-la-bola',
  imports: [FormsModule],
  templateUrl: './encuentra-la-bola.html',
  styleUrl: './encuentra-la-bola.css',
})
export class EncuentraLaBola implements AfterViewInit {
  authService = inject(Auth);
  constructor(private renderer: Renderer2) {}

  protected juegoIniciado = signal<boolean>(false);
  protected vidas: number = 5;
  protected puntos: number = 0;
  protected mensaje = signal<string>('');

  mostrarBola = signal<boolean>(true);
  posicionBola = signal<number | null>(null);

  comenzarJuego() {
    this.juegoIniciado.update((valor) => !valor);
    this.mostrarBola.set(true);
    this.mensaje.set('');
    this.posicionBola.set(null);
    this.vidas = 5;
    this.puntos = 0;
  }

  async guardarResultado() {
    const { data } = await this.authService.supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    await this.authService.supabase.from('resultados_encuentra_bola').insert({
      id_usuario: userId,
      puntaje: this.puntos,
    });
  }

  verificar(index: number) {
    if (this.posicionBola() === index) {
      Swal.fire({
        title: '¡Acertaste!',
        text: '¡Vamos a la siguiente ronda!',
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.puntos += 5;
          this.mostrarBola.set(true);
          this.mensaje.set('');
          this.posicionBola.set(null);
        }
      });
    } else if (this.posicionBola() != null) {
      this.vidas -= 1;
      if (this.vidas <= 0) {
        this.guardarResultado();
        Swal.fire({
          title: 'Juego Terminado',
          text: '¡Perdiste todas tus vidas!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.comenzarJuego();
          }
        });
      }
    }
  }

  private isShuffling = false;
  @ViewChild('vasosContainer', { static: false }) vasosContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      const imgs = this.getImgs();
      imgs.forEach((img) => {
        this.renderer.setStyle(img, 'display', 'inline-block');
        this.renderer.setStyle(img, 'transition', 'transform 100ms ease');
        this.renderer.setStyle(img, 'will-change', 'transform');
      });
    }, 0);
  }

  mezclar() {
    this.mostrarBola.set(false);
    this.posicionBola.set(Math.floor(Math.random() * 3) + 1);

    if (this.isShuffling) return;
    const imgs = this.getImgs();
    if (imgs.length < 3) return;

    this.isShuffling = true;

    const offsets = [-160, 0, 160];
    let mapping = [0, 1, 2];
    let ticks = 12;
    const tickInterval = 90;

    imgs.forEach((img) => {
      this.renderer.setStyle(img, 'transition', `transform ${tickInterval - 10}ms ease`);
    });

    const intervalId = window.setInterval(() => {
      const a = Math.floor(Math.random() * 3);
      let b = Math.floor(Math.random() * 3);
      while (b === a) b = Math.floor(Math.random() * 3);

      [mapping[a], mapping[b]] = [mapping[b], mapping[a]];

      imgs.forEach((img, i) => {
        const posIndex = mapping[i];
        const x = offsets[posIndex];
        const y = Math.random() > 0.5 ? -6 : 6;
        this.renderer.setStyle(img, 'transform', `translate(${x}px, ${y}px)`);
      });

      ticks--;
      if (ticks <= 0) {
        clearInterval(intervalId);
        setTimeout(() => {
          imgs.forEach((img) => {
            this.renderer.setStyle(img, 'transform', `translateX(0px)`);
          });
          setTimeout(() => {
            const parent = this.vasosContainer?.nativeElement;
            if (parent) {
              const nodes = Array.from(parent.querySelectorAll('img')) as HTMLImageElement[];
              for (let i = nodes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
              }
              nodes.forEach((n) => parent.appendChild(n));
            }
            setTimeout(() => {
              imgs.forEach((img) => {
                this.renderer.removeStyle(img, 'transform');
                this.renderer.removeStyle(img, 'transition');
                this.renderer.removeStyle(img, 'will-change');
                this.renderer.removeStyle(img, 'display');
              });
              this.mensaje.set('La bola esta en el vaso N°' + this.posicionBola());
              this.isShuffling = false;
            }, 80);
          }, 140);
        }, tickInterval + 10);
      }
    }, tickInterval);
  }

  private getImgs(): HTMLImageElement[] {
    try {
      const parent = this.vasosContainer?.nativeElement;
      if (!parent) return [];
      return Array.from(parent.querySelectorAll('img')) as HTMLImageElement[];
    } catch {
      return [];
    }
  }
}
