import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    getPhysicalAllocationValueHistory
} from "../api/value-history/Client";
import React, {FC} from "react";
import {Dayjs} from "dayjs";
import MoneyPage from "./MoneyPage";

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
        <MoneyPage
            title={props.name}
            getData={getData}
            showCompositionChart={true}
            defaultGranularity={DateGranularity.Day}
            showInferredValues={true}
        />
    );
};

export default PhysicalAllocation;