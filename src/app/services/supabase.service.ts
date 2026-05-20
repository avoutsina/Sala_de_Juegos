import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { enviroments } from '../environments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Observable del usuario actual — todos los componentes pueden suscribirse
  private _usuario = new BehaviorSubject<User | null>(null);
  usuario$ = this._usuario.asObservable();

  constructor() {
    this.supabase = createClient(enviroments.supabaseUrl, enviroments.supabaseKey);

    // Escuchar cambios de sesión en tiempo real (login / logout / refresh)
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._usuario.next(session?.user ?? null);
    });

    // Cargar sesión existente al iniciar la app
    this.supabase.auth.getSession().then(({ data }) => {
      this._usuario.next(data.session?.user ?? null);
    });
  }

  // ── AUTH ──────────────────────────────────────────────────────────────

  /** Inicia sesión con email y contraseña */
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  /**
   * Registra un nuevo usuario:
   * 1. Crea cuenta en Supabase Auth
   * 2. Inserta datos extra en la tabla `usuarios`
   * 3. Inicia sesión automáticamente con el mismo usuario
   */
  async signUp(email: string, password: string, nombre: string, apellido: string, edad: number) {
    // 1. Crear cuenta en Auth
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('No se obtuvo el ID del usuario.');

    // 2. Insertar fila en tabla `usuarios` (la contraseña NO se guarda aquí)
    const { error: insertError } = await this.supabase
      .from('usuarios')
      .insert([{ id: userId, email, nombre, apellido, edad }]);
    if (insertError) throw insertError;

    // 3. Login automático
    await this.login(email, password);

    return data;
  }

  /** Cierra la sesión */
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /** Retorna el usuario actual sincrónico */
  get usuarioActual(): User | null {
    return this._usuario.getValue();
  }

  // ── DB ────────────────────────────────────────────────────────────────

  async getData(tabla: string) {
    const { data, error } = await this.supabase.from(tabla).select('*');
    if (error) throw error;
    return data;
  }
}
