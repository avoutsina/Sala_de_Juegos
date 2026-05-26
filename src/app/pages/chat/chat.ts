import { Component, inject, signal } from '@angular/core';
import { Mensaje } from '../../interfaces/mensaje';
import { Realtime } from '../../services/realtime';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-chat',
  imports: [DatePipe, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private realtimeService = inject(Realtime);
  private authService = inject(Auth);

  mensajes = signal<Mensaje[]>([]);
  userId: string | null = null;
  msj: string = '';

  async ngOnInit() {
    const { data } = await this.authService.supabase.auth.getUser();
    this.userId = data.user?.id ?? null;

    const mensajesPrevios = await this.realtimeService.traerTodosFijo();
    this.mensajes.set(mensajesPrevios);

    this.realtimeService.channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat' }, (payload) => {
        this.mensajes.update((anterior) => {
          anterior.push(payload.new as Mensaje);
          return anterior.slice();
        });
      })
      .subscribe((status) => {
        console.log('Estado canal realtime:', status);
      });
  }

  async enviarMensaje() {
    if (this.msj.trim().length === 0) return;

    const { data } = await this.authService.supabase.auth.getUser();
    const nombre = data.user?.user_metadata?.['nombre'] ?? data.user?.email ?? 'Anónimo';

    await this.realtimeService.crear(this.msj.trim(), nombre, this.userId as string);
    this.msj = '';
  }

  esMiMensaje(mensaje: Mensaje): boolean {
    return mensaje.id_usuario === this.userId;
  }
}
