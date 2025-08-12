import {Dayjs} from "dayjs";
import {DateGranularity} from "./DTOs/DateGranularity";
import {
    EntityTableDto,
    ValueHistoryRecordDto, WalletComponentsValueHistoryRecordDto,
    WalletValueHistoryRecordDto
} from "./DTOs/EntityTableDto";
import {MoneyDto} from "./DTOs/Money";

export async function getAssetsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto<ValueHistoryRecordDto>> {
    return await sendGet('api/value-history/assets', granularity, from, to);
}

export async function setAssetValue(id: string, date: string, value: MoneyDto) : Promise<void> {
    await sendPut(`api/value-history/assets/${id}/${date}`, value);
}

export async function deleteAssetsValues(date: string) : Promise<void> {
    await sendDelete(`api/value-history/assets/${date}`);
}

export async function getDebtsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto<ValueHistoryRecordDto>> {
    return await sendGet('api/value-history/debts', granularity, from, to);
}

export async function setDebtValue(id: string, date: string, value: MoneyDto) : Promise<void> {
    await sendPut(`api/value-history/debts/${id}/${date}`, value);
}

export async function deleteDebtsValues(date: string) : Promise<void> {
    await sendDelete(`api/value-history/debts/${date}`);
}

export async function getPhysicalAllocationValueHistory(
    allocationId: string,
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto<ValueHistoryRecordDto>> {
    return await sendGet(`api/value-history/physical-allocations/${allocationId}`, granularity, from, to);
}

export async function getPortfolioValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto<ValueHistoryRecordDto>> {
    return await sendGet('api/value-history/portfolio', granularity, from, to);
}

export async function getWalletsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto<WalletValueHistoryRecordDto>> {
    return await sendGet('api/value-history/wallets', granularity, from, to);
}

export async function setWalletTarget(id: string, date: string, value: number) : Promise<void> {
    await sendPut(`api/value-history/wallets/${id}/target`, {
        date: date,
        value: value
    });
}

export async function deleteWalletValues(walletId: string, date: string) : Promise<void> {
    return await sendDelete(`api/value-history/wallets/${walletId}/${date}`);
}

export async function getWalletComponentsValueHistory(
    walletId: string,
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto<WalletComponentsValueHistoryRecordDto>> {
    return await sendGet(`api/value-history/wallets/${walletId}/components`, granularity, from, to);
}

export async function setWalletComponentValue(id: string, date: string, value: MoneyDto) : Promise<void> {
    await sendPut(`api/value-history/wallets/components/${id}/${date}`, value);
}

export async function setInflation(year: number, month: number, value: number, confirmed: boolean) : Promise<void> {
    await sendPut(`api/value-history/inflation`, {
        year: year,
        month: month,
        value: value,
        confirmed: confirmed
    });
}

// Implementation

async function sendGet<T>(
    path: string,
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<T> {
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
    let body: T = await response.json();
    
    return body;
}

async function sendPut(path: string, body: any) : Promise<void> {
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

async function sendDelete(path: string) : Promise<void> {
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