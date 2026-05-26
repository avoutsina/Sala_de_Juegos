import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados {
  private http = inject(HttpClient);
  authService = inject(Auth);

  pregunta = signal<string>('');
  respuestas = signal<string[]>([]);
  estaJugando = signal<boolean>(false);
  respuestasDeshabilitadas = signal<string[]>([]);

  private respuestaCorrecta?: string;
  private puntos = signal<number>(0);
  private vidas = signal<number>(5);

  ngOnInit() {}

  traerPregunta(): void {
    this.http.get<any[]>('https://the-trivia-api.com/v2/questions').subscribe({
      next: (data) => {
        const p = data[0];
        this.respuestaCorrecta = p.correctAnswer;
        const res = [p.correctAnswer, ...(p.incorrectAnswers ?? [])];
        this.pregunta.set(p?.question?.text ?? '(sin texto)');
        // Mezclar opciones
        this.respuestas.set(res.sort(() => Math.random() - 0.5));
        this.respuestasDeshabilitadas.set([]);
      },
      error: (err) => console.error('Error API:', err),
    });
  }

  chequearRespuesta(respuesta: string) {
    if (this.respuestasDeshabilitadas().includes(respuesta)) return;
    this.respuestasDeshabilitadas.update((arr) => [...arr, respuesta]);

    if (respuesta === this.respuestaCorrecta) {
      this.puntos.update((n) => n + 5);
      Swal.fire({ title: '¡Acertaste!', text: '¡Siguiente pregunta!' }).then(() =>
        this.traerPregunta(),
      );
    } else {
      this.vidas.update((n) => n - 1);
      if (this.vidas() <= 0) {
        this.guardarResultado();
        Swal.fire({ title: 'Juego terminado', text: '¡Sin vidas!' }).then(() => {
          this.estaJugando.set(false);
          this.reiniciar();
          this.traerPregunta();
        });
      }
    }
  }

  async guardarResultado() {
    const { data } = await this.authService.supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    await this.authService.supabase.from('resultados_preguntados').insert({
      id_usuario: userId,
      puntaje: this.puntos(),
    });
  }

  getPuntos() {
    return this.puntos();
  }
  getVidas() {
    return this.vidas();
  }

  reiniciar() {
    this.puntos.set(0);
    this.vidas.set(5);
  }

  comenzarPartida() {
    this.estaJugando.update((v) => !v);
    this.reiniciar();
    // Si está iniciando (no terminando), traer la primera pregunta
    if (this.estaJugando()) {
      this.traerPregunta();
    }
  }
}
