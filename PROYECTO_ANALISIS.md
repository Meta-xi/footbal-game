# Reporte Comprehensivo del Proyecto Angular - Game Football

## 1. INFORMACIÓN GENERAL DEL PROYECTO

- **Nombre del Proyecto**: nequi-v2-a21 (Juego de Fútbol/Clicker)
- **Versión Angular**: v21.1.1
- **Versión TypeScript**: v5.9.2
- **Framework UI**: TailwindCSS v4.1.18
- **Testing**: Vitest con jsdom
- **Estado**: Strict mode DESHABILITADO

---

## 2. ESTRUCTURA DE DIRECTORIOS

```
frontend/src/app/
├── app.ts                          # Componente raíz de la aplicación
├── app.routes.ts                  # Rutas principales
├── app.config.ts                  # Configuración de la app
├── app.html                       # Template raíz
├── app.scss                       # Estilos raíz
├── services/                      # Servicios de negocio
├── shared/                        # Componentes compartidos
├── views/                         # Vistas/Páginas
│   ├── auth/                      # Autenticación
│   ├── game/                      # Juego principal
│   ├── invest/                    # Inversiones/Mining
│   ├── social/                    # Red social/Referidos
│   ├── wallet/                    # Billetera
│   └── motions/                   # Mociones/Votaciones
```

---

## 3. COMPONENTES EN src/app/

### 3.1 Componentes Compartidos (shared/)

| Componente | Propósito |
|------------|-----------|
| `balance.component.ts` | Muestra el balance/coins del usuario |
| `balance-wallet.component.ts` | Componente de balance específico para wallet |
| `bottom-nav.component.ts` | Navegación inferior de la aplicación |
| `loader.component.ts` | Indicador de carga |
| `particles-background.component.ts` | Fondo con partículas animadas |
| `level-up-animation.component.ts` | Animación de subír de nivel |

### 3.2 Componentes de Juego (views/game/)

| Componente | Propósito |
|------------|-----------|
| `game-layout.component.ts` | Layout principal del juego (página principal) |
| `action-buttons.component.ts` | Botones de acción del juego |
| `tap-area.component.ts` | Área donde el usuario hace tap/clicks |
| `header.component.ts` | Encabezado del juego |
| `settings.component.ts` | Configuración del juego |
| `level-menu.component.ts` | Menú de niveles |
| `per-hour-earnings.component.ts` | Ganancias por hora |
| `energy-boost.component.ts` | Sistema de boosts de energía |
| `lucky-wheel.component.ts` | Ruleta de la suerte |
| **Subcomponentes de Rank:** | |
| `rank.component.ts` | Rankings/clasificaciones |
| `rank-podium.component.ts` | Podio de ganadores |
| `rank-info-modal.component.ts` | Modal de información de rank |
| `rank-tabs.component.ts` | Pestañas de rank |
| `rank-list.component.ts` | Lista de rankings |
| `rank-prizes.component.ts` | Premios del ranking |
| `rank-countdown.component.ts` | Cuenta regresiva para reset |
| **Subcomponentes de Boost:** | |
| `boost.component.ts` | Componente de compra de boosts |

### 3.3 Componentes de Autenticación (views/auth/)

| Componente | Propósito |
|------------|-----------|
| `welcome.component.ts` | Página de bienvenida |
| `login.component.ts` | Página de inicio de sesión/registro |

### 3.4 Componentes de Inversión (views/invest/)

| Componente | Propósito |
|------------|-----------|
| `invest-layout.component.ts` | Layout de inversiones/minería |
| `product-card.component.ts` | Tarjeta de producto (jugador) |
| `product-card-vertical.component.ts` | Tarjeta vertical de producto |
| `player-details.component.ts` | Detalles del jugador |

### 3.5 Componentes de Wallet (views/wallet/)

| Componente | Propósito |
|------------|-----------|
| `wallet.ts` | Billetera principal |
| `crypto-deposit-modal.component.ts` | Modal de depósito de criptomonedas |
| `support-chat.component.ts` | Chat de soporte |
| `transaction.component.ts` | Transacciones |
| **Subcomponentes de Transacción:** | |
| `payment-screen.component.ts` | Pantalla de pago |
| `withdraw-form.component.ts` | Formulario de retiro |
| `deposit-form.component.ts` | Formulario de depósito |
| `success-overlay.component.ts` | Overlay de éxito |
| `account-selector.component.ts` | Selector de cuenta |
| `amount-input.component.ts` | Input de cantidad |

### 3.6 Componentes Social (views/social/)

| Componente | Propósito |
|------------|-----------|
| `social.ts` | Página de red social/referidos |

### 3.7 Componentes de Mociones (views/motions/)

| Componente | Propósito |
|------------|-----------|
| `motions.ts` | Página de mociones/votaciones |
| `history-modal.component.ts` | Modal de historial |

---

## 4. PÁGINAS/VISTAS (COMPONENTES ROUTED)

