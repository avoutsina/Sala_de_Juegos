import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav {
  private auth = inject(Auth);
  private router = inject(Router);

  exactMatch = { exact: true };

  usuario = this.auth.usuarioActual;
  mostrarJuegos = false;

  async cerrarSesion() {
    await this.auth.logOut();
    this.router.navigate(['/home']);
  }
  esAdmin = signal(false);

  constructor() {
    // Chequeá si el usuario es admin al detectar cambios de sesión
    effect(() => {
      const user = this.usuario();
      if (user) {
        this.auth.supabase
          .from('usuarios')
          .select('is_admin')
          .eq('id', user.id)
          .single()
          .then(({ data }) => this.esAdmin.set(data?.is_admin ?? false));
      } else {
        this.esAdmin.set(false);
      }
    });
  }
}
