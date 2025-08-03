import React, {FC, useEffect, useState} from "react";
import EditableMoneyTable from "../components/EditableMoneyTable";
import {ComponentHeader, EntityValueHistory, MoneyDto, ValueHistoryRecord} from "../api/ValueHistoryApi";

interface SimpleComponentsPageProps {
    title: string;
    getData: () => Promise<EntityValueHistory>,
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

    const populateData = async () => {
        const response = await props.getData();
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
        : <EditableMoneyTable
            title={props.title}
            rows={data.rows}
            columns={data.headers}
            editable={editable}
          />
}

export default SimpleComponentsPage;
