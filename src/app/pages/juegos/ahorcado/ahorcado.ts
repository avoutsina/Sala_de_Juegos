import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-ahorcado',
  imports: [FormsModule, TitleCasePipe, UpperCasePipe, RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado {
  http = inject(HttpClient);
  authService = inject(Auth);

  private jsonUrl = 'assets/palabras.json';

  palabra = signal<string | null>(null);
  categoria = signal<string>('animales');
  juegoIniciado = signal<boolean>(false);
  ganar = signal<boolean>(false);
  vidas: number = 6;
  puntos: number = 0;
  iterarFotos: number = 0;

  letrasElegidas = signal<string[]>([]);
  alfabeto = 'abcdefghijklmnñopqrstuvwxyz'.split('');

  private tiempoInicio: number = 0;

  ngOnInit() {
    this.categoria.set('animales');
  }

  getPalabras(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }

  traerPalabras() {
    this.getPalabras().subscribe((res) => {
      const array: string[] = res[this.categoria()];
      const random = Math.floor(Math.random() * array.length);
      this.palabra.set(array[random].toLowerCase());
      this.juegoIniciado.set(true);
      this.tiempoInicio = Date.now();
    });
  }

  display = computed(() => {
    const p = this.palabra();
    return p?.split('').map((letra) => {
      const lower = letra.toLowerCase();
      return this.letrasElegidas().includes(lower) || lower === ' ' ? letra : '_';
    });
  });

  chequearVictoria(): boolean {
    const p = this.palabra();
    if (!p) return false;
    const todas = p
      .split('')
      .every((letra) => letra === ' ' || this.letrasElegidas().includes(letra.toLowerCase()));
    if (todas) {
      this.ganar.set(true);
      return true;
    }
    return false;
  }

  adivinar(letra: string) {
    if (this.letrasElegidas().includes(letra)) return;
    this.letrasElegidas.update((prev) => [...prev, letra]);

    if (!this.palabra()!.includes(letra)) {
      this.vidas -= 1;
      this.iterarFotos++;

      if (this.vidas <= 0) {
        this.guardarResultado(false);
        Swal.fire({
          icon: 'error',
          title: 'Juego Terminado',
          text: '¡Perdiste todas tus vidas!',
        }).then((result) => {
          if (result.isConfirmed) this.reiniciar();
        });
        return;
      }
    }

    if (this.chequearVictoria()) {
      Swal.fire({
        title: '¡Acertaste!',
        text: '¡Vamos a la siguiente palabra!',
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.puntos += 10;
          this.letrasElegidas.set([]);
          this.vidas = 6;
          this.iterarFotos = 0;
          this.ganar.set(false);
          this.traerPalabras();
        }
      });
    }
  }

  async guardarResultado(gano: boolean) {
    const tiempoFinalizacion = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const { data } = await this.authService.supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    await this.authService.supabase.from('resultados_ahorcado').insert({
      id_usuario: userId,
      tiempo_finalizacion: tiempoFinalizacion,
      letras_seleccionadas: this.letrasElegidas().length,
      puntaje: this.puntos,
      gano: gano,
    });
  }

  reiniciar() {
    this.palabra.set(null);
    this.letrasElegidas.set([]);
    this.juegoIniciado.set(false);
    this.ganar.set(false);
    this.vidas = 6;
    this.iterarFotos = 0;
    this.puntos = 0;
  }

  getBackground() {
    const path = `/assets/Secuencia Ahorcado/${this.iterarFotos}.png`;
    return `url('${encodeURI(path)}')`;
  }
}
