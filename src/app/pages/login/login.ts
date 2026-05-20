import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

// ⚠️ Reemplazá con credenciales de usuarios reales registrados en tu Supabase
const USUARIOS_PRUEBA = [
  { email: 'prueba1@mail.com', password: 'prueba123' },
  { email: 'prueba2@mail.com', password: 'prueba123' },
  { email: 'prueba3@mail.com', password: 'prueba123' },
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  cargando = false;
  errorMsg = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
  ) {}

  /** Rellena los inputs con un usuario de prueba */
  cargarPrueba(indice: number) {
    const u = USUARIOS_PRUEBA[indice];
    this.email = u.email;
    this.password = u.password;
    this.errorMsg = '';
  }

  async onSubmit() {
    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completá todos los campos.';
      return;
    }
    if (!this.email.includes('@')) {
      this.errorMsg = 'El email ingresado no es válido.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.cargando = true;
    try {
      await this.supabaseService.login(this.email, this.password);
      // ✅ Requisito: navegar automáticamente al Home si el login es exitoso
      this.router.navigate(['/home']);
    } catch (error: any) {
      // ✅ Requisito: mostrar mensaje de error si el login falla
      if (
        error?.message?.includes('Invalid login credentials') ||
        error?.message?.includes('invalid_credentials')
      ) {
        this.errorMsg = 'Email o contraseña incorrectos.';
      } else if (error?.message?.includes('Email not confirmed')) {
        this.errorMsg = 'Debés confirmar tu email antes de iniciar sesión.';
      } else {
        this.errorMsg = 'Ocurrió un error inesperado. Intentá de nuevo.';
      }
    } finally {
      this.cargando = false;
    }
  }
}
