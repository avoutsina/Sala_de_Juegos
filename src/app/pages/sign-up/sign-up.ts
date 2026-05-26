import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class SignUp {
  private auth = inject(Auth);
  private router = inject(Router);

  formularioRegistro = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z]+$/),
    ]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z]+$/),
    ]),
    edad: new FormControl('', [Validators.required, Validators.min(15), Validators.max(100)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarPassword: new FormControl('', [Validators.required, this.validarPassword]),
  });

  async enviarFormulario() {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const { email, password, nombre, apellido, edad } = this.formularioRegistro.value;

    await this.auth.signUp(email!, password!, nombre!, apellido!, Number(edad));

    if (this.auth.returnEstado() === 'SIGNED_IN') {
      Swal.fire({ title: 'Registro exitoso', icon: 'success' }).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'El usuario ya se encuentra registrado o hubo un error.',
        icon: 'error',
      });
    }
  }

  validarPassword(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.parent) return null;
    const password = control.parent.get('password')?.value;
    if (!control.value || !password) return null;
    return control.value === password ? null : { iguales: true };
  }
}
