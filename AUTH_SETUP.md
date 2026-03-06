# Configuración del Sistema de Autenticación

## Resumen
Se ha configurado un sistema completo de autenticación con login y registro que se comunica con tu backend.

## Archivos Creados/Modificados

### 1. **AuthService** (`src/app/core/services/auth.service.ts`)
Servicio principal que maneja la comunicación con el backend:
- `login(credentials)` - Inicio de sesión
- `register(data)` - Registro de nuevos usuarios
- `loginWithGoogle(token)` - Autenticación con Google
- `logout()` - Cierre de sesión
- `getToken()` - Obtiene el token JWT del localStorage
- `isAuthenticated()` - Verifica si el usuario está autenticado

### 2. **AuthInterceptor** (`src/app/core/interceptors/auth.interceptor.ts`)
Interceptor HTTP que:
- Automáticamente agrega el token JWT a todas las peticiones
- Maneja errores de autenticación (401)
- Limpia la sesión si el token expira

### 3. **AppConfig** (`src/app/app.config.ts`)
Configuración de Angular actualizada con:
- `provideHttpClient()` - Provedor de HTTP
- `AuthInterceptor` - Registrado globalmente

### 4. **Componentes Actualizados**
- `login-form.component.ts` - Ahora comunica con el backend
- `register-form.component.ts` - Ahora comunica con el backend

## Configuración Necesaria

### 1. Actualiza la URL del Backend
En `src/app/core/services/auth.service.ts`, línea 31:
```typescript
private apiUrl = 'http://localhost:3000/api/auth'; // Cambia esto a tu URL real
```

Ejemplo:
```typescript
private apiUrl = 'https://api.miproyecto.com/api/auth';
```

### 2. Endpoints del Backend Esperados

Tu backend debe tener estos endpoints:

#### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: { id, email, name } }
```

#### Registro
```
POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { token: string, user: { id, email, name } }
```

#### Google OAuth
```
POST /api/auth/google
Body: { token: string }
Response: { token: string, user: { id, email, name } }
```

## Flujo de Autenticación

1. **Usuario completa el formulario** → El componente valida los datos
2. **Se envía al backend** → AuthService realiza la petición HTTP
3. **Backend verifica credenciales** → Devuelve un JWT token
4. **Token se guarda** → Se almacena en localStorage
5. **Se agrega a peticiones** → AuthInterceptor lo incluye en headers
6. **Usuario se redirige** → Va al dashboard

## Token JWT

El token se almacena en `localStorage['authToken']` y se envía en el header:
```
Authorization: Bearer <token>
```

## Manejo de Errores

- **Credenciales incorrectas** - Se muestra mensaje de error en el formulario
- **Token expirado** - Se limpia automáticamente y se redirige al login
- **Errores de red** - Se muestra el error al usuario

## Próximos Pasos

1. ✅ El backend ya debe estar listo con estos endpoints
2. ⚙️ Configura la URL en `auth.service.ts`
3. 🧪 Prueba los formularios de login y registro
4. 🛡️ Implementa Guards para rutas protegidas (opcional)
5. 🚀 Implementa refresh token (opcional, para mejor seguridad)

## Guards de Ruta (Opcional)

Si necesitas rutas protegidas, crea un guard:
```typescript
// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

Úsalo en rutas:
```typescript
const routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];
```
