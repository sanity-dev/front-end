// ─── JWT Payload ──────────────────────────────────────────────────────────────
// Spring Boot pone: sub=correo + claims extra: userId, rol, nombre
export interface JwtPayload {
  sub: string;
  userId: number;
  rol: 'USUARIO' | 'TERAPEUTA';
  nombre: string;
  iat: number;
  exp: number;
}

// Usado por auth-helper.service.ts
export interface AuthUser {
  userId: number;
  nombre: string;
  correo: string;
  rol: 'USUARIO' | 'TERAPEUTA';
}

// ─── Disponibilidad ───────────────────────────────────────────────────────────
// Se guarda en BD como JSON.stringify(DisponibilidadSlot[])
export interface DisponibilidadSlot {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export function parseDisponibilidad(raw: string): DisponibilidadSlot[] {
  try { return JSON.parse(raw) ?? []; } catch { return []; }
}

export function stringifyDisponibilidad(slots: DisponibilidadSlot[]): string {
  return JSON.stringify(slots);
}

// ─── Entidades ────────────────────────────────────────────────────────────────
export interface Specialist {
  userId: number;
  tituloProfesional: string;
  presentacion: string;
  especialidades: string[];
  servicios: string[];
  disponibilidad: string;   // JSON stringificado
  nombre?: string;
  citas?: Appointment[];
}

export interface Appointment {
  id: number;
  pacienteID: number;
  tipoSesion: string;
  fecha: string;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface CreateSpecialistDto {
  userId: number;
  tituloProfesional: string;
  presentacion: string;
  especialidades: string[];
  servicios: string[];
  disponibilidad: string;
}

export interface UpdateSpecialistDto {
  tituloProfesional?: string;
  presentacion?: string;
  especialidades?: string[];
  servicios?: string[];
  disponibilidad?: string;
}

export interface CreateAppointmentDto {
  pacienteID: number;
  tipoSesion: string;
  fecha: string;
  specialistUserId: number;
}