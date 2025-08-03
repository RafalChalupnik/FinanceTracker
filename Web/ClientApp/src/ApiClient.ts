interface WalletsPerDateQueryDto {
    wallets: WalletDto[]
}

interface WalletDto {
    id: string,
    name: string,
    headers: EntityHeaderDto[],
    data: EntitiesForDateDto[]
}

interface EntitiesPerDateQueryDto {
    headers: EntityHeaderDto[],
    data: EntitiesForDateDto[]
}

interface EntityHeaderDto {
    name: string,
    id: string
}

export interface EntitiesForDateDto {
    date: Date,
    entities: ValueSnapshotDto[],
    summary: ValueSnapshotDto
}

interface ValueSnapshotDto {
    value: MoneyDto,
    change: MoneyDto,
    cumulativeChange: MoneyDto
}

export interface MoneyDto {
    amount: number,
    currency: string
    amountInMainCurrency: number
}

export type OrderableEntityDto = {
    id: string;
    name: string;
    displaySequence: number;
}

export interface WalletDataDto extends OrderableEntityDto {
    components: OrderableEntityDto[];
}

export interface ConfigurationDto {
    assets: OrderableEntityDto[];
    debts: OrderableEntityDto[];
    wallets: WalletDataDto[];
}

export async function getEntities (path: string) {
    const response = await fetch(path);
    const data: EntitiesPerDateQueryDto = await response.json();
    return data;
}

export async function getWallets () {
    const response = await fetch('wallets');
    const data: WalletsPerDateQueryDto = await response.json();
    return data;
}

export async function getConfig () : Promise<Configuration> {
    const response = await fetch('config');
    const data: ConfigurationDto = await response.json();
    return {
        assets: data.assets.map(asset => {
            return {
                key: asset.id,
                name: asset.name,
                displaySequence: asset.displaySequence
            }
        }),
        debts: data.debts.map(debt => {
            return {
                key: debt.id,
                name: debt.name,
                displaySequence: debt.displaySequence
            }
        }),
        wallets: data.wallets.map(wallet => {
            return {
                key: wallet.id,
                name: wallet.name,
                displaySequence: wallet.displaySequence,
                components: wallet.components.map(component => {
                    return {
                        key: component.id,
                        name: component.name,
                        displaySequence: component.displaySequence
                    }
                })
            }
        })
    };
}

export async function upsertAsset(asset: OrderableEntity) : Promise<void> {
    let dto = {
        id: asset.key,
        name: asset.name,
        displaySequence: asset.displaySequence
    } as OrderableEntityDto;

    const response = await fetch(`config/assets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
}