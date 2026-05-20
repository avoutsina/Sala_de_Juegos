import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  usuario: User | null = null;
  private sub!: Subscription;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
  ) {}

  ngOnInit() {
    // ✅ Requisito: detectar si el usuario está logueado o no
    this.sub = this.supabaseService.usuario$.subscribe((u) => {
      this.usuario = u;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async cerrarSesion() {
    await this.supabaseService.logout();
    this.router.navigate(['/home']);
  }

  get nombreMostrado(): string {
    return this.usuario?.email ?? 'Usuario';
  }
}
