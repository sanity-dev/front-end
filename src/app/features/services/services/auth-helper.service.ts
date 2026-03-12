import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser, JwtPayload } from '../models/specialist.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthHelperService {
  private http = inject(HttpClient);

  getBearerToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getJwtPayload(): JwtPayload | null {
    const token = this.getBearerToken();
    if (!token) return null;
    try {
      const b64 = token.split('.')[1];
      return JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload;
    } catch { return null; }
  }

  getAuthUser(): AuthUser | null {
    const token = this.getBearerToken();
    if (!token) return null;

    // Intenta primero desde localStorage
    const userIdRaw = localStorage.getItem('userId');
    const userName  = localStorage.getItem('userName') ?? '';
    const correo    = localStorage.getItem('userEmail') ?? this.getJwtPayload()?.sub ?? '';
    const rol       = this.getRol();

    // Si userId está en localStorage úsalo
    if (userIdRaw) {
      return {
        userId: Number(userIdRaw),
        nombre: userName,
        correo,
        rol,
      };
    }

    // Si userId NO está en localStorage, busca el perfil y guárdalo
    // Mientras tanto retorna con userId=0 para no bloquear
    // y dispara la carga del perfil
    this.loadAndSaveUserId(correo);

    // Retorna con userId temporal desde el JWT sub si es número,
    // o 0 si es email (lo corregirá loadAndSaveUserId)
    return {
      userId: 0,
      nombre: userName,
      correo,
      rol,
    };
  }

  private loadAndSaveUserId(email: string): void {
    if (!email) return;
    const token = this.getBearerToken();
    if (!token) return;

    this.http.get<any[]>(`${environment.apiUrl}/api/personas`).subscribe({
      next: (personas) => {
        const found = personas.find((p: any) => p.correo === email);
        if (found) {
          localStorage.setItem('userId', String(found.idPersona));
          localStorage.setItem('userName', found.nombre ?? '');
          localStorage.setItem('userEmail', found.correo ?? '');
        }
      },
      error: () => {}
    });
  }

  getRol(): 'TERAPEUTA' | 'USUARIO' {
    const raw = (localStorage.getItem('userType') ?? '').trim().toUpperCase();
    if (raw === 'TERAPEUTA') return 'TERAPEUTA';
    if (raw === 'USUARIO')   return 'USUARIO';
    const payload = this.getJwtPayload();
    if (payload?.rol) return payload.rol;
    return 'USUARIO';
  }

  isTherapist(): boolean { return this.getRol() === 'TERAPEUTA'; }
  isPatient():   boolean { return this.getRol() === 'USUARIO'; }
}