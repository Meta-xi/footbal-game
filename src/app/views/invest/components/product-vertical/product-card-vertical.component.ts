import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-card-vertical',
    standalone: true,
    imports: [NgOptimizedImage, CommonModule],
    template: `
    @if (product(); as player) {
      <div class="lg-module-card group relative flex flex-col overflow-hidden active:scale-[0.98] transition-all duration-500">
          
          <div class="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/5 backdrop-blur-2xl border border-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse"></span>
              <span class="text-[8px] font-black text-amber-500/80 uppercase tracking-[0.2em]">VIP</span>
          </div>

          <div class="relative w-full aspect-square flex items-center justify-center p-10">
              <div class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl"></div>
              <img ngSrc="{{player.imageUrl}}" alt="{{player.name}}"
                  class="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000"
                  width="130" height="130">
          </div>

          <div class="px-5 pb-6 flex flex-col gap-4">
              <div class="flex flex-col">
                  <span class="text-[8px] font-black text-amber-500/20 uppercase tracking-[0.3em] mb-1">Élite</span>
                  <h3 class="text-[15px] font-black text-white tracking-tight truncate text-glow-amber">{{player.name}}</h3>
                  <p class="text-[9px] text-white/10 font-bold uppercase tracking-[0.2em] truncate mt-2">{{player.description}}</p>
              </div>

              <button (click)="onBuy()"
                  class="lg-btn-outline !rounded-2xl w-full py-3.5 hover:bg-amber-500/5 active:scale-95 text-[9px] font-black uppercase tracking-[0.3em] text-amber-400/80 border-amber-400/20 shadow-lg">
                  Fichar VIP
              </button>
          </div>
      </div>
    }
  `,
    styles: [`
    :host { display: block; }
    .text-glow-amber { text-shadow: 0 0 25px rgba(251, 191, 36, 0.3); }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardVerticalComponent {
    modalOpened = output<any>();
    buy = output<any>();
    product = input<any>();

    openModal() {
        this.modalOpened.emit(this.product());
    }

    onBuy() {
        this.buy.emit(this.product());
    }
}
