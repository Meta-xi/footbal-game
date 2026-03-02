import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

type RankEntry = {
    id: string;
    name: string;
    score: number;
    avatar: string;
    position: number;
};

@Component({
    selector: 'app-rank-list',
    imports: [NgOptimizedImage],
    templateUrl: './rank-list.component.html',
    styleUrls: ['./rank-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankListComponent {
    title = input('Todas las calificaciones');
    entries = input<RankEntry[]>([]);
}
