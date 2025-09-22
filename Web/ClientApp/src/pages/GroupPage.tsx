import React, {FC, useEffect, useState} from "react";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import {
    deleteGroupValues,
    getGroupValueHistory,
    setGroupComponentValue, setGroupTarget
} from "../api/value-history/Client";
import {buildComponentsColumns, buildTargetColumn} from "../components/table/ColumnBuilder";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {Dayjs} from "dayjs";
import {
    EntityColumnDto, 
    EntityTableDto,
    ValueHistoryRecordDto
} from "../api/value-history/DTOs/EntityTableDto";
import {ColumnGroup} from "../components/table/ExtendableTable";
import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import {getPhysicalAllocations} from "../api/configuration/Client";
import TargetChart from "../components/charts/custom/TargetChart";

interface GroupPageProps {
    groupId: string,
    name: string,
    showTargets: boolean
}

const GroupPage: FC<GroupPageProps> = (props) => {
    const [physicalAllocations, setPhysicalAllocations] = useState<OrderableEntityDto[]>([]);

    const populateData = async () => {
        const physicalAllocationsResponse = await getPhysicalAllocations();
        setPhysicalAllocations(physicalAllocationsResponse);
    }

    useEffect(() => {
        populateData()
    }, [])
    
    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) =>
        await getGroupValueHistory(props.groupId, granularity, from, to)

    let buildComponentColumns = (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>): ColumnGroup<ValueHistoryRecordDto>[] => {
        return buildComponentsColumns(
            components,
            granularity,
            true,
            async (entityId, date, value) => {
                await setGroupComponentValue(entityId, date, value);
                await updateCallback();
            },
            physicalAllocations
        )
    }
    
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
                onDelete: date => deleteGroupValues(props.groupId, date),
            }}
            buildComponentColumns={buildComponentColumns}
            buildExtraColumns={buildExtraColumns}
            extra={buildExtra}
        />
    );
}

export default GroupPage;