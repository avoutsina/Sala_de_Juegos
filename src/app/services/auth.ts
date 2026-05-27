import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private url = 'https://agyvrqfvvwacjvgvmaxg.supabase.co';
  private key =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneXZycWZ2dndhY2p2Z3ZtYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzA5MjMsImV4cCI6MjA5NDgwNjkyM30.QikH07-vKeT3hgYW_UqtK_LfXRUsG1Mc9npSB5kxnzc';

  public supabase: SupabaseClient;

  // Signal reactivo: los componentes lo leen con usuarioActual()
  public usuarioActual = signal<User | null>(null);

  private estado: string = '';

  constructor() {
    this.supabase = createClient(this.url, this.key);

    // Escucha cambios de sesión en tiempo real (login, logout, refresh)
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.estado = event;
      this.usuarioActual.set(session?.user ?? null);
    });
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Error login:', error.message);
    else console.log('Login OK:', data);
  }

  async signUp(email: string, password: string, nombre: string, apellido: string, edad: number) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido, edad } },
    });

    if (error) {
      console.error('Error registro:', error.message);
      return;
    }

    // Insertar datos en la tabla pública
    const { error: errorTabla } = await this.supabase.from('usuarios').insert({
      id: data.user!.id,
      email,
      nombre,
      apellido,
      edad,
    });

    if (errorTabla) {
      console.error('Error guardando en tabla:', errorTabla.message);
    } else {
      console.log('Usuario guardado en tabla OK');
    }
  }

  async logOut() {
    await this.supabase.auth.signOut();
  }

  returnEstado(): string {
    return this.estado;
  }
}
