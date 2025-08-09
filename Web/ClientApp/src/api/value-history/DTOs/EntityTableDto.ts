import {ValueSnapshotDto} from "./ValueSnapshotDto";

export type WalletsComponentsDto = {
    wallets: WalletComponentsTableDto[]
}

export type WalletComponentsTableDto = EntityTableDto<WalletComponentsValueHistoryRecordDto> & {
    id: string,
    name: string
}

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
    entities: (ValueSnapshotDto | undefined)[],
    summary: ValueSnapshotDto | undefined
}

export type WalletValueHistoryRecordDto = ValueHistoryRecordDto & {
    yield: YieldDto
}

export type YieldDto = {
    changePercent: number,
    inflation: number | undefined,
    totalChangePercent: number
}

export type WalletComponentsValueHistoryRecordDto = ValueHistoryRecordDto & {
    target: WalletTargetDto | undefined;
}

export type WalletTargetDto = {
    targetInMainCurrency: number,
    percentage: number,
}