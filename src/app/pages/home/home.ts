import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private auth = inject(Auth);
  private router = inject(Router);

  usuario = this.auth.usuarioActual;

  async cerrarSesion() {
    await this.auth.logOut();
    this.router.navigate(['/home']);
  }

  get nombreMostrado(): string {
    const meta = this.usuario()?.user_metadata;
    return meta?.['nombre'] ?? this.usuario()?.email ?? 'Usuario';
  }
}
