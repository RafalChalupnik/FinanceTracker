import React, {FC, useEffect, useState} from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {
    deleteGroupValues,
    getGroupValueHistory,
    setGroupComponentValue
} from "../api/value-history/Client";
import {buildComponentsColumns} from "../components/table/ColumnBuilder";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {Dayjs} from "dayjs";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {ColumnGroup} from "../components/table/ExtendableTable";
import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import {getPhysicalAllocations} from "../api/configuration/Client";

interface GroupPageProps {
    groupId: string,
    name: string
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
    
    return (
        <EditableMoneyComponent
            title={props.name}
            getData={getData}
            showCompositionChart={true}
            editable={{
                createEmptyRow: (date, columns) => {
                    return {
                        key: date.format("YYYY-MM-DD"),
                        entities: columns.map(_ => undefined),
                        summary: undefined,
                        newEntry: true
                    }
                },
                onDelete: date => deleteGroupValues(props.groupId, date),
            }}
            buildComponentColumns={buildComponentColumns}
            // buildExtraColumns={(granularity, refreshCallback) => [
            //     buildTargetColumn(
            //         granularity,
            //         async (date, value) => {
            //             await setWalletTarget(props.walletId, date, value);
            //             await refreshCallback();
            //         }
            //     )
            // ]}
            // extra={buildExtra} // Target chart
        />
    );
}

export default GroupPage;