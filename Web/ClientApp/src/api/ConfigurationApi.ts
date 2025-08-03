export type Config = {
    assets: OrderableEntity[];
    debts: OrderableEntity[];
    wallets: WalletEntity[];
}

export type OrderableEntity = {
    key: string;
    name: string;
    displaySequence: number;
}

export type WalletEntity = OrderableEntity & {
    components: OrderableEntity[];
}

export async function getConfiguration() : Promise<Config> {
    let dto = await get<ConfigurationDto>('api/configuration');
    return mapConfiguration(dto);
}

export async function upsertAsset(asset: OrderableEntity) : Promise<void> {
    await upsertEntity('api/configuration/assets', asset);
}

export async function deleteAsset(assetId: string) : Promise<void> {
    await deleteEntity(`api/configuration/assets/${assetId}`);
}

export async function upsertDebt(debt: OrderableEntity) : Promise<void> {
    await upsertEntity('api/configuration/debts', debt);
}

export async function deleteDebt(debtId: string) : Promise<void> {
    await deleteEntity(`api/configuration/debts/${debtId}`);
}

export async function upsertWallet(wallet: OrderableEntity) : Promise<void> {
    await upsertEntity('api/configuration/wallets', wallet);
}

export async function deleteWallet(walletId: string) : Promise<void> {
    await deleteEntity(`api/configuration/wallets/${walletId}`);
}

export async function upsertWalletComponent(walletId: string, component: OrderableEntity) : Promise<void> {
    await upsertEntity(
        `api/configuration/wallets/${walletId}/components`, 
        component
    );
}

export async function deleteWalletComponent(componentId: string) : Promise<void> {
    await deleteEntity(`api/configuration/wallets/components/${componentId}`);
}

// Implementation

interface ConfigurationDto {
    assets: OrderableEntityDto[];
    debts: OrderableEntityDto[];
    wallets: WalletDataDto[];
}

type OrderableEntityDto = {
    id: string;
    name: string;
    displaySequence: number;
}

export interface WalletDataDto extends OrderableEntityDto {
    components: OrderableEntityDto[];
}

function mapConfiguration(dto: ConfigurationDto) : Config {
    return {
        assets: dto.assets.map(mapOrderableEntity),
        debts: dto.debts.map(mapOrderableEntity),
        wallets: dto.wallets.map(wallet => {
            return {
                key: wallet.id,
                name: wallet.name,
                displaySequence: wallet.displaySequence,
                components: wallet.components.map(mapOrderableEntity)
            }
        })
    };
}

function mapOrderableEntity(dto: OrderableEntityDto) : OrderableEntity {
    return {
        key: dto.id,
        name: dto.name,
        displaySequence: dto.displaySequence
    }
}

async function upsertEntity(path: string, entity: OrderableEntity) : Promise<void> {
    let dto = {
        id: entity.key,
        name: entity.name,
        displaySequence: entity.displaySequence
    } as OrderableEntityDto;

    await post(path, dto);
}

async function get<T>(path: string) : Promise<T> {
    let response = await fetch(path);
    return await response.json();
}

async function post(path: string, body: any) : Promise<void> {
    let response = await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to POST to ${path}`);
    }
}

async function deleteEntity(path: string) : Promise<void> {
    let response = await fetch(path, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to DELETE ${path}`);
    }
}