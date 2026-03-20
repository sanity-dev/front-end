export interface DisponibilidadSlot {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface Specialist {
  id: number;
  userId: number;
  email?: string;
  fotoPerfilUrl?: string | null;
  nombre?: string;
  tituloProfesional: string;
  presentacion: string;
  especialidades: string[];
  servicios: string[];
  disponibilidad: string;
  citas?: Appointment[];
}

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

export interface Appointment {
  id?: number;
  pacienteID: number;
  tipoSesion: string;
  fecha: Date | string;
  specialistUserId: number;
}

export interface CreateAppointmentDto {
  pacienteID: number;
  tipoSesion: string;
  fecha: string;
  specialistUserId: number;
}

export interface AuthUser {
  userId: number;
  nombre: string;
  correo: string;
  rol: 'TERAPEUTA' | 'USUARIO';
}

export interface JwtPayload {
  sub: string;
  rol?: 'TERAPEUTA' | 'USUARIO';
  exp?: number;
}

export function parseDisponibilidad(raw: string): DisponibilidadSlot[] {
  try { return JSON.parse(raw) ?? []; } catch { return []; }
}

export function stringifyDisponibilidad(slots: DisponibilidadSlot[]): string {
  return JSON.stringify(slots);
}