import React, {FC, useEffect, useState} from "react";
import {getEntities, MoneyDto} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {SummaryComponent, SummaryRecord} from "../SummaryDataTypes";
import EditableMoneyTable from "../components/EditableMoneyTable";

interface SimpleComponentsPageProps {
    apiPath: string,
    editable: boolean
}

const SimpleComponentsPage: FC<SimpleComponentsPageProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as SummaryComponent[],
        rows: [] as SummaryRecord[]
    });

    const populateData = async () => {
        const response = await getEntities(props.apiPath);

        let headers: SummaryComponent[] = response.headers
        let data = mapData(response.data)
        
        setData({
            headers: headers,
            rows: data
        });
        
        setIsLoading(false)
    }
    
    useEffect(() => {
        populateData()
    }, [])
    
    const updateEntity = async (id: string, date: string, value: MoneyDto) => {
        const response = await fetch(`${props.apiPath}/` + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: date,
                value: value
            }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await populateData()
    }

    const deleteEvaluations = async (date: string) => {
        const response = await fetch(`${props.apiPath}/` + date, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
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
            rows={data.rows}
            columns={data.headers}
            editable={editable}
          />
}

export default SimpleComponentsPage;
