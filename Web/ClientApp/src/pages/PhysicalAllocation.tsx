import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    getPhysicalAllocationValueHistory, 
    setGroupComponentValue
} from "../api/value-history/Client";
import React, {FC} from "react";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
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
            showCompositionChart={true}
            editable={{
                onUpdate: setGroupComponentValue
            }}
            defaultGranularity={DateGranularity.Day}
            showInferredValues={true}
        />
    );
};

export default PhysicalAllocation;