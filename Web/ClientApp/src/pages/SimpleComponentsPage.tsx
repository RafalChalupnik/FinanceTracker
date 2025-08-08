import React, {FC, useEffect, useState} from "react";
import {EditableMoneyComponent} from "../components/EditableMoneyComponent";
import {
    ComponentHeader,
    DateGranularity,
    EntityValueHistory,
    MoneyDto,
    ValueHistoryRecord
} from "../api/ValueHistoryApi";
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from "dayjs";

interface SimpleComponentsPageProps<T extends ValueHistoryRecord> {
    title: string;
    defaultGranularity: DateGranularity;
    getData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<EntityValueHistory<T>>,
    editable?: EditableProps
}

interface EditableProps {
    setValue: (id: string, date: string, value: MoneyDto) => Promise<void>;
    deleteValues: (date: string) => void | Promise<void>;   
}

export function SimpleComponentsPage<T extends ValueHistoryRecord>(props: SimpleComponentsPageProps<T>) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as ComponentHeader[],
        rows: [] as T[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await props.getData(granularity, from, to);
        setData({
            headers: response.headers,
            rows: response.data
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
            />
        </EmptyConfig>;
}

export default SimpleComponentsPage;
