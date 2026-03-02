# FASE 2: Servicios HTTP - Documentación

## Servicios Creados

### 1. **ApiService** (`api.service.ts`)
Servicio base HTTP con:
- Manejo automático de tokens JWT
- Headers con autorización Bearer
- Manejo centralizado de errores
- Métodos: `get()`, `post()`, `put()`, `delete()`, `patch()`, `postPublic()`

### 2. **AuthHttpService** (`auth-http.service.ts`)
Autenticación con backend:
- `login(credentials)` - Login OAuth2
- `register(data)` - Registro de usuario
- `getCurrentUser()` - Obtener usuario actual
- `refreshToken()` - Refrescar token JWT
- `logout()` - Cerrar sesión
- `isAuthenticated()` / `isAuthenticated$` - Estado de autenticación

### 3. **UserHttpService** (`user-http.service.ts`)
Datos del usuario:
- `getProfile()` - Perfil completo
- `getBalance()` - Balance actual
- `getStats()` - Estadísticas
- `getLevel()` - Nivel y progreso
- `updateProfile(data)` - Actualizar perfil

### 4. **GameHttpService** (`game-http.service.ts`)
Lógica del juego:
- **Taps**: `processTaps(count)`, `getTapConfig()`
- **Energía**: `getEnergy()`, `recoverEnergy()`
- **Boosts**: `getBoosts()`, `getUserBoosts()`, `purchaseBoost(id)`
- **Game State**: `getGameState()`, `useSpin()`

### 5. **WalletHttpService** (`wallet-http.service.ts`)
Billetera y transacciones:
- `getWalletInfo()` - Información de wallet
- `getTransactions(page, pageSize)` - Historial
- `getDepositMethods()` - Métodos de depósito
- `createDeposit(data)` - Crear depósito
- `createWithdrawal(data)` - Crear retiro

### 6. **PlayersHttpService** (`players-http.service.ts`)
Jugadores/NFT:
- `getPlayers()` - Todos los jugadores
- `getAvailablePlayers()` - Disponibles para compra
- `getVipPlayers()` - Jugadores VIP
- `purchasePlayer(id)` - Comprar jugador
- `getHourlyEarnings()` - Ganancias por hora

### 7. **SocialHttpService** (`social-http.service.ts`)
Referidos y social:
- `getReferralStats()` - Estadísticas de referidos
- `getReferrals()` - Lista de referidos
- `getMyReferralCode()` - Código de referido

## Guards de Autenticación

### **AuthGuard** (`auth.guard.ts`)
Protege rutas que requieren autenticación. Redirige a `/login` si no hay token.

### **NoAuthGuard** (`no-auth.guard.ts`)
Protege rutas públicas (login/register). Redirige a `/main` si ya está autenticado.

## Uso en Componentes

### Ejemplo: Login
```typescript
import { Component, inject } from '@angular/core';
import { AuthHttpService } from '../services/auth-http.service';
import { Router } from '@angular/router';

@Component({...})
export class LoginComponent {
  private authService = inject(AuthHttpService);
  private router = inject(Router);

  onSubmit() {
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error('Login failed:', err.message);
      }
    });
  }
}
```

### Ejemplo: Obtener Datos del Usuario
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { UserHttpService } from '../services/user-http.service';

@Component({...})
export class ProfileComponent implements OnInit {
  private userService = inject(UserHttpService);
  
  profile: any;

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Error:', err.message);
      }
    });
  }
}
```

### Ejemplo: Procesar Taps
```typescript
import { Component, inject } from '@angular/core';
import { GameHttpService } from '../services/game-http.service';

@Component({...})
export class GameComponent {
  private gameService = inject(GameHttpService);

  onTap() {
    this.gameService.processTaps(1).subscribe({
      next: (response) => {
        console.log('Coins earned:', response.coins_earned);
        console.log('New balance:', response.new_balance);
      }
    });
  }
}
```

## Configuración de Rutas

Las rutas ahora están protegidas:

```typescript
{
  path: 'main',
  canActivate: [AuthGuard],  // Requiere autenticación
  loadChildren: () => import('./views/game/main.routes')
},
{
  path: 'login',
  canActivate: [NoAuthGuard],  // Solo sin autenticar
  loadComponent: () => import('./views/auth/login.component')
}
```

## Manejo de Errores

Todos los servicios manejan errores automáticamente:

- **401** → Token expirado, redirige a login
- **403** → Sin permisos
- **404** → Recurso no encontrado
- **500** → Error del servidor
- **0** → Backend no disponible

Ejemplo de manejo:
```typescript
this.apiService.get('/endpoint').subscribe({
  next: (data) => { /* éxito */ },
  error: (err: ApiError) => {
    console.log(err.status);     // Código HTTP
    console.log(err.message);    // Mensaje amigable
    console.log(err.details);    // Detalles adicionales
  }
});
```

## Próximos Pasos (FASE 3)

Integrar estos servicios HTTP en:
1. `LocalApiService` - Usar backend en lugar de localStorage
2. Componentes de login/register
3. Componentes del juego (taps, boosts)
4. Componentes de wallet

## Notas Importantes

1. **Base URL**: Configurada en `api.service.ts` como `http://localhost:8000/api`
2. **Token Storage**: JWT se guarda en `localStorage` como `nequi_access_token`
3. **Auto-retry**: No implementado aún (se puede agregar en FASE 3)
4. **Offline mode**: No implementado (frontend requiere conexión)

## Testing

Para probar que los servicios funcionan:

1. Asegurarse que backend corra en http://localhost:8000
2. Ver documentación API en http://localhost:8000/docs
3. Probar endpoints con curl:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass"

# Obtener perfil (requiere token)
curl http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```
