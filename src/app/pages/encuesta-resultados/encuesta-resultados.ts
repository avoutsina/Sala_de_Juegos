import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-encuesta-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encuesta-resultados.html',
  styleUrl: './encuesta-resultados.css',
})
export class EncuestaResultados {
  auth = inject(Auth);
  respuestas = signal<any[]>([]);
  cargando = signal(true);

  async ngOnInit() {
    const { data, error } = await this.auth.supabase
      .from('resultados_preguntados_encuesta')
      .select('*, usuarios(nombre, apellido)')
      .order('created_at', { ascending: false });

    if (!error) this.respuestas.set(data ?? []);
    this.cargando.set(false);
  }
}
