import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GitModel } from '../Models/gitModel';

@Injectable({
  providedIn: 'root',
})
export class ApiGitService {
  private readonly apiUrl = 'https://api.github.com/users/avoutsina';

  constructor(private http: HttpClient) {}

  getUser(): Observable<GitModel> {
    return this.http.get<GitModel>(this.apiUrl);
  }
}
