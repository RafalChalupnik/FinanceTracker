import React, {FC, ReactNode, useEffect, useState} from "react";
import {getEntities, MoneyDto} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import EditableMoneyTable from "../components/EditableMoneyTable";

interface SimpleComponentsTableProps {
    apiPath: string,
    editable: boolean
}

const SimpleComponentsTable: FC<SimpleComponentsTableProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as SummaryTableHeader[],
        rows: [] as SummaryTableRow[]
    });

    const populateData = async () => {
        const response = await getEntities(props.apiPath);

        let headers: SummaryTableHeader[] = response.headers
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

export default SimpleComponentsTable;
