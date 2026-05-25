import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true, // asegúrate de incluir esto si usas standalone components
  imports: [ RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'], // nota: es "styleUrls" (con 's')
})
export class Nav {
  constructor(public router: Router) {}
}
