import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {
  authService = inject(Auth);
  ahorcado = signal<any[]>([]);
  mayorMenor = signal<any[]>([]);
  preguntados = signal<any[]>([]);
  encuentraBola = signal<any[]>([]);

  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.cargarTodos();
  }

  async cargarTodos() {
    this.cargando.set(true);
    this.error.set(null);

    const r1 = await this.authService.supabase
      .from('resultados_ahorcado')
      .select(
        'id_usuario, puntaje, tiempo_finalizacion, letras_seleccionadas, gano, usuarios(nombre, apellido)',
      )
      .order('puntaje', { ascending: false })
      .limit(10);

    const r2 = await this.authService.supabase
      .from('resultados_mayor_menor')
      .select('id_usuario, puntaje, cartas_acertadas, usuarios(nombre, apellido)')
      .order('puntaje', { ascending: false })
      .limit(10);

    const r3 = await this.authService.supabase
      .from('resultados_preguntados')
      .select('id_usuario, puntaje, usuarios(nombre, apellido)')
      .order('puntaje', { ascending: false })
      .limit(10);

    const r4 = await this.authService.supabase
      .from('resultados_encuentra_bola')
      .select('id_usuario, puntaje, usuarios(nombre, apellido)')
      .order('puntaje', { ascending: false })
      .limit(10);

    if (r1.error) this.error.set('Error en ahorcado: ' + r1.error.message);
    if (r2.error) this.error.set('Error en mayor/menor: ' + r2.error.message);
    if (r3.error) this.error.set('Error en preguntados: ' + r3.error.message);
    if (r4.error) this.error.set('Error en encuentra bola: ' + r4.error.message);

    this.ahorcado.set(r1.data ?? []);
    this.mayorMenor.set(r2.data ?? []);
    this.preguntados.set(r3.data ?? []);
    this.encuentraBola.set(r4.data ?? []);

    this.cargando.set(false);
  }

  getNombre(r: any): string {
    const u = r.usuarios;
    if (!u) return 'Desconocido';
    return `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim();
  }
}
