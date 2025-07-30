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

interface MoneyDto {
    amount: number,
    currency: string
    amountInMainCurrency: string
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
