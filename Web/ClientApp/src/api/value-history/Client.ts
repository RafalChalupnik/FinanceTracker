import {Dayjs} from "dayjs";
import {DateGranularity} from "./DTOs/DateGranularity";
import {EntityTableDto} from "./DTOs/EntityTableDto";
import {MoneyDto} from "./DTOs/Money";
import {sendDelete, sendPut} from "../shared/HttpClient";

export async function getGroupValueHistory(
    groupId: string,
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto> {
    return await sendGet(`api/value-history/groups/${groupId}`, granularity, from, to);
}

export async function setGroupTarget(id: string, date: Dayjs, value: number) : Promise<void> {
    await sendPut(`api/value-history/groups/${id}/target`, {
        date: toDateString(date),
        value: value
    });
}

export async function setGroupComponentValue(id: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) : Promise<void> {
    await sendPut(`api/value-history/groups/components/${id}/${toDateString(date)}`, {
        value: value,
        physicalAllocationId: physicalAllocationId
    });
}

export async function deleteGroupValues(groupId: string, date: Dayjs) : Promise<void> {
    return await sendDelete(`api/value-history/groups/${groupId}/${toDateString(date)}`);
}

export async function getPhysicalAllocationValueHistory(
    allocationId: string,
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto> {
    return await sendGet(`api/value-history/physical-allocations/${allocationId}`, granularity, from, to);
}

export async function getPortfolioValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto> {
    return await sendGet('api/value-history/portfolio', granularity, from, to);
}

export async function getWalletsValueHistory(
    granularity?: DateGranularity,
    from?: Dayjs,
    to?: Dayjs
) : Promise<EntityTableDto> {
    return await sendGet('api/value-history/wallets', granularity, from, to);
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
        queryParams.append('from', toDateString(from));
    }

    if (to !== undefined) {
        queryParams.append('to', toDateString(to));
    }

    const response = await fetch(`${path}?` + queryParams);
    return await response.json();
}

function toDateString(date: Dayjs) : string {
    return date.format('YYYY-MM-DD');
}