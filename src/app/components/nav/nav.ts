import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements OnInit, OnDestroy {
  usuario: User | null = null;
  private sub!: Subscription;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
  ) {}

  ngOnInit() {
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
}
