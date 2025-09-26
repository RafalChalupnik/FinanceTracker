import {FC} from "react";
import MoneyPage from "./MoneyPage";
import {getGroupTypeSummary, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {Dayjs} from "dayjs";
import {GroupTypeConfigDto} from "../api/configuration/DTOs/ConfigurationDto";

interface GroupTypePageProps {
    groupType: GroupTypeConfigDto
}

const GroupTypePage: FC<GroupTypePageProps> = (props) => {
    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) =>
        await getGroupTypeSummary(props.groupType.key, granularity, from, to)
    
    const setInflationFunc = props.groupType.showScore
        ? setInflation
        : undefined;
    
    return (
        <MoneyPage 
            title={props.groupType.name} 
            getData={getData}
            showCompositionChart={true}
            showInferredValues={true}
            setInflation={setInflationFunc}
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
