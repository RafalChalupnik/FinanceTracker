import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    getPhysicalAllocationValueHistory,
    setWalletComponentValue
} from "../api/value-history/Client";
import React, {FC, useEffect, useState} from "react";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {Dayjs} from "dayjs";
import {MoneyDto} from "../api/value-history/DTOs/Money";

interface PhysicalAllocationProps {
    allocationId: string,
    name: string
}

const PhysicalAllocation: FC<PhysicalAllocationProps> = (props) => {
    const [data, setData] = useState({
        headers: [] as EntityColumnDto[],
        rows: [] as ValueHistoryRecordDto[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getPhysicalAllocationValueHistory(
            props.allocationId,
            granularity,
            from,
            to
        );
        
        setData({
            headers: response.columns,
            rows: response.rows
        });
    }

    useEffect(() => {
        populateData();
    }, []);

    const updateEntity = async (id: string, date: string, value: MoneyDto) => {
        await setWalletComponentValue(id, date, value)
        await populateData()
    }
    
    return (
        <EmptyConfig enabled={data.headers.length === 0}>
            <EditableMoneyComponent
                title={props.name}
                rows={data.rows}
                columns={data.headers}
                refreshData={populateData}
                showInferredValues={true}
                defaultGranularity={DateGranularity.Day}
                editable={{
                    createEmptyRow: (date, columns) => {
                        return {
                            key: date.format("YYYY-MM-DD"),
                            entities: columns.map(_ => undefined),
                            summary: undefined,
                            target: undefined,
                        }
                    },
                    onUpdate: updateEntity
                }}
            />
        </EmptyConfig>
    );
};

export default PhysicalAllocation;