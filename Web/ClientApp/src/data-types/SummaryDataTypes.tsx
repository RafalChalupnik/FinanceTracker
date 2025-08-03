import {MoneyDto} from "../ApiClient";

export type SummaryComponent = {
    name: string;
    id: string;
}

type SummaryComponentData = {
    value: MoneyDto;
    change: MoneyDto;
    cumulativeChange: MoneyDto;
}

export type SummaryRecord = {
    key: string;
    date: string;
    components: Array<SummaryComponentData | undefined>;
    summary: SummaryComponentData | undefined;
}
