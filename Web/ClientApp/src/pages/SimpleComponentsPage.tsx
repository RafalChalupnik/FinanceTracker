import React, {useEffect, useState} from "react";
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from "dayjs";
import {Column, ColumnGroup} from "../components/table/ExtendableTable";
import { DateGranularity } from "../api/value-history/DTOs/DateGranularity";
import {EntityColumnDto, EntityTableDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";

interface SimpleComponentsPageProps<T extends ValueHistoryRecordDto> {
    title: string;
    defaultGranularity: DateGranularity;
    getData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<EntityTableDto<T>>,
    editable?: EditableProps<T>,
    buildExtraColumns?: (granularity: DateGranularity) => (Column<T> | ColumnGroup<T>)[];
    showInferredValues?: boolean
}

interface EditableProps<T> {
    createEmptyRow: (date: Dayjs, columns: EntityColumnDto[]) => T;
    setValue: (id: string, date: string, value: MoneyDto) => Promise<void>;
    deleteValues: (date: string) => void | Promise<void>;   
}

export function SimpleComponentsPage<T extends ValueHistoryRecordDto>(props: SimpleComponentsPageProps<T>) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as EntityColumnDto[],
        rows: [] as T[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await props.getData(granularity, from, to);
        setData({
            headers: response.columns,
            rows: response.rows
        });
        
        setIsLoading(false)
    }
    
    useEffect(() => {
        populateData(props.defaultGranularity, undefined, undefined)
    }, [])
    
    const updateEntity = async (id: string, date: string, value: MoneyDto) => {
        await props.editable!.setValue(id, date, value)
        await populateData()
    }

    const deleteEvaluations = async (date: string) => {
        await props.editable!.deleteValues(date)
        await populateData()
    }
    
    let editable = props.editable
        ? {
            createEmptyRow: props.editable!.createEmptyRow,
            onUpdate: updateEntity,
            onDelete: deleteEvaluations
        }
        : undefined;
    
    return isLoading
        ? <p><em>Loading...</em></p>
        : <EmptyConfig enabled={data.headers.length === 0}>
            <EditableMoneyComponent
                title={props.title}
                rows={data.rows}
                columns={data.headers}
                editable={editable}
                refreshData={populateData}
                showInferredValues={props.showInferredValues ?? true}
                buildExtraColumns={props.buildExtraColumns}
            />
        </EmptyConfig>;
}

export default SimpleComponentsPage;
