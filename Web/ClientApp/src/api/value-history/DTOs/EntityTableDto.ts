import {EntityValueSnapshotDto, ValueSnapshotDto} from "./ValueSnapshotDto";

export type EntityTableDto<T extends ValueHistoryRecordDto> = {
    columns: EntityColumnDto[],
    rows: T[]
}

export type EntityColumnDto = {
    name: string,
    id: string | undefined
}

export type ValueHistoryRecordDto = {
    key: string,
    entities: (EntityValueSnapshotDto | undefined)[],
    summary: ValueSnapshotDto | undefined
}

export type WalletValueHistoryRecordDto = ValueHistoryRecordDto & {
    yield: YieldDto
}

export type YieldDto = {
    changePercent: number,
    inflation: InflationDto | undefined,
    totalChangePercent: number
}

export type InflationDto = {
    value: number,
    confirmed: boolean
}

export type WalletComponentsValueHistoryRecordDto = ValueHistoryRecordDto & {
    target: WalletTargetDto | undefined;
}

export type WalletTargetDto = {
    targetInMainCurrency: number,
    percentage: number,
}