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
    value: number,
    change: number,
    cumulativeChange: number
}

export async function getEntities (path: string) {
    const response = await fetch(path);
    const data: EntitiesPerDateQueryDto = await response.json();
    console.log("lol");
    console.log(data);
    return data;
}

export async function getAssets () {
    return await getEntities('assets');
}

export async function getDebts () {
    return await getEntities('debts');
}

export async function getPortfolioSummary () {
    return await getEntities('portfolio/summary');
}

export async function getWallets () {
    const response = await fetch('wallets');
    const data: WalletsPerDateQueryDto = await response.json();
    return data;
}

export async function getWalletsSummary () {
    return await getEntities('portfolio/wallets');   
}