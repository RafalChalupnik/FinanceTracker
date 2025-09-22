import React, {FC} from "react";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import {
    deleteGroupValues,
    getGroupValueHistory,
    setGroupComponentValue, setGroupTarget
} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {Dayjs} from "dayjs";
import {
    EntityTableDto
} from "../api/value-history/DTOs/EntityTableDto";
import TargetChart from "../components/charts/custom/TargetChart";

interface GroupPageProps {
    groupId: string,
    name: string,
    showTargets: boolean
}

const GroupPage: FC<GroupPageProps> = (props) => {
    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) =>
        await getGroupValueHistory(props.groupId, granularity, from, to)

    const buildExtra = (data: EntityTableDto) => props.showTargets
        ? <TargetChart data={data.rows}/>
        : undefined;
    
    return (
        <EditableMoneyComponent
            title={props.name}
            getData={getData}
            showCompositionChart={true}
            editable={{
                onUpdate: setGroupComponentValue,
                onDelete: date => deleteGroupValues(props.groupId, date),
                setTarget: async (date, value) => await setGroupTarget(props.groupId, date, value)
            }}
            showInferredValues={true}
            extra={buildExtra}
        />
    );
}

export default GroupPage;