import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { enviroments } from '../environments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(enviroments.supabaseUrl, enviroments.supabaseKey);
  }

  // Ejemplo: obtener datos de una tabla
  async getData(tabla: string) {
    const { data, error } = await this.supabase.from(tabla).select('*');

    if (error) throw error;
    return data;
  }
}
