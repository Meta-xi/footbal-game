import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { UserStatusService } from '../../../core/services/user-status.service';

interface BallBox {
  id: number;
  hasPrize: boolean;
  prizeValue: number;
  opened: boolean;
}

@Component({
  selector: 'app-box',
  imports: [NgOptimizedImage],
  template: `
    <div class="game-wrapper hide-nav">
      <!-- Botón Atrás -->
       <button class="back-btn absolute top-3 left-3 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur border border-white/10 z-50 transition-transform hover:-translate-x-0.5" (click)="goBack()" aria-label="Volver">
         <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-6 h-6">
           <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
         </svg>
       </button>

      <div class="header glass !p-2 !mb-4 inline-flex items-center gap-3 border-yellow-500/30 shadow-lg accent-amber">
        <img ngSrc="mini-games/tickets/tickets.webp" alt="Jugadores" class="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 drop-shadow-md transition-all" width="48" height="48">
        <h1>Tickets: <span class="text-glow-yellow"> {{ balance() }}</span></h1>
      </div>

      <div class="grid-container !gap-4 !mb-6">
        @for (box of boxes(); track box.id) {
          <div class="box glass !w-24 !h-24"
               [class.active]="gameState === 'playing' && !box.opened"
               [class.opened]="box.opened"
               [class.winner]="box.opened && box.hasPrize"
               [class.loser]="box.opened && !box.hasPrize"
               (click)="openBox(box)">
            <div class="content">
              <img [ngSrc]="boxIcon(box)" [alt]="'Balón ' + (box.opened ? (box.hasPrize ? box.prizeValue + ' COP' : 'vacío') : 'sin abrir')" width="96" height="96" class="icon-img">
            </div>
          </div>
        }
      </div>

       <button class="play-btn glass !px-6 !py-3 !text-base bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 border border-white/20 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
               (click)="startGame()" [disabled]="gameState === 'playing' || balance() === 0">
         {{ balance() === 0 ? 'Sin tickets' : (gameState === 'idle' ? 'JUGAR' : '⚽ TOCA UN BALÓN ⚽') }}
       </button>

      @if (gameState === 'won' || gameState === 'lost') {
        <div class="banner glass !p-4 !text-xl" [class.banner-win]="gameState === 'won'">
          <h2>{{ gameState === 'won' ? '¡GANASTE ' + prizeWon() + ' COP!' : '¡BALÓN VACÍA! PERDISTE' }}</h2>
        </div>
      }
    </div>
  `,
  styleUrls: ['./box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  private userStatusService = inject(UserStatusService);
  
  // Balance inicial desde wallet, mutable durante el juego
  balance = signal(0);
  boxes = signal<BallBox[]>([]);
  gameState: 'idle' | 'playing' | 'won' | 'lost' = 'idle';
  prizeWon = signal(0);

  private readonly router = inject(Router);

  constructor() {
    // Sincronizar balance inicial desde wallet
    const walletBalance = this.userStatusService.wallet()?.ticketBalance ?? 0;
    this.balance.set(walletBalance);
    this.initBoxes();
  }

  goBack() {
    this.router.navigate(['/main']);
  }

  boxIcon(box: BallBox): string {
    if (!box.opened) return 'mini-games/box/init.webp';
    if (box.hasPrize) return 'mini-games/box/good.webp';
    return 'mini-games/box/empty.webp';
  }

  initBoxes() {
    this.boxes.set(Array.from({ length: 9 }, (_, i) => ({
      id: i,
      hasPrize: false,
      prizeValue: 0,
      opened: false
    })));
  }

  startGame() {
    if (this.gameState === 'playing') return;
    this.gameState = 'playing';
    this.prizeWon.set(0);
    this.playAudioSynth('start');

    // 3 premios fijos: 20, 50, 80 COP
    const prizes = [20, 50, 80];
    const shuffled = prizes.sort(() => Math.random() - 0.5);
    const newBoxes = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      hasPrize: false,
      prizeValue: 0,
      opened: false
    }));

    let prizeIndex = 0;
    while (prizeIndex < 3) {
      const randomIndex = Math.floor(Math.random() * 9);
      if (!newBoxes[randomIndex].hasPrize) {
        newBoxes[randomIndex].hasPrize = true;
        newBoxes[randomIndex].prizeValue = shuffled[prizeIndex];
        prizeIndex++;
      }
    }

    this.boxes.set(newBoxes);
  }

  openBox(box: BallBox) {
    if (this.gameState !== 'playing' || box.opened) return;
    this.boxes.update(boxes =>
      boxes.map(b =>
        b.id === box.id ? { ...b, opened: true } : b
      )
    );
    if (box.hasPrize) {
      this.gameState = 'won';
      this.prizeWon.set(box.prizeValue);
      this.balance.update(v => v + box.prizeValue);
      this.playAudioSynth('win');
      this.triggerConfetti();
    } else {
      this.gameState = 'lost';
      this.playAudioSynth('lose');
    }
  }

  playAudioSynth(type: 'start' | 'win' | 'lose') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'lose') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  triggerConfetti() {
    const colors = ['#00ffcc', '#ff00ff', '#00ff80', '#ffffff'];
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.classList.add('confetti-particle');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100 + 'vw';
      const duration = Math.random() * 1.5 + 1 + 's';
      particle.style.backgroundColor = color;
      particle.style.left = left;
      particle.style.top = '-10px';
      particle.style.animationDuration = duration;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 3000);
    }
  }
}
