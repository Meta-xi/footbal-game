import { Injectable, inject, computed } from '@angular/core';
import { LocalApiService, Transaction, DepositMethod } from './local-api.service';

export type { Transaction };

export interface Deposit {
    id: number;
    title: string;
    desc: string;
    icon: string;
    type: string;
    countries: string[];
    currencies?: string[];
}

export interface WalletData {
    deposits: Deposit[];
    transactions: Transaction[];
}

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    private localApi = inject(LocalApiService);

    readonly walletData = computed(() => {
        const depositMethods = this.localApi.depositMethods();
        const transactions = this.localApi.transactions();

        return {
            deposits: depositMethods.map(d => ({
                id: d.id,
                title: d.title,
                desc: d.desc,
                icon: d.icon,
                type: d.type,
                countries: d.countries,
                currencies: d.currencies,
            })),
            transactions,
        } as WalletData;
    });

    readonly isLoading = computed(() => !this.localApi.isInitialized());
    readonly error = computed(() => null);
    readonly balance = this.localApi.balance;

    loadWallet() {
        // No necesario, los datos ya están en LocalApiService
    }

    getDeposits(): Deposit[] {
        return this.walletData()?.deposits || [];
    }

    getTransactions(): Transaction[] {
        return this.localApi.transactions();
    }

    getDepositByTitle(title: string): Deposit | undefined {
        return this.getDeposits().find(d => d.title === title);
    }

    addTransaction(transaction: Omit<Transaction, 'id' | 'date' | 'reference'>): Transaction {
        return this.localApi.addTransaction(transaction);
    }

    createDeposit(amount: number, method: string, currency: string = 'COP'): Transaction {
        return this.localApi.createDeposit(amount, method, currency);
    }

    createWithdrawal(amount: number, method: string, currency: string = 'COP'): { success: boolean; transaction?: Transaction; message: string } {
        return this.localApi.createWithdrawal(amount, method, currency);
    }
}
