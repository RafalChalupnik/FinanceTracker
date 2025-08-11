export type ConfigurationDto = {
    assets: OrderableEntityDto[],
    debts: OrderableEntityDto[],
    wallets: WalletDataDto[],
    physicalAllocations: OrderableEntityDto[]
}

export type OrderableEntityDto = {
    key: string,
    name: string,
    displaySequence: number
}

export type WalletDataDto = OrderableEntityDto & {
    components: WalletComponentDataDto[]
}

export type WalletComponentDataDto = OrderableEntityDto & {
    defaultPhysicalAllocationId: string | undefined
};