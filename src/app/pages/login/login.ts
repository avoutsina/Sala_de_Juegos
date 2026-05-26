import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
const USUARIOS_PRUEBA = [
  { email: 'prueba1@mail.com', password: 'prueba123' },
  { email: 'prueba2@mail.com', password: 'prueba123' },
  { email: 'prueba3@mail.com', password: 'prueba123' },
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  cargando = false;
  errorMsg = '';

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  cargarPrueba(indice: number) {
    const u = USUARIOS_PRUEBA[indice];
    this.formularioLogin.setValue({ email: u.email, password: u.password });
    this.errorMsg = '';
  }

  async onSubmit() {
    this.errorMsg = '';

    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const { email, password } = this.formularioLogin.value;

    this.cargando = true;
    try {
      await this.auth.login(email!, password!);
      this.router.navigate(['/home']);
    } catch (error: any) {
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