### Rutas Principales (app.routes.ts)

| Path | Componente | Descripción |
|------|------------|-------------|
| `/` | redirect to `/welcome` | Redirección por defecto |
| `/welcome` | `welcome.component` | Pantalla de bienvenida |
| `/login` | `login.component` | Login/Registro |
| `/main` | `game-layout.component` (lazy) | Juego principal |
| `/mining` | `invest-layout.component` | Inversiones |
| `/social` | `social` | Red social |
| `/wallet` | `wallet` | Billetera |
| `/mociones` | `motions` | Mociones |
| `/transaccion` | `transaction.component` | Transacciones |

### Rutas del Juego (main.routes.ts)

| Path | Componente | Descripción |
|------|------------|-------------|
| `/main` | `game-layout.component` | Layout principal del juego |
| `/main/boost` | `boost.component` | Comprar boosts |
| `/main/lucky-wheel` | `lucky-wheel.component` | Ruleta de la suerte |
| `/main/rank` | `rank.component` | Rankings |

---

## 5. ESTRUCTURA DEL ROUTING

### Archivo: `app.routes.ts`
```typescript
// Rutas principales con lazy loading
- '' → redirect to 'welcome'
- 'welcome' → WelcomeComponent (auth)
- 'login' → LoginComponent (auth)
- 'main' → MainRoutes (game with children)
- 'mining' → InvestLayoutComponent
- 'social' → SocialComponent
- 'wallet' → WalletComponent
- 'mociones' → MotionsComponent
- 'transaccion' → TransactionComponent
```

### Archivo: `main.routes.ts`
```typescript
// Rutas del módulo de juego
- '' → GameLayoutComponent
- 'boost' → BoostComponent
- 'lucky-wheel' → LuckyWheelComponent
- 'rank' → RankComponent
```

---

## 6. SERVICIOS Y SU PROPÓSITO

### 6.1 Servicios Principales

| Servicio | Propósito | Archivo |
|----------|-----------|---------|
| **AuthService** | Gestión de autenticación, login, registro, logout | `auth.service.ts` |
| **GameService** | Lógica del juego, estadísticas, taps | `game.service.ts` |
| **WalletService** | Gestión de wallet, depósitos, retiros, transacciones | `wallet.service.ts` |
| **UserService** | Datos del perfil y estadísticas del usuario | `user.service.ts` |
| **PlayersService** | Gestión de jugadores comprables | `players.service.ts` |
| **EnergyService** | Sistema de energía y boosts | `energy.service.ts` |
| **TapService** | Sistema de taps y ganancias | `tap.service.ts` |
| **InvestmentService** | Planes de inversión | `investment.service.ts` |
| **SocialService** | Red social y referidos | `social.service.ts` |
| **StorageService** | Acceso a localStorage con soporte SSR | `storage.service.ts` |
| **LocalApiService** | API local centralizada - maneja todos los datos del juego | `local-api.service.ts` |
| **ViewportService** | Utilidades del viewport | `viewport.service.ts` |

### 6.2 Descripción Detallada de Servicios

#### LocalApiService (EL MÁS IMPORTANTE)
Este es el servicio central que gestiona:
- Perfil de usuario (balance, nivel, username, email)
- Estadísticas (totalTaps, hourlyEarning, referrals, etc.)
- Energía (estado actual, recuperación, límites)
- Boosts (compras, activación, niveles)
- Transacciones (depósitos, retiros, ganancias)
- Jugadores (disponibles, VIP, comprados)
- Configuración de taps
- Estados del juego (experiencia, spins)

---

## 7. MODELOS/TIPOS PRINCIPALES

### 7.1 Interfaces Definidas en local-api.service.ts

```typescript
// Usuario y Perfil
UserProfile {
  id: number
  username: string
  email: string
  balance: number
  totalEarnings: number
  level: number
  joinedAt: string
  status: 'active' | 'inactive' | 'banned'
  avatar?: string
}

UserStats {
  totalTaps: number
  hourlyEarning: number
  referrals: number
  investments: number
  achievements: number
}

// Energía y Boost
EnergyState {
  current: number
  maximum: number
  recoveryRate: number
  lastUpdated: string
}

Boost {
  id: number
  name: string
  description: string
  cost: number
  baseCost: number
  level: number
  amount?: number
  baseAmount?: number
  multiplier?: number
  recoveryMultiplier?: number
  duration: number | null
  type: 'instant' | 'timed' | 'permanent'
  icon?: string
}

ActiveBoost {
  boostId: number | string
  activatedAt: string
  expiresAt: string | null
}

// Juego
TapConfig {
  baseValue: number
  currentMultiplier: number
  maxMultiplier: number
  levelBonus: { level: number; multiplier: number }[]
}

EarningSource {
  source: string
  amount: number
  percentage: number
}

GameState {
  experience: number
  experienceToNextLevel: number
  sessionTaps: number
  lastSessionStart: string
  spinsRemaining: number
  dailySpinsTotal: number
  lastSpinReset: string
}

// Transacciones
Transaction {
  id: number
  type: 'deposit' | 'withdrawal' | 'earning' | 'boost_purchase' | 'spin_reward' | 'reward'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  method?: string
  reference: string
  description?: string
}

DepositMethod {
  id: number
  title: string
  desc: string
  icon: string
  type: string
  countries: string[]
  currencies?: string[]
}

CryptoAddress {
  currency: string
  network?: string
  address: string
  qrCode?: string
}

// Jugadores
Player {
  id: number
  name: string
  price: number
  imageUrl: string
  description: string
  earning: number
  level: number
  exclusive?: boolean
  boughtAt?: string
  contract_days: number
}

PlayersData {
  availablePlayers: Player[]
  vipPlayers: Player[]
  ownedPlayers: Player[]
}
```

