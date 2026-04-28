import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterLink, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { routes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ToastModule],
  template: `
    <p-toast></p-toast>
    <main class="shell">
      <h1>HR Leaves Management</h1>
      <p class="muted">Demo employee id: 1. No authentication, per task assumptions.</p>
      <nav class="nav">
        <a routerLink="/">Dashboard</a>
        <a routerLink="/apply">Apply</a>
        <a routerLink="/approvals">Approvals</a>
        <a routerLink="/leave-types">Leave Types</a>
      </nav>
      <router-outlet></router-outlet>
    </main>`
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimations(), MessageService]
});
