import React, {FC} from "react";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import {
    deleteGroupValues,
    getGroupValueHistory,
    setGroupComponentValue, setGroupTarget
} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {Dayjs} from "dayjs";

interface GroupPageProps {
    groupId: string,
    name: string,
    showTargets: boolean
}

const GroupPage: FC<GroupPageProps> = (props) => {
    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) =>
        await getGroupValueHistory(props.groupId, granularity, from, to)

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
        />
    );
}

export default GroupPage;