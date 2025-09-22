import {EntityValueSnapshotDto, ValueSnapshotDto} from "./ValueSnapshotDto";

export type EntityTableDto = {
    columns: EntityColumnDto[],
    rows: ValueHistoryRecordDto[]
}

export type EntityColumnDto = {
    id: string,
    name: string,
    parentName: string | undefined,
    defaultPhysicalAllocationId: string | undefined
}

export type ValueHistoryRecordDto = {
    key: string,
    entities: (EntityValueSnapshotDto | undefined)[],
    summary: ValueSnapshotDto | undefined
    target: TargetDto | undefined,
    score: ScoreDto | undefined,
    // Used internally
    newEntry?: boolean,
}

export type TargetDto = {
    targetInMainCurrency: number,
    percentage: number,
}

export type ScoreDto = {
    changePercent: number,
    inflation: InflationDto | undefined,
    totalChangePercent: number
}

export type InflationDto = {
    value: number,
    confirmed: boolean
}