### 7.2 Interfaces de auth.service.ts

```typescript
User {
  id: number
  username: string
  email: string
  avatar?: string
}
```

### 7.3 Interfaces de game.service.ts

```typescript
GameStats {
  level: number
  experience: number
  experienceToNextLevel: number
  totalTaps: number
  sessionTaps: number
  earning: number
  hourlyEarning: number
}

TapValue {
  level: number
  multiplier: number
}

GameData {
  gameStats: GameStats
  tapValues: TapConfig
  perHourEarnings: EarningSource[]
}
```

### 7.4 Interfaces de wallet.service.ts

```typescript
Deposit {
  id: number
  title: string
  desc: string
  icon: string
  type: string
  countries: string[]
  currencies?: string[]
}

WalletData {
  deposits: Deposit[]
  transactions: Transaction[]
}
```

### 7.5 Interfaces de social.service.ts

```typescript
Referral {
  id: number
  username: string
  joinedAt: string
  status: 'active' | 'inactive'
  totalEarningsFromReferral: number
}

ReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarningsFromReferrals: number
  bonus: number
  commissionRate: number
}

SocialNetwork {
  id: number
  name: string
  connected: boolean
  followers: number
  icon: string
}

SocialData {
  referrals: Referral[]
  referralStats: ReferralStats
  socialNetworks: SocialNetwork[]
}
```

---

## 8. DATOS DEFAULT DEL JUEGO

### 8.1 Jugadores Disponibles (DEFAULT_PLAYERS)
- Ronaldo CR7 - 500 monedas - 15/hora
- Messi - 600 monedas - 15/hora
- Neymar Jr - 700 monedas - 15/hora
- Mbappé - 800 monedas - 15/hora
- Haaland - 900 monedas - 15/hora
- Vinicius Jr - 1000 monedas - 15/hora

### 8.2 Jugadores VIP
- Messi VIP - 2000 monedas - 100/hora
- CR7 VIP - 2500 monedas - 100/hora
- Mbappé VIP - 3000 monedas - 100/hora

### 8.3 Boosts Disponibles
1. **Energy Plus** - +50 energía instantánea - 100 monedas
2. **2x Multiplier** - Ganancias x2 por 60 min - 500 monedas
3. **Energy Recovery** - Recuperación +50% por 30 min - 300 monedas
4. **Max Energy** - +100 energía máxima permanente - 1000 monedas
5. **Tap Power** - +1 valor por toque permanente - 500 monedas

### 8.4 Métodos de Depósito
1. Colombia - Transferencia bancaria
2. Cryptos - BTC, ETH, USDT, USDC
3. Perú - Transferencia bancaria

---

## 9. CARACTERÍSTICAS TÉCNICAS

### 9.1 Estado de la Aplicación
- **Patrón de Estado**: Signals de Angular
- **Cambio de Estrategia**: OnPush para todos los componentes
- **Componentes**: Standalone (Angular 20+)
- **Lazy Loading**: Activado para todas las rutas

### 9.2 Dependencias Principales
- TailwindCSS v4.1.18
- NgxApexCharts (visualización)
- NgxSonner (notificaciones toast)
- NgxQuill (editor de texto)
- CryptoJS (encriptación)

### 9.3 Almacenamiento
- LocalStorage para persistencia de datos
- Sistema de claves con prefijo "nequi_"
- Soporte para SSR

---

## 10. FLUJO DE LA APLICACIÓN

```
Bienvenida (/welcome)
    ↓
Login (/login)
    ↓
Juego Principal (/main)
    ├── Tap Area (ganancias por click)
    ├── Energy Boosts (comprar boosts)
    ├── Lucky Wheel (ruleta diaria)
    ├── Rankings (competencia)
    ├── Wallet (/wallet)
    │   ├── Depósitos
    │   ├── Retiros
    │   └── Transacciones
    ├── Mining (/mining)
    │   └── Comprar Jugadores
    ├── Social (/social)
    │   └── Referidos
    └── Mociones (/mociones)
        └── Votaciones
```

---

*Reporte generado el 21 de febrero de 2026*
*Proyecto: Game Football - Angular v21.1.1*
