import { Dayjs } from "dayjs";

export enum DateGranularity {
    Day,
    Week,
    Month,
    Quarter,
    Year
}

export type EntityValueHistory = {
    headers: ComponentHeader[],
    data: ValueHistoryRecord[]
}

export type WalletValueHistory = {
    id: string,
    name: string,
    headers: ComponentHeader[],
    data: WalletHistoryRecord[]
}

export type WalletHistoryRecord = {
    key: string;
    date: string;
    components: Array<ComponentValues | undefined>;
    summary: ComponentValues | undefined;
    target: WalletTarget | undefined;
}

interface WalletTarget {
    targetInMainCurrency: number,
    percentage: number
}

export type ValueHistoryRecord = {
    key: string;
    date: string;
    components: Array<ComponentValues | undefined>;
    summary: ComponentValues | undefined;
}

export type ComponentHeader = {
    name: string;
    id: string;
}

export type ComponentValues = {
    value: MoneyDto;
    change: MoneyDto;
    cumulativeChange: MoneyDto;
}

export interface MoneyDto {
    amount: number,
    currency: string
    amountInMainCurrency: number
}

export async function getAssetsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityValueHistory> {
    return await getEntitiesPerDateQueryDto('api/value-history/assets', granularity, from, to);
}

export async function setAssetValue(id: string, date: string, value: MoneyDto) : Promise<void> {
    await put(`api/value-history/assets/${id}/${date}`, value);
}

export async function deleteAssetsValues(date: string) : Promise<void> {
    await deleteValue(`api/value-history/assets/${date}`);
}

export async function getDebtsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityValueHistory> {
    return await getEntitiesPerDateQueryDto('api/value-history/debts', granularity, from, to);
}

export async function setDebtValue(id: string, date: string, value: MoneyDto) : Promise<void> {
    await put(`api/value-history/debts/${id}/${date}`, value);
}

export async function deleteDebtsValues(date: string) : Promise<void> {
    await deleteValue(`api/value-history/debts/${date}`);
}

export async function getPortfolioValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityValueHistory> {
    return await getEntitiesPerDateQueryDto('api/value-history/portfolio', granularity, from, to);
}

export async function getWalletsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityValueHistory> {
    return await getEntitiesPerDateQueryDto('api/value-history/wallets', granularity, from, to);
}

export async function deleteWalletValues(walletId: string, date: string) : Promise<void> {
    return await deleteValue(`api/value-history/wallets/${walletId}/${date}`);
}

export async function getWalletsComponentsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<WalletValueHistory[]> {
    let queryParams = new URLSearchParams();

    if (granularity !== undefined) {
        queryParams.append('granularity', granularity.toString());
    }

    if (from !== undefined) {
        queryParams.append('from', from.format('YYYY-MM-DD'));
    }

    if (to !== undefined) {
        queryParams.append('to', to.format('YYYY-MM-DD'));
    }
    
    const response = await fetch('api/value-history/wallets/components?' + queryParams);
    let data: WalletsPerDateQueryDto = await response.json();
    
    return data.wallets.map(wallet => {
        return {
            id: wallet.id,
            name: wallet.name,
            headers: wallet.headers,
            data: mapWalletData(wallet.data)
        }
    })
}

export async function setWalletComponentValue(id: string, date: string, value: MoneyDto) : Promise<void> {
    await put(`api/value-history/wallets/components/${id}/${date}`, value);
}

// Implementation

interface EntitiesPerDateQueryDto {
    headers: ComponentHeader[],
    data: EntitiesForDateDto[]
}

interface WalletsPerDateQueryDto {
    wallets: WalletDto[]
}

interface WalletDto {
    id: string,
    name: string,
    headers: ComponentHeader[],
    data: WalletForDateDto[]
}

interface WalletForDateDto {
    key: string,
    entities: ValueSnapshotDto[],
    summary: ValueSnapshotDto,
    target?: WalletTarget
}

interface EntitiesForDateDto {
    key: string,
    entities: ValueSnapshotDto[],
    summary: ValueSnapshotDto
}

interface ValueSnapshotDto {
    value: MoneyDto,
    change: MoneyDto,
    cumulativeChange: MoneyDto
}

async function getEntitiesPerDateQueryDto(
    path: string, 
    granularity?: DateGranularity, 
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityValueHistory> {
    let queryParams = new URLSearchParams();
    
    if (granularity !== undefined) {
        queryParams.append('granularity', granularity.toString());
    }
    
    if (from !== undefined) {
        queryParams.append('from', from.format('YYYY-MM-DD'));
    }
    
    if (to !== undefined) {
        queryParams.append('to', to.format('YYYY-MM-DD'));
    }
    
    const response = await fetch(`${path}?` + queryParams);
    let body: EntitiesPerDateQueryDto = await response.json();
    
    return {
        headers: body.headers,
        data: mapData(body.data)
    }
}

function mapWalletData (data: WalletForDateDto[]) : WalletHistoryRecord[] {
    return data.map(row => ({
        key: row.key,
        date: row.key,
        components: row.entities.map(entity => {
            if (entity === null) {
                return undefined;
            }

            return {
                value: entity.value,
                change: entity.change,
                cumulativeChange: entity.cumulativeChange
            }
        }),
        summary: {
            value: row.summary.value,
            change: row.summary.change,
            cumulativeChange: row.summary.cumulativeChange
        },
        target: row.target
    }))
}

function mapData (data: EntitiesForDateDto[]) : ValueHistoryRecord[] {
    return data.map(row => ({
        key: row.key,
        date: row.key,
        components: row.entities.map(entity => {
            if (entity === null) {
                return undefined;
            }

            return {
                value: entity.value,
                change: entity.change,
                cumulativeChange: entity.cumulativeChange
            }
        }),
        summary: {
            value: row.summary.value,
            change: row.summary.change,
            cumulativeChange: row.summary.cumulativeChange
        }
    }))
}

async function put(path: string, body: any) : Promise<void> {
    let response = await fetch(path, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to PUT to ${path}`);
    }
}

async function deleteValue(path: string) : Promise<void> {
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