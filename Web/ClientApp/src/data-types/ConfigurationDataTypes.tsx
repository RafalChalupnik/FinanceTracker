type Configuration = {
    assets: OrderableEntity[];
    debts: OrderableEntity[];
    wallets: WalletEntity[];
}

type OrderableEntity = {
    key: string;
    name: string;
    displaySequence: number;
}

type WalletEntity = {
    key: string;
    name: string;
    displaySequence: number;
    components: OrderableEntity[];
}