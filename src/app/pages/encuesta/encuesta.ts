import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css',
})
export class Encuesta {
  private auth = inject(Auth);

  // ✅ Signals en lugar de propiedades simples
  enviado = signal(false);
  enviando = signal(false);
  error = signal('');

  generos = ['Acción', 'Estrategia', 'Deportes', 'Puzzle', 'Aventura'];
  frecuencias = ['Todos los días', 'Varias veces por semana', 'Fines de semana', 'Rara vez'];

  form = new FormGroup({
    nombre_apellido: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    edad: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(99),
    ]),
    telefono: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d{1,10}$/)]),
    pregunta_1: new FormControl<string>('', Validators.required),
    pregunta_2: new FormControl<string[]>([], this.checkboxRequired),
    pregunta_3: new FormControl<string>('', Validators.required),
  });

  checkboxRequired(control: AbstractControl): ValidationErrors | null {
    return (control.value as string[])?.length > 0 ? null : { required: true };
  }

  toggleGenero(genero: string) {
    const control = this.form.get('pregunta_2') as FormControl<string[]>;
    const actual: string[] = control.value ?? [];
    const nuevo = actual.includes(genero)
      ? actual.filter((g) => g !== genero)
      : [...actual, genero];
    control.setValue(nuevo);
    control.markAsTouched();
  }

  isGeneroSelected(genero: string): boolean {
    const valor = (this.form.get('pregunta_2') as FormControl<string[]>).value ?? [];
    return valor.includes(genero);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.enviando()) return;
    this.enviando.set(true);
    this.error.set('');

    const { data: sessionData } = await this.auth.supabase.auth.getSession();
    const v = this.form.value;

    const { error } = await this.auth.supabase
      .from('resultados_preguntados_encuesta')
      .insert({
        id_usuario: sessionData.session?.user.id,
        nombre_apellido: v.nombre_apellido,
        edad: v.edad,
        telefono: v.telefono,
        pregunta_1: v.pregunta_1,
        pregunta_2: v.pregunta_2,
        pregunta_3: v.pregunta_3,
      })
      .select();

    if (error) {
      this.error.set('Error al guardar: ' + error.message);
      this.enviando.set(false);
    } else {
      this.enviado.set(true);
    }
  }
}
