import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { GitModel } from '../Models/gitModel';

@Injectable({
  providedIn: 'root',
})
export class ApiGitService {
  // Primer paso: inyectar el servicio
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://api.github.com/users/avoutsina';

  // Signal para almacenar el usuario actual
  usuarioActual = signal<GitModel | null>(null);

  getUser(): void {
    // Segundo paso: crear la petición
    const peticion: Observable<GitModel> = this.http.get<GitModel>(this.apiUrl);

    // Tercer paso: suscribirnos y definir qué hacemos con la respuesta
    const suscripcion: Subscription = peticion.subscribe((respuesta) => {
      this.usuarioActual.set(respuesta);

      // Último paso: cerrar la suscripción para no seguir escuchando
      suscripcion.unsubscribe();
    });
  }
}
