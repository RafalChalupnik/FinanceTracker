import React from 'react';
import Money from "./Money";
import {EditableMoney} from "./EditableMoney";

const SummaryTable = ({data, selectFunc}) => {
    let components = selectFunc(data[0])
    
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
                    {selectFunc(row).map(component =>
                        <>
                            <td style={{borderLeft: '1px solid black'}}>
                                {/*<Money amount={component.value}/>*/}
                                <EditableMoney
                                    amount={component.value}
                                    onNewAmount={newAmount => {
                                        alert('Updated to: ' + newAmount)
                                    }}
                                />
                            </td>
                            <td>
                                <Money amount={component.change} colorCoding="true"/>
                            </td>
                            <td>
                                <Money amount={component.cumulativeChange} colorCoding="true"/>
                            </td>
                        </>
                    )}
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default SummaryTable;