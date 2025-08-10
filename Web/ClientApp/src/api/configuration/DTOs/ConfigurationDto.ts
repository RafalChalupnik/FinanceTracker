export type ConfigurationDto = {
    assets: OrderableEntityDto[],
    debts: OrderableEntityDto[],
    wallets: WalletDataDto[]
}

export type OrderableEntityDto = {
    key: string,
    name: string,
    displaySequence: number
}

export type WalletDataDto = OrderableEntityDto & {
    components: OrderableEntityDto[]
}