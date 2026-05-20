import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // ← AGREGAR
import { GitModel } from '../../Models/gitModel';
import { ApiGitService } from '../../services/api-git.service';

@Component({
  selector: 'app-sobre-mi',
  imports: [CommonModule], // ← AGREGAR
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.css',
})
export class SobreMi implements OnInit {
  // ← AGREGAR implements OnInit
  user: GitModel | null = null;
  loading: boolean = true;

  constructor(
    private apiGitService: ApiGitService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.apiGitService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
