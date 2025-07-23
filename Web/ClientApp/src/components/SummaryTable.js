import React from 'react';
import {useState} from "react";
import Money from "./Money";
import {EditableMoney} from "./EditableMoney";

const SummaryTable = ({data, selectFunc, isEditable, onUpdate, onDelete}) => {
    let [newRowDate, setNewRowDate] = useState(null)
    
    if (data.length === 0) {
        return (<h2>No data</h2>)
    }
    
    let firstRow = selectFunc(data[0])
    let components = [...firstRow.components, firstRow.summary]
    
    return (
        <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
            <tr>
                <th/>
                {/*Empty column for Date below*/}
                {components.map(component =>
                    <th colSpan="3">{component.name}</th>
                )}
            </tr>
            <tr>
                <th>Date</th>
                {components.map(_ =>
                    <>
                        <th style={{borderLeft: '1px solid black'}}>Value</th>
                        <th>Change</th>
                        <th>Cumulative</th>
                    </>
                )}
            </tr>
            </thead>
            <tbody>
            {data.map(row =>
                <tr key={row.date}>
                    <td>{row.date}</td>
                    {selectFunc(row).components.map(component =>
                        <>
                            <td style={{borderLeft: '1px solid black'}}>
                                {/*<Money amount={component.value}/>*/}
                                {isEditable 
                                    ? <EditableMoney
                                    value={component.value}
                                    onNewValue={newAmount => onUpdate(component.id, row.date, newAmount)}/> 
                                    : <Money amount={component.value}/>}
                            </td>
                            <td>
                                <Money amount={component.change} colorCoding="true"/>
                            </td>
                            <td>
                                <Money amount={component.cumulativeChange} colorCoding="true"/>
                            </td>
                        </>
                    )}
                    <td style={{borderLeft: '1px solid black'}}>
                        <Money amount={selectFunc(row).summary.value}/>
                    </td>
                    <td>
                        <Money amount={selectFunc(row).summary.change} colorCoding="true"/>
                    </td>
                    <td>
                        <Money amount={selectFunc(row).summary.cumulativeChange} colorCoding="true"/>
                    </td>
                    {(isEditable && <td>
                        <button onClick={() => onDelete(row.date)}>Delete</button>
                    </td>)}
                </tr>
            )}
            {(isEditable && <tr>
                <td>
                    <input 
                        type="date"
                        value={newRowDate}
                        onChange={e => setNewRowDate(e.target.value)}
                        />
                </td>
                {firstRow.components.map(component =>
                    <>
                        <td style={{borderLeft: '1px solid black'}}>
                            <EditableMoney
                                value={0}
                                onNewValue={newAmount => {
                                    onUpdate(component.id, newRowDate, newAmount);
                                }}
                                initialEditMode="true"
                            />
                        </td>
                        <td/>
                        <td/>
                    </>
                )}
            </tr>)}
            </tbody>
        </table>
    );
};

export default SummaryTable;