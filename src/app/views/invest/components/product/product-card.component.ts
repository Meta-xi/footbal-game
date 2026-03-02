import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  template: `
    @if (product(); as player) {
      <article
          class="lg-module-card group relative flex flex-col overflow-hidden active:scale-[0.98] transition-all duration-500">
          
          <div class="relative w-full aspect-[4/3] flex items-center justify-center p-4">
              <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl"></div>
              <img ngSrc="{{player.imageUrl}}" alt="{{player.name}}"
                  class="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-1000"
                  width="140" height="140">
          </div>

          <div class="px-4 pb-4 flex flex-col gap-3">
              <div class="flex flex-col">
                  <span class="text-[8px] font-black text-white/10 uppercase tracking-[0.3em] mb-1">Candidato</span>
                  <h3 class="text-[13px] font-black text-white tracking-tight truncate text-glow">
                      {{player.name}}
                  </h3>
              </div>

              <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                      <span class="text-[8px] font-bold text-white/5 uppercase tracking-[0.2em] mb-1.5">Earnings</span>
                      <span class="flex items-center gap-1.5">
                          <img ngSrc="balance-coin/coin.png" alt="coin" width="12" height="12" class="opacity-40">
                          <p class="text-[10px] font-black text-white tracking-wide text-glow">
                            +{{player.earning || 0}}<span class="text-[8px] text-white/20 font-black ml-0.5">/H</span>
                          </p>
                      </span>
                  </div>

                  <button (click)="onBuy(); $event.stopPropagation()" type="button"
                      class="lg-btn-outline !rounded-2xl px-4 py-2 text-[8px] font-black text-white uppercase tracking-[0.3em] active:scale-90 transition-all">
                      Fichar
                  </button>
              </div>
          </div>
      </article>
    }
  `,
  styles: [`
    :host { display: block; }
    .text-glow { text-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
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
