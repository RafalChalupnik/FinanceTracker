import {FC} from "react";
import MoneyPage from "./MoneyPage";
import {getGroupTypeSummary} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {Dayjs} from "dayjs";

interface GroupTypePageProps {
    groupTypeId: string,
    name: string
}

const GroupTypePage: FC<GroupTypePageProps> = (props) => {
    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) =>
        await getGroupTypeSummary(props.groupTypeId, granularity, from, to)
    
    return (
        <MoneyPage 
            title={props.name} 
            getData={getData}
            showCompositionChart={true}
            showInferredValues={true}
            allowedGranularities={[
                DateGranularity.Month,
                DateGranularity.Quarter,
                DateGranularity.Year
            ]}
            defaultGranularity={DateGranularity.Month}
        />
    );
}

export default GroupTypePage;