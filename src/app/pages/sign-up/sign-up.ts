import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class SignUp {
  email = '';
  nombre = '';
  apellido = '';
  edad: number | null = null;
  password = '';
  confirmarPassword = '';

  cargando = false;
  errorMsg = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
  ) {}

  async onSubmit() {
    this.errorMsg = '';

    // Validaciones
    if (
      !this.email ||
      !this.nombre ||
      !this.apellido ||
      !this.edad ||
      !this.password ||
      !this.confirmarPassword
    ) {
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
    if (this.password !== this.confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.edad < 1 || this.edad > 120) {
      this.errorMsg = 'La edad debe estar entre 1 y 120.';
      return;
    }

    this.cargando = true;
    try {
      // signUp() ya hace login automático internamente
      await this.supabaseService.signUp(
        this.email,
        this.password,
        this.nombre,
        this.apellido,
        this.edad,
      );
      // ✅ Requisito: iniciar sesión y navegar automáticamente al Home
      this.router.navigate(['/home']);
    } catch (error: any) {
      // ✅ Requisito: emitir mensaje si el usuario ya está registrado
      if (
        error?.message?.includes('already registered') ||
        error?.message?.includes('User already registered')
      ) {
        this.errorMsg = 'Este email ya se encuentra registrado.';
      } else {
        this.errorMsg = error?.message ?? 'Ocurrió un error. Intentá de nuevo.';
      }
    } finally {
      this.cargando = false;
    }
  }
}
