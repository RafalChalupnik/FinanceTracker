import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPhysicalAllocationValueHistory, setWalletComponentValue} from "../api/value-history/Client";
import {FC} from "react";

interface PhysicalAllocationProps {
    allocationId: string,
    name: string
}

const PhysicalAllocation: FC<PhysicalAllocationProps> = (props) => {
    return <SimpleComponentsPage
        title={props.name}
        defaultGranularity={DateGranularity.Day}
        getData={async (granularity, from, to) => await getPhysicalAllocationValueHistory(
            props.allocationId,
            granularity,
            from,
            to
        )}
        editable={{
            createEmptyRow: (date, columns) => {
                return {
                    key: date.format("YYYY-MM-DD"),
                    entities: columns.map(_ => undefined),
                    summary: undefined,
                    target: undefined,
                }
            },
            setValue: setWalletComponentValue
        }}
    />;
};

export default PhysicalAllocation;