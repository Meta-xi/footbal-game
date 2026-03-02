import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <section class="h-dvh w-full relative overflow-hidden flex flex-col pt-safe-top bg-transparent">
      <!-- iOS 26 Liquid Glass Background -->
      <div class="absolute inset-0 z-0 bg-transparent pointer-events-none overflow-hidden">
        <div class="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-b from-teal-500/10 via-transparent to-black/80 blur-[120px]"></div>
        <div class="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-teal-400/5 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>

      <!-- Header -->
      <header class="relative z-20 px-8 py-8 flex justify-between items-center w-full">
        <div class="flex flex-col">
          <span class="text-3xl font-black text-white tracking-tighter text-glow lowercase">volo</span>
        </div>
        <div class="w-10 h-10 lg-icon-btn flex items-center justify-center">
            <svg class="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </div>
      </header>

      <!-- Main Content -->
      <main class="relative z-20 flex-1 flex flex-col px-8 pt-6">
        <!-- Hero Section -->
        <div class="relative mb-12 flex flex-col items-center">
          <div class="absolute inset-0 bg-teal-500/10 blur-[80px] rounded-full scale-150 lg-aura-glow"></div>
          <div class="relative w-32 h-32 mb-8 group active:scale-95 transition-all duration-500">
             <div class="absolute inset-0 bg-white/5 rounded-[40px] border border-white/10 rotate-3 group-hover:rotate-6 transition-transform"></div>
             <div class="absolute inset-0 bg-teal-500/5 rounded-[40px] -rotate-3 group-hover:-rotate-6 transition-transform"></div>
             <div class="relative w-full h-full bg-white/10 backdrop-blur-2xl rounded-[40px] border border-white/20 flex items-center justify-center overflow-hidden">
                <div class="w-16 h-16 bg-gradient-to-tr from-teal-400 to-indigo-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <svg class="w-12 h-12 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
          </div>
          
          <div class="text-center space-y-3">
            <h1 class="text-6xl font-black text-white tracking-tighter leading-none text-glow">VOLO</h1>
            <p class="text-white/40 text-sm font-black uppercase tracking-[0.2em]">Next-Gen Assets</p>
          </div>
        </div>

        <div class="space-y-4 mb-12">
          <button (click)="goToRegister()" class="lg-btn-primary w-full py-5 text-sm shadow-teal-500/20 active:scale-95 transition-all">
             GET STARTED
          </button>

          <button (click)="goToLogin()" class="lg-btn-outline w-full py-5 flex items-center justify-center gap-3 active:scale-95 transition-all text-white font-black uppercase text-xs tracking-widest border-white/5 bg-white/5">
             Log In
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4 opacity-80">
           <div class="lg-module-card p-4 flex items-center gap-4">
             <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <div class="w-4 h-4 rounded-full border-2 border-teal-500/50"></div>
             </div>
             <div class="space-y-0.5">
               <h3 class="text-[10px] font-black text-white uppercase tracking-wider">Secure Banking</h3>
               <p class="text-[9px] text-white/30 font-bold uppercase tracking-widest">End-to-End Encryption</p>
             </div>
           </div>
        </div>
      </main>

      <!-- Bottom Nav Bar (Decorative Like Image) -->
      <footer class="relative z-20 px-6 pb-10">
        <div class="grid grid-cols-4 gap-3 p-2 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10">
          <div class="h-14 lg-module-card bg-transparent border-none flex items-center justify-center opacity-40">
             <div class="w-5 h-5 border-2 border-white/20 rounded"></div>
          </div>
          <div class="h-14 lg-module-card bg-transparent border-none flex items-center justify-center opacity-40">
             <div class="w-5 h-5 border-2 border-white/20 rounded rotate-45"></div>
          </div>
          <div (click)="goToGuest()" class="h-14 lg-module-card bg-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
             <div class="w-6 h-6 bg-teal-500/40 rounded-full border border-teal-500 animate-pulse"></div>
          </div>
          <div class="h-14 lg-module-card bg-transparent border-none flex items-center justify-center opacity-40">
             <div class="w-5 h-5 border-2 border-white/20 rounded-full"></div>
          </div>
        </div>
      </footer>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .pt-safe-top { padding-top: env(safe-area-inset-top, 1rem); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WelcomeComponent {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/login'], { queryParams: { tab: 'register' } });
  }

  goToGuest() {
    this.router.navigate(['/main']);
  }
}
