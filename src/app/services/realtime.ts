import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import { Mensaje } from '../interfaces/mensaje';

@Injectable({
  providedIn: 'root',
})
export class Realtime {
  private authService = inject(Auth);

  public channel = this.authService.supabase.channel('table-db-changes');

  async traerTodosFijo(): Promise<Mensaje[]> {
    const { data, error } = await this.authService.supabase
      .from('chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error trayendo mensajes:', error);
      return [];
    }

    return data as Mensaje[];
  }

  async crear(mensaje: string, usuario: string, id_usuario: string): Promise<void> {
    const { error } = await this.authService.supabase
      .from('chat')
      .insert({ mensaje, usuario, id_usuario });

    if (error) console.error('Error enviando mensaje:', error);
  }
}
