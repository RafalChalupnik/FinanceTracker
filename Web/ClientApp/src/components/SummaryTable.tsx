import React, { FC } from 'react';
import {useState} from "react";
import {Money} from "./Money";
import {EditableMoney} from "./EditableMoney";

export type SummaryTableHeader = {
    name: string;
    id: string;
}

type SummaryTableComponent = {
    value: number;
    change: number;
    cumulativeChange: number;
    id: string;
}

export type SummaryTableRow = {
    date: Date;
    components: Array<SummaryTableComponent | undefined>;
    summary: SummaryTableComponent
}

interface SummaryTableProps {
    headers: SummaryTableHeader[];
    data: SummaryTableRow[];
    isEditable: boolean
    onUpdate?: (id: string, date: string, value: number) => void;
    onDelete?: (date: Date) => void;
}

const SummaryTable: FC<SummaryTableProps> = (props) => {
    let [newRowDate, setNewRowDate] = useState("")
    
    let componentHeader = (
        <>
            <th style={{borderLeft: '1px solid black'}}>Value</th>
            <th>Change</th>
            <th>Cumulative</th>
        </>
    )
    
    function componentRow(date: Date, component: SummaryTableComponent | undefined, isEditable: boolean) {
        return component === undefined 
            ? (
                <>
                    <td style={{borderLeft: '1px solid black'}}/>
                    <td/>
                    <td/>
                </>
            ) 
            : (
                <>
                    <td style={{borderLeft: '1px solid black'}}>
                        {isEditable
                            ? <EditableMoney
                                value={component.value}
                                onNewValue={newValue => props.onUpdate!(component.id, date.toString(), newValue)}/>
                            : <Money value={component.value}/>}
                    </td>
                    <td>
                        <Money value={component.change} colorCoding={true}/>
                    </td>
                    <td>
                        <Money value={component.cumulativeChange} colorCoding={true}/>
                    </td>
                </>
            )
    }
    
    let newEntryRow= (
        props.isEditable && <tr>
            <td>
                <input
                    type="date"
                    value={newRowDate}
                    onChange={e => {
                        console.log('Foo')
                        console.log(e.target.value)
                        console.log(Date.parse(e.target.value))
                        setNewRowDate(e.target.value);
                    }}
                />
            </td>
            {props.headers.map(header =>
                <>
                    <td style={{borderLeft: '1px solid black'}}>
                        <EditableMoney
                            value={0}
                            onNewValue={newAmount => {
                                props.onUpdate!(header.id!, newRowDate, newAmount);
                            }}
                            initialEditMode={true}
                        />
                    </td>
                    <td/>
                    <td/>
                </>
            )}
        </tr>
    )
    
    return (
        <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th/> {/*Empty column for Date below*/}
                    {props.headers.map(header =>
                        <th colSpan={3}>{header.name}</th>
                    )}
                    <th colSpan={3}>Summary</th>
                </tr>
                <tr>
                    <th>Date</th>
                    {props.headers.map(_ => componentHeader)}
                    {componentHeader} {/*One more for 'Summary' component*/}
                </tr>
            </thead>
            <tbody>
            {props.data.map(row =>
                <tr>
                    <td>{row.date.toString()}</td>
                    {row.components.map(component => componentRow(row.date, component, props.isEditable))}
                    {componentRow(row.date, row.summary, false)}
                    {props.isEditable && <td>
                        <button onClick={() => props.onDelete!(row.date)}>Delete</button>
                    </td>}
                </tr>
            )}
            {newEntryRow}
            </tbody>
        </table>
    )
};

export default SummaryTable;