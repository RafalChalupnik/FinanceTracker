import React, {FC} from "react";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import {
    deleteGroupValues,
    getGroupValueHistory,
    setGroupComponentValue, setGroupTarget
} from "../api/value-history/Client";
import {buildTargetColumn} from "../components/table/ColumnBuilder";
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

    const buildExtraColumns = (granularity: DateGranularity, refreshCallback: () => void) => {
        return props.showTargets
            ? [
                buildTargetColumn(
                    granularity,
                    async (date, value) => {
                        await setGroupTarget(props.groupId, date, value);
                        await refreshCallback();
                    }
                )
            ]
            : [];
    }

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
            }}
            showInferredValues={true}
            buildExtraColumns={buildExtraColumns}
            extra={buildExtra}
        />
    );
}

export default GroupPage;