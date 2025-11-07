import { Component, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  title = 'Music Player';
searchQuery: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Opcional: tracking de rutas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navegación a:', event.url);
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Navegar a la ruta de búsqueda con el término como parámetro
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }

  backToHome(): void {
    this.router.navigate(['/']);
    this.searchQuery = '';
  }

  isSearchRoute(): boolean {
    return this.router.url.includes('/search');
  }
}
