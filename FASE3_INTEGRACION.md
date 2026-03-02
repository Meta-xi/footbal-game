# FASE 3: Integración Frontend-Backend - Documentación

## Resumen de Cambios

### Servicios Modificados

#### 1. **AuthService** (`auth.service.ts`)
**Antes:** Solo usaba localStorage y simulaba login  
**Ahora:** Conecta con backend real vía `AuthHttpService`

Cambios principales:
- ✅ Login real con JWT
- ✅ Registro con backend
- ✅ Carga automática de perfil
- ✅ Manejo de errores del servidor
- ✅ Estados reactivos (`isLoading`, `error`)

#### 2. **LocalApiService** 
Se mantiene intacto para compatibilidad, pero ahora usa `BackendSyncService` para operaciones que requieren backend.

### Servicios Nuevos

#### **BackendSyncService** (`backend-sync.service.ts`)
Servicio híbrido que:
- Sincroniza taps en batch (cada 500ms)
- Carga datos del backend
- Mantiene compatibilidad con UI reactiva existente

```typescript
// Uso en componentes
private syncService = inject(BackendSyncService);

// En cada tap
this.syncService.syncTaps(1); // Se acumulan y envían cada 500ms
```

### Componentes Actualizados

#### 1. **LoginComponent** (`login.component.ts`)
- Usa `AuthService` actualizado
- Muestra errores reales del backend
- Estados de carga reactivos

#### 2. **WelcomeComponent** (`welcome.component.ts` + `.html`)
- Redirige a `/main` si ya está autenticado
- ✅ Removido botón "Entrar como invitado"
- Limpieza de HTML duplicado

#### 3. **TapAreaComponent** (`tap-area.component.ts`)
- Sincroniza taps con backend vía `BackendSyncService`
- Envía taps en batch (mejor performance)
- Forza sync al destruir componente

#### 4. **GameLayoutComponent** (`game-layout.component.ts`)
- Carga datos iniciales del backend:
  - Perfil de usuario
  - Balance
  - Energía
  - Estado del juego

## Flujo de Datos

```
Usuario hace tap
    ↓
TapAreaComponent
    ↓
BackendSyncService.syncTaps(1) [buffer]
    ↓
Cada 500ms → GameHttpService.processTaps(count)
    ↓
POST /api/game/taps → Backend (PostgreSQL)
    ↓
Respuesta con nuevo balance
    ↓
LocalApiService (UI reactiva)
    ↓
Actualización en pantalla
```

## Endpoints Utilizados

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil actual

### Usuario
- `GET /api/users/profile` - Perfil
- `GET /api/users/balance` - Balance
- `GET /api/users/stats` - Estadísticas
- `GET /api/users/level` - Nivel

### Juego
- `POST /api/game/taps` - Procesar taps
- `GET /api/game/energy` - Estado energía
- `POST /api/game/energy/recover` - Recuperar energía
- `GET /api/game/boosts` - Lista boosts
- `POST /api/game/boosts/{id}/purchase` - Comprar boost
- `GET /api/game/state` - Estado juego
- `POST /api/game/spins/use` - Usar spin

### Jugadores
- `GET /api/players` - Todos los jugadores
- `POST /api/players/{id}/purchase` - Comprar jugador

### Wallet
- `GET /api/wallet` - Info wallet
- `GET /api/wallet/transactions` - Transacciones
- `POST /api/wallet/deposits` - Crear depósito
- `POST /api/wallet/withdrawals` - Crear retiro

## Testing

### 1. Verificar Backend
```bash
# En terminal 1 - Backend
cd /home/winter/Desktop/Game\ football/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Verificar endpoints
curl http://localhost:8000/health
```

### 2. Verificar Frontend
```bash
# En terminal 2 - Frontend
cd /home/winter/Desktop/Game\ football/frontend
ng serve

# Abrir navegador en http://localhost:4200
```

### 3. Flujo de Prueba
1. Ir a http://localhost:4200
2. Click "Registrate y Juega"
3. Crear cuenta (usar email real)
4. Verificar que redirige al juego
5. Hacer taps en la pelota
6. Verificar en consola del navegador que se sincronizan
7. Recargar página - datos deben persistir

## Notas Importantes

### Sync de Taps
Los taps se acumulan y se envían cada 500ms para:
- Reducir llamadas HTTP
- Mejorar performance
- Permitir operación offline temporal

### Manejo de Errores
Si falla el sync de taps:
- Se reintentan automáticamente
- Se acumulan en el buffer
- El usuario no ve interrupción

### Estados Locales vs Backend
- **UI reactiva:** Usa LocalApiService (signals)
- **Persistencia:** Backend (PostgreSQL)
- **Sync:** BackendSyncService (híbrido)

## Próximos Pasos (Opcional)

1. **Offline Mode:** Guardar taps en localStorage si no hay conexión
2. **Optimistic Updates:** Actualizar UI antes de confirmar backend
3. **WebSockets:** Actualizaciones en tiempo real
4. **Retry Logic:** Reintentos automáticos con backoff exponencial

## Solución de Problemas

### "No se puede conectar al servidor"
Verificar que backend corra en puerto 8000:
```bash
curl http://localhost:8000/health
```

### "Token inválido"
Limpiar localStorage y recargar:
```javascript
localStorage.clear();
location.reload();
```

### Errores de CORS
Verificar que backend tenga CORS configurado para localhost:4200 (ya está hecho)

## Archivos Modificados

- `src/app/services/auth.service.ts` - Conecta con backend
- `src/app/services/backend-sync.service.ts` - Nuevo (sync híbrido)
- `src/app/views/auth/login.component.ts` - Errores reales
- `src/app/views/auth/welcome.component.ts` - Redirección auth
- `src/app/views/auth/welcome.component.html` - Sin modo invitado
- `src/app/views/game/game-layout.component.ts` - Carga inicial
- `src/app/views/game/components/tap-area/tap-area.component.ts` - Sync taps
- `src/app/app.config.ts` - Inicialización auth
- `src/app/app.routes.ts` - Guards

## Compatibilidad

✅ Todos los componentes existentes funcionan sin cambios  
✅ LocalApiService mantiene la misma API  
✅ UI reactiva no requiere modificaciones  
✅ Guards protegen rutas correctamente
