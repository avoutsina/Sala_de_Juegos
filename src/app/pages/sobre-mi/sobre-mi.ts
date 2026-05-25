import { Component, OnInit, signal } from '@angular/core';
import { GitModel } from '../../Models/gitModel';
import { ApiGitService } from '../../service/api-git.service';

@Component({
  selector: 'app-sobre-mi',
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.css',
})
export class SobreMi implements OnInit {
  user = signal<GitModel | null>(null);
  loading = signal<boolean>(true);

  abrirGit(url: string): void {
    window.open(url, '_blank');
  }

  constructor(private apiGitService: ApiGitService) {}

  ngOnInit(): void {
    this.apiGitService.getUser().subscribe({
      next: (data) => {
        this.user.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loading.set(false);
      },
    });
  }
}
