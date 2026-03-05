import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";

@Component({
  selector: 'app-lucky-wheel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <button (click)="goBack()" class="back-btn">← Volver</button>

      <div class="slot-machine-wrapper">
        <div class="indicator left">▶</div>
        <div class="indicator right">◀</div>

        <div class="viewport">
          <div class="reel" [style.transform]="'translateY(' + reelOffset + 'px)'" [class.spinning]="isSpinning">
            <div *ngFor="let prize of displayPrizes; let i = index" 
                 class="ticket 3d-effect" 
                 [style.border-left-color]="prize.color">
              <div class="ticket-content glass-morph">
                <div class="token-icon" [style.background]="prize.color">T</div>
                <div class="prize-value">{{ prize.value }}</div>
                <div class="prize-label">Tether</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button (click)="spin()" [disabled]="isSpinning" class="spin-btn glass-panel">
        {{ isSpinning ? 'GIRANDO...' : 'PROBAR SUERTE' }}
      </button>

      <div class="win-announcement" *ngIf="showWinMessage">
        <div class="win-content glass-morph">
          <h2>¡GANASTE!</h2>
          <p>+{{ lastPrize }} USDT</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary-blur: blur(15px); --glass-bg: rgba(255, 255, 255, 0.08); }
    
    .game-container {
      background: transparent;
      height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; overflow: hidden;
      font-family: 'Inter', sans-serif; color: white;
    }

    .back-btn {
      position: absolute; top: 20px; left: 20px; padding: 8px 16px; border-radius: 8px;
      background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px); cursor: pointer; font-weight: bold;
      transition: all 0.3s;
    }
    .back-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateX(-2px); }

    /* ESTILO LIQUID GLASS */
    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: var(--primary-blur);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 0 15px rgba(255,255,255,0.05);
    }

    .glass-morph {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 15px;
    }

    .slot-machine-wrapper {
      position: relative; width: 320px; height: 360px;
      display: flex; justify-content: center; align-items: center;
    }

    .viewport {
      width: 280px; height: 340px; overflow: hidden;
      mask-image: linear-gradient(transparent, black 20%, black 80%, transparent);
    }

    .reel { transition: transform 4s cubic-bezier(0.1, 0, 0, 1); display: flex; flex-direction: column; gap: 15px; }

    /* TICKETS 3D */
    .ticket {
      height: 100px; padding: 5px; transition: all 0.5s;
      transform: perspective(500px) rotateX(10deg);
      border-left: 5px solid;
    }

    .ticket-content {
      height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
      .prize-value { font-size: 2.2rem; font-weight: 900; line-height: 1; }
      .prize-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; }
      .token-icon { width: 22px; height: 22px; border-radius: 50%; font-weight: bold; font-size: 12px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;}
    }

    .indicator {
      position: absolute; top: 50%; transform: translateY(-50%);
      font-size: 24px; color: #3b82f6; z-index: 10; text-shadow: 0 0 10px #3b82f6;
      &.left { left: 0; } &.right { right: 0; }
    }

    .spin-btn {
      margin-top: 40px; padding: 18px 50px; border-radius: 50px;
      font-weight: bold; cursor: pointer; color: white; transition: 0.3s;
      &:hover { background: rgba(255,255,255,0.15); transform: scale(1.05); }
      &:disabled { opacity: 0.4; transform: scale(0.95); }
    }

    .win-announcement {
      position: absolute; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center; z-index: 100;
      animation: fadeIn 0.3s;
      .win-content { padding: 40px; text-align: center; h2 { color: #facc15; margin: 0; } p { font-size: 2rem; font-weight: bold; } }
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class LuckyWheelComponent {
  balance = signal(130.00);
  isSpinning = false;
  reelOffset = 0;
  showWinMessage = false;
  lastPrize = 0;

  prizes = [
    { value: 50, color: '#ec4899' }, { value: 4, color: '#3b82f6' },
    { value: 2, color: '#06b6d4' }, { value: 0.15, color: '#10b981' },
    { value: 10, color: '#8b5cf6' }, { value: 100, color: '#f59e0b' },
    { value: 25, color: '#ef4444' }, { value: 0.05, color: '#64748b' }
  ];

  displayPrizes = [...this.prizes, ...this.prizes, ...this.prizes, ...this.prizes, ...this.prizes, ...this.prizes];

  private audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

  constructor() {
    this.balance.update(v => v + 1000); // Saldo inicial
  }

  spin() {
    if (this.isSpinning) return;

    this.playSimpleSound(440, 'sine', 0.1); // Sonido de clic
    this.isSpinning = true;
    this.showWinMessage = false;

    const ticketHeight = 115; // altura + gap
    const targetIdx = Math.floor(Math.random() * this.prizes.length) + (this.prizes.length * 4);
    this.reelOffset = -(targetIdx * ticketHeight) + (ticketHeight);

    // Sonido de giro (simulado con intervalo)
    const spinLoop = setInterval(() => {
      if (this.isSpinning) this.playSimpleSound(150, 'triangle', 0.05, 0.1);
      else clearInterval(spinLoop);
    }, 150);

    setTimeout(() => {
      this.isSpinning = false;
      this.lastPrize = this.displayPrizes[targetIdx + 1].value;
      this.balance.update(v => v + this.lastPrize);
      this.playWinSound();
      this.showWinMessage = true;
      
      setTimeout(() => this.showWinMessage = false, 3000);
    }, 4000);
  }

  goBack() {
    window.history.back();
  }

  // MOTOR DE SONIDO SINTÉTICO
  private playSimpleSound(freq: number, type: OscillatorType, volume: number, duration: number = 0.2) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  private playWinSound() {
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      setTimeout(() => this.playSimpleSound(f, 'square', 0.1, 0.5), i * 150);
    });
  }
}