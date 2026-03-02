import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GlassTabBarComponent, GlassTab } from '../../shared/ui';

@Component({
  selector: 'app-social',
  imports: [NgOptimizedImage, GlassTabBarComponent],
  template: `
    <section class="h-dvh flex flex-col relative w-full overflow-hidden bg-transparent">
      
      <div class="flex-1 w-full relative z-10 flex flex-col overflow-y-auto no-scrollbar pt-safe-top pb-28 px-5 gap-2 animate-slide-up">
        
        <!-- Hero Section -->
        <div class="flex flex-col items-center py-0 -mb-1.5">
          <div class="relative w-32 h-32 group">
             <!-- Deep Aura Glow -->
            <div class="absolute inset-[-20px] bg-indigo-500/20 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse"></div>
            <img ngSrc="social/social.png" alt="social icon" width="128" height="128"
                class="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] lg-float">
          </div>
        </div>

        <!-- Master Invitation Card (iOS 26 Liquid Reference) -->
        <article class="relative rounded-xl group active:scale-[0.98] transition-all duration-300">
           <div class="lg-panel p-3.5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner">
                <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <img ngSrc="icons/money-box.png" alt="reward" width="24" height="24" 
                    class="relative z-10 opacity-90 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
              </div>
              <div class="space-y-0.5">
                <h3 class="text-[12px] font-black text-white tracking-tight uppercase">Bono Amigo</h3>
                <p class="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Gana con cada referido</p>
              </div>
            </div>
            <div class="text-right pr-1">
              <span class="text-base font-black text-white tracking-tighter text-glow">+5K</span>
            </div>
          </div>
        </article>
 
        <!-- Quick Actions Row -->
        <div class="flex gap-2">
          <button class="flex-1 lg-module-card p-3 flex items-center justify-center gap-3 active:scale-[0.98] transition-all duration-300 group">
            <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-inner group-hover:bg-indigo-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <span class="text-[11px] font-black text-white uppercase tracking-widest">Invitar un amigo</span>
          </button>
          
          <button class="w-14 lg-module-card p-3 flex items-center justify-center active:scale-[0.98] transition-all duration-300 group">
             <div class="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
             </div>
          </button>
        </div>

        <!-- Redes / Tabs -->
        <div class="w-full">
          <app-glass-tab-bar 
            [tabs]="socialTabs"
            [(activeTab)]="activeTab"
          />
        </div>

        <!-- Dynamic Content Engine -->
        <div class="flex-1 pb-32">
          @switch (activeTab()) {
            @case ('misReferidos') {
              <div class="lg-card-panel p-5 flex flex-col gap-4">
                <!-- Section Header -->
                <div class="flex flex-col gap-2 px-1">
                  <div class="lg-status-badge !py-1 !px-3 !text-[8px] w-fit">
                    <span class="lg-dot-active"></span>
                    PANEL
                  </div>
                  <h2 class="text-xl font-black text-white tracking-tight text-glow uppercase">Mis Referidos</h2>
                  <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Comparte tu enlace y mira como crece tu red.</p>
                </div>

                <!-- Network Metrics Expanded Grid -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Total</span>
                    <span class="block text-lg font-black text-white tracking-tighter text-glow mt-1">--</span>
                  </div>
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Hoy</span>
                    <span class="block text-lg font-black text-emerald-400 tracking-tighter text-glow mt-1">--</span>
                  </div>
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Último mes</span>
                    <span class="block text-lg font-black text-white tracking-tighter text-glow mt-1">--</span>
                  </div>
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Última semana</span>
                    <span class="block text-lg font-black text-white tracking-tighter text-glow mt-1">--</span>
                  </div>
                </div>

                <!-- Main Action Area -->
                <button class="lg-btn-primary w-full h-12 flex items-center justify-center gap-3 px-4 active:scale-[0.98] transition-all">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <span class="text-[12px] font-semibold tracking-wide">INVITAR</span>
                </button>
              </div>
            }

            @case ('detalles') {
              <div class="lg-card-panel p-5 flex flex-col gap-4">
                <!-- Section Header -->
                <div class="flex flex-col gap-1.5 px-1">
                  <div class="inline-flex w-fit px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Panel</span>
                  </div>
                  <h2 class="text-xl font-black text-white tracking-tight text-glow uppercase">Detalles</h2>
                  <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Invite a sus amigos a ganar junto a usted.</p>
                </div>

                <!-- Commission Levels List -->
                <div class="flex flex-col gap-2">
                  <div class="lg-module-card p-3.5 flex items-center justify-between active:scale-[0.98] transition-transform">
                    <span class="text-[11px] font-black text-white tracking-wide uppercase">Nivel 1: Gana el 5%</span>
                    <span class="text-[11px] font-black text-white/20">--</span>
                  </div>
                  <div class="lg-module-card p-3.5 flex items-center justify-between active:scale-[0.98] transition-transform">
                    <span class="text-[11px] font-black text-white tracking-wide uppercase">Nivel 2: Gana el 3%</span>
                    <span class="text-[11px] font-black text-white/20">--</span>
                  </div>
                  <div class="lg-module-card p-3.5 flex items-center justify-between active:scale-[0.98] transition-transform">
                    <span class="text-[11px] font-black text-white tracking-wide uppercase">Nivel 3: Gana el 1%</span>
                    <span class="text-[11px] font-black text-white/20">--</span>
                  </div>
                </div>
              </div>
            }

            @case ('misGanancias') {
              <div class="lg-card-panel p-5 flex flex-col gap-4">
                <!-- Section Header -->
                <div class="flex flex-col gap-1 px-1">
                  <h2 class="text-xl font-black text-white tracking-tight text-glow uppercase">Mis Ganancias</h2>
                  <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed text-balance">Visualiza lo que has acumulado y lo que esta en camino.</p>
                </div>

                <!-- Earnings Metrics 2x2 Grid -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Total</span>
                    <span class="block text-lg font-black text-white tracking-tighter text-glow mt-1">--</span>
                  </div>
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Hoy</span>
                    <span class="block text-lg font-black text-emerald-400 tracking-tighter text-glow mt-1">--</span>
                  </div>
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Último mes</span>
                    <span class="block text-lg font-black text-white tracking-tighter text-glow mt-1">--</span>
                  </div>
                  <div class="lg-module-card p-3">
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Última semana</span>
                    <span class="block text-lg font-black text-white tracking-tighter text-glow mt-1">--</span>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </div>

    </section>
  `,
  styles: [`
    :host { display: block; }
    .pt-safe-top { padding-top: env(safe-area-inset-top, 0); }
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Social {
  readonly socialTabs: GlassTab[] = [
    { id: 'misReferidos', label: 'Referidos' },
    { id: 'misGanancias', label: 'Ganancias' },
    { id: 'detalles', label: 'Detalles' },
  ];

  activeTab = signal<string>('misReferidos');
}
