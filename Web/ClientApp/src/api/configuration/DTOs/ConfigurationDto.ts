export type ConfigurationDto = {
    groupTypes: GroupTypeConfigDto[],
    physicalAllocations: OrderableEntityDto[]
}

export type GroupTypeConfigDto = OrderableEntityDto & {
    icon: string,
    groups: GroupConfigDto[]
}

export type GroupConfigDto = OrderableEntityDto & {
    showTargets: boolean,
    groupTypeId: string,
    components: ComponentConfigDto[]
}

export type ComponentConfigDto = OrderableEntityDto & {
    groupId: string,
    defaultPhysicalAllocationId: string | undefined,
}

export type OrderableEntityDto = {
    key: string,
    name: string,
    displaySequence: number
}

// ---

export type WalletDataDto = OrderableEntityDto & {
    components: WalletComponentDataDto[]
}

export type WalletComponentDataDto = OrderableEntityDto & {
    defaultPhysicalAllocationId: string | undefined
};