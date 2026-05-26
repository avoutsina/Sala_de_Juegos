import { Component, inject } from '@angular/core';
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

  usuario = this.auth.usuarioActual;

  async cerrarSesion() {
    await this.auth.logOut();
    this.router.navigate(['/home']);
  }
}
