import React, {FC, useEffect, useState} from "react";
import EditableMoneyTable from "../components/EditableMoneyTable";
import {
    ComponentHeader,
    DateGranularity,
    EntityValueHistory,
    MoneyDto,
    ValueHistoryRecord
} from "../api/ValueHistoryApi";
import {Space} from "antd";
import EmptyConfig from "../components/EmptyConfig";
import MoneyChart from "../components/MoneyChart";
import {Dayjs} from "dayjs";

interface SimpleComponentsPageProps {
    title: string;
    getData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<EntityValueHistory>,
    editable?: EditableProps
}

interface EditableProps {
    setValue: (id: string, date: string, value: MoneyDto) => Promise<void>;
    deleteValues: (date: string) => void | Promise<void>;   
}

const SimpleComponentsPage: FC<SimpleComponentsPageProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as ComponentHeader[],
        rows: [] as ValueHistoryRecord[]
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
        populateData()
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
            <EditableMoneyTable
                title={props.title}
                rows={data.rows}
                columns={data.headers}
                editable={editable}
                refreshData={populateData}            
            />
            <MoneyChart
                headers={data.headers}
                data={data.rows}
            />
        </EmptyConfig>;
}

export default SimpleComponentsPage;
