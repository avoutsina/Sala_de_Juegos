import { Component, inject, signal } from '@angular/core';
import { Carta } from './carta';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-mayor-omenor',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mayor-o-menor.html',
  styleUrl: './mayor-o-menor.css',
})
export class MayorOMenor {
  authService = inject(Auth);

  noEligio: boolean = true;

  valores = [
    { valor: 'A', numero: 1 },
    { valor: '2', numero: 2 },
    { valor: '3', numero: 3 },
    { valor: '4', numero: 4 },
    { valor: '5', numero: 5 },
    { valor: '6', numero: 6 },
    { valor: '7', numero: 7 },
    { valor: '8', numero: 8 },
    { valor: '9', numero: 9 },
    { valor: 'J', numero: 11 },
    { valor: 'Q', numero: 12 },
    { valor: 'K', numero: 13 },
  ];

  figuras = [
    { figura: '♠', color: 'negro' },
    { figura: '♣', color: 'negro' },
    { figura: '♥', color: 'rojo' },
    { figura: '♦', color: 'rojo' },
  ];

  cartaActual: Carta = this.generarCarta();
  cartaNueva: Carta | null = null;
  puntaje: number = 0;
  mensaje: string = '';
  vidas: number = 5;
  cartasAcertadas: number = 0;

  juegoIniciado = signal<boolean>(false);

  generarCarta(): Carta {
    const valor = this.valores[Math.floor(Math.random() * this.valores.length)];
    const figura = this.figuras[Math.floor(Math.random() * this.figuras.length)];
    return {
      valor: valor.valor,
      numero: valor.numero,
      figura: figura.figura,
      color: figura.color as 'rojo' | 'negro',
    };
  }

  adivinarCarta(opcion: 'mayor' | 'menor') {
    this.cartaNueva = this.generarCarta();
    this.noEligio = false;

    if (
      (opcion === 'mayor' && this.cartaNueva.numero > this.cartaActual.numero) ||
      (opcion === 'menor' && this.cartaNueva.numero < this.cartaActual.numero)
    ) {
      this.puntaje += 5;
      this.cartasAcertadas++;
      this.mensaje = '¡Acertaste! 🎉';
    } else if (this.cartaNueva.numero === this.cartaActual.numero) {
      this.mensaje = '¡Empate! 😐';
    } else {
      this.mensaje = 'No acertaste 😢';
      this.vidas -= 1;

      if (this.vidas <= 0) {
        this.guardarResultado();
        Swal.fire({
          icon: 'error',
          title: 'Juego Terminado',
          text: '¡Perdiste todas tus vidas!',
        }).then((res) => {
          if (res.isDismissed || res.isConfirmed) {
            this.alternarJuegoIniciado();
          }
        });
      }
    }
  }

  siguiente() {
    if (this.cartaNueva) {
      this.cartaActual = this.cartaNueva;
    }
    this.noEligio = true;
    this.mensaje = '';
  }

  async guardarResultado() {
    const { data } = await this.authService.supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    await this.authService.supabase.from('resultados_mayor_menor').insert({
      id_usuario: userId,
      cartas_acertadas: this.cartasAcertadas,
      puntaje: this.puntaje,
    });
  }

  resetearJuego() {
    this.puntaje = 0;
    this.vidas = 5;
    this.cartasAcertadas = 0;
    this.mensaje = '';
    this.noEligio = true;
    this.cartaActual = this.generarCarta();
    this.cartaNueva = null;
  }

  alternarJuegoIniciado() {
    this.juegoIniciado.update((v) => !v);
    this.resetearJuego();
  }
}
