import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiGitService } from '../../services/api-git.service';

@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.css',
})
export class SobreMi implements OnInit {
  private apiGitService = inject(ApiGitService);

  // Se lee el signal directamente desde el servicio, sin duplicarlo
  user = this.apiGitService.usuarioActual;
  loading = signal<boolean>(true);

  abrirGit(url: string): void {
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    this.apiGitService.getUser();

    // Cuando el signal tenga datos, apagamos el loading
    const intervalo = setInterval(() => {
      if (this.user() !== null) {
        this.loading.set(false);
        clearInterval(intervalo);
      }
    }, 50);
  }
}
