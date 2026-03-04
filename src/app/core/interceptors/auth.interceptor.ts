import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // No enviar token en rutas de autenticación (login, registro, etc.)
    const isAuthUrl = request.url.includes('/api/auth/');

    // Agrega el token al header si existe y no es una ruta de auth
    if (token && !isAuthUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Maneja errores de autenticación
        if (error.status === 401) {
          this.authService.logout();
          console.warn('Token expirado o inválido');
          // Aquí puedes redirigir al login si es necesario
        }
        return throwError(() => error);
      })
    );
  }
}
