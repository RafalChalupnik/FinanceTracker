import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    getPhysicalAllocationValueHistory, setWalletComponentValue
} from "../api/value-history/Client";
import React, {FC} from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {Dayjs} from "dayjs";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {ColumnGroup} from "../components/table/ExtendableTable";
import {buildComponentsColumns} from "../components/table/ColumnBuilder";

interface PhysicalAllocationProps {
    allocationId: string,
    name: string
}

const PhysicalAllocation: FC<PhysicalAllocationProps> = (props) => {
    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => 
        await getPhysicalAllocationValueHistory(
        props.allocationId,
        granularity,
        from,
        to
    )

    let buildComponentColumns = (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>): ColumnGroup<ValueHistoryRecordDto>[] => {
        return buildComponentsColumns(
            components,
            granularity,
            true,
            async (entityId, date, value) => {
                await setWalletComponentValue(entityId, date, value);
                await updateCallback();
            }
        )
    }

    return (
        <EditableMoneyComponent
            title={props.name}
            getData={getData}
            defaultGranularity={DateGranularity.Day}
            editable={{
                createEmptyRow: (date, columns) => {
                    return {
                        key: date.format("YYYY-MM-DD"),
                        entities: columns.map(_ => undefined),
                        summary: undefined,
                        target: undefined,
                    }
                }
            }}
            buildComponentColumns={buildComponentColumns}
        />
    );
};

export default PhysicalAllocation;