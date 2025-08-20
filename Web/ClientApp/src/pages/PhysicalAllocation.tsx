import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    getPhysicalAllocationValueHistory,
    setWalletComponentValue
} from "../api/value-history/Client";
import React, {FC} from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {Dayjs} from "dayjs";

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

    return (
        <EditableMoneyComponent
            title={props.name}
            getData={getData}
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
                onUpdate: setWalletComponentValue
            }}
        />
    );
};

export default PhysicalAllocation;