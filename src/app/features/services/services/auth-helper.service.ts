import { Injectable } from '@angular/core';
import { AuthUser, JwtPayload } from '../models/specialist.model';

@Injectable({ providedIn: 'root' })
export class AuthHelperService {

  // ─── Token ────────────────────────────────────────────────────────────────

  getBearerToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // ─── JWT (opcional, solo si el backend mete claims extra) ─────────────────

  getJwtPayload(): JwtPayload | null {
    const token = this.getBearerToken();
    if (!token) return null;
    try {
      const b64 = token.split('.')[1];
      return JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload;
    } catch {
      return null;
    }
  }

  getAuthUser(): AuthUser | null {
    const token = this.getBearerToken();
    if (!token) return null;

    // Prioridad: localStorage (guardado por AuthService desde PersonaDto)
    const userIdRaw = localStorage.getItem('userId');
    const userName  = localStorage.getItem('userName') ?? '';
    const correo    = localStorage.getItem('userEmail') ?? this.getJwtPayload()?.sub ?? '';

    if (!userIdRaw) return null;

    return {
      userId: Number(userIdRaw),
      nombre: userName,
      correo,
      rol: this.getRol(),
    };
  }

  // ─── Rol ──────────────────────────────────────────────────────────────────
  // AuthService guarda response.persona.tipoUsuario → 'TERAPEUTA' | 'USUARIO'

  getRol(): 'TERAPEUTA' | 'USUARIO' {
    const raw = (localStorage.getItem('userType') ?? '').trim().toUpperCase();

    if (raw === 'TERAPEUTA') return 'TERAPEUTA';
    if (raw === 'USUARIO')   return 'USUARIO';

    // Fallback: leer del JWT si el backend incluyó el claim
    const payload = this.getJwtPayload();
    if (payload?.rol) return payload.rol;

    return 'USUARIO';
  }

  isTherapist(): boolean { return this.getRol() === 'TERAPEUTA'; }
  isPatient():   boolean { return this.getRol() === 'USUARIO'; }
